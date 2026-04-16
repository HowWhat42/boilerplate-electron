import { join } from 'node:path'
import pkg from 'electron-updater'
import { Menu, Tray, app, BrowserWindow, ipcMain, nativeImage, shell } from 'electron'
const { autoUpdater } = pkg

const IS_MAC = process.platform === 'darwin'
const IS_LINUX = process.platform === 'linux'

/**
 * On Wayland/GNOME, the taskbar icon is matched via the app-id
 * from the .desktop file, not from BrowserWindow({ icon }).
 */
if (IS_LINUX) {
  app.commandLine.appendSwitch('ozone-platform-hint', 'auto')
  app.commandLine.appendSwitch('class', 'boilerplate')
  app.commandLine.appendSwitch('wm-class', 'boilerplate')
}
app.setDesktopName('com.boilerplate.desktop')
app.setName('Boilerplate')

const STUDIO_PORT = 4200
const STUDIO_URL = `http://localhost:${STUDIO_PORT}`

/**
 * `vite-plugin-electron` injects VITE_DEV_SERVER_URL when the main process
 * is spawned by `vite` (dev). In production it's undefined and we load the
 * bundled renderer off disk.
 */
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function loadRenderer(window: BrowserWindow) {
  if (VITE_DEV_SERVER_URL) {
    window.loadURL(VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(join(app.getAppPath(), 'dist', 'renderer', 'index.html'))
  }
}

function getIcon() {
  if (IS_MAC) return undefined

  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'icon.png')
    : join(app.getAppPath(), 'build', 'icon.png')

  return nativeImage.createFromPath(iconPath)
}

function getPreloadPath() {
  return join(app.getAppPath(), 'dist', 'preload.cjs')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    icon: getIcon(),
    title: 'Boilerplate',
    ...(IS_MAC
      ? { titleBarStyle: 'hiddenInset' as const, trafficLightPosition: { x: 16, y: 10 } }
      : { frame: false }),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: getPreloadPath(),
    },
    backgroundColor: '#09090b',
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow!.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (IS_MAC) {
      mainWindow!.webContents.insertCSS(`
        body { padding-top: 28px !important; }
        #electron-drag-bar {
          position: fixed; top: 0; left: 0; right: 0; height: 28px;
          -webkit-app-region: drag; z-index: 99999; pointer-events: none;
        }
      `)
      mainWindow!.webContents.executeJavaScript(`
        if (!document.getElementById('electron-drag-bar')) {
          const bar = document.createElement('div');
          bar.id = 'electron-drag-bar';
          document.body.appendChild(bar);
        }
      `)
    } else {
      mainWindow!.webContents.insertCSS(TITLEBAR_CSS)
      mainWindow!.webContents.executeJavaScript(TITLEBAR_JS)
    }
  })
}

const TITLEBAR_CSS = `
  #electron-titlebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 28px;
    background: #18181b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-app-region: drag;
    z-index: 99999;
    user-select: none;
    border-bottom: 1px solid #1e1e22;
  }

  #electron-titlebar-title {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #71717a;
    padding-left: 16px;
  }

  #electron-titlebar-controls {
    display: flex;
    -webkit-app-region: no-drag;
    height: 100%;
  }

  #electron-titlebar-controls button {
    width: 36px;
    height: 100%;
    border: none;
    background: transparent;
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
  }

  #electron-titlebar-controls button:hover {
    background: #27272a;
  }

  #electron-titlebar-controls button.close:hover {
    background: #dc2626;
    color: #fff;
  }

  #electron-titlebar-controls button svg {
    width: 10px;
    height: 10px;
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
  }

  body {
    padding-top: 28px !important;
  }
`

const TITLEBAR_JS = `
  if (!document.getElementById('electron-titlebar')) {
    const bar = document.createElement('div');
    bar.id = 'electron-titlebar';
    bar.innerHTML = \`
      <span id="electron-titlebar-title">Boilerplate</span>
      <div id="electron-titlebar-controls">
        <button id="titlebar-minimize" title="Minimize">
          <svg viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5"/></svg>
        </button>
        <button id="titlebar-maximize" title="Maximize">
          <svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/></svg>
        </button>
        <button id="titlebar-close" class="close" title="Close">
          <svg viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>
        </button>
      </div>
    \`;
    document.body.prepend(bar);

    document.getElementById('titlebar-minimize').onclick = () => window.electronAPI.minimize();
    document.getElementById('titlebar-maximize').onclick = () => window.electronAPI.maximize();
    document.getElementById('titlebar-close').onclick = () => window.electronAPI.close();
  }
`

/**
 * Poll until the backend HTTP server responds. Any HTTP response means the
 * server is listening — we don't care about the status code, just reachability.
 */
async function waitForServer(maxRetries = 50) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fetch(STUDIO_URL)
      return
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  throw new Error(`Backend server did not start within ${maxRetries * 200}ms`)
}

const ONE_HOUR = 60 * 60 * 1000
let updateCheckTimeout: NodeJS.Timeout | null = null
let isCheckingForUpdates = false

async function checkForUpdates() {
  if (isCheckingForUpdates) return
  isCheckingForUpdates = true

  if (updateCheckTimeout) {
    clearTimeout(updateCheckTimeout)
    updateCheckTimeout = null
  }

  try {
    await autoUpdater.checkForUpdatesAndNotify()
  } catch (err: any) {
    console.error('Auto-update error:', err.message)
  }

  isCheckingForUpdates = false
  updateCheckTimeout = setTimeout(checkForUpdates, ONE_HOUR)
  updateCheckTimeout.unref()
}

function setupAutoUpdater() {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('error', (err) => {
    console.error('Auto-update error:', err.message)
  })

  checkForUpdates()
}

function showOrCreateWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    loadRenderer(mainWindow!)
    return
  }

  if (mainWindow.isMinimized()) mainWindow.restore()
  if (!mainWindow.isVisible()) mainWindow.show()
  mainWindow.focus()
}

function createTray() {
  const trayIconPath = app.isPackaged
    ? join(process.resourcesPath, 'tray-icon.png')
    : join(app.getAppPath(), 'build', 'tray-icon.png')

  const trayIcon = nativeImage.createFromPath(trayIconPath).resize({ width: 18, height: 18 })
  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Boilerplate', click: () => showOrCreateWindow() },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setToolTip('Boilerplate')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => showOrCreateWindow())
  tray.on('double-click', () => showOrCreateWindow())
}

function setupIPC() {
  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) return mainWindow.unmaximize()
    mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())
}

app.whenReady().then(async () => {
  if (app.isPackaged) process.env.NODE_ENV = 'production'

  setupIPC()

  const { startServer } = await import('@boilerplate/backend')
  startServer({ port: STUDIO_PORT, host: '127.0.0.1' })
  await waitForServer()

  createTray()
  createWindow()
  loadRenderer(mainWindow!)
  setupAutoUpdater()

  app.on('activate', () => showOrCreateWindow())
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  /**
   * Keep the app alive in the tray on all platforms.
   * The OTLP endpoint keeps running in the background.
   */
})
