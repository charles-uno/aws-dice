import logo from './logo.svg';
import './App.css';

import React from 'react';
import axios from 'axios';

class DiceRoller extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dice: [],
            isFetching: true
        };
    }

    componentDidMount() {}

    render() {
        var dice_str = "";
        if (this.state.isFetching) {
            dice_str = "[?][?][?]";
        } else {
            for (let d of this.state.dice) {
                dice_str += "[" + d.toString() + "]";
            }
        }
        return (
            <div>
                <p>{dice_str}</p>
                <button onClick={this.roll.bind(this)}>click me!</button>
            </div>
        );
    }

    async roll(state) {
        try {
            this.setState({isFetching: true});
            const response = await axios.get("http://localhost:5000");
            this.setState({dice: response.data.data, isFetching: false});
        } catch (e) {
            console.log(e);
            this.setState({isFetching: false});
        }
    }

}


export default DiceRoller;
