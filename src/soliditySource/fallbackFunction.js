export default `
pragma solidity ^0.4.0;

contract TestContract {
    // The function below will be called for each message
    // that is sent to this contract (as there is no other function to call).
    // However, if Ether is sent to this contract, an exception will occur.
    // That is because this contract does not have the "payable" modifier.
    function() { a = 1; }
    uint a;
}


// this is a contract, which keeps all Ether to it with not way of 
// retrieving it.
contract SinkContract {
    function() payable { }
}

contract CallerContract {
    function testCall(TestContract test) {
        test.call(0xabcdef01); // hash is non-existent
        // will result in test.a becoming == 1.

        // The following statement is not going to compile.
        // But if ether is sent to this contract, the
        // transaction would fail and the Ether would be rejected
        //test.send(2 ether);
    }
}
`