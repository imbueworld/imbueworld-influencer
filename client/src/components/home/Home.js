import React from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"

function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  // async function disconnect() {
  //   try {
  //     deactivate()
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }


  return (
    <div className="home">
      <h1>Home page</h1>

      <button onClick={connect}>Connect Wallet</button>
    </div>
  );
}

export default Home;
