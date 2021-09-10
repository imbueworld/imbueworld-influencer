import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from 'react-router';
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import ethereum from '../../images/ethereum.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './Events.css';
import CONTRACT_ADDRESS from '../../common/contracts';
const moment = require('moment');

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walletBalance: 0,
      address: '',
      events: [],
      subscriberList: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  loadBlockchainData = async() => {
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

    // Load abi and address from testnet
    const imbueEvents = new web3.eth.Contract(ImbueEventsContract.abi, CONTRACT_ADDRESS);
    this.setState({ web3, accounts, contract: imbueEvents });

    const eventCount = await imbueEvents.methods.eventCount().call();
    console.log(eventCount); 
    this.setState({ eventCount });
    // Load subscriberList
    const subscriberListCount = await imbueEvents.methods.subscriberListCount().call();
    for (var i = 1; i <= subscriberListCount; i++) {
      const subscriber = await imbueEvents.methods.subscriberList(i).call();
      this.setState({
        subscriberList: [...this.state.subscriberList, subscriber]
      })
    }
    // Load events
    for (var i = 1; i <= eventCount; i++) {
      const event = await imbueEvents.methods.events(i).call();
      this.setState({
        events: [...this.state.events, event]
      })
    }
  }

  // subscribe Event using wallet
  subscribeEvent = (e, id, price) => {
    e.preventDefault();
    e.stopPropagation();
    let {subscriberList} = this.state;
    this.setState({ isLoading: true});
    this.state.contract.methods.subscribeEvent(id).send({from: this.state.account, value: price})
    .on('receipt', (receipt) => {
      // redirect to events page
      subscriberList.push({eventId: id, subscriberAddress: receipt.from});
      this.setState({ isLoading: false});
      this.setState({subscriberList: subscriberList});
    })
    .on('confirmation', (receipt) => {
      console.log('event subscribed');
    })
    .on('error', (error, receipt) => {
      this.setState({ isLoading: false});
      console.log(error);
    })
  }

  // Redirect eventDetail page
  redirectToEventDetail = (id, name, owner) => {
    // Redirect to EventDetail Page
    var redirectLink = "/event/" + owner + '/' + id + '/' + name;
    redirectLink = redirectLink.replace(/ /g, '')
    this.props.history.push(redirectLink);
  }

  // Check event if purchased
  checkEventPurchased = (eventId) => {
    let isPurchased = false;
    const { address, subscriberList } = this.state;
    if(subscriberList.length > 0) {
      subscriberList.map((subscriber, index) => {
        if(subscriber.eventId === eventId && subscriber.subscriberAddress.toUpperCase() === address.toUpperCase()) {
          isPurchased = true;
        }
      });
    }

    return isPurchased;
  }

  render() {
    const {events, subscriberList, isLoading} = this.state;

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
              <span>{ Math.round(this.state.walletBalance * 100000) / 100000 + 'ETH' }</span>
              <span style={{ 
                marginLeft: 10, 
                padding: "5px 8px", 
                borderRadius: 5, 
                backgroundColor: "#f7f8fa"
              }}>
                <span>{ shortenText(this.state.address) }</span>
                <img style={{ width: 12, marginLeft: 10 }} src={ethereum} alt='ethereum' />
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
              letterSpacing: "6px",
            }}
          >
            UP COMING
            <br /> EVENTS
          </div>
          {
            events.length > 0 ?
              ( <div>
                  {events.map((event, index) => (
                    <div onClick={() => this.redirectToEventDetail(event.id, event.name, event.owner)}
                      key={index}
                      style={{
                        backgroundColor: "#242429",
                        borderRadius: 20,
                        marginTop: 20,
                        height: 60,
                        marginBottom: 20,
                        cursor: 'pointer'
                      }}
                    >
                      <Row>
                        <Col sm={5}>
                          <h4 style={{ color: "#FFFFFF", marginTop: 13, textAlign: 'left', paddingLeft: 30, letterSpacing: 2 }}>
                            {event.name}
                          </h4>
                        </Col>
                        <Col sm={3} style={{ color: "#FFFFFF", marginTop: 8 }}>
                          {
                            moment(event.startTime).format('MMM Do YYYY') === moment(event.endTime).format('MMM Do YYYY') ?
                              <h5 style={{ textAlign: "center", marginLeft: 10, color: "#919194", fontSize: '1.15rem' }}>
                                {moment(event.startTime).format('MMM Do YYYY')} <br /> 
                                {moment(event.startTime).format('h A')} - {moment(event.endTime).format('h A')}
                              </h5>
                              :
                              <h5 style={{ textAlign: "center", marginLeft: 10, color: "#919194", fontSize: '1.15rem' }}>
                                {moment(event.startTime).format('MMM Do YYYY h A')} - <br /> 
                                {moment(event.endTime).format('MMM Do YYYY h A')}
                              </h5>
                          }
                        </Col>
                        <Col sm={1} style={{ color: "#FFFFFF", marginTop: 15 }}>
                          <FontAwesomeIcon className='icon-share' icon={faShareSquare} size="lg" />
                        </Col>
                        <Col
                         sm={3}
                        >
                          { isLoading ?
                              (<h5 className="start-event" disabled={isLoading}>
                                Purchasing Now...
                                <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />
                              </h5>) 
                              :
                              (this.checkEventPurchased(event.id) ?
                              <h5 onClick={() => this.redirectToEventDetail(event.id, event.name, event.owner)}
                                className="start-event"
                              >
                                VISIT EVENT
                              </h5>
                              :
                              <h5 onClick={(e) => this.subscribeEvent(e, event.id, event.price)}
                                className="start-event"  
                              className="start-event"  
                                className="start-event"  
                              >
                                PURCHASE EVENT
                              </h5>
                              )
                          }
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
                NO UPCOMING EVENTS... 
              </div>)
          }
          
        </Container>
      </div>
    );
  }
}

export default withRouter(Events);
