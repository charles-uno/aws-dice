import logo from './logo.svg';
import './App.css';

import React from 'react';
import axios from 'axios';

class DiceRoller extends React.Component {

    constructor(props) {
        super(props);
        this.state = {dice: [-2, -2, -2, -2]};
    }

    componentDidMount() {}

    render() {
        var dice_str = "";
        for (let d of this.state.dice) {
            if (d === -1) {
                dice_str += "[-]";
            } else if (d === 0) {
                dice_str += "[ ]";
            } else if (d === 1) {
                dice_str += "[+]";
            } else {
                dice_str += "[?]";
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
            this.setState({dice: [-2, -2, -2, -2]});
            const response = await axios.get("http://localhost:5000");
            this.setState({dice: response.data.data});
        } catch (e) {
            console.log(e);
        }
    }

}


export default DiceRoller;
