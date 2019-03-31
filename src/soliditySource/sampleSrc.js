export default `
pragma solidity ^0.4.22;

contract Oracle {
  // struct Request {
  //   bytes data;
  //   function(bytes memory) external callback;
  // }
  Request[] requests;
  // event NewRequest(uint);
  function query(bytes data, function(bytes memory) external callback) public {
    requests.push(Request(data, callback));
    request newRequest = Request(data, callback);
    uint[] arr;
    // emit NewRequest(requests.length - 1);
  }
  function reply(uint requestID, bytes response) public {
    // Here goes the check that the reply comes from a trusted source
    requests[requestID].callback(response);
  }
}
`