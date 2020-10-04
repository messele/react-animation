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
                    srcKey: null
                })
            }
            else {
                this.setState({
                    ...this.state,
                    srcKey: key,
                })
            }
        }
    }


    render() {
        return <div className="tileWrapper">
            <div className="tileWrapper-content">
                <AnimatedList animationSpeed={this.props.animationSpeed}>
                {this.props.tiles.map((l, idx) =>
                    <Tile
                        //ref={(ref) => this[`refs${idx}`] = ref}
                        key={l}
                        tileClass={`tile ${l === this.state.srcKey ? "selected" : ""}`}
                        value={l}
                        handleClick={this.clickTile} />
                )}
                </AnimatedList>
            </div>
        </div>
    }

}

const Tile = React.forwardRef(({ tileClass, value, handleClick }, ref) =>
    <div ref={ref} className={tileClass} onClick={(e) => handleClick(e, value)}>
        <span>{value}</span> </div>)

