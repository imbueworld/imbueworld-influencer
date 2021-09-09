import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import getWeb3 from "../../getWeb3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';
import './Events.css';
const moment = require('moment');

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
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

  startEvent = (id) => {
    this.state.contract.methods.startEvent(id).send({from: this.state.account})
    .on('receipt', () => {
      console.log('receipt');
    })
    .on('confirmation', (receipt) => {
      console.log('event subscribed');
    })
    .on('error', function(error, receipt){
      console.log(error);
    })
  }

  goEventDetail = (event) => {
    let redirectPath = `http://localhost:3001/event/${event[4]}/${event[0]}/${event[2]}`;
    window.location.href = redirectPath;
  }

  render() {
    const {events, account} = this.state;
    
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
                    marginTop: 30
                  }}>
                    <Link className="wallet-button" to="/event/create">CREATE EVENTS</Link>
                  </div>
                  {events.filter((event) => event.owner === account).map((event, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#242429",
                        borderRadius: 20,
                        marginTop: 20,
                        height: 60,
                        marginBottom: 20
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
                          <FontAwesomeIcon className='icon-share' icon={faShareSquare} size="lg" 
                          onClick={() => this.goEventDetail(event)} />
                        </Col>
                        <Col
                         sm={3}
                        >
                           { !event.isStarted &&
                            <h5 className="start-event" onClick={() => this.startEvent(event.id)}>
                              START EVENT
                            </h5>
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
                      fontSize: 20,
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
