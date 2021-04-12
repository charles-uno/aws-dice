import './App.scss';
import React from 'react';
import axios from 'axios';
import Chart from "react-google-charts";


class Flashcards extends React.Component {

    constructor(props) {
        super(props);
        if (process.env.REACT_APP_DEBUG === "1") {
            console.log("WARNING: Assuming no access to back end");
        }
        this.state = {
            autocard: {name: null, style: {}},
            opener: null,
            gameplay: null,
            stats: null,
            waiting: false,
            error: {location: null, text: null}
        };
    }

    componentDidMount(){
        document.addEventListener("keydown", this.onKeyPress.bind(this), false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyPress.bind(this), false);
    }

    onKeyPress(event){
        // Esc
        if(event.keyCode === 27) {
            this.hideAutocard(event)
        }
    }

    render() {
        return [
            this.renderAutocard(),
            this.renderMain(),
            this.renderFoot()
        ];
    }

    renderAutocard() {
        let uri = this.cardUri(this.state.autocard.name);
        let autocard = <img className="autocard" id="autocard" src={uri} alt={this.state.autocard.name} style={this.state.autocard.style} />
        var wrapStyle = {display: "none"};
        if (this.state.autocard.name != null) {
            wrapStyle = {display: "block"};
        }
        return <div className="autocard-wrap" style={wrapStyle} onClick={this.hideAutocard.bind(this)} key="autocard">
            {autocard}
        </div>
    }

    renderMain() {
        return <div className="main" key="main">
            {this.renderHand()}
            {this.renderGraph()}
            {this.renderPlay()}
        </div>
    }

    renderFoot() {
        return <div className="foot" key="foot">
            <span className="foot-elt center">
                &copy; Charles Fyfe 2021
            </span>
            <span className="foot-elt">
                <a href="https://github.com/charles-uno/aws-practice/blob/main/README.md">Source code on GitHub</a>
            </span>
            <span className="foot-elt">
                 <a href="https://charles.uno/amulet-simulation">About the model</a>
            </span>
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
            text = "you are on the play";
        } else if (this.state.opener.onThePlay === false) {
            text = "you are on the draw";
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
            let wordRaw = lineRaw[i];
            if (wordRaw.type === "mana") {
                let imgs = this.renderMana(wordRaw.text);
                words.push(
                    <span className="mana-expr" key={i}>
                        {imgs}
                    </span>
                );
            } else if (wordRaw.type === "land" || wordRaw.type === "spell" || wordRaw.type === "card") {
                words.push(this.card(wordRaw.text, i));
            } else {
                if (wordRaw.text.toLowerCase().startsWith("turn")) {
                    classNames += " turn-start";
                }
                words.push(
                    <span className="text" key={i}>{wordRaw.text}</span>
                );
            }
        }
        let key = "line-" + lineNumber.toString();
        return <p className={classNames} key={key}>{words}</p>
    }

    renderGraph() {
        if (this.state.opener === null) {
            return "";
        }
        if (this.state.stats === null) {
            return <div className="plot-wrapper">
                working...
            </div>
        }
        return <div className="plot-wrapper">
            <Chart
              width={'100%'}
              height={'100%'}
              chartType="ComboChart"
              loader={<div>Loading Chart</div>}
              data={this.state.stats.table}
              options={{
                title: "How does this compare to an average hand?",
                vAxis: {title: "Probability by Turn", format: "percent"},
                hAxis: {title: "Turn"},
                seriesType: "bars",
                series: {1: { type: "line"}},
                curveType: "function",
                legend: "none",
                bar: {groupWidth: "90%"},
                colors: ["green", "black"]
              }}
              rootProps={{"data-testid": "1"}}
            />
        </div>
    }

    card(cardName, key=null) {
        return <span className="card" key={key} onClick={this.showAutocard.bind(this, cardName)}>
            {cardName}
        </span>
    }

    renderPlayOutcome() {
        let className = "play-outcome ";
        if (this.state.gameplay === null) {
            ;
        } else if (this.state.gameplay.turn < 0) {
            className += "play-red";
        } else if (this.state.gameplay.turn < 3) {
            className += "play-blue";
        } else if (this.state.gameplay.turn === 3) {
            className += "play-green";
        } else if (this.state.gameplay.turn === 4) {
            className += "play-yellow";
        } else {
            className += "play-magenta";
        }
        let text = "no solution before turn 5";
        if (this.state.gameplay === null) {
            text = "";
        } else if (this.state.gameplay.turn > 0) {
            text = "done on turn " + this.state.gameplay.turn.toString();
        }
        return <div className={className}>{text}</div>
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

    renderMana(m) {
        let imgs = [];
        for (let i=0; i<m.length; i++) {
            let alt = "{" + m[i] + "}";
            imgs.push(
                <img src={this.manaUri(m[i])} className="mana-symbol" alt={alt} key={i} />
            );
        }
        return imgs;
    }

    async getNewHand() {
        if (process.env.REACT_APP_DEBUG === "1") {
            this.setState({
                opener: openerDebug,
                gameplay: null,
                stats: null,
                error: {location: null, text: null}
            });
            this.initStats(openerDebug);
            return;
        }
        this.setState({
            opener: null,
            gameplay: null,
            stats: null,
            waiting: true,
            error: {location: null, text: null}
        });
        try {
            const response = await axios.get(`/api/hand`);
            this.setState({opener: response.data});
            this.initStats(response.data);
        } catch (err) {
            console.log(err);
            this.setState({
                error: {location: "opener", text: err.toString()}
            });
        }
        this.setState({waiting: false});
    }

    async getNewPlay() {
        if (process.env.REACT_APP_DEBUG === "1") {
            let turn = Math.floor(Math.random()*4);
            if (turn === 0) {
                turn -= 1;
            } else {
                turn += 1;
            }
            gameplayDebug.turn = turn;
            this.setState({
                gameplay: gameplayDebug,
                graph: null,
                error: {location: null, text: null},
            });
            this.updateStats(gameplayDebug);
            return;
        }
        this.setState({
            gameplay: null,
            graph: null,
            error: {location: null, text: null},
            waiting: true
        });
        try {
            let payload = this.state.opener;
            const response = await axios.post(`/api/play`, payload);
            this.setState({gameplay: response.data});
            this.updateStats(response.data);
        } catch (err) {
            console.log(err);
            this.setState({
                error: {location: "gameplay", text: err.toString()}
            });
        }
        this.setState({waiting: false});
    }

    initStats(opener) {
        let columnLabels = [
            "Turn",
            "This Hand",
            {role: "interval"},
            {role: "interval"},
            "Average",
            {role: "annotation"}
        ];
        let rowLabels = ["2", "3", "4", "5+"];
        // Figure out the average for play/draw
        let averages, averageNote;
        if (opener.onThePlay) {
            averages = [0.02, 0.30, 0.41, 0.27];
            averageNote = "average on the play";
        } else {
            averages = [0.04, 0.41, 0.38, 0.17];
            averageNote = "average on the draw";
        }
        // Initialize the table with appropriate labels and averages, no data
        let table = [];
        table.push(columnLabels);
        for (let i = 0; i<4; i++) {
            let row = [];
            row.push(rowLabels[i]);
            // Value
            row.push(0.);
            // Interval min and max
            row.push(0.);
            row.push(0.);
            // Average line
            row.push(averages[i]);
            // Annovation on the average line
            if (i === 2) {
                row.push(averageNote);
            } else {
                row.push(null);
            }
            table.push(row);
        }
        this.setState({
            stats: {
                nTrials: 0,
                counts: [0, 0, 0, 0],
                table: table,
            }
        });
    }

    updateStats(gameplay) {
        let nTrials = this.state.stats.nTrials;
        let table = this.state.stats.table;
        let counts = this.state.stats.counts;
        let key = gameplay.turn - 2;
        if (key < 0) {
            key = 3;
        }
        // Increment data for the most recent result
        counts[key] += 1;
        nTrials += 1
        // Update the table correspondingly
        for (let i=0; i<4; i++) {
            // Row 0 and column 0 are labels
            // Column 1 is data values
            let dv = counts[i]/nTrials;
            table[i+1][1] = dv;
            // Column 2 and 3 are the bottom and top of the error bar
            let uncertainty = nTrials**-0.5;
            let intervalMin = dv*(1 - uncertainty);
            let intervalMax = dv*(1 + uncertainty);
            // Make sure error bars don't go negative or above 100%
            table[i+1][2] = Math.max(intervalMin, 0.);
            table[i+1][3] = Math.min(intervalMax, 1.);
            // Clear annotation to avoid weirdness
            table[i+1][5] = null;
        }
        this.setState({
            stats: {
                nTrials: nTrials,
                counts: counts,
                table: table,
            }
        });
    }

    cardUri(c) {
        if (c === null) {
            c = "back";
        } else if (c === "Abundant Harvest") {
            return "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/6/16782095-0b7f-4489-8a97-b74f8efef352.jpg";
        }
        return "https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + c;
    }

    manaUri(m) {
        return "https://gatherer.wizards.com/Handlers/Image.ashx?size=medium&type=symbol&name=" + m;
    }

}


var openerDebug = {
    hand: [
        "Elvish Spirit Guide",
        "Elvish Spirit Guide",
        "Elvish Spirit Guide",
        "Elvish Spirit Guide",
        "Elvish Spirit Guide",
        "Elvish Spirit Guide",
        "Primeval Titan",
    ],
    library: [
        "Primeval Titan"
    ],
    onThePlay: true
};


var gameplayDebug = {
    turn: 1,
    plays: [
        {type: "text", text: "on the play"},
        {type: "break", text: ""},
        {type: "text", text: "turn 1, exile 6*"},
        {type: "spell", text: "Elvish Spirit Guide"},
        {type: "text", text: ", "},
        {type: "text", text: "cast "},
        {type: "spell", text: "Primeval Titan"}
    ]
};


export default Flashcards;
