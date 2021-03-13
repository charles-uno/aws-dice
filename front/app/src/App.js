import './App.scss';
import React from 'react';
import axios from 'axios';


class DiceRoller extends React.Component {

    constructor(props) {
        super(props);
        this.state = {dice: [-2, -2, -2, -2]};
    }

    render() {
        var dice_elts = [];
        for (let d of this.state.dice) {
            dice_elts.push(df(d));
        }
        return (
            <div className="dice-app">
                <div className="dice-wrap">{dice_elts}</div>
                <button className="roll-button" onClick={this.roll.bind(this)}>reroll</button>
            </div>
        );
    }

    async roll() {
        try {
            this.setState({dice: [-2, -2, -2, -2]});
            const response = await axios.get(`http://eb-back:5001/api`);
            this.setState({dice: response.data.data});
        } catch (e) {
            console.log(e);
        }
    }

}


function df(d) {
    // Note: in theory, we should be attaching a key to each element in this
    // list. But when we do that, React gets confused and draws additional dice
    // instead of re-rolling
    let uri = "/images/df-question.svg";
    if (d === -1) {
        uri = "/images/df-minus.svg";
    } else if (d === 0) {
        uri = "/images/df-zero.svg";
    } else if (d === 1) {
        uri = "/images/df-plus.svg";
    }
    return (
        <img className="df" src={uri} alt="" />
    )
}


export default DiceRoller;
