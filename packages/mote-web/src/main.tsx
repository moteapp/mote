import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react';
import './index.css'
import { Workbench } from './mote/workbench/browser/workbench.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Workbench />
    </NextUIProvider>
  </React.StrictMode>,
)
