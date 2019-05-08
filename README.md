# Solidity2JS  
- A compiler that compiles Smart Contract written in Solidity to Javascript - a language that almost developers know and can use quickly. 

### Just `npm start`, open [http://localhost:3000](http://localhost:3000) to view it in the browser
paste your Solidity code in the left area and **Hot Dog**, the result appears. 
Then, you need to manually modify the Generated JavaScript code in the right side so that it can function properly.
1. We map `Contract` in **Solidity** to `Class` in **Javascript**. So we need to use `this` pointer to reference state of class. 
2.
3.

PROCESS:
Solidity SUPPORTTED:
* contract, interface
* state property, variable inside function
* function, state mutability, modifier
* array
* common opertator

Solidity not SUPPORTTED:
* map
* inheritance



------
* We use [solidity-parser-antlr](https://github.com/federicobond/solidity-parser-antlr) to parse the Solidity code and get the Solidity AST (Abstract Syntax Tree)
* We also fork the [ASTexplorer](http://ASTexplorer.net) website for easy using


