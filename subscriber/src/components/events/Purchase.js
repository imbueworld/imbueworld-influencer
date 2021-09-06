import React, {useState} from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import { Container, Image, Row, Col } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import './Purchase.css';
import avatar from "../../images/back.jpeg";
import ethereum from "../../images/ethereum.jpg"

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

export default function Purchase() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [walletBalance, setWalletBalance] = useState(0.324234);
  const [address, setAddress] = useState('0xfdaf435wssdfsdfsdfsd');
  const [isPurchase, setIsPurchase] = useState(true);

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
            color: "#3c3c3c",
          }}
        >
          I M B U E
        </div>
        <div className="wallet-status">
          {
            isPurchase && 
            <div 
              style={{
                fontSize: 10,
                backgroundColor: "#f0f4f9",
                marginRight: 10
              }}
            >
              Bridge <br /> Assets
            </div>
          }
          <div style={{ width: 15, height: 15, backgroundColor: "#9CFFA6", borderRadius: "50%", marginTop: 8 }}>
          </div>
          <div style={{ 
            height: 31, 
            backgroundColor: "#edeef2", 
            fontSize: 11,
            lineHeight: "31px",
            paddingLeft: 10,
            paddingRight: 10,
            fontWeight: 500,
            marginLeft: 10,
            letterSpacing: 3,
            width: "285px"
            }}>
            <span>{ Math.round(walletBalance * 1000000) / 1000000 + 'ETH' }</span>
            <span style={{ 
              marginLeft: 10, 
              padding: "5px 8px", 
              borderRadius: 5, 
              backgroundColor: "#f7f8fa"
            }}>
              <span>{ shortenText(address) }</span>
              <img style={{ width: 12, marginLeft: 10 }} src={ethereum} />
            </span>
          </div>
          </div>
        <div
          style={{
            alignItems: "center",
            textAlign: "center",
            marginTop: 50,
          }}
        >
          {
            isPurchase ?
              <Link className="wallet-button" to="/connectors"
                style={{
                  textDecoration: "none",
                  letterSpacing: "1.5px",
                  color: "#919194",
                  fontSize: 15,
                  backgroundColor: "#FFFFFF",
                  padding: "10px 20px 10px 20px",
                  border: "1px solid #000000",
                  borderRadius: "20px",
                  marginTop: '-100px'
                }}
              >PURSHASE EVENT</Link>
            : 
              <Link className="wallet-button" to="/connectors"
                style={{
                  textDecoration: "none",
                  letterSpacing: "1.5px",
                  color: "#919194",
                  fontSize: 15,
                  backgroundColor: "#FFFFFF",
                  padding: "10px 20px 10px 20px",
                  border: "1px solid #000000",
                  borderRadius: "20px",
                  marginTop: '-100px'
                }}
              >YOU'VE SUCCESSFULLY BOOKED</Link>
          }
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
            marginTop: 15,
            letterSpacing: "6px",
            marginTop: '30px'
          }}
          >
          <Row>
            <Col md={2}>WORKOUT LIVE</Col>
            <Col md={8}>WORKOUT WITH ME AND GET ALL THE TIPS OF THE TIPS OF THE TRADE.</Col>
            <Col md={2}>8 AM - 9 AM JULY 21 2021</Col>
          </Row>
        </div>
        <div style={{
          textAlign: "center",
          marginTop: 150
        }}>
        </div>
      </Container>
    </div>
  )
}
