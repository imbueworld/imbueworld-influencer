pragma solidity >=0.4.21 <0.7.0;

import "../contracts/ImbuEvents.sol";

contract TestImbuEvents {

  function testItStoresAValue() public {
    ImbuEvents ImbuEvents = ImbuEvents(DeployedAddresses.ImbuEvents());

    imbuEvents.set(89);

    uint expected = 89;

    Assert.equal(imbuEvents.get(), expected, "It should store the value 89.");
  }

}
