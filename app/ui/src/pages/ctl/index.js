import { useEffect, useRef, useState } from 'react';
import './index.css';
import API from "../../api"
import cookie from "../../cookie"

function Ctl(props) {

  var [captionsList, setCaptionsList] = useState([])
  var [manifestData, setManifestData] = useState([])
  var [templateData, setTemplateData] = useState([])

  var [selectedTemplate, setSelectedTemplate] = useState(-1)
  var [collapseData, setCollapseData] = useState([])

  useEffect(()=>{
    document.getElementById('filepath').value = cookie.get('path')
  },[])

  const importCaptions = ()=>{
    var path = document.getElementById("filepath").value
    if(!path){
      alert("Empty file path")
      return
    }
    cookie.set('path', path)
    new API().call(path).then((res)=>{

      setTemplateData(res.body.map(r=>{
        return {
          template: r.template,
          html: r.html,
          css: r.css,
        }
      }))

      setManifestData(res.body.map(r=>{
        return JSON.parse(r.manifest)
      }))

      setCaptionsList(res.body.map(r=>{
        var { manifest, captions } = r

        var m = JSON.parse(manifest)
        var c = []
        var keyCount = 0
        captions.split("\n").forEach(line => {
          line = line.trim()
          if(line.startsWith("#")){
            c.push({
              name: line.replaceAll("#",""),
              value: []
            })
            return
          }
          if(!!line){
            if(keyCount%m.id.length==0){
              c[c.length-1].value.push([])
            }
            if(line.startsWith("~")){
              c[c.length-1].value[c[c.length-1].value.length-1][c[c.length-1].value[c[c.length-1].value.length-1].length-1]+=`
${line.replaceAll("~","")}`
            }else{
              c[c.length-1].value[c[c.length-1].value.length-1].push(line)
              keyCount++
            }
          }
        })

        return c
      }))

    }).catch(err=>{
      console.log(err)
      alert(err)
    })
  }

  const changeTemplate = (e)=>{
    var s = templateData.map(t=>{
      return t.template
    }).indexOf(e.target.value)
    setSelectedTemplate(s)
    setCollapseData(captionsList[s].map(()=>{
      return false
    }))
    let channel = new BroadcastChannel('obscribe-template');
    channel.postMessage(templateData[s])
  }

  const toggleCollapse = (e)=>{
    var i = captionsList[selectedTemplate].map(c=>{
      return c.name
    }).indexOf(e.target.textContent.trim())
    var cd = collapseData.map(c=>{
      return c
    })
    cd[i]=!cd[i]
    setCollapseData(cd)
  }

  const sendCaption = (i, j)=>{
    let channel = new BroadcastChannel('obscribe-caption');
    channel.postMessage({
      id: manifestData[selectedTemplate].id,
      caption: captionsList[selectedTemplate][i].value[j]
    })
  }

  var self = this

  return (
    <div className='ctl'>
      <div className='ctlFileHolder'>
        <label>File</label>
        <input id="filepath"/>
        <button onClick={importCaptions}>Import</button>
      </div>

      {templateData.length?<div className='templateDataHolder'>
        <select onChange={changeTemplate}>
          {
            [{template: "Select Template"}].concat(templateData).map(t=> {
              return <option>{t.template}</option>
            })
          }
        </select>
        {selectedTemplate!=-1?
          <div>
            {captionsList[selectedTemplate].map((cp, i)=>{
              return <div>
                <div onClick={toggleCollapse}>{cp.name}</div>
                {collapseData[i]?<div>
                  {
                    cp.value.map((vl, j)=>{
                      return <button onClick={sendCaption.bind(self, i, j)}>
                        {vl[manifestData[selectedTemplate].id.indexOf(manifestData[selectedTemplate].key)]}
                      </button>
                    })
                  }
                </div>:null}
              </div>
            })}
          </div>
        :null}
      </div>:null}
    </div>
  )

}

export default Ctl;