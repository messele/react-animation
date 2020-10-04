import _                    from 'lodash'
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import TileWrapper from './TileWrapper';

const DEFAULT_LENGTH = 20;

const createTiles = (numTiles) => Array.from(Array(numTiles).keys()).map(x => x + 1);

class App extends Component {

  constructor() {
    super();
    this.handleSwap = this.handleSwap.bind(this)
    this.addTiles = this.addTiles.bind(this)
    this.changeAnimationSpeed = this.changeAnimationSpeed.bind(this)
    this.shuffleTiles         = this.shuffleTiles.bind(this)
    this.state = {
      tiles: createTiles(DEFAULT_LENGTH),
      animationSpeed: 500
    }
  }
  addTiles(e) {
    const numTiles = parseInt(e.target.value);
    if (numTiles >= DEFAULT_LENGTH) {
      this.setState({
        ...this.state,
        tiles: createTiles(numTiles)
      })
    }
  }
  shuffleTiles() {
    this.setState({
      ...this.state,
      tiles: _.shuffle(this.state.tiles)
    })
  }
  changeAnimationSpeed(e) {
    const animationSpeed = parseInt(e.target.value);
    if (animationSpeed > 0) {
      this.setState({
        ...this.state,
        animationSpeed: animationSpeed
      })
    }

  }
  handleSwap(src, dest) {
    const newTiles = [...this.state.tiles],
      srcIdx = newTiles.findIndex(l => l === src),
      destIdx = newTiles.findIndex(l => l === dest);

    if (srcIdx < 0 || destIdx < 0) {
      console.error(`Cannot swap: invalid src and dest values: {src=${src}, dest=${dest}}`);
      return;
    }
    newTiles[destIdx] = src
    newTiles[srcIdx] = dest

    this.setState({
      tiles: newTiles
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">ANIMATED LIST</header>
        <div>
          <div className="controls">
            <div className="control-group"><span>Tiles:</span><input type="number" value={this.state.tiles.length} onChange={this.addTiles}></input></div>
            <div className="control-group"><span>Speed:</span><input type="number" value={this.state.animationSpeed} onChange={this.changeAnimationSpeed}></input></div>
            <div className="control-group"><button className="btn btn-primary" onClick={this.shuffleTiles}>Shuffle Tiles</button></div>
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
      </div>
    );
  }
}

export default App;


