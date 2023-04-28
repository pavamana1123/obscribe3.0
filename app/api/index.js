const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 8000

app.post('/', (req, res)=>{
    fs.readdir(req.body.path, { withFileTypes: true }, (err, files) => {
    if(err){
        sendError(res, 500, err)
    }

    try{
        res.send(files.filter(file => file.isDirectory()).map(dir => {
            return {
                template: dir.name,
                html: fs.readFileSync(`${req.body.path}/${dir.name}/index.html`,'utf8').trim(),
                css: fs.readFileSync(`${req.body.path}/${dir.name}/index.css`,'utf8').trim(),
                captions: fs.readFileSync(`${req.body.path}/${dir.name}/captions.txt`,'utf8').trim(),
            }
        }))
    }catch(err){
        sendError(res, 500, err)
    }

    })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

function sendError(res, code, msg){
    res.status(code)
    res.send({"error":msg})
}