import './App.scss';
import React from 'react';
import axios from 'axios';


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hand: ["back", "back", "back", "back", "back", "back", "back"],
            library: [],
            on_the_play: null,
            plays: [],
            success: null
        };
    }

    render() {

        // TODO: Don't render "play it out" until we have a hand
        // TODO: blank out the button while the request is out
        // TODO: clean up formatting, of course

        return (
            <div className="main-app">
                <button className="draw-button" onClick={this.drawNewHand.bind(this)}>draw a new hand</button>
                <div className="hand-wrap">{this.renderHand()}</div>
                <div className="otp-wrap">{this.renderOTP()}</div>

                <button className="draw-button" onClick={this.getSequencing.bind(this)}>play it out</button>
                <div className="play-wrap">{this.renderSequencing()}</div>
            </div>
        );
    }

    renderHand() {
        let imgs = [];
        for (let i in this.state.hand) {
            let uri = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + this.state.hand[i];
            imgs.push(
                <img className="hand-card" src={uri} alt={this.state.hand[i]} key={i}/>
            );
        }
        return imgs;
    }

    renderOTP() {
        if (this.state.on_the_play === true) {
            return "on the play";
        } else if (this.state.on_the_play === false) {
            return "on the draw";
        } else {
            return ""
        }
    }

    renderSequencing() {
        let plays = "";
        for (let tag of this.state.plays) {
            plays += tag.text;
        }
        return plays
    }

    async drawNewHand() {
        this.setState({hand: ["back", "back", "back", "back", "back", "back", "back"]});
        try {
            const response = await axios.get(`http://localhost:5001/api/hand`);
            this.setState({
                hand: response.data.hand,
                library: response.data.library,
                on_the_play: response.data.on_the_play
            });
        } catch (e) {
            console.log(e);
        }
    }

    async getSequencing() {
        this.setState({plays: []});
        try {
            let payload = {
                hand: this.state.hand,
                library: this.state.library,
                on_the_play: this.state.on_the_play
            }
            const response = await axios.post(`http://localhost:5001/api/play`, payload);
            this.setState({
                plays: response.data.plays
            });
        } catch (e) {
            console.log(e);
        }
    }




}


export default Flashcards;
