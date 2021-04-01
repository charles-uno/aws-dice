import './App.scss';
import React from 'react';
import axios from 'axios';


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            autocard: {name: null, style: {}},
            opener: null,
            gameplay: null,
            waiting: false,
            error: {location: null, text: null}
        };
    }

    render() {
        return [
            this.renderAutocard(),
            this.renderMain()
        ];
    }

    renderMain() {
        return <div className="main" key="0">
            <div className="article">
                {this.renderHand()}
                {this.renderPlay()}
                <div className="foot-push"></div>
            </div>
            {this.renderFoot()}
        </div>
    }

    renderFoot() {
        return <div className="foot">
            &copy; Charles Fyfe 2021 under <a href="https://creativecommons.org/licenses/by/3.0/us/">CC-BY</a>
        </div>


    }


    renderHand() {
        return <div className="hand-wrap">
            {this.renderHandButton()}
            <div className="hand-cards-wrap">
                <div className="hand-cards">
                    {this.renderHandImages()}
                </div>
            </div>
            {this.renderHandText()}
        </div>
    }

    renderHandButton() {
        if (this.state.waiting) {
            return <button className="button button-disabled" disabled={true}>working...</button>
        } else {
            return <button className="button" onClick={this.getNewHand.bind(this)}>draw a new opener</button>
        }
    }

    renderHandImages() {
        let imgs = [];
        for (let i=0; i<7; i++) {
            if (this.state.opener === null) {
                imgs.push(
                    <img className="hand-card" src={this.cardUri("back")} alt="card back" key={i} />
                );
            } else {
                let c = this.state.opener.hand[i];
                imgs.push(
                    <img className="hand-card" src={this.cardUri(c)} alt="card back" key={i} onClick={this.showAutocard.bind(this, c)} />
                );
            }
        }
        return imgs;
    }

    renderHandText() {
        if (this.state.error.location === "opener") {
            return <div className="error-message vertical-center">
                {this.state.error.text}
            </div>
        }
        let text = "";
        if (this.state.opener === null) {
            text = "";
        } else if (this.state.opener.onThePlay === true) {
            text = "on the play";
        } else if (this.state.opener.onThePlay === false) {
            text = "on the draw";
        }
        return <div className="turn-order">{text}</div>
    }

    renderPlay() {
        if (this.state.opener === null) {
            return "";
        }
        return <div className="play-wrap">
            {this.renderPlayButton()}
            {this.renderPlayLines()}
            {this.renderPlayOutcome()}
        </div>
    }

    renderPlayButton() {
        if (this.state.waiting) {
            return <button className="button button-disabled" disabled={true}>working...</button>
        } else {
            return <button className="button" onClick={this.getNewPlay.bind(this)}>play it out</button>
        }
    }

    renderPlayLines() {
        if (this.state.error.location === "gameplay") {
            console.log("gameplay error!");
            return <div className="error-message">
                {this.state.error.text}
            </div>
        }
        if (this.state.gameplay === null) {
            return "";
        }
        let linesRaw = [];
        linesRaw.push([]);
        for (let tag of this.state.gameplay.plays) {
            if (tag.type === "break") {
                linesRaw.push([]);
            } else {
                linesRaw[linesRaw.length-1].push(tag);
            }
        }
        // Drop the first line. We already know about the opening hand.
        linesRaw.shift();
        let lines = [];
        for (let i in linesRaw) {
            if (linesRaw[i].length > 0) {
                lines.push(this.renderPlayLine(linesRaw[i], i));
            }
        }
        return <div className="play-lines">{lines}</div>
    }

    renderPlayLine(lineRaw, lineNumber) {
        let words = [];
        let classNames = "play-line";
        for (let i in lineRaw) {
            let key = "line-" + lineNumber.toString() + "-word-" + i.toString();
            let wordRaw = lineRaw[i];
            if (wordRaw.type === "mana") {
                for (let symbol of this.renderMana(wordRaw.text, key)) {
                    words.push(symbol);
                }
            } else if (wordRaw.type === "land" || wordRaw.type === "spell") {
                words.push(
                    <span className="card" key={key} onClick={this.showAutocard.bind(this, wordRaw.text)}>
                        {wordRaw.text}
                    </span>
                );
            } else {
                if (wordRaw.text.toLowerCase().startsWith("turn")) {
                    classNames += " turn-start";
                }
                words.push(
                    <span className="text" key={key}>{wordRaw.text}</span>
                );
            }
            key += 1;
        }
        let key = "line-" + lineNumber.toString();
        return <p className={classNames} key={key}>{words}</p>
    }

    renderPlayOutcome() {
        let text = "no solution before turn 5";
        if (this.state.gameplay === null) {
            text = "";
        } else if (this.state.gameplay.turn > 0) {
            text = "done on turn " + this.state.gameplay.turn.toString();
        }
        return <div className="play-outcome">{text}</div>
    }

    renderAutocard() {
        let uri = this.cardUri(this.state.autocard.name);
        let autocard = <img className="autocard center-inner" id="autocard" src={uri} alt={this.state.autocard.name} style={this.state.autocard.style} />
        var wrapStyle = {display: "none"};
        if (this.state.autocard.name != null) {
            wrapStyle = {display: "block"};
        }
        return <div className="autocard-wrap center-outer" style={wrapStyle} onClick={this.hideAutocard.bind(this)} key="1">
            {autocard}
        </div>
    }

    showAutocard(cardName) {
        this.setState({
            autocard: {name: cardName, style: {display: true}}
        });
    }

    hideAutocard(event) {
        this.setState({
            autocard: {name: null, style: {display: "none"}}
        });
    }

    renderMana(m, key) {
        let imgs = [];
        for (let i=0; i<m.length; i++) {
            let alt = "{" + m[i] + "}";
            let k = key.toString() + "-" + i.toString();
            imgs.push(
                <img src={this.manaUri(m[i])} className="mana-symbol" alt={alt} key={k} />
            );
        }
        return imgs;
    }

    async getNewHand() {
        this.setState({
            opener: null,
            gameplay: null,
            waiting: true,
            error: {location: null, text: null}
        });
        try {
            const response = await axios.get(`http://localhost:5001/api/hand`);
            this.setState({opener: response.data});
        } catch (err) {
            console.log(err);
            this.setState({
                error: {location: "opener", text: err.toString()}
            });
        }
        this.setState({waiting: false});
    }

    async getNewPlay() {
        this.setState({
            gameplay: null,
            error: {location: null, text: null},
            waiting: true
        });
        try {
            let payload = this.state.opener;
            const response = await axios.post(`http://localhost:5001/api/play`, payload);
            this.setState({gameplay: response.data});
        } catch (err) {
            console.log(err);
            this.setState({
                error: {location: "gameplay", text: err.toString()}
            });
        }
        this.setState({waiting: false});
    }

    cardUri(c) {
        if (c === null) {
            c = "back";
        }
        return "https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + c;
    }

    manaUri(m) {
        return "https://gatherer.wizards.com/Handlers/Image.ashx?size=small&type=symbol&name=" + m;
    }

}




export default Flashcards;
