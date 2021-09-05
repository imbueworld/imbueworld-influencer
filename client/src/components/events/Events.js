import React, {useState, useEffect} from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import { Container, Row, Col, Image } from "react-bootstrap";
import share from "../../images/share.png";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
const moment = require('moment');

function Events() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "MAX 's ABS & CORE ",
      date: ""    
    },
    {
      id: 1,
      name: "MAXsdf 's ABS & CORE ",
      date: ""    
    },
  ]);

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
        <div
          style={{
            fontFamily: "LuloCleanW01-One",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "22px",
            lineHeight: "27px",
            alignItems: "center",
            textAlign: "center",
            marginTop: 70,
            letterSpacing: "6px",
          }}
        >
          UP COMING
          <br /> EVENTS
        </div>
        {
          events.length > 0 ?
            ( <div>
                <div style={{
                  textAlign: "center",
                  marginTop: 20
                }}>
                  <Link className="wallet-button" to="/event/create"
                    style={{
                      textDecoration: "none",
                      letterSpacing: "1.5px",
                      color: "#919194",
                      fontSize: 10,
                      backgroundColor: "#242429",
                      padding: "10px 20px 10px 20px",
                      borderRadius: "20px",
                    }}
                  >CREATE EVENTS</Link>
                </div>
                {events.map(event => (
                  <div
                    style={{
                      backgroundColor: "#000",
                      borderRadius: 20,
                      marginTop: 40,
                      height: 80,
                    }}
                  >
                    <Row>
                      <Col>
                        <h4 style={{ color: "#FFFFFF", marginTop: 13, width: 500 }}>
                          {event.name}
                        </h4>
                      </Col>
                      <Col style={{ color: "#FFFFFF", marginTop: 8 }}>
                        <h3 style={{ textAlign: "center", marginLeft: 10 }}>
                          JULY 12TH 2021 <br /> 8PM-10PM
                        </h3>
                      </Col>
                      <Col style={{ color: "#FFFFFF", marginTop: 20 }}>
                        <Image
                          src={share}
                          style={{ width: 30, height: 30, marginLeft: 80 }}
                        />
                      </Col>
                      <Col
                        style={{
                          marginTop: 20,
                          backgroundColor: "#FFFFFF",
                          borderRadius: 20,
                          height: 40,
                          width: 10,
                          marginLeft: 80,
                        }}
                      >
                        <h5
                          style={{
                            color: "#000",
                            textAlign: "center",
                            marginTop: 10,
                          }}
                        >
                          CREATE EVENT
                        </h5>
                      </Col>
                    </Row>
                  </div>
                ))}
            </div>)
          :
          ( <div
              style={{
                fontFamily: "LuloCleanW01-One",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 15,
                lineHeight: "17px",
                alignItems: "center",
                textAlign: "center",
                marginTop: 70,
                letterSpacing: "5px",
                color: "#303030",
              }}
            >
              NO UPCOMING EVENTS... CREATE ONE
              <div style={{
                textAlign: "center",
                marginTop: 50
              }}>
                <Link className="wallet-button" to="/event/create"
                  style={{
                    textDecoration: "none",
                    letterSpacing: "1.5px",
                    color: "#919194",
                    fontSize: 10,
                    backgroundColor: "#242429",
                    padding: "10px 20px 10px 20px",
                    borderRadius: "20px",
                  }}
                >CREATE EVENTS</Link>
              </div>
            </div>)
        }
        
      </Container>
    </div>
  );
}

export default Events;
