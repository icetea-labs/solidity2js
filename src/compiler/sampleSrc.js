export default `
contract SimpleStore {
  uint[] public a = [1,2,3]; 
  constructor()  {
    for(;;i++){
      a[1];
      uint[] numbers;
    }
  }
  modifier onlyOwner(uint _value) {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
  function set(uint _value) private onlyOwner(_value) onlyOwner1(_value){
    require(msg.sender == owner);
    if(true) {
      callMe();
    } 
  }
  function get() public view returns (uint, uint) {
    value++;
    return value + 1;
  }
  function name(uint _value, uint _value1) public payable {
  	value = 1;
  }
}`