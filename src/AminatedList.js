import React, { Component } from 'react'
// import ReactDOM from 'react-dom'

const ANIMATION_DELAY = '500ms';
/**
 * Implementation of swapping elements in the list
 * inspired by "Animating the unanimatable." from https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
 */
export default class AminatedList extends Component {
    constructor() {
        super();
        this.clickTile = this.clickTile.bind(this);
        this.moveNode = this.moveNode.bind(this);
        this.refs = React.createRef()
        this.state = {}
    }
    
    componentDidUpdate(previousProps) {
        // figure out what changed in the new props
        let changeTracker = {}
        let hasChanged = false;
        for(let x in previousProps.contents) {
            if(previousProps.contents[x] !== this.props.contents[x]) {
                changeTracker[previousProps.contents[x]] = x;
                hasChanged = true;
            }
        }

        if(hasChanged) {
            for(let key of Object.keys(changeTracker)) {
                this.moveNode(key, changeTracker[key])
            }
        }
    }

    moveNode(key, oldPos) {
        const //pos = this.props.contents.findIndex(x => x === key),
            //oldPos = this.oldNodPos[key],
            node = document.getElementById(key),
            oldNode = document.getElementById(this.props.contents[oldPos]);

        console.log(`Moving node with value ${key}`)
        
        // Get the delta between the old and new positions.
        const xDelta = node.getBoundingClientRect().x - oldNode.getBoundingClientRect().x,
            yDelta = node.getBoundingClientRect().y - oldNode.getBoundingClientRect().y


        // invert the position to original position.    
        requestAnimationFrame(() => {
            node.style.transform        = `translate(${-xDelta}px, ${-yDelta}px)`;
            oldNode.style.transform     = `translate(${xDelta}px, ${yDelta}px)`;

            // Ensure it inverts it immediately
            node.style.transition       = 'transform 0s';  
            oldNode.style.transition    = 'transform 0s';  

           /**
            * Use another animation frame to restore original position.
            */
            requestAnimationFrame(() => {
                node.style.transform = '';
                node.style.transition = `transform ${ANIMATION_DELAY}`
                oldNode.style.transform = '';
                oldNode.style.transition = `transform ${ANIMATION_DELAY}`
                
            })
        })
        
    }

    clickTile(e, key) {
        if (key) {
            console.log("Clicked key :" + key)
            //console.log("Contents :", this.state.contents)
            if (this.state.srcKey) {
                if (key === this.state.srcKey) {
                    return;
                }
                this.props.handleSwap(this.state.srcKey, key);
                this.setState({
                    // contents: newContent,
                    // srcKey: null,
                    // swap: {
                    //     srcKey:this.state.srcKey,
                    //     destKey:key
                    // }
                    ...this.state,
                    destKey: key,
                    //srcKey: null
                })

            }
            else {
                this.setState({
                    ...this.state,
                    srcKey: key,
                    destKey: null
                })
            }
        }
    }
    // refsCollection={}

    render() {
        return <div className="tileWrapper">
            {this.props.contents.map(l =>
                <Tile
                    ref={l}
                    key={l}
                    tileClass={`tile ${l === this.state.srcKey ? "selected" : ""}`}
                    value={l}
                    handleClick={this.clickTile} />
            )}
        </div>
    }

}

const Tile = ({ tileClass, value, handleClick }, ref) =>
    <div id={value} className={tileClass} onClick={(e) => handleClick(e, value)}>
        <span>{value}</span> </div>

