import { useRef, useState } from 'react';
import './index.css';

function Ctl(props) {

  function handleDirectoryDrop(event) {
    event.preventDefault()
    const items = event.dataTransfer.items;
    console.log(event)
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'directory') {
        const directory = item.webkitGetAsEntry();
        readDirectoryContents(directory);
      }
    }
  }
  
  function readDirectoryContents(directory) {
    const reader = directory.createReader();
    reader.readEntries(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isFile) {
          entry.file(function(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
              const contents = event.target.result;
              console.log(contents)
            };
            reader.readAsText(file);
          });
        } else if (entry.isDirectory) {
          readDirectoryContents(entry);
        }
      });
    });
  }

  return (
    <div className='ctl'>
      <div className='ctlFileHolder'>
        <label>File</label>
        <input/>
        <div id="dropzone" onDrop={handleDirectoryDrop} onDragOver={e=>{e.preventDefault()}}>
          Drop directory here
        </div>

        <button>Import</button>
      </div>
    </div>
  )

}

export default Ctl;