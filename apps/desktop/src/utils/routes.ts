import { createBrowserHistory, createHashHistory, createRouter } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const isBrowserRouting = import.meta.env.VITE_USE_BROWSER_ROUTING === 'true'

const history = isBrowserRouting ? createBrowserHistory() : createHashHistory()

export const router = createRouter({
  defaultPendingMinMs: 0,
  routeTree,
  history,
})
