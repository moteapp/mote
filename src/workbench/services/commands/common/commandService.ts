/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//import { ILogService } from 'mote/platform/log/common/log.js';
import { Event, Emitter } from 'mote/base/common/event';
import { Disposable } from 'mote/base/common/lifecycle';
import { ICommandService, ICommandEvent, CommandsRegistry } from 'mote/platform/commands/common/commands';
import { InstantiationType, registerSingleton } from 'mote/platform/instantiation/common/extensions';
import { IInstantiationService } from 'mote/platform/instantiation/common/instantiation';


export class CommandService extends Disposable implements ICommandService {

	declare readonly _serviceBrand: undefined;

	private readonly _onWillExecuteCommand: Emitter<ICommandEvent> = this._register(new Emitter<ICommandEvent>());
	public readonly onWillExecuteCommand: Event<ICommandEvent> = this._onWillExecuteCommand.event;

	private readonly _onDidExecuteCommand: Emitter<ICommandEvent> = new Emitter<ICommandEvent>();
	public readonly onDidExecuteCommand: Event<ICommandEvent> = this._onDidExecuteCommand.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	async executeCommand<T>(id: string, ...args: any[]): Promise<T> {
		console.trace('CommandService#executeCommand', id);

		const activationEvent = `onCommand:${id}`;
		const commandIsRegistered = !!CommandsRegistry.getCommand(id);

		if (commandIsRegistered) {

			return this._tryExecuteCommand(id, args);
		}

		// finally, if the command is not registered we will send a simple activation event
		// as well as a * activation event raced against registration and against 30s
		await Promise.all([
			Promise.race<any>([
				Event.toPromise(Event.filter(CommandsRegistry.onDidRegisterCommand, e => e === id))
			]),
		]);
		return this._tryExecuteCommand(id, args);
	}

	private _tryExecuteCommand(id: string, args: any[]): Promise<any> {
		const command = CommandsRegistry.getCommand(id);
		if (!command) {
			return Promise.reject(new Error(`command '${id}' not found`));
		}
		try {
			this._onWillExecuteCommand.fire({ commandId: id, args });
			const result = this._instantiationService.invokeFunction(command.handler, ...args);
			this._onDidExecuteCommand.fire({ commandId: id, args });
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

registerSingleton(ICommandService, CommandService, InstantiationType.Delayed);
