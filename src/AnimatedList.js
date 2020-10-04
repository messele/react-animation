import React, { Component, cloneElement } from 'react'

const ANIMATION_SPEED = 500;

/**
 * Implementation of swapping elements in the list
 * inspired by "Animating the unanimatable." from https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
 */
export default class extends Component {

    componentDidUpdate(previousProps) {
        // figure out what changed in the new props
        let changeTracker = {}
        let hasChanged = false;
        for (let x in previousProps.children) {
            if (previousProps.children[x] && this.props.children[x] && 
                previousProps.children[x].key !== this.props.children[x].key) {
                changeTracker[previousProps.children[x].key] = {
                    oldPos: x,
                    pos: this.props.children.findIndex(v => v.key === previousProps.children[x].key)
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
            node = this[`ref${this.props.children[pos].key}`],
            oldNode = this[`ref${this.props.children[oldPos].key}`]

        console.log(`Moving node :  {currentPos=${pos}, oldPos=${oldPos}}`)

        if (!node || !oldNode) {
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

    createChildrenWithRefs() {
        // To capture the dom element. clone the element and add a ref.
        return this.props.children.map(child =>
            cloneElement(child, {
                ref: (element) => {
                    /**
                     * Note this will only work if the child has a Forward Ref
                     */
                    if (!element) {
                        return;
                    }
                    this[`ref${child.key}`] = element
                },
            }),
        );
    }


    render() {
        return (
            <>
                {this.createChildrenWithRefs()}
            </>
        )
    }
}
