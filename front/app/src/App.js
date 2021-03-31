import './App.scss';
import React from 'react';
import axios from 'axios';


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opener: null,
            plays: null,
            success: null,
            waiting: false,
            autocard: {name: null, style: {}},
        };
    }

    render() {
        return (
            <div className="main-wrap">
                {this.renderAutocard()}
                <div className="main">
                    {this.renderHand()}
                    {this.renderPlay()}
                </div>
            </div>
        );
    }

    renderAutocard() {
        let uri = this.cardUri(this.state.autocard.name);
        let autocard = <img className="autocard" id="autocard" src={uri} alt={this.state.autocard.name} style={this.state.autocard.style} />
        var wrapStyle = {display: "none"};
        if (this.state.autocard.name != null) {
            wrapStyle = {display: "block"};
        }
        return (
            <div className="autocard-wrap" style={wrapStyle} onClick={this.hideAutocard.bind(this)}>
                {autocard}
            </div>
        );
    }

    renderHand() {
        return (
            <div className="hand-wrap">
                {this.renderHandButton()}
                <div className="hand-cards">{this.renderHandImages()}</div>
                {this.renderTurnOrder()}
            </div>
        );
    }

    renderHandButton() {
        if (this.state.waiting) {
            return <button className="button button-disabled" disabled={true}>working...</button>
        } else {
            return <button className="button" onClick={this.getNewHand.bind(this)}>draw a new hand</button>
        }
    }

    renderPlay() {
        if (this.state.opener === null) {
            return "";
        } else {
            return (
                <div className="play-wrap">
                    {this.renderPlayButton()}
                    {this.renderPlayLines()}
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

    renderTurnOrder() {
        let text = "";
        if (this.state.opener === null) {
            text = "...";
        } else if (this.state.opener.onThePlay === true) {
            text = "on the play";
        } else if (this.state.opener.onThePlay === false) {
            text = "on the draw";
        }
        return <div className="hand-otp">{text}</div>
    }

    renderPlayLines() {
        if (this.state.plays === null) {
            return "";
        }
        let linesRaw = [];
        linesRaw.push([]);
        for (let tag of this.state.plays) {
            if (tag.type === "break") {
                linesRaw.push([]);
            } else {
                linesRaw[linesRaw.length-1].push(tag);
            }
        }
        let lines = [];
        for (let lr of linesRaw) {
            lines.push(this.renderPlayLine(lr));
        }
        return <div className="play-lines">{lines}</div>
    }

    renderPlayLine(lineRaw) {
        let words = [];
        let key = 0;
        for (let wordRaw of lineRaw) {
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
                words.push(
                    <span className="text" key={key}>{wordRaw.text}</span>
                );
            }
            key += 1;
        }
        return <p className="play-line">{words}</p>
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
            plays: null,
            waiting: true
        });
        try {
            const response = await axios.get(`http://localhost:5001/api/hand`);
            this.setState({
                opener: {
                    hand: response.data.hand,
                    library: response.data.library,
                    onThePlay: response.data.on_the_play
                }
            });
        } catch (err) {
            console.log(err);
        }
        this.setState({waiting: false});
    }

    async getNewPlay() {
        this.setState({plays: null, waiting: true});
        try {
            let payload = this.state.opener;
            const response = await axios.post(`http://localhost:5001/api/play`, payload);
            this.setState({plays: response.data.plays});
        } catch (err) {
            console.log(err);
        }
        this.setState({waiting: false});
    }

    cardUri(c) {
        if (c === null) {
            c = "back";
        }
        return "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + c;
    }

    manaUri(m) {
        return "https://gatherer.wizards.com/Handlers/Image.ashx?size=small&type=symbol&name=" + m;
    }

}




export default Flashcards;
