import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { app, BrowserWindow } from 'electron'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // In dev, the renderer is served by Vite at VITE_DEV_SERVER_URL.
  // In production, load the built index.html from dist/renderer.
  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (!app.isPackaged && devServerUrl) {
    mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
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
