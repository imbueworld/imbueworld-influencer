import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
import { Container } from "react-bootstrap";
import metamask from '../../images/metamask.svg';
import coinbase from '../../images/coinbase.svg';
import fortmatic from '../../images/fortmatic.png';
import portis from '../../images/portis.png';
import walletconnection from '../../images/walletconnection.png';
import impulse from '../../images/impulse.png';
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
        <img style={{ width: 20 }} src={impulse} alt="impulse" />
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
        MUST BE ON THE <br/>OPTIMISM NETWORK <br/>
        <p style={{ fontSize: '16px', color: '#333', letterSpacing: '1px'}}>Please click <a target="_blank" href="https://chainid.link/?network=optimism">here</a> to connect optimism network.</p>
      </div>
    </div>
  );
}

function Connectors() {
  const { activate } = useWeb3React()
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const history = useHistory();
  const search = useLocation().search;
  const redirectLink = new URLSearchParams(search).get('redirectLink');

  useEffect(() => {
    console.log('redirectLink', redirectLink);
    if (redirectLink !== null) {
      setWrongNetwork(true);
    }
  });

  async function connectWallet (e) {
    const chainId = await injected.getChainId();

    console.log('chainId', chainId);
    //if (chainId !== '0xa' && chainId !== '0x45' && chainId !== '0x2a') {
    if (chainId !== '0x3') {
      setWrongNetwork(true);
      return;
    }
    
    setWrongNetwork(false);
    try {
      await activate(injected);
      if (redirectLink !== null) {
        history.push(redirectLink);
      } else {
        history.push('/events');
      }
    } catch (ex) {
      console.log('injecting failed', ex)
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
          <span className="connect-button" href="#" onClick={connectWallet}
              style={{ 
                marginTop: 20,
              }}>
            MetaMask
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={metamask} alt='metamask' />
          </span>
          <span className="connect-button"
              style={{ marginTop: 10 }}>
            WalletConnection
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={walletconnection} alt='walletconnection' />
          </span>
          <span className="connect-button"
              style={{ marginTop: 10 }}>
            Coinbase Wallet
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={coinbase} alt='coinbase' />
          </span>
          <span className="connect-button"
              style={{ marginTop: 10 }}>
            Fortmatic
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={fortmatic} alt='fortmatic' />
          </span>
          <span className="connect-button"
              style={{ marginTop: 10 }}>
            Portis
            <img style={{ height: 30, position: "absolute", top: 5, right: 10 }} src={portis} alt='portis' />
          </span>
        </div>
        <WrongNetwork networkStatus={wrongNetwork} />
      </Container>
    </div>
  );
}

export default Connectors;
