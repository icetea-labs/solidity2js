export default `pragma solidity ^0.4.18;
contract SimpleStore {
  // uint private value = 1;
  // address owner;
  // string name = 'tungduong';
  constructor(uint _value, uint _value1) public {
    // owner = tungduong;
    // owner = msg.sender;
    // value = _value;
    // while(true) {
    //   myMoney++;
    // }
    // callMeHandsome('tungduong', 20);
    // for(uint i = 0; i<n;i++) {
    // 	helloWorld();
    // }
  }
  function set(uint _value) private {
    // require(msg.sender == owner);
    uint value2 = human++;
    value2 = value2 + 3;
    value = value2;
    ++value;
    if(true) {
      value2 = value2 + 3;
      value = value2;
    }else {
      uint value2 = human++;
      value2 = value2 + 3;
      value = value2;
      ++value;
    }
  }
  // function get() public view returns (uint, uint) {
  //   value++;
  //   return value + 1;
  // }
  // function name(uint _value, uint _value1) public payable {
  // 	value = 1;
  // }
}`