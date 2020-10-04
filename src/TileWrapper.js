import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const ANIMATION_SPEED = 500;
/**
 * Implementation of swapping elements in the list
 * inspired by "Animating the unanimatable." from https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
 */
export default class TileWrapper extends Component {
    constructor() {
        super();
        this.clickTile = this.clickTile.bind(this);
        this.moveNode = this.moveNode.bind(this);
        this.refs = []
        this.state = {}
    }

    componentDidUpdate(previousProps) {
        // figure out what changed in the new props
        let changeTracker = {}
        let hasChanged = false;
        for (let x in previousProps.tiles) {
            if (previousProps.tiles[x] !== this.props.tiles[x]) {
                changeTracker[previousProps.tiles[x]] = {
                    oldPos: x,
                    pos: this.props.tiles.findIndex(v => v === previousProps.tiles[x])
                }
                hasChanged = true;
            }
        }

        if (hasChanged) {
            for (let key of Object.keys(changeTracker)) {
                this.moveNode(changeTracker[key])
            }
        }
    }

    moveNode({ pos, oldPos }) {
        const //pos = this.props.contents.findIndex(x => x === key),
            //oldPos = this.oldNodPos[key],
            node = ReactDOM.findDOMNode(this[`refs${pos}`]),//document.getElementById(key),
            oldNode = ReactDOM.findDOMNode(this[`refs${oldPos}`])//document.getElementById(this.props.contents[oldPos]);

        console.log(`Moving node :  {currentPos=${pos}, oldPos=${oldPos}}`)

        if(!node || !oldNode) {
           // do nothing for a node that has been newly added or removed.
            return;
        }
        // Get the delta between the old and new positions.
        const xDelta = node.getBoundingClientRect().x - oldNode.getBoundingClientRect().x,
            yDelta = node.getBoundingClientRect().y - oldNode.getBoundingClientRect().y

        const animationSpeed = this.props.animationSpeed || ANIMATION_SPEED
        // invert the position to original position.    
        requestAnimationFrame(() => {
            node.style.transform = `translate(${-xDelta}px, ${-yDelta}px)`;
            oldNode.style.transform = `translate(${xDelta}px, ${yDelta}px)`;

            // Ensure it inverts it immediately
            node.style.transition = 'transform 0s';
            oldNode.style.transition = 'transform 0s';

            /**
             * Use another animation frame to restore original position.
             */
            requestAnimationFrame(() => {
                node.style.transform = '';
                node.style.transition = `transform ${animationSpeed}ms`
                oldNode.style.transform = '';
                oldNode.style.transition = `transform ${animationSpeed}ms`

            })
        })

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
            <h1 className="tileWrapper-header">ANIMATED LIST</h1>
            <div className="tileWrapper-content">
                {this.props.tiles.map((l, idx) =>
                    <Tile
                        ref={(ref) => this[`refs${idx}`] = ref}
                        key={l}
                        tileClass={`tile ${l === this.state.srcKey ? "selected" : ""}`}
                        value={l}
                        handleClick={this.clickTile} />
                )}
            </div>
        </div>
    }

}

const Tile = React.forwardRef(({ tileClass, value, handleClick }, ref) =>
    <div ref={ref} className={tileClass} onClick={(e) => handleClick(e, value)}>
        <span>{value}</span> </div>)

