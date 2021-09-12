import React, {Component} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from 'react-router';
import ImbueEventsContract from '../../contracts/ImbuEvents.json';
import DaiContract from '../../contracts/DAI.json';
import getWeb3 from "../../getWeb3";
import { injected } from "../wallet/connectors";
import './EventDetail.css';
import ethereum from "../../images/ethereum.jpg";
import videojs from "video.js";
import videojsqualityselector from "videojs-hls-quality-selector";
import 'video.js/dist/video-js.css';
import axios from 'axios';
import CONTRACT_ADDRESS from '../../common/contracts';
const moment = require('moment');
var CryptoJS = require("crypto-js");
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function shortenText(text) {
  var ret = text;
  if (ret.length > 0) {
      ret = ret.substr(0, 6) + "..." + ret.substr(text.length - 5, text.length - 1);
  }
  return ret;
}

let interval;

class EventDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walletBalance: 0,
      address: '',
      eventId: '',
      currentEvent: [],
      subscriberList: [],
      videoElement: null,
      streamIsActive: false,
      isLoading: false,
      insufficientFund : false,
    }
  }

  componentDidMount = async() => {
    // Check network is Optimism Valid
    const chainId = await injected.getChainId();
    //if (chainId !== '0xa') {
    if (chainId !== '0x3') {
      const redirectUrl = this.props.match.url;
      this.props.history.push({
        pathname: '/connectors',
        search: '?redirectLink=' + redirectUrl,
        state: { wrongNetwork: true }
      })
      return;
    }

    await this.loadBlockchainData();
    
    const { eventId } = this.props.match.params;
    if (this.checkEventPurchased(eventId) && this.state.currentEvent.isStarted) {
      let streamData = CryptoJS.AES.decrypt(this.state.currentEvent[7], this.state.currentEvent.name).toString(CryptoJS.enc.Utf8).split('&&');
      const [streamId, streamKey, playbackId, apiKey] = [...streamData];
      const authorizationHeader = `Bearer ${apiKey}`;
      if (streamId) {
        interval = setInterval(async () => {
          try {
            const streamStatusResponse = await axios.get(
              `/api/stream/${streamId}`,
              {
                headers: {
                  "content-type": "application/json",
                  "authorization": authorizationHeader, // API Key needs to be passed as a header
                },
              }
            );
            if (streamStatusResponse.data) {
              const { isActive } = streamStatusResponse.data;
              this.setState({
                streamIsActive : isActive
              });
            }
          } catch (err) {
            console.log(err)
          }
        }, 5000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  componentDidUpdate(prevProps) {
    if (this.state.videoElement === null) return;
    const {streamIsActive, videoElement} = this.state;
    if (prevProps.streamIsActive !== streamIsActive) {
      if (streamIsActive) {
        let streamData = CryptoJS.AES.decrypt(this.state.currentEvent.streamData, this.state.currentEvent.name).toString(CryptoJS.enc.Utf8).split('&&');
        const [streamId, streamKey, playbackId, apiKey] = [...streamData];
        if (playbackId) {
          const player = videojs(videoElement, {
            autoplay: true,
            controls: true,
            sources: [
              {
                src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
              },
            ],
          });

          player.hlsQualitySelector = videojsqualityselector;
          player.hlsQualitySelector();

          player.on("error", () => {
            player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
          });
        }
      }
    }
  }

  onVideo = (video) => {
    this.setState({
      videoElement: video
    });
  }

  loadBlockchainData = async() => {
    const { eventId } = this.props.match.params;
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    
    // Get Wallet Address and Balance
    this.setState({ address: web3.currentProvider.selectedAddress});

    // Load abi and address from testnet
    const imbueEvents = new web3.eth.Contract(ImbueEventsContract.abi, CONTRACT_ADDRESS);
    const daiToken = new web3.eth.Contract(DaiContract, "0xad6d458402f60fd3bd25163575031acdce07538d");
    this.setState({ web3, accounts, contract: imbueEvents, daiToken: daiToken });

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

    // check user has enough dai or not.
    const balance = await this.state.daiToken.methods.balanceOf(this.state.account).call({from: this.state.account});
    this.setState({ walletBalance: web3.utils.fromWei(balance, "ether")});

    // check if user has sufficient dai balance
    this.interval = setInterval(async() => {
      const balance = await this.state.daiToken.methods.balanceOf(this.state.account).call({from: this.state.account});
      const insufficientFund = parseFloat(balance) < parseFloat(this.state.currentEvent.price);
      this.setState({insufficientFund});
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // subscribe Event using wallet
  subscribeEvent = async(id, price) => {
    // Check Optimism network is on
    /*const chainId = await injected.getChainId();
    if (chainId !== '0xa') {
      const redirectUrl = this.props.match.url;
      this.props.history.push({
        pathname: '/connectors',
        search: '?redirectLink=' + redirectUrl,
        state: { wrongNetwork: true }
      })
      return;
    }*/

    // check account balance
    const balance = await this.state.daiToken.methods.balanceOf(this.state.account).call({from: this.state.account});
    if (parseFloat(balance) < parseFloat(price)) {
      this.setState({insufficientFund: true});
      return;
    }

    this.setState({isLoading: true});

    const allowance = await this.state.daiToken.methods.allowance(this.state.account, CONTRACT_ADDRESS).call({from: this.state.account});
    console.log("allowance", this.state.web3.utils.fromWei(allowance));
    console.log(this.state.currentEvent.price);
    //if (this.state.web3.utils.toWei(allowance) < this.state.web3.utils.toWei(this.state.currentEvent.price)) {
    //  await this.state.daiToken.methods.approve(CONTRACT_ADDRESS, this.state.currentEvent.price).send({from: this.state.account});
    //}
    // Check approved
    try {
      await this.state.daiToken.methods.approve(CONTRACT_ADDRESS, this.state.currentEvent.price).send({from: this.state.account});
    }catch (error) {
      this.setState({isLoading: false});
      return;
    }

    let {subscriberList} = this.state
    this.state.contract.methods.subscribeEvent(id).send({from: this.state.account})
    .on('receipt', async(receipt) => {
      // redirect to events page
      subscriberList.push({eventId: id, subscriberAddress: receipt.from});
      this.setState({subscriberList: subscriberList});

      await this.loadBlockchainData();
      const { eventId } = this.props.match.params;
      if (this.checkEventPurchased(eventId) && this.state.currentEvent.isStarted) {
        let streamData = CryptoJS.AES.decrypt(this.state.currentEvent[7], this.state.currentEvent.name).toString(CryptoJS.enc.Utf8).split('&&');
        const [streamId, streamKey, playbackId, apiKey] = [...streamData];
        const authorizationHeader = `Bearer ${apiKey}`;
        if (streamId) {
          interval = setInterval(async () => {
            try {
              const streamStatusResponse = await axios.get(
                `/api/stream/${streamId}`,
                {
                  headers: {
                    "content-type": "application/json",
                    "authorization": authorizationHeader, // API Key needs to be passed as a header
                  },
                }
              );
              if (streamStatusResponse.data) {
                const { isActive } = streamStatusResponse.data;
                this.setState({
                  streamIsActive : isActive
                });
              }
            } catch (err) {
              console.log(err)
            }
          }, 5000);
        }
      }

      this.setState({isLoading: false});
    })
    .on('confirmation', (receipt) => {
      this.setState({isLoading: false});
      console.log('event subscribed');
    })
    .on('error', (error, receipt) => {
      this.setState({isLoading: false});
      console.log(error);
    })
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

  renderButtons = () => {
    const { currentEvent, isLoading, insufficientFund } = this.state;
    const { eventId } = this.props.match.params

    if (isLoading) {
      return (
        <a href="#" disabled="disabled"
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
           }}
        >PURCHASING NOW...</a>
      );
    } else {
      if(this.checkEventPurchased(eventId)) {
        return (
          <div className="wallet-button" to="/connectors"
           style={{
             display: "inline-block",
             cursor: "pointer",
             textDecoration: "none",
             letterSpacing: "1.5px",
             color: "#919194",
             fontSize: 15,
             backgroundColor: "#FFFFFF",
             padding: "10px 20px 10px 20px",
             border: "1px solid #000000",
             borderRadius: "20px",
           }}
          >YOU'VE SUCCESSFULLY BOOKED</div>
        )
      } else {
        if(insufficientFund) {
          return (
            <div className="wallet-button" to="/connectors"
                 style={{
                   display: "inline-block",
                   cursor: "pointer",
                   textDecoration: "none",
                   letterSpacing: "1.5px",
                   color: "#919194",
                   fontSize: 15,
                   backgroundColor: "#FFFFFF",
                   padding: "10px 20px 10px 20px",
                   border: "1px solid #000000",
                   borderRadius: "20px",
                 }}
            >WRONG <br/>CURRENCY OR <br/>INSUFFICIENT FUNDS<br/>
              <div style={{marginTop: "5px", marginBottom: "5px"}}>
                <a style={{background: "#333", paddingTop: "13px", paddingBottom: "13px", paddingLeft: "36px", paddingRight: "36px", borderRadius: "50px", color: "white" }}
                   href="https://app.uniswap.org/#/swap" target="_blank">SWAP TO DAI</a>
              </div>
            </div>
          )
        } else {
          return (
            <a href="#" onClick={() => this.subscribeEvent(currentEvent.id, currentEvent.price)}
               style={{
                 textDecoration: "none",
                 letterSpacing: "1.5px",
                 color: "#919194",
                 fontSize: 15,
                 backgroundColor: "#FFFFFF",
                 padding: "10px 20px 10px 20px",
                 border: "1px solid #000000",
                 borderRadius: "20px",
               }}
            >PURCHASE EVENT</a>
          )
        }
      }
    }
  }

  render() {
    const { walletBalance, address, currentEvent, streamIsActive } = this.state;
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
              <span>{ Math.round(walletBalance * 100000) / 100000 + 'DAI' }</span>
              <span style={{ 
                marginLeft: 10, 
                padding: "5px 8px", 
                borderRadius: 5, 
                backgroundColor: "#f7f8fa"
              }}>
                <span>{ shortenText(address) }</span>
                <img style={{ width: 12, marginLeft: 10 }} src={ethereum} alt="ethereum" />
              </span>
            </div>
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
              letterSpacing: "6px",
              marginTop: 30
            }}
            >
            <div>
              <div data-vjs-player>
                <video
                  className="video-js vjs-theme-city"
                  style={{ width: '1100px', height: '500px' }}
                  ref={this.onVideo}
                  controls
                  playsInline
                />
              </div>
              { !streamIsActive &&
              <div
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  top: "-19rem"
                }}
              >
                { this.renderButtons() }
              </div>
              }
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid black',
                  borderRadius: 20,
                  width: 200,
                  fontSize: 15,
                  letterSpacing: 1,
                  lineHeight: 1,
                  position: "absolute",
                  top: "11.5rem",
                  left: "66rem"
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: `${streamIsActive ? "green" : "yellow"}`,
                    width: 10,
                    height: 10,
                    border: `1px solid ${streamIsActive ? "green" : "yellow"}`,
                    borderRadius: 5,
                    marginRight: 10
                  }}
                ></div>
                {streamIsActive ? "Live" : "Waiting for Video"}
              </div>
            </div>
            <Row>
              <Col md={2}>{currentEvent && currentEvent.name}</Col>
              <Col md={8}>{currentEvent && currentEvent.description}</Col>
              <Col md={2}>{currentEvent && 
                (
                  moment(currentEvent.startDate).format('MMM Do YYYY') === moment(currentEvent.startDate).format('MMM Do YYYY') ?
                    <h5 style={{ textAlign: "center", marginLeft: 10, color: "#919194", fontSize: '1.15rem' }}>
                      {moment(currentEvent.startDate).format('MMM Do YYYY')} <br /> 
                      {moment(currentEvent.startDate).format('h A')} - {moment(currentEvent.endDate).format('h A')}
                    </h5>
                    :
                    <h5 style={{ textAlign: "center", marginLeft: 10, color: "#919194", fontSize: '1.15rem' }}>
                      {moment(currentEvent.startDate).format('MMM Do YYYY h A')} - <br /> 
                      {moment(currentEvent.endDate).format('MMM Do YYYY h A')}
                    </h5>
                )
              }</Col>
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
