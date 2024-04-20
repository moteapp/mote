import { WorkbenchPhase, registerWorkbenchContribution } from 'mote/workbench/common/contribution';
import { ExplorerViewletViewsContribution } from './explorerViewlet';

// Register Explorer views
registerWorkbenchContribution(ExplorerViewletViewsContribution.ID, ExplorerViewletViewsContribution, WorkbenchPhase.BlockStartup);
