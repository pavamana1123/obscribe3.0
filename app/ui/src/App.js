import './App.css';

import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Overlay from './pages/overlay';
import Ctl from './pages/ctl';

function App() {

  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/ctl" element={<Ctl/>}></Route>
          <Route path="/overlay" element={<Overlay/>}></Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
