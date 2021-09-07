import React, {Component} from 'react';
import { Container, Image, Row, Col } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import { withRouter } from 'react-router';
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import './EventDetail.css';
import avatar from "../../images/back.jpeg";
import ethereum from "../../images/ethereum.jpg"

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

class EventDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walletBalance: 0,
      address: '',
      eventId: '',
      currentEvent: [],
      subscriberList: [],
    }
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  loadBlockchainData = async() => {
    const { eventId } = this.props.match.params;
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

      const eventCount = await imbueEvents.methods.eventCount().call();

      // Load subscriberList
      const subscriberListCount = await imbueEvents.methods.subscriberListCount().call();
      for (var i = 1; i <= subscriberListCount; i++) {
        const subscriber = await imbueEvents.methods.subscriberList(i).call();
        this.setState({
          subscriberList: [...this.state.subscriberList, subscriber]
        })
      }

      // Load selected event with eventId
      const event = await imbueEvents.methods.events(eventId).call();
      this.setState({ currentEvent: event });
    } else {
      window.alert('ImbueEvents contract not deployed to detected network.')
    }
  }

  // subscribe Event using wallet
  subscribeEvent = (id, price) => {
    this.state.contract.methods.subscribeEvent(id).send({from: this.state.account, value: price})
    .on('confirmation', (receipt) => {
      console.log('event subscribed');
    })
    .on('error', function(error, receipt){
      console.log(error);
    })
  }

  // Check event if purchased
  checkEventPurchased = (eventId) => {
    let isPurchased = false;
    const { address, subscriberList } = this.state;
    if(subscriberList.length > 0) {
      subscriberList.map((subscriber, index) => {
        if(subscriber.eventId == eventId && subscriber.subscriberAddress.toUpperCase() == address.toUpperCase()) {
          isPurchased = true;
        }
      });
    }

    return isPurchased;
  }


  render() {
    const { walletBalance, address, currentEvent } = this.state;
    const { eventId } = this.props.match.params;

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
              this.checkEventPurchased(eventId) && 
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
              this.checkEventPurchased(eventId) ?
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
                :
                <a href="#" onClick={() => this.subscribeEvent(currentEvent.id, currentEvent.price)}
                  className="wallet-button" 
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
                >PURSHASE EVENT</a>
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
              <Col md={2}>{currentEvent && currentEvent.name}</Col>
              <Col md={8}>WORKOUT WITH ME AND GET ALL THE TIPS OF THE TIPS OF THE TRADE.</Col>
              <Col md={2}>{currentEvent && currentEvent.startTime}{currentEvent && currentEvent.endTime}</Col>
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
  
}
export default withRouter(EventDetail);
