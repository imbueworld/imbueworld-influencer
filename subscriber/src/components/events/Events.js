import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import { withRouter } from 'react-router';
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import share from "../../images/share.png";

import ethereum from '../../images/ethereum.jpg';

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
    }

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.subscribeEvent = this.subscribeEvent.bind(this);
  }

  componentDidMount() {
    this.loadBlockchainData();
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
      
      const eventCount = await imbueEvents.methods.eventCount().call();
      console.log(eventCount); 
      this.setState({ eventCount });
      // Load events
      for (var i = 1; i <= eventCount; i++) {
        const event = await imbueEvents.methods.events(i).call();
        this.setState({
          events: [...this.state.events, event]
        })
      }
    } else {
      window.alert('ImbueEvents contract not deployed to detected network.')
    }
  }

  // subscribe Event using wallet
  subscribeEvent(id, price) {
    this.state.contract.methods.subscribeEvent(id).send({from: this.state.account, value: price})
    .on('confirmation', (receipt) => {
      console.log('event subscribed');
    })
    .on('error', function(error, receipt){
      console.log(error);
    })
  }

  // Redirect eventDetail page
  redirectToEventDetail(id, name, owner) {
    // Redirect to EventDetail Page
    var redirectLink = "/event/" + owner + '/' + id + '/' + name;
    redirectLink = redirectLink.replace(/ /g, '')
    this.props.history.push(redirectLink);
  }

  render() {
    const {events} = this.state;
    debugger;

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
                        marginTop: 40,
                        height: 60,
                      }}
                    >
                      <Row>
                        <Col sm={5}>
                          <h4 style={{ color: "#FFFFFF", marginTop: 13, textAlign: 'left', paddingLeft: 30, letterSpacing: 2 }}>
                            {event.name}
                          </h4>
                        </Col>
                        <Col sm={3} style={{ color: "#FFFFFF", marginTop: 8 }}>
                          <h5 style={{ textAlign: "center", marginLeft: 10, color: "#919194" }}>
                            JULY 12TH 2021 <br /> 8PM-10PM
                          </h5>
                        </Col>
                        <Col sm={1} style={{ color: "#FFFFFF", marginTop: 15 }}>
                          <Image
                            src={share}
                            style={{ width: 30, height: 30 }}
                          />
                        </Col>
                        <Col
                         sm={3}
                        >
                          <a href="#" onClick={() => this.subscribeEvent(event.id, event.price)}
                            style={{
                              backgroundColor: "#f9f9f9",
                              color: "#1f1f1f",
                              textAlign: "center",
                              marginTop: 13,
                              marginRight: 30,
                              padding: "5px 0px 5px 0px",
                              borderRadius: 20,
                              cursor: 'pointer'
                            }}
                          >
                            PURCHASE EVENT
                          </a>
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
}

export default withRouter(Events);
