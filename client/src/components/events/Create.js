import React from 'react';
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
import { Container, Form } from "react-bootstrap";
import metamask from '../../images/metamask.svg';
import coinbase from '../../images/coinbase.svg';
import fortmatic from '../../images/fortmatic.png';
import portis from '../../images/portis.png';
import walletconnection from '../../images/walletconnection.png';
import impulse from '../../images/impulse.png';
import '../../bootstrap/dist/css/bootstrap.min.css';

function Create() {
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
          <Form.Group className="mb-3" controlId="formGroupEventName">
            <Form.Control type="text" placeholder="Event Name" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupDateTime">
            <Form.Control type="text" placeholder="DateTime" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupDescription">
            <Form.Control type="text" placeholder="Description" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupFree">
            <Form.Control type="text" placeholder="Free" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPaid">
            <Form.Control type="text" placeholder="Paid" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPrice">
            <Form.Control type="text" placeholder="Price (Dai)" />
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default Create;
