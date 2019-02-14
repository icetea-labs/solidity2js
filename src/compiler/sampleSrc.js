export default `pragma solidity ^0.4.18;
contract SimpleStore {
  uint private value = 1;
  address owner;
  string name = 'tungduong';
  constructor(uint _value, uint _value1) public {
    owner = tungduong;
    owner = msg.sender;
    value = _value;
  }
  // function set(uint _value) private {
  //   require(msg.sender == owner);
  //   uint value2 = _value++;
  //   value2 = value2 + 3;
  //   value = value2;
  //   //value++;
  // }
  function get() public view returns (uint, uint) {
    return value + 1;
  }
  function name() public payable {
  	value = 1;
  }
}`