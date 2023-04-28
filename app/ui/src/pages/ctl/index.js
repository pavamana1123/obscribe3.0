import { useRef, useState } from 'react';
import './index.css';

function Ctl(props) {

  const openDirectory = (event)=>{
    const files = event.target.files;
    console.log(files)
  }

  return (
    <div className='ctl'>
      <div className='ctlFileHolder'>
        <label>File</label>
        <input/>
        <input id='ctlFileHidden' type='file' directory webkitdirectory mozdirectory msdirectory odirectory/>
        <button onClick={openDirectory}>...</button>
        <button>Import</button>
      </div>
    </div>
  )

}

export default Ctl;