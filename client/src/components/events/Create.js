import React, {Component} from 'react';
import { Container, Form,  } from "react-bootstrap";
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import DatetimeRangePicker from 'react-datetime-range-picker';
import moment from 'moment';

import '../../bootstrap/dist/css/bootstrap.min.css';
import './Create.css';

import ethereum from '../../images/ethereum.jpg';

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
      walletBalance: 0,
      address: '',
      isFreeOrPaid: false,
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
      startDate: '',
      endDate: ''
    };

    this.createEvent = this.createEvent.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    this.loadBlockchainData();
  }

  setFree = () => {
    this.setState({
      isFreeOrPaid: false
    });
  }

  setPaid = () => {
    this.setState({
      isFreeOrPaid: true
    });
  }

  async loadBlockchainData() {
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    
    // Get Wallet Address and Balance
    this.setState({ address: web3.currentProvider.selectedAddress});

    const thisstate = this;
    web3.eth.getBalance(web3.currentProvider.selectedAddress, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        thisstate.setState({ walletBalance: web3.utils.fromWei(result, "ether")});
      }
    })

    const networkId = await web3.eth.net.getId();
    const networkData = ImbueEventsContract.networks[networkId]
    if(networkData) {
      const imbueEvents = new web3.eth.Contract(ImbueEventsContract.abi, networkData.address);
      this.setState({ web3, accounts, contract: imbueEvents });
    } else {
      window.alert('ImbueEvents contract not deployed to detected network.')
    }
  }

  createEvent(name, price, startDate, endDate) {
    this.state.contract.methods.createEvent(name, price, startDate, endDate).send({ from: this.state.account })
    .on('confirmation', function(confirmationNumber, receipt){
      // redirect to events page
      window.location = '/events';
      console.log(receipt);
    })
    .on('error', function(error, receipt){
      console.log(error);
    })
  }

  changeDateRange(event) {
    // get changed datetime and save to state
    this.setState({
      startDate: moment(event.start).format('YYYY-MM-DD H:mm:ss'),
      endDate: moment(event.end).format('YYYY-MM-DD H:mm:ss')
    });
  }
  
  submitForm(event) {
    event.preventDefault();
    const name = this.eventName.value;
    const price = this.state.web3.utils.toWei(this.eventPrice.value.toString(), 'Ether');
    const [startDate, endDate, ...other] = this.state;
    this.createEvent(name, price, startDate, endDate);
  }

  render() {
    const {isFreeOrPaid, walletBalance, address} = this.state;

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
              width: "285px"
              }}>
              <span>{ Math.round(this.state.walletBalance * 1000000) / 1000000 + 'ETH' }</span>
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
          <Form onSubmit={(event) => this.submitForm(event)} >
            <Form.Group className="mb-3 event-input" controlId="formGroupEventName">
              <Form.Control type="text" placeholder="EVENT NAME" ref={(input) => { this.eventName = input }} />
            </Form.Group>
            <Form.Group className="mb-3 event-input" controlId="formGroupDateTime">
              <DatetimeRangePicker onChange={(event) => this.changeDateRange(event)} />
            </Form.Group>
            { isFreeOrPaid ? 
              (<div className="row">
                <a className="mb-3 event-input btn-paid"
                  onClick={this.setFree}
                  style={{ marginRight: 40 }}
                >
                  <span className='btn-word-left'>FREE</span>
                  <span className='btn-word-right'>PAID</span>
                </a>
                <a className="mb-3 event-input btn-paid"
                  style={{ marginLeft: 40, backgroundColor: 'grey' }}
                  onClick={this.setPaid}
                >
                  <span className='btn-word-left'
                    style={{ color: "#f0f0f0" }}
                  >FREE</span>
                  <span className='btn-word-right'
                    style={{ color: "#000000" }}
                  >PAID</span>
                </a>
              </div>)
              :
              (<div className="row">
                <a className="mb-3 event-input btn-paid"
                  onClick={this.setFree}
                  style={{ marginRight: 40, backgroundColor: 'grey' }}
                >
                  <span className='btn-word-left'>FREE</span>
                  <span className='btn-word-right'>PAID</span>
                </a>
                <a className="mb-3 event-input btn-paid"
                  style={{ marginLeft: 40 }}
                  onClick={this.setPaid}
                >
                  <span className='btn-word-left'
                    style={{ color: "#f0f0f0" }}
                  >FREE</span>
                  <span className='btn-word-right'
                    style={{ color: "#000000" }}
                  >PAID</span>
                </a>
              </div>)
            }
            { isFreeOrPaid && 
              <div className="row">
                <Form.Group className="mb-3 event-empty" 
                  style={{ marginRight: 40 }}>
                </Form.Group>
                <Form.Group className="mb-3 event-input event-price" controlId="formGroupPrice"
                  style={{ marginLeft: 40 }}
                >
                  <Form.Control type="text" placeholder="PRICE (DAI)" ref={(input) => { this.eventPrice = input }} />
                </Form.Group>
              </div>
            }
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
