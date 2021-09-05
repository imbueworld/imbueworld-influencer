pragma solidity ^0.5.0;

contract ImbuEvents {
  string public name;
  uint public eventCount = 0;
  mapping(uint => Event) public events;

  struct Event {
    uint id;
    string name;
    uint price;
    address payable owner;
    address[] subscribers;
    uint subscriberCounts;
    string startTime;
    string endTime;
    bool isStarted;
  }

  event EventCreated(
    uint id,
    string name,
    uint price,
    string startTime,
    string endTime,
    address payable owner
  );

  event EventPurchased(
    uint id,
    string name,
    uint price,
    address payable subscriber
  );

  event EventStarted(
    uint id,
    string name,
    uint price,
    address payable owner
  );

  constructor() public {
    name = "Imbu Events";
  }

  function createEvent(string memory _name, uint _price, string memory _startTime, string memory _endTime) public {
    require(bytes(_name).length > 0);
    require(_price >= 0);
    require(bytes(_startTime).length > 0);
    require(bytes(_endTime).length > 0);
    eventCount ++;
    events[eventCount] = Event(eventCount, _name, _price, msg.sender, new address[](0), 0, _startTime, _endTime, false);

    emit EventCreated(eventCount, _name, _price, _startTime, _endTime, msg.sender);
  }

  function subscribeEvent(uint _id) public payable {
    // Get the event
    Event memory _event = events[_id];
    // Get the owner
    address payable _owner = _event.owner;
    // Validation id, enough Ether, 
    require(_event.id > 0 && _event.id <= eventCount);
    // Require that there is enough Ether in the transaction
    require(msg.value >= _event.price);
    // Require that the buyer is not the event owner
    require(_owner != msg.sender);
    // Add address to subscribers
    _event.subscriberCounts++;
    _event.subscribers[_event.subscriberCounts] = msg.sender;
    // Update the event
    events[_id] = _event;
    // Pay the owner by sending them Ether
    address(_owner).transfer(msg.value);

    emit EventPurchased(_id, _event.name, _event.price, msg.sender);
  }

  function startEvent(uint _id) public {
    Event memory _event = events[_id];
    _event.isStarted = true;
    events[_id] = _event;

    emit EventStarted(_id, _event.name, _event.price, msg.sender);
  }
  
}
