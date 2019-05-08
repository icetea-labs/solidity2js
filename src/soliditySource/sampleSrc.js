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



contract TestContract {
    // The function below will be called for each message
    // that is sent to this contract (as there is no other function to call).
    // However, if Ether is sent to this contract, an exception will occur.
    // That is because this contract does not have the "payable" modifier.
    function() { a = 1; }
    uint[] a;
    function sum(uint a) {
    	require(a>1);
    }
}

`