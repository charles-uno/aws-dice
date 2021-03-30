import './App.scss';
import React from 'react';
import axios from 'axios';


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hand: null,
            library: null,
            on_the_play: null,
            plays: null,
            success: null,
            waiting: false
        };
    }

    render() {

        // TODO: Don't render "play it out" until we have a hand
        // TODO: blank out the button while the request is out
        // TODO: clean up formatting, of course

        return (
            <div className="main">
                {this.renderHand()}
                {this.renderPlay()}
            </div>
        );
    }

    renderHand() {
        return (
            <div className="hand-wrap">
                {this.renderHandButton()}
                <div className="hand-cards">{this.renderHandImages()}</div>
                <div className="hand-otp">{this.renderOTP()}</div>
            </div>
        );
    }

    renderHandButton() {
        if (this.state.waiting) {
            return <button className="button button-disabled" disabled="true">working...</button>
        } else {
            return <button className="button" onClick={this.getNewHand.bind(this)}>draw a new hand</button>
        }
    }

    renderPlay() {
        if (this.state.hand == null) {
            return "";
        } else {
            return (
                <div className="play-wrap">
                    {this.renderPlayButton()}
                    <div className="hand-cards">{this.renderPlaySteps()}</div>
                </div>
            );
        }
    }

    renderPlayButton() {
        if (this.state.waiting) {
            return <button className="button button-disabled" disabled={true}>working...</button>
        } else {
            return <button className="button" onClick={this.getNewPlay.bind(this)}>play it out</button>
        }
    }

    renderHandImages() {
        let imgs = [];
        for (let i=0; i<7; i++) {
            if (this.state.hand == null) {
                imgs.push(
                    <img className="hand-card" src={this.cardUri("back")} alt="card back" key={i}/>
                );
            } else {
                let c = this.state.hand[i];
                imgs.push(
                    <img className="hand-card" src={this.cardUri(c)} alt="card back" key={i}/>
                );
            }
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

    renderPlaySteps() {
        if (this.state.plays == null) {
            return "";
        }
        let plays = "";
        for (let tag of this.state.plays) {
            plays += tag.text;
        }
        return plays
    }

    async getNewHand() {
        this.setState({
            hand: null,
            plays: null,
            waiting: true
        });
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
        this.setState({waiting: false});
    }

    async getNewPlay() {
        this.setState({plays: null, waiting: true});
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
        this.setState({waiting: false});
    }

    cardUri(c) {
        return "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + c;
    }

}




export default Flashcards;
