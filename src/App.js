import React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import './App.css';
import Login from './login/Login';
import ProtectedRouter from './protected/UserProtected';
import ManagerProtected from './protected/ManagerProtected';
import Home from './home/Home';
import PassengerTransport from './transport/PassengerTransport';
import Navbar from './navbar/Navbar';
import ForeignHome from './home/ForeignHome';
import Report from './report/Report';
import ManagerLogin from './login/ManagerLogin';

function App() {
  return (
    <React.Fragment>
      <HashRouter>
      <Navbar />
        <Switch>    
          <Route exact path="/">   
            <Login/>
          </Route>
          <Route exact path="/manager">   
            <ManagerLogin/>
          </Route>
          <Route exact path="/Foreignpassenger/home">
            <ForeignHome/>
          </Route>
          <ManagerProtected exact path="/report/home" component={Report}/>    
          <ProtectedRouter exact path="/passenger/home" component={Home} />
          <ProtectedRouter exact path="/passenger/transport" component={PassengerTransport}/>
        </Switch>
      </HashRouter>
   </React.Fragment>
  );
}

export default App;
