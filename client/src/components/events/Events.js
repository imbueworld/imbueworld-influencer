import React, {useState, useEffect} from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
const moment = require('moment');

function Events() {
  const [events, setEvents] = useState([]);

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
                  <div>

                    <div>{event.name}</div>
                    <div>{moment(event.date).format('MMMM Do YYYY, h:mm:ss a')}</div>
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
