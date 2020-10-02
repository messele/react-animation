import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import AnimatedList from './AminatedList'
let myList = Array.from(Array(80).keys())

class App extends Component {

  constructor() {
    super();
    this.handleSwap = this.handleSwap.bind(this)
    this.state = {
      contents : myList
    }
  }
  handleSwap(src, dest) {
    const newContent = [...this.state.contents],
    srcIdx = newContent.findIndex(l => l === src),
    destIdx = newContent.findIndex(l => l === dest);
  
    newContent[destIdx] = src
    newContent[srcIdx] =  dest

    this.setState ({
      contents:newContent
    })
  }

  render() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <AnimatedList contents={this.state.contents} handleSwap={this.handleSwap} />
    </div>
  );
}
}

export default App;
