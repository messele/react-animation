import _ from 'lodash'
import React, { Component, cloneElement } from 'react'
import {findDOMNode}  from 'react-dom'

const ANIMATION_SPEED = 500;

/**
 * Implementation of swapping elements in the list
 * inspired by "Animating the unanimatable." from https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
 * 
 * Note: the Animation works only on children that have a Forward Ref.
 */
export default class extends Component {

    componentDidUpdate(previousProps) {
        // figure out what changed in the new props
        let changeTracker = {}
        let hasChanged = false;
        let delay  = 0;
        for (let x in previousProps.children) {
            /**
             * For each of the children track the children whose position was changed.
             */
            if (previousProps.children[x] && this.props.children[x] && 
                previousProps.children[x].key !== this.props.children[x].key) {

                const pos = this.props.children.findIndex(v => v.key === previousProps.children[x].key),
                    oldPos = parseInt(x),
                    currDelay = (_.find(changeTracker, t => (t.oldPos === pos && t.pos === oldPos)) ||{}).delay 
                
                if(pos < 0) {
                    /** short circuit as the child has been deleted. */
                    continue;
                }
                changeTracker[previousProps.children[x].key] = {
                    oldPos,
                    pos,
                    delay: currDelay !==  undefined ?  currDelay : delay
                }
                // introduce a minor delay to fix the visual anomaly
                if(currDelay ===  undefined) delay += 1/this.props.children.length;
                hasChanged = true;
            }
        }

        if (hasChanged) {
            for (let key of Object.keys(changeTracker)) {
                this.simulateNodeMove(changeTracker[key])
            }
        }
    }

    simulateNodeMove({ pos, oldPos, delay}) {

        if(pos === undefined || !oldPos === undefined || !this.props.children[pos] || !this.props.children[oldPos]) {
            //defensive: this only happens if a node has been added or removed.
            return;
        }
        const node      = findDOMNode(this[getRefKey(this.props.children[pos])]),
            oldNode     = findDOMNode(this[getRefKey(this.props.children[oldPos])])

        if (!node || !oldNode) {
            // Defensive: Bail out if this is a new node.
            return;
        }
        console.log(`Moving node :  {currentPos=${pos}, oldPos=${oldPos}}`)

       
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
                node.style.transition = `transform ${animationSpeed}ms ease ${animationSpeed * delay}ms`
                oldNode.style.transform = '';
                oldNode.style.transition = `transform ${animationSpeed}ms ease ${animationSpeed * delay}ms`

            })
        })

    }

    createChildrenWithRefs() {
        // To capture the dom element. clone the element and add a ref.
        return this.props.children.map(child =>
           {
               const element = <ListItemWrapper key={child.key} originalItem={child}/>
            return cloneElement(
                element, {
                 ref: (element) => {
                    if (!element) {
                        return;
                    }
                    this[getRefKey(child)] = element
                }})
                // return <ListItemWrapper key={child.key} originalItem={child} ref={
                //     element => this[getRefKey(child)] = element}/>
            }
            
            // cloneElement(child, {
            //     ref: (element) => {
            //         /**
            //          * Note this will only work if the child has a Forward Ref
            //          */
            //         if (!element) {
            //             return;
            //         }
            //         this[getRefKey(child)] = element
            //     },
            // }),
        // );
        )};


    render() {
        return (
            <>
                {this.createChildrenWithRefs()}
            </>
        )
    }
}

const ListItemWrapper = React.forwardRef(({originalItem}, ref) => {
  const OriginalItem = originalItem.type;
  return <OriginalItem ref={ref} {...originalItem.props} />
});

const getRefKey = (child) => `ref${child.key}`
