import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import share from "../../images/share.png";

const moment = require('moment');

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
      {
        id: 1,
        name: 'adsfadsfasdfadsfasdfasdf',
        date: '',
      },
      {
        id: 2,
        name: 'asdfadsfadsfasdfadsfasdfasdf',
        date: '',
      }
    ],
    }

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
  }

  componentDidMount() {
    this.loadBlockchainData();
    console.log('events page will mount');
  }

  async loadBlockchainData() {
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
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

  render() {
    const {events} = this.state;
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
                  {events.map((event, index) => (
                    <div key={index.toString()}
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
                          <h5
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
                            START EVENT
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
}

export default Events;
