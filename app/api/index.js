const express = require('express')
const fs = require('fs')
const app = express()
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

app.listen(port, () => {
  console.log(`Running Obscriber> App listening at http://localhost:${port}`)
})

function sendError(res, code, msg){
    res.status(code)
    res.send({"error":msg})
}