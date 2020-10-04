import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import TileWrapper from './TileWrapper';

const DEFAULT_LIST = Array.from(Array(20).keys()).map(x=>x+1);


class App extends Component {

  constructor() {
    super();
    this.handleSwap = this.handleSwap.bind(this)
    this.addTiles   = this.addTiles.bind(this)
    this.changeAnimationSpeed = this.changeAnimationSpeed.bind(this)
    this.state = {
      tiles : DEFAULT_LIST,
      animationSpeed: 500
    }
  }
  addTiles (e) {
    const numTiles = parseInt(e.target.value);
    if(numTiles > 0) {
      this.setState({
        ...this.state,
        tiles:Array.from(Array(numTiles).keys()).map(x=>x+1)
      })
    }

  }
  changeAnimationSpeed (e) {
    const animationSpeed = parseInt(e.target.value);
    if(animationSpeed > 0) {
      this.setState({
        ...this.state,
        animationSpeed:animationSpeed
      })
    }

  }
  handleSwap(src, dest) {
    const newTiles = [...this.state.tiles],
    srcIdx = newTiles.findIndex(l => l === src),
    destIdx = newTiles.findIndex(l => l === dest);
  
    if(srcIdx < 0 || destIdx < 0 ) {
      console.error(`Cannot swap: invalid src and dest values: {src=${src}, dest=${dest}}`);
      return;
    }
    newTiles[destIdx] = src
    newTiles[srcIdx] =  dest

    this.setState ({
      tiles:newTiles
    })
  }

  render() {
  return (
    <div className="App">
      <div className="controls">
        <div><span>Number of Tiles:</span><input type="number" value={this.state.tiles.length} onChange={this.addTiles}></input></div>
         <div><span>Speed:</span><input type="number" value={this.state.animationSpeed} onChange={this.changeAnimationSpeed}></input></div>
      </div>
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
      <TileWrapper {...this.state} handleSwap={this.handleSwap} />
      
    </div>
  );
}
}

export default App;
