const express = require('express')
const path = require('path');
const fs = require('fs')
const app = express()
app.use(express.static(path.join(__dirname, 'build')))
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3005

app.post('/', (req, res)=>{
    var path = req.get('path')
    console.log(`Obscriber> ${path}`)
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
    if(err){
        sendError(res, 500, err)
        return
    }

    try{
        res.send(files.filter(file => file.isDirectory()).map(dir => {
            return {
                template: dir.name,
                html: fs.readFileSync(`${path}/${dir.name}/index.html`,'utf8').trim(),
                css: fs.readFileSync(`${path}/${dir.name}/index.css`,'utf8').trim(),
                manifest: fs.readFileSync(`${path}/${dir.name}/manifest.json`,'utf8').trim(),
                captions: fs.readFileSync(`${path}/${dir.name}/captions.txt`,'utf8').trim(),
            }
        }))
    }catch(err){
        sendError(res, 500, err)
    }

    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`
Hare Krishna!
Obscriber is running

Dock Url: http://localhost:3005/ctl
Browser Overlay Url: http://localhost:3005/overlay
`.trim())
})

function sendError(res, code, msg){
    res.status(code)
    res.send({"error":msg})
}