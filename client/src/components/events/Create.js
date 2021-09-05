import React, {Component} from 'react';
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
import { Container, Form } from "react-bootstrap";
import '../../bootstrap/dist/css/bootstrap.min.css';
import ethereum from '../../images/ethereum.jpg';
import './Create.css';
import { useInput } from './BindHooks';

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walletBalance: 343242,
      address: 'sjafljsaklfjsakljf;kasjf'
    };
  }

  submitEvent(event) {
    event.preventDefault();
    //const price = window.web3.utils.toWei(price.toString(), 'Ether');
    //this.props.createEvent(name, price, startTime, endTime);
  }

  render() {
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
              <span>{ Math.round(this.state.walletBalance * 100000) / 100000 + 'ETH' }</span>
              <span style={{ 
                marginLeft: 10, 
                padding: "5px 8px", 
                borderRadius: 5, 
                backgroundColor: "#f7f8fa"
              }}>
                <span>{ shortenText(this.state.address) }</span>
                <img style={{ width: 12, marginLeft: 10 }} src={ethereum} />
              </span>
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
              marginBottom: 20
            }}
          >
            CREATE EVENT
          </div>
          <Form onSubmit={this.submitEvent}>
            <Form.Group className="mb-3 event-input" controlId="formGroupEventName">
              <Form.Control type="text" placeholder="EVENT NAME" />
            </Form.Group>
            <Form.Group className="mb-3 event-input" controlId="formGroupDateTime">
              <Form.Control type="text" placeholder="SELECT DATE/TIME (CALENDAR)" />
            </Form.Group>
            <Form.Group className="mb-3 event-input" controlId="formGroupDescription">
              <Form.Control type="text" placeholder="DESCRIPTION" />
            </Form.Group>
            <div className="row">
              <button className="mb-3 event-input btn-paid" controlId="formGroupFree"
                style={{ marginRight: 40 }}
              >
                <span className='btn-word-left'>FREE</span>
                <span className='btn-word-right'>PAID</span>
              </button>
              <button className="mb-3 event-input btn-paid" controlId="formGroupPaid"
                style={{ marginLeft: 40 }}
              >
                <span className='btn-word-left'
                  style={{ color: "#f0f0f0" }}
                >FREE</span>
                <span className='btn-word-right'
                  style={{ color: "#000000" }}
                >PAID</span>
              </button>
            </div>
            <div className="row">
              <Form.Group className="mb-3 event-empty" 
                style={{ marginRight: 40 }}>
              </Form.Group>
              <Form.Group className="mb-3 event-input event-price" controlId="formGroupPrice"
                style={{ marginLeft: 40 }}
              >
                <Form.Control type="text" placeholder="PRICE (DAI)" />
              </Form.Group>
            </div>
            <div style={{
                  textAlign: "center",
                  marginTop: 50
                }}>
                  <button className="wallet-button" type="submit"
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
}

export default Create;
