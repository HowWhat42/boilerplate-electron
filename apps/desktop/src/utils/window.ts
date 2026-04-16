import path from 'node:path'
import { BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null

export function getMainWindow() {
  return mainWindow
}

export function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: process.platform === 'darwin',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform !== 'darwin'
      ? {
          titleBarOverlay: {
            color: '#020817',
            symbolColor: '#f8fafc',
            height: 30,
          },
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

export function showOrCreateWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  } else {
    createWindow()
  }
}
