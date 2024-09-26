import { ServicesAccessor as InstantiationServicesAccessor } from 'mote/platform/instantiation/common/instantiation';
import { IMoteEditor } from './editorBrowser';

export type ServicesAccessor = InstantiationServicesAccessor;

export type ICommandOptions = {
	id: string;
}

export abstract class Command {
    public abstract runCommand(accessor: ServicesAccessor, args: any): void | Promise<void>;
}

export abstract class EditorCommand extends Command {

    public static runEditorCommand(
		accessor: ServicesAccessor,
		args: any,
        runner: (accessor: ServicesAccessor | null, editor: IMoteEditor, args: any) => void | Promise<void>
    ) {

    }
}