import { IConstructorSignature, ServicesAccessor } from "vs/platform/instantiation/common/instantiation";
import { IMoteEditor } from "./editorBrowser";
import { IEditorContribution } from "../common/editorCommon";
import { IKeybindings, KeybindingsRegistry } from "vs/platform/keybinding/common/keybindingsRegistry";
import { CommandsRegistry, ICommandMetadata } from "vs/platform/commands/common/commands";
import { MenuId, MenuRegistry } from "vs/platform/actions/common/actions";
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from "vs/platform/contextkey/common/contextkey";
import { ThemeIcon } from "vs/base/common/themables";
import { IMoteEditorService } from "./services/moteEditorService";

export type EditorContributionCtor = IConstructorSignature<IEditorContribution, [IMoteEditor]>;


export const enum EditorContributionInstantiation {
	/**
	 * The contribution is created eagerly when the {@linkcode IMoteEditor} is instantiated.
	 * Only Eager contributions can participate in saving or restoring of view state.
	 */
	Eager,

	/**
	 * The contribution is created at the latest 50ms after the first render after attaching a text model.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	AfterFirstRender,

	/**
	 * The contribution is created before the editor emits events produced by user interaction (mouse events, keyboard events).
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	BeforeFirstInteraction,

	/**
	 * The contribution is created when there is idle time available, at the latest 5000ms after the editor creation.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 */
	Eventually,

	/**
	 * The contribution is created only when explicitly requested via `getContribution`.
	 */
	Lazy,
}

export interface IEditorContributionDescription {
	readonly id: string;
	readonly ctor: EditorContributionCtor;
	readonly instantiation: EditorContributionInstantiation;
}

//#region Command

export interface ICommandKeybindingsOptions extends IKeybindings {
	kbExpr?: ContextKeyExpression | null;
	weight: number;
	/**
	 * the default keybinding arguments
	 */
	args?: any;
}
export interface ICommandMenuOptions {
	menuId: MenuId;
	group: string;
	order: number;
	when?: ContextKeyExpression;
	title: string;
	icon?: ThemeIcon;
}
export interface ICommandOptions {
	id: string;
	precondition: ContextKeyExpression | undefined;
	kbOpts?: ICommandKeybindingsOptions | ICommandKeybindingsOptions[];
	metadata?: ICommandMetadata;
	menuOpts?: ICommandMenuOptions | ICommandMenuOptions[];
}
export abstract class Command {
	public readonly id: string;
	public readonly precondition: ContextKeyExpression | undefined;
	private readonly _kbOpts: ICommandKeybindingsOptions | ICommandKeybindingsOptions[] | undefined;
	private readonly _menuOpts: ICommandMenuOptions | ICommandMenuOptions[] | undefined;
	public readonly metadata: ICommandMetadata | undefined;

	constructor(opts: ICommandOptions) {
		this.id = opts.id;
		this.precondition = opts.precondition;
		this._kbOpts = opts.kbOpts;
		this._menuOpts = opts.menuOpts;
		this.metadata = opts.metadata;
	}

	public register(): void {

		if (Array.isArray(this._menuOpts)) {
			this._menuOpts.forEach(this._registerMenuItem, this);
		} else if (this._menuOpts) {
			this._registerMenuItem(this._menuOpts);
		}

		if (this._kbOpts) {
			const kbOptsArr = Array.isArray(this._kbOpts) ? this._kbOpts : [this._kbOpts];
			for (const kbOpts of kbOptsArr) {
				let kbWhen = kbOpts.kbExpr;
				if (this.precondition) {
					if (kbWhen) {
						kbWhen = ContextKeyExpr.and(kbWhen, this.precondition);
					} else {
						kbWhen = this.precondition;
					}
				}

				const desc = {
					id: this.id,
					weight: kbOpts.weight,
					args: kbOpts.args,
					when: kbWhen,
					primary: kbOpts.primary,
					secondary: kbOpts.secondary,
					win: kbOpts.win,
					linux: kbOpts.linux,
					mac: kbOpts.mac,
				};

				KeybindingsRegistry.registerKeybindingRule(desc);
			}
		}

		CommandsRegistry.registerCommand({
			id: this.id,
			handler: (accessor, args) => this.runCommand(accessor, args),
			metadata: this.metadata
		});
	}

	private _registerMenuItem(item: ICommandMenuOptions): void {
		MenuRegistry.appendMenuItem(item.menuId, {
			group: item.group,
			command: {
				id: this.id,
				title: item.title,
				icon: item.icon,
				precondition: this.precondition
			},
			when: item.when,
			order: item.order
		});
	}

	public abstract runCommand(accessor: ServicesAccessor, args: any): void | Promise<void>;
}

//#endregion

//#region EditorCommand

export interface IContributionCommandOptions<T> extends ICommandOptions {
	handler: (controller: T, args: any) => void;
}
export interface EditorControllerCommand<T extends IEditorContribution> {
	new(opts: IContributionCommandOptions<T>): EditorCommand;
}

export abstract class EditorCommand extends Command {

	/**
	 * Create a command class that is bound to a certain editor contribution.
	 */
	public static bindToContribution<T extends IEditorContribution>(controllerGetter: (editor: IMoteEditor) => T | null): EditorControllerCommand<T> {
		return class EditorControllerCommandImpl extends EditorCommand {
			private readonly _callback: (controller: T, args: any) => void;

			constructor(opts: IContributionCommandOptions<T>) {
				super(opts);

				this._callback = opts.handler;
			}

			public runEditorCommand(accessor: ServicesAccessor, editor: IMoteEditor, args: any): void {
				const controller = controllerGetter(editor);
				if (controller) {
					this._callback(controller, args);
				}
			}
		};
	}

	public static runEditorCommand(
		accessor: ServicesAccessor,
		args: any,
		precondition: ContextKeyExpression | undefined,
		runner: (accessor: ServicesAccessor | null, editor: IMoteEditor, args: any) => void | Promise<void>
	): void | Promise<void> {
		const moteEditorService = accessor.get(IMoteEditorService);

		// Find the editor with text focus or active
		const editor = moteEditorService.getFocusedMoteEditor() || moteEditorService.getActiveMoteEditor();
		if (!editor) {
			// well, at least we tried...
			return;
		}

		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			if (!kbService.contextMatchesRules(precondition ?? undefined)) {
				// precondition does not hold
				return;
			}

			return runner(editorAccessor, editor, args);
		});
	}

	public runCommand(accessor: ServicesAccessor, args: any): void | Promise<void> {
		return EditorCommand.runEditorCommand(accessor, args, this.precondition, (accessor, editor, args) => this.runEditorCommand(accessor, editor, args));
	}

	public abstract runEditorCommand(accessor: ServicesAccessor | null, editor: IMoteEditor, args: any): void | Promise<void>;
}

//#endregion