import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Split from 'react-split'


import AceEditor from 'react-ace'

import 'brace/mode/javascript';
import 'brace/theme/github';

import {compile} from './lib';
import sampleSrc from './soliditySource/sampleSrc'
// import sampleSrc from './soliditySource/erc20'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      soliditySrc: sampleSrc,
      jsSrc: compile(sampleSrc)
    })
  }
  onChange = (value) => {
    this.setState({
      soliditySrc: value,
      jsSrc: compile(value)
    });
  }
  render() {
    const jsOptions = {
      readOnly: true,
      displayIndentGuides: false
    }
    return (
      <Split sizes={[45, 55]} className="container">
        <section className="pane">
        <h3>SOLIDITY</h3>
          <AceEditor
            value={this.state.soliditySrc}
            mode="javascript"
            theme="github"
            height='100%'
            width='100%'
            onChange={this.onChange}
            showPrintMargin={false}
            showGutter={false}
            name="solidityPane"
            editorProps={{$blockScrolling: true}}
          />
        </section>
        <section className="pane">
          <h3>JAVASCRIPT (ES.next)</h3>
          <AceEditor
          value={this.state.jsSrc}
          setOptions={jsOptions}
            mode="javascript"
            theme="github"
            height='100%'
            width='100%'
            showPrintMargin={false}
            showGutter={false}
            name="jsPane"
            editorProps={{$blockScrolling: true}}
          />
        </section>
      </Split>
    );
  }
}

export default App;
