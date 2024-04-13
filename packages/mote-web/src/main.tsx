import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Workbench } from './mote/workbench/browser/workbench.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Workbench />
  </React.StrictMode>,
)
