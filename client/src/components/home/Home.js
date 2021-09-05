import React from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";


export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="home">
      <Container
        className='MyContainer'
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginTop: 70,
            fontSize:40,
            letterSpacing: "7px",
            fontFamily: "MyWebFont",
          }}
        >
          I M B U E
        </div>
        <div
          style={{
            fontFamily: "LuloCleanW01-One",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 12,
            lineHeight: "17px",
            alignItems: "center",
            textAlign: "center",
            marginTop: 40,
            letterSpacing: "5px",
          }}
        >
          LIVESTREAM TO YOUR FAVORITE
          <br />
          AUDIENCES AND GET PAID IN CRYPTO
        </div>
        <div
          style={{
            fontFamily: "LuloCleanW01-One",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "22px",
            lineHeight: "31px",
            alignItems: "center",
            textAlign: "center",
            marginTop: "20px"

          }}
        >
          CONNECT YOUR
          <br /> WALLET TO SIGN IN
        </div>
        <div style={{
          textAlign: "center",
          marginTop: 150
        }}>
          <Link className="wallet-button" to="/connectors">Connect Wallet</Link>
        </div>
      </Container>

    </div>
  )
}
