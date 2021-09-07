import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

import Home from './components/home/Home';
import Events from './components/events/Events';
import Connectors from "./components/connectors/Connectors";
import EventDetail from './components/events/EventDetail';

import './bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function getLibrary(provider) {
  return new Web3(provider)
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <div className="App">
          <Router>
            <Switch>
              <Route path="/events">
                <Events />
              </Route>
              <Route path="/connectors">
                <Connectors />
              </Route>
              <Route path="/event/:ownerAddress/:eventId/:eventName">
                <EventDetail />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </div>
      </Web3ReactProvider>
    );
  }
}

export default App;
