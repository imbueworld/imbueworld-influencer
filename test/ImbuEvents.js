const ImbuEvents = artifacts.require("./ImbuEvents.sol");

contract("ImbuEvents", accounts => {
  it("...should store the value 89.", async () => {
    const ImbuEventsInstance = await ImbuEvents.deployed();

    // Set value of 89
    await ImbuEventsInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await ImbuEventsInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
