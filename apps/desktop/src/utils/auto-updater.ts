import { app, autoUpdater, dialog } from 'electron'

export function setupAutoUpdater() {
  if (!app.isPackaged) return

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available and will be downloaded in the background.',
    })
  })

  autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
    dialog
      .showMessageBox({
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Update Ready',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart to apply the update.',
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall()
      })
  })

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error)
  })

  // Configure your update feed URL then uncomment:
  // autoUpdater.setFeedURL({ url: 'https://your-update-server.com/updates' })
  // autoUpdater.checkForUpdates()
}
