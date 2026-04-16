import { app, ipcMain, shell } from 'electron'
import { BACKEND_URL } from './constants'
import { getMainWindow } from './window'

export function setupIPC() {
  ipcMain.handle('app:version', () => app.getVersion())
  ipcMain.handle('app:name', () => app.getName())
  ipcMain.handle('app:backendUrl', () => BACKEND_URL)

  ipcMain.handle('window:minimize', () => getMainWindow()?.minimize())
  ipcMain.handle('window:maximize', () => {
    const win = getMainWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })
  ipcMain.handle('window:close', () => getMainWindow()?.close())
  ipcMain.handle('window:isMaximized', () => getMainWindow()?.isMaximized() ?? false)

  ipcMain.handle('shell:openExternal', (_event, url: string) => shell.openExternal(url))
}
