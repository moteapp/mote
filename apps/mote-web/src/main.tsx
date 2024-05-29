import * as zhCNBundle from 'extensions/languages/zh-cn.json';
import './index.css'
import { create } from 'mote/workbench/browser/web.factory.ts';
import { mainWindow } from 'mote/base/browser/window.ts';
import 'mote/workbench/workbench.web.main';
import * as nls from '@mote/base/common/nls';

nls.create('zh-cn', zhCNBundle);

// Create workbench
create(mainWindow.document.body, {});

