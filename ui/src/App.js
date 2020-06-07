import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css';
import Todos from './components/Todos';
import SignUp from './components/SignUp';

function App() {

  return (
    <Router>
      {/* {rLogin && <Redirect to="/todos" />} */}
      <div className="App">
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/todos"  >
        <Todos />
      </Route>
    </div>
    </Router>
  )
}

export default App;
