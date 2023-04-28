import { useRef, useState } from 'react';
import './index.css';
import API from "../../api"

const importCaptions = ()=>{
  new API(
    {
      path: "C:/PVPD/a"
    }
  ).call().then((res)=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}

function Ctl(props) {
  return (
    <div className='ctl'>
      <div className='ctlFileHolder'>
        <label>File</label>
        <input/>
        <button onClick={importCaptions}>Import</button>
      </div>
    </div>
  )

}

export default Ctl;