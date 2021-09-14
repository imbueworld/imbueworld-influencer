import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import {
  Link,
} from "react-router-dom";
import './Home.css';


export default function Home() {
  // const { active, account, library, connector, activate, deactivate } = useWeb3React()

  // async function connect() {
  //   try {
  //     await activate(injected)
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

  // async function disconnect() {
  //   try {
  //     deactivate()
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

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
        <Link className="wallet-button" to="/connectors"
          style={{
            textDecoration: "none",
            letterSpacing: "1.5px",
            color: "#919194",
            fontSize: 10,
            backgroundColor: "#242429",
            padding: "10px 20px 10px 20px",
            borderRadius: "20px",        
            float: "right",
            marginTop: -50,
          }}
        >CONNECT WALLET</Link>
        <div
          style={{
            alignItems: "center",
            textAlign: "center",
            marginTop: 50,
          }}
        >
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
          >CONNECT WALLET TO JOIN LIVESTREAM</Link>
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
            letterSpacing: "6px",
            marginTop: 30
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
