import { useEffect, useRef, useState } from 'react';
import './index.css';

function Overlay(props) {

  var self = this
  const { ctl } = props

  useEffect(()=>{
    if(!document.getElementById('css')){
      const style = document.createElement('style');
      style.innerHTML = '';
      style.id = 'css';
      document.head.appendChild(style);
    }

    const bt = new BroadcastChannel("obscribe-template")
    bt.onmessage = ev => {
      document.getElementById("html").innerHTML = ev.data.html
      document.getElementById("css").innerHTML = ev.data.css
    }

    const bc = new BroadcastChannel("obscribe-caption")
    bc.onmessage = ev => {
      
    }
  },[])

  return (
    <div id='html'/>
  )

}

export default Overlay