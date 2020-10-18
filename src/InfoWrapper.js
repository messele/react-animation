import React, { Component } from 'react'

export default class InfoWrapper extends Component {
    constructor() {
        super();
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
            displayClass: "hidden"
        }
    }
    show() {
        this.setState({
            displayClass: "visible"
        })
    }
    hide() {
        this.setState({
            displayClass:"hidden"
        })
    }
    render() {
        return (
            <>
                <div className="tooltip-wrapper" onMouseEnter={this.show} onMouseLeave={this.hide}/>
                <div className={"toolTip "+this.state.displayClass}> {this.props.message}</div>
                {this.props.children}
            </>
        )
    }
}
