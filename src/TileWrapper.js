import React, { Component } from 'react'
import AnimatedList  from './AnimatedList'

export default class TileWrapper extends Component {
    constructor() {
        super();
        this.clickTile = this.clickTile.bind(this);
       // this.moveNode = this.moveNode.bind(this);
        //this.refs = []
        this.state = {}
    }
    clickTile(e, key) {
        if (key !== undefined) {
            console.log("Clicked key :" + key)
            //console.log("Contents :", this.state.contents)
            if (this.state.srcKey) {
                if (key === this.state.srcKey) {
                    return;
                }
                this.props.handleSwap(this.state.srcKey, key);
                this.setState({
                    ...this.state,
                    srcKey: null,
                    lastSelected: {
                        src: this.state.srcKey,
                        dest: key
                    }
                })
            }
            else {
                this.setState({
                    ...this.state,
                    srcKey: key,
                    lastSelected: null
                })
            }
        }
    }


    render() {
        return <div className="tileWrapper">
            <div className="tileWrapper-content">
                <AnimatedList animationSpeed={this.props.animationSpeed}>
                {this.props.tiles.map((value, idx) =>
                    <Tile
                        //ref={(ref) => this[`refs${idx}`] = ref}
                        key={value}
                        tileClass={`tile ${value === this.state.srcKey 
                            || (this.state.lastSelected ||{}).src === value 
                            || (this.state.lastSelected ||{}).dest === value ? "selected" : ""}`}
                        value={value}
                        handleClick={this.clickTile} />
                )}
                </AnimatedList>
            </div>
        </div>
    }

}

// const Tile = React.forwardRef(({ tileClass, value, handleClick }, ref) =>
//     <div ref={ref} className={tileClass} onClick={(e) => handleClick(e, value)}>
//         <span>{value}</span> </div>)

// const Tile = ({ tileClass, value, handleClick }) =>
//     <div className={tileClass} onClick={(e) => handleClick(e, value)}>
//         <span>{value}</span> </div>

class Tile extends Component {
    render() {
        return <div className={this.props.tileClass} onClick={(e) => this.props.handleClick(e, this.props.value)}>
       <span>{this.props.value}</span> </div> 
    }
}
