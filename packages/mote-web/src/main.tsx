import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react';
import './index.css'
import { create } from 'mote/workbench/browser/web.factory.ts';
import { mainWindow } from 'mote/base/browser/window.ts';

// Create workbench
create(mainWindow.document.body, {});

/*
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Workbench />
    </NextUIProvider>
  </React.StrictMode>,
)
*/
