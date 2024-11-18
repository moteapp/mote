//#region --- workbench services

import './services/commands/common/commandService';

//#endregion

//#region --- workbench contributions

import './contrib/pages/browser/pages.contribution';

//#endregion


import { InstantiationType, registerSingleton } from "mote/platform/instantiation/common/extensions";
import { IRecordService } from "mote/platform/record/common/record";
import { RecordService } from "mote/platform/record/common/recordService";

registerSingleton(IRecordService, RecordService, InstantiationType.Delayed);
