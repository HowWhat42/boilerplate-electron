import started from 'electron-squirrel-startup'
import { app, BrowserWindow } from 'electron'
import { BACKEND_PORT } from './utils/constants'
import { setupIPC } from './utils/ipc'
import { waitForServer } from './utils/server'
import { createTray } from './utils/tray'
import { createWindow, showOrCreateWindow } from './utils/window'
import { setupAutoUpdater } from './utils/auto-updater'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

app.whenReady().then(async () => {
  if (app.isPackaged) process.env.NODE_ENV = 'production'

  setupIPC()

  const { startServer } = await import('@boilerplate/backend')
  startServer({ port: BACKEND_PORT, host: '127.0.0.1' })
  await waitForServer()

  createTray()
  createWindow()
  setupAutoUpdater()

  app.on('activate', () => showOrCreateWindow())
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
