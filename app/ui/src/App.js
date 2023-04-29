import './App.css';

import { useEffect, useState } from 'react';
import Overlay from './pages/overlay';
import Ctl from './pages/ctl';

function App() {

  return (
    <div className="App">
      {window.location.search=="?p=ctl"?<Ctl/>:<Overlay/>}
    </div>
  );
}

export default App;
