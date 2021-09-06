import React from 'react';
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
import { Container } from "react-bootstrap";
import metamask from '../../images/metamask.svg';
import coinbase from '../../images/coinbase.svg';
import fortmatic from '../../images/fortmatic.png';
import portis from '../../images/portis.png';
import walletconnection from '../../images/walletconnection.png';
import impulse from '../../images/impulse.png';
import getWeb3 from '../../getWeb3';
import './Connectors.css';

function WrongNetwork(props) {
  if (!props.networkStatus) {
    return null;
  }

  return (
    <div>
      <div className="wrong"
          style={{ 
            marginTop: 10,
            textAlign: "center",
            backgroundColor: "#e26861",
            color: "#ffffff",
            fontSize: 20,
            padding:10,
            borderRadius: 15,
            width: 230,
            marginLeft: "auto",
            marginRight: "auto"
           }}>
        <img style={{ width: 20 }} src={impulse}/>
        &nbsp;&nbsp;Wrong Network
      </div>
      <div style={{
            textAlign: "center",
            color: "#f21321",
            fontSize: 25,
            marginTop: 10,
            letterSpacing: "6px",
            fontFamily: "MyWebFont"
      }}>
        MUST BE ON THE <br/>OPTIMISM NETWORK
      </div>
    </div>
  );
}

function Connectors() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  async function connectWallet (e) {
    try {
      await activate(injected);
      window.location = '/events';
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="connectors">
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
            color: "#3c3c3c",
          }}
        >
          I M B U E
        </div>
        <div
          style={{
            width: 280,
            marginTop: 100,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <div
            style={{
              fontSize: 11,
              padding: 10,
              backgroundColor: "#EDEDED",
              borderRadius: 10,
              textAlign: "left",
              border: "1px solid #E9E9E9",
            }}
          >
            By connecting a wallet, you agree to Uniswap Labs' 
            <a style={{ color: "#FE4B39" }} href="terms"> Terms of Service</a> and
            acknowledge that you have read and understand the 
            <a style={{ color: "#FE4B39", textDecoration: "none" }} href="disc"> Uniswap protocol disclaimer.
            </a>
          </div>
          <a className="connect-button" href="#" onClick={connectWallet}
              style={{ 
                marginTop: 20,
              }}>
            MetaMask
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={metamask} />
          </a>
          <a className="connect-button"
              style={{ marginTop: 10 }}>
            WalletConnection
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={walletconnection} />
          </a>
          <a className="connect-button"
              style={{ marginTop: 10 }}>
            Coinbase Wallet
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={coinbase} />
          </a>
          <a className="connect-button"
              style={{ marginTop: 10 }}>
            Fortmatic
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={fortmatic} />
          </a>
          <a className="connect-button"
              style={{ marginTop: 10 }}>
            Portis
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={portis} />
          </a>
        </div>
        <WrongNetwork networkStatus={true} />
      </Container>
    </div>
  );
}

export default Connectors;
