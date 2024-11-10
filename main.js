const {app,BrowserWindow, Menu}= require('electron')
function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height:600,
    })
    win.loadFile("htmls/login.html")
    
}
app.whenReady().then(createWindow)