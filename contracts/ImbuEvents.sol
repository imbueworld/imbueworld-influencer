pragma solidity 0.5.16;
contract ImbuEvents {
  uint public eventCount = 0;
  uint public subscriberListCount = 0;
  mapping(uint => Event) public events;
  mapping(uint => Subscriber) public subscriberList;

  struct Event {
    uint id;
    string name;
    string description;
    uint price;
    address payable owner;
    string startTime;
    string endTime;
    bool isStarted;
  }
  
  struct Subscriber {
    uint eventId;
    address payable subscriberAddress;
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

  function createEvent(string memory _name, string memory _description, uint _price, string memory _startTime, string memory _endTime) public {
    require(bytes(_name).length > 0);
    require(bytes(_description).length > 0);
    require(_price >= 0);
    require(bytes(_startTime).length > 0);
    require(bytes(_endTime).length > 0);
    eventCount ++;
    events[eventCount] = Event(eventCount, _name, _description, _price, msg.sender,  _startTime, _endTime, false);

    emit EventCreated(eventCount, _name, _price, _startTime, _endTime, msg.sender);
  }

  function subscribeEvent(uint _id) public payable {
    // Get the event
    Event storage _event = events[_id];
    // Get the owner
    address payable _owner = _event.owner;
    // Validation id, enough Ether, 
    require(_event.id > 0 && _event.id <= eventCount);
    // Require that there is enough Ether in the transaction
    require(msg.value >= _event.price);
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

    if (isPurchased == false) {
      subscriberListCount++;
      subscriberList[subscriberListCount] = Subscriber(_id, msg.sender);
      // Update the event
      events[_id] = _event;
      // Pay the owner by sending them Ether
      address(_owner).transfer(msg.value);
      
      emit EventPurchased(_id, _event.name, _event.price, msg.sender);
    }
  }

  function startEvent(uint _id) public {
    Event memory _event = events[_id];
    _event.isStarted = true;
    events[_id] = _event;

    emit EventStarted(_id, _event.name, _event.price, msg.sender);
  }
  
}
