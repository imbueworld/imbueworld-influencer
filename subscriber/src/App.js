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
import Create from './components/events/Create';
import Purchase from './components/events/Purchase';

import ImbuEventsContract from "./contracts/ImbuEvents.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function getLibrary(provider) {
  return new Web3(provider)
}

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  /*componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
     const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ImbuEventsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ImbuEventsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
   }
  };*/

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  //};


  
  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

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
              <Route path="/event/create">
                <Create />
              </Route>
              <Route path="/event/purchase">
                <Purchase />
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
