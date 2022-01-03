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
            about: false,
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
            this.hideAbout(event);
            this.hideAutocard(event);
        }
    }

    render() {
        if (this.state.about) {
            return [
                this.renderAutocard(),
                this.renderAboutToggle("toggle-top"),
                this.renderAbout(),
                this.renderAboutToggle("toggle-bottom")
            ];
        } else {
            return [
                this.renderAutocard(),
                this.renderHand(),
                this.renderPlay(),
                this.renderAboutToggle("toggle-bottom")
            ]
        }
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

    renderAbout() {
        let color = process.env.REACT_APP_COLOR;
        let timestamp = process.env.REACT_APP_TIMESTAMP;
        // JS does dates in ms
        let date = new Date(parseInt(timestamp)*1000);
        let date_str = date.toISOString().slice(0, 16).replace("T", " at ") + " UTC";

        return <div className="justify section" key="about">
<h2 key="model-head">About the Model</h2>
<p className="about" key="model-0">
The MTG deck <a href="https://www.mtggoldfish.com/archetype/amulet-titan">Amulet Titan</a> is known for its complex play patterns.
This app presents users with sample opening hands, then shuffles the deck and solves for a sequence of plays to cast the titular {this.card("Primeval Titan", "Titan")} as quickly as possible.
Think of it like mulligan flashcards: decide for yourself whether you would keep the hand, then play it out a few times to see what the numbers say!
</p>
<p className="about" key="model-1">
Sequencing is determined via exhaustive search.
Whenever the computer is faced with a choice, it tries both options and keeps whichever works out best.
For example, an experienced player can generally eyeball whether to choose land or nonland for {this.card("Abundant Harvest")}, but spelling out the logic explicitly for the computer is tedious and fragile.
Instead of worrying about strategy and synergy, the computer splits the game into two copies.
The first chooses land, the second chooses nonland, and they proceed independently from there.
If either copy ends up casting turn-three {this.card("Primeval Titan")} down the line, it's pretty safe
to say that a human player could have done so as well.
</p>
<p className="about" key="model-2">
Exhaustive search is straightforward and flexible, but also computationally demanding.
Several approximations are made in the interest of performance.
Oddball singletons like {this.card("Boros Garrison")}, {this.card("Cavern of Souls")}, and {this.card("Vesuva")} are excluded.
Only green mana is tracked, so there's no transmuting with {this.card("Tolaria West")}.
There's no need to worry about the non-mana abilities on {this.card("Radiant Fountain")} and {this.card("Sunhome, Fortress of the Legion", "Sunhome")}, so they're represented by {this.card("Wastes")}. Similarly, {this.card("Bojuka Bog")} is used as a stand-in for any non-green land that enters the battlefield tapped, such as {this.card("Valakut, the Molten Pinnacle", "Valakut")}.
These approximations can make opening hands look a bit odd, but the resulting numbers turn out to be nearly identical.
</p>
<p className="about" key="model-3">
That said, please don't expect the computer to teach you good sequencing!
If it's possible to cast {this.card("Primeval Titan")} on turn three, this model is guaranteed to find a way to do so.
But there are often several different ways to get there.
There's no guarantee the computer will pick the best one.
Several corrections are included to suppress non-human play patterns, but from time to time it'll still choose a "solution" that's needlessly bizarre or reckless.
Consider it a starting point, not an authority.
</p>
<h2 key="app-list">The Decklist</h2>
<p className="about" key="list-0">
Below is the list used by this app. Don't worry too much about a difference here or there. Considering similar cards together helps the model run faster. Numbers look pretty much the same if (for example) we swap out an {this.card("Explore")} for an {this.card("Azusa, Lost but Seeking", "Azusa")}.
</p>
<table className="deck-list">
    <tbody>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Abundant Harvest")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Amulet of Vigor")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Arboreal Grazer")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Dryad of the Ilysian Grove")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Explore")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Primeval Titan")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Summoner's Pact")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count"></td>
        <td className="deck-list-name"></td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">5</td>
        <td className="deck-list-name">{this.card("Bojuka Bog")} (includes {this.card("Tolaria West")} and {this.card("Valakut, the Molten Pinnacle", "Valakut")})</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Castle Garenbrig")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">6</td>
        <td className="deck-list-name">{this.card("Forest")} (includes {this.card("Breeding Pool", "shocks")} and {this.card("Misty Rainforest", "fetches")})</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">8</td>
        <td className="deck-list-name">{this.card("Simic Growth Chamber")} (includes {this.card("Gruul Turf")}, etc)</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">4</td>
        <td className="deck-list-name">{this.card("Urza's Saga")}</td>
      </tr>
      <tr className="deck-list-line">
        <td className="deck-list-count">5</td>
        <td className="deck-list-name">{this.card("Wastes")}  (includes {this.card("Ghost Quarter")}, {this.card("Radiant Fountain")}, etc)</td>
      </tr>
    </tbody>
</table>

<h2 key="app-head">Implementation</h2>
<p className="about" key="app-1">
This app uses a React front end and a Go back end behind an nginx proxy.
Each component is built into its own container; containers are managed using Docker Compose.
Updates are deployed to AWS on commit via GitHub Actions.
</p>
<p className="about" key="app-2">
Source code is available <a href="https://github.com/charles-uno/aws-practice/blob/main/README.md" key="frontend-link">here</a>. Front-end, back-end, proxy, and deployment are all contained in the same repo. The back-end model is a stripped-down version from my previous work <a href="https://charles.uno/amulet-simulation" key="amulet-link">here</a> and <a href="https://charles.uno/valakut-simulation" key="valakut-link">here</a>.
</p>
<h2 key="copy-head">Fine Print</h2>
<p className="about" key="copy-1">
This page &copy; Charles Fyfe 2021, along with the source code linked above.
Card names and images owned by <a href="https://magic.wizards.com">Wizards of the Coast</a>.
This site is not affiliated.
</p>
        </div>
    }

    showAbout() {
        this.setState({about: true});
        window.scrollTo(0, 0);
    }

    hideAbout() {
        this.setState({about: false});
    }

    renderAboutToggle(key) {
        let text = "Read more";
        let onclick = this.showAbout.bind(this);
        if (this.state.about) {
            text = "Read less";
            onclick = this.hideAbout.bind(this);
        }
        return <div className="about-toggle-wrap" key={key}>
            <button className="about-toggle" onClick={onclick}>
                {text}
            </button>
        </div>
    }

    renderHand() {
        return <div className="section" key="hand">
            <div className="hand-wrap" key="1">
                {this.renderHandButton()}
                <div className="hand-cards-wrap">
                    <div className="hand-cards">
                        {this.renderHandImages()}
                    </div>
                </div>
                {this.renderHandText()}
                {this.renderGraph()}
            </div>
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
        return <div className="section" key="play">
            <div className="play-wrap" key="2">
                {this.renderPlayButton()}
                {this.renderPlayLines()}
                {this.renderPlayOutcome()}
            </div>
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
                words.push(this.card(wordRaw.target, wordRaw.text));
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

    card(cardName, text=null) {
        if (!text) {
            text = cardName;
        }
        return <span className="card" key={text} onClick={this.showAutocard.bind(this, cardName)}>
            {text}
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
            let url = this.backEndUrl() + `api/hand`;

            console.log("target:", url);

            const response = await axios.get(url);
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
            let url = this.backEndUrl() + `api/play`;

            console.log("target:", url);

            const response = await axios.post(url, payload);
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
        }
        if (c === "Urza's Saga") {
            return "https://c1.scryfall.com/file/scryfall-cards/large/front/c/1/c1e0f201-42cb-46a1-901a-65bb4fc18f6c.jpg?1621127724";
        }
        return "https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=" + c;
    }

    manaUri(m) {
        return "https://gatherer.wizards.com/Handlers/Image.ashx?size=medium&type=symbol&name=" + m;
    }

    backEndUrl() {
        console.log(process.env);
        return "/" + process.env.REACT_APP_COLOR + "/";
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
