const {
  app,
  BrowserWindow,
  Tray,
  Menu
} = require('electron')
const path = require('path')
const iconPath = 'src/assets/icons/linux/icon.png'
const menuTemplate = [{
  label: 'Menu',
  submenu: [{
      label: 'Hide window',
      click() {
        if (win.isVisible()) {
          menuTemplate[0].submenu[0].label = 'Show window'
          win.hide()
        } else {
          menuTemplate[0].submenu[0].label = 'Hide window'
          win.show()
        }
        refreshAppMenu()
      }
    },
    {
      label: 'Quit',
      click() {
        win.destroy()
      }
    }
  ]
}]

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray

function refreshAppMenu() {
  let menu = Menu.buildFromTemplate(menuTemplate)
  let trayMenu = Menu.buildFromTemplate(menuTemplate[0].submenu)
  Menu.setApplicationMenu(menu)
  tray.setContextMenu(trayMenu)
}

function createWindow() {
  process.env.XDG_CURRENT_DESKTOP = 'Unity'
  // Create the browser window.
  win = new BrowserWindow({
    icon: path.join(__dirname, iconPath)
  })
  win.maximize()

  // and load the index.html of the app.
  win.loadURL('https://chat.zalo.me/')

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  tray = new Tray(path.join(__dirname, iconPath))
  refreshAppMenu()
  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
