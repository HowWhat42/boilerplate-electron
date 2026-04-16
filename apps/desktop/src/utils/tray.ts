import { app, Menu, nativeImage, Tray } from 'electron'
import { showOrCreateWindow } from './window'

let tray: Tray | null = null

export function createTray() {
  // 16x16 placeholder icon — replace with your app icon in resources/
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII='
  )

  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => showOrCreateWindow() },
    { type: 'separator' },
    { role: 'quit' },
  ])

  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
  tray.on('click', () => showOrCreateWindow())
}
