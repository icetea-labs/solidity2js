# Solidity2JS  
- A compiler that compiles Smart Contract written in Solidity to Javascript - a language that almost developers know and can use quickly. 

## Just `npm start`, open [http://localhost:3000](http://localhost:3000) to view it in the browser,
paste your Solidity code in the left area and **Hot Dog**, the result appears. 

Then, you need to manually modify the Generated JavaScript code results to function properly.
1. We map `Contract` in **Solidity** to `Class` in **Javascript**. So we need to use `this pointer` to reference state of class. 
2. The default decorator of class method is `@view`, depends on your code, you may want to change it to `@transaction`.
## Example:
```
pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```
This is a super simple solidity smart contract. Here is the code you would acquire after using the compiler:
```
//Pragma solidity version ^0.4.0
@contract
class SimpleStorage {
  @state
  #storedData;
  
  @view
  set(x) {
    storedData = x;
  }

  @view
  get() {
    return storedData;
  }
}

```
1. It is clearly seen that there is a state `storedData`, it is referenced by `set()` and `get()` method down below. So we need to add the `this pointer`: `storedData` -> `this.storedData`
2. Because the `set()` method change the state of the contract, it should not be decorated with `@view`: 
`@view` -> `@transaction`
3. Put it all together, we are good to go:
```
@contract
class SimpleStorage {
  @state
  #storedData;
  
  @transaction
  set(x) {
    this.storedData = x;
  }

  @view
  get() {
    return this.storedData;
  }
}
```

## CURRENT PROCESS:

### Solidity SUPPORTTED:
* contract, interface.
* state property, variable inside function.
* function, state mutability, modifier.
* array.
* common opertator.

### Solidity not yet SUPPORTTED:
* map.
* inheritance.
* more...


## THANKS
------
* We use [solidity-parser-antlr](https://github.com/federicobond/solidity-parser-antlr) to parse the Solidity code and get the Solidity AST (Abstract Syntax Tree).
* We fork the [ASTexplorer](http://ASTexplorer.net) website for easy using.


