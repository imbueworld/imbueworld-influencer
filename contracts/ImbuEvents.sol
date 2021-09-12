// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract ImbuEvents {
  address daiAddress = address(0xaD6D458402F60fD3Bd25163575031ACDce07538D);
  uint public eventCount = 0;
  uint public subscriberListCount = 0;
  mapping(uint => Event) public events;
  mapping(uint => Subscriber) public subscriberList;

  struct Event {
    uint id;
    string name;
    string description;
    uint price;
    address owner;
    string startTime;
    string endTime;
    string streamData;
    bool isStarted;
  }

  struct Subscriber {
    uint eventId;
    address subscriberAddress;
  }

  event EventCreated(
    uint id,
    string name,
    uint price,
    string startTime,
    string endTime,
    address owner
  );

  event EventPurchased(
    uint id,
    string name,
    uint price,
    address subscriber
  );

  event EventStarted(
    uint id,
    string name,
    uint price,
    address owner
  );

  function createEvent(string memory _name, string memory _description, uint _price, string memory _startTime, string memory _endTime, string memory _streamData) public {
    require(bytes(_name).length > 0);
    require(bytes(_description).length > 0);
    require(_price >= 0);
    require(bytes(_startTime).length > 0);
    require(bytes(_endTime).length > 0);
    require(bytes(_streamData).length > 0);
    eventCount ++;
    events[eventCount] = Event(eventCount, _name, _description, _price, msg.sender,  _startTime, _endTime, _streamData,  false);

    emit EventCreated(eventCount, _name, _price, _startTime, _endTime, msg.sender);
  }

  function subscribeEvent(uint _id) payable public {
    // Get the event
    Event storage _event = events[_id];
    // Get the owner
    address _owner = _event.owner;
    // Validation id, enough Ether,
    require(_event.id > 0 && _event.id <= eventCount);
    // Require that the buyer is not the event owner
    require(_owner != msg.sender);
    // Check if user purchased
    bool isPurchased = false;
    for (uint j = 0; j < subscriberListCount; j++) {
      if(subscriberList[j].eventId == _id && subscriberList[j].subscriberAddress == msg.sender) {
        isPurchased = true;
        break;
      }
    }

    require(isPurchased == false);

    IERC20(daiAddress).transferFrom(msg.sender, _owner, _event.price);
    subscriberListCount++;
    subscriberList[subscriberListCount] = Subscriber(_id, msg.sender);

    emit EventPurchased(_id, _event.name, _event.price, msg.sender);
  }

  function startEvent(uint _id) public {
    Event memory _event = events[_id];
    _event.isStarted = true;
    events[_id] = _event;

    emit EventStarted(_id, _event.name, _event.price, msg.sender);
  }

}