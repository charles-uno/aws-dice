import './App.scss';
import React from 'react';
import axios from 'axios';


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {hand: ["back", "back", "back", "back", "back", "back", "back"], plays: []};
    }

    render() {
        return (
            <div className="main-app">
                <div className="hand-wrap">{this.renderHand()}</div>
                <button className="draw-button" onClick={this.draw.bind(this)}>draw</button>
            </div>
        );
    }

    renderHand() {
        let imgs = [];
        for (let i in this.state.hand) {
            let uri = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + this.state.hand[i];
            imgs.push(
                <img class="hand-card" src={uri} alt={this.state.hand[i]} key={i}/>
            );
        }
        return imgs;
    }

    async draw() {
        this.setState({hand: ["back", "back", "back", "back", "back", "back", "back"]});
        try {
            const response = await axios.get(`http://localhost:5001/api/hand`);
            this.setState({hand: response.data.hand});
            console.log(response.data.hand);

        } catch (e) {
            console.log(e);
        }
    }

}


export default Flashcards;
