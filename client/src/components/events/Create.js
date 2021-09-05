import React, {useState, useEffect} from 'react';
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
import { Container, Form } from "react-bootstrap";
import '../../bootstrap/dist/css/bootstrap.min.css';
import ethereum from '../../images/ethereum.jpg';
import './Create.css';

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

function Create() {
  const [walletBalance, setWalletBalance] = useState(0.00023454);
  const [address, setAddress] = useState('0xfadfadfadfadfadfafaaa12312312312312313123123f');

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
          <div className="wallet-status">
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
              width: "270px"
             }}>
              <span>{ walletBalance + 'ETH' }</span>
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
            letterSpacing: "7px",
          }}
        >
          CREATE EVENT
        </div>
        <Form>
          <Form.Group className="mb-3 event-input" controlId="formGroupEventName">
            <Form.Control type="text" placeholder="Event Name" />
          </Form.Group>
          <Form.Group className="mb-3 event-input" controlId="formGroupDateTime">
            <Form.Control type="text" placeholder="DateTime" />
          </Form.Group>
          <Form.Group className="mb-3 event-input" controlId="formGroupDescription">
            <Form.Control type="text" placeholder="Description" />
          </Form.Group>
          <Form.Group className="mb-3 event-input" controlId="formGroupFree">
            <Form.Control type="text" placeholder="Free" />
          </Form.Group>
          <Form.Group className="mb-3 event-input" controlId="formGroupPaid">
            <Form.Control type="text" placeholder="Paid" />
          </Form.Group>
          <Form.Group className="mb-3 event-input" controlId="formGroupPrice">
            <Form.Control type="text" placeholder="Price (Dai)" />
          </Form.Group>
          <div style={{
                textAlign: "center",
                marginTop: 50
              }}>
                <button className="wallet-button" to="/event/create"
                  style={{
                    textDecoration: "none",
                    letterSpacing: "1.5px",
                    color: "#919194",
                    fontSize: 10,
                    backgroundColor: "#242429",
                    padding: "10px 20px 10px 20px",
                    borderRadius: "20px",
                  }}
                >CREATE EVENT</button>
              </div>
        </Form>
      </Container>
    </div>
  );
}

export default Create;
