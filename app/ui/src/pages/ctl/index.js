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
  var [show, setShow] = useState(true)
  var [sel, setSel] = useState([0,0])

  var tc = useRef(new BroadcastChannel('obscribe-template'))
  var cc = useRef(new BroadcastChannel('obscribe-caption'))
  var sc = useRef(new BroadcastChannel('obscribe-show'))


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
    tc.current.postMessage(templateData[s])
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
    cc.current.postMessage({
      id: manifestData[selectedTemplate].id,
      caption: captionsList[selectedTemplate][i].value[j]
    })
    setSel([i,j])
  }

  const toggleShow = ()=>{
    sc.current.postMessage(!show)
    setShow(!show)
  }

  var self = this

  return (
    <div className='ctl'>
      <div className='ctlFileHolder'>
        <label className='filelabel'>File</label>
        <input id="filepath"/>
        <button onClick={importCaptions}>Import</button>
      </div>

      {templateData.length?<div className='templateDataHolder'>
        <div className='tempSel'>
          <select onChange={changeTemplate}>
            {
              [{template: "Select Template"}].concat(templateData).map(t=> {
                return <option>{t.template}</option>
              })
            }
          </select>
          <button onClick={toggleShow}>{!show?"Show":"Hide"}</button>
        </div>
        {selectedTemplate!=-1?
          <div>
            {captionsList[selectedTemplate].map((cp, i)=>{
              return <div>
                <div className='name' onClick={toggleCollapse}>{cp.name}</div>
                {collapseData[i]?<div className='captHolder'>
                  {
                    cp.value.map((vl, j)=>{
                      return <div onClick={sendCaption.bind(self, i, j)}
                        className={`capt ${sel[0]==i && sel[1]==j?"sel":""}`}>
                        {vl[manifestData[selectedTemplate].id.indexOf(manifestData[selectedTemplate].key)]}
                      </div>
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