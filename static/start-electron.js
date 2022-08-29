
// Modules to control application life and create native browser window
const { app, protocol, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
  })

  // and load the index.html of the app.
  if (isDev)
    mainWindow.loadURL('http://localhost:3000/')
  else
    mainWindow.loadFile("/")

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr('file://'.length)
    if (url.startsWith(__dirname)) {
      // console.log(`Using unchanged URL: ${request.url}`)
      callback({path: url}) ;
    } else {
      const url_path = (
        url == "/"
        ? path.normalize(`${__dirname}/index.html`)
        : path.normalize(`${__dirname}/${url}`)
      )
      // console.log(`Request URL: ${request.url}, Path: ${url_path}`)
      callback({path: url_path})
    }
    return true ;
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })

  // protocol.registerFileProtocol('atom', (request, callback) => {
  //   const url = request.url.substr("atom://".length)
  //   const url_path = (
  //     url.length == 0
  //     ? path.normalize(`${__dirname}/../build/index.html`)
  //     : path.normalize(`${__dirname}/../build/${url}`)
  //   ) ;
  //   callback({
  //     path: url_path
  //   })
  // })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
