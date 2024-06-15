import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./mote/app/store"
import "./index.css"
import { RouterProvider } from 'react-router-dom';
import { router } from 'mote/pages/router';
import { DefaultTheme, ThemeProvider } from "styled-components"
import { defaultColors, defaultLightTheme } from "mote/app/styles/theme"
import { HelmetProvider } from "react-helmet-async"
import { initI18n } from "mote/utils/i18n"
import { TooltipStyles } from "mote/base/components/tooltip"
import { fetchAuthInfo } from "mote/app/slices/user/userSlice"

initI18n("zh_CN");
store.dispatch(fetchAuthInfo());

const container = document.getElementById("root");

if (container) {
    const root = createRoot(container)

    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <Provider store={store}>
            <ThemeProvider theme={defaultLightTheme}>
              <>
                  <TooltipStyles />
                  <RouterProvider router={router} />
              </>
            </ThemeProvider>
          </Provider>
        </HelmetProvider>
      </React.StrictMode>,
    )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
