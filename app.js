const {
  app,
  dialog,
  BrowserWindow,
  Tray,
  Menu
} = require('electron')
const nativeImage = require('electron').nativeImage
const appVersion = '1.0.3'
const path = require('path')
const baseIconPath = 'src/assets/icons/'
const iconPath = baseIconPath + 'icon.png'
const AutoLaunch = require('auto-launch')
const rootUrl = 'https://chat.zalo.me/'
let autoLaunchOptions = {
  name: 'Unofficial Zalo'
}
if (process.platform === 'linux') {
  autoLaunchOptions.path = '/opt/Unofficial\\ Zalo/unofficial-zalo'
}
const appAutoLauncher = new AutoLaunch(autoLaunchOptions)

var isAutoLaunchEnabled = false
const menuTemplate = [{
  label: 'Menu',
  submenu: [{
    label: 'About Unofficial Zalo',
    click () {
      dialog.showMessageBox({
        icon: nativeImage.createFromPath(baseIconPath + 'app-icon.png'),
        title: 'About Unofficial Zalo',
        message: 'Unoffical Zalo ' + appVersion,
        detail: 'Built by SAFE Studio with ❤️ and Electron',
        buttons: ['OK']
      })
    }
  },
  {
    label: 'Hide window',
    accelerator: 'CmdOrCtrl+H',
    click () {
      if (win.isMinimized()) {
        win.focus()
      }
      if (win.isVisible()) {
        menuTemplate[0].submenu[1].label = 'Show window'
        win.hide()
      } else {
        menuTemplate[0].submenu[1].label = 'Hide window'
        win.show()
      }
      refreshTrayMenu()
      refreshAppMenu()
    }
  },
  {
    label: 'Auto start with OS',
    type: 'checkbox',
    checked: isAutoLaunchEnabled,
    click () {
      toogleAutoLaunch()
    }
  },
  {
    label: 'Quit',
    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
    click () {
      app.quit()
    }
  }]
},
{
  label: 'Developer',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'F5',
      click () {
        win.loadURL(rootUrl)
      }
    },
    {
      label: 'Open developer tool',
      click () {
        win.webContents.openDevTools()
      }
    }
  ]
}]

function toogleAutoLaunch () {
  appAutoLauncher.isEnabled()
    .then(function (isEnabled) {
      if (isEnabled) {
        appAutoLauncher.disable()
      } else {
        appAutoLauncher.enable()
      }
      isAutoLaunchEnabled = !isEnabled
      menuTemplate[0].submenu[2].checked = isAutoLaunchEnabled
      refreshAllMenus()
    })
    .catch(function (err) {
      console.log('Error occurred: ' + err.message)
    })
}

function refreshAutoLaunch (callback) {
  appAutoLauncher.isEnabled()
    .then(function (isEnabled) {
      isAutoLaunchEnabled = isEnabled
      menuTemplate[0].submenu[2].checked = isAutoLaunchEnabled
      if (typeof callback === 'function') {
        callback()
      }
      refreshAppMenu()
    })
    .catch(function (err) {
      console.log('Error occurred: ' + err.message)
    })
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray
let trayMenu

function refreshAppMenu () {
  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function refreshTrayMenu () {
  trayMenu = Menu.buildFromTemplate(menuTemplate[0].submenu.slice(1))
  if (process.platform === 'linux') {
    tray.setContextMenu(trayMenu)
  }
}

function refreshAllMenus () {
  refreshTrayMenu()
  refreshAppMenu()
}

function createWindow () {
  process.env.XDG_CURRENT_DESKTOP = 'Unity'
  // Create the browser window.
  win = new BrowserWindow({
    icon: path.join(__dirname, iconPath)
  })
  win.maximize()

  // and load the index.html of the app.
  win.loadURL(rootUrl)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  tray = new Tray(path.join(__dirname, iconPath))
  trayMenu = Menu.buildFromTemplate(menuTemplate[0].submenu.slice(1))
  if (process.platform === 'linux') {
    tray.setContextMenu(trayMenu)
  }
  tray.on('click', () => {
    refreshAutoLaunch(() => {
      trayMenu = Menu.buildFromTemplate(menuTemplate[0].submenu.slice(1))
      tray.popUpContextMenu(trayMenu)
    })
  })
  refreshAutoLaunch()
  refreshAppMenu()

  win.on('minimize', () => {
    menuTemplate[0].submenu[1].label = 'Show window'
    refreshAllMenus()
  })

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
