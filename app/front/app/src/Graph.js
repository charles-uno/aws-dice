import React from 'react';
import Chart from "react-google-charts";

export default class Graph extends React.Component {

    render() {
        if (this.props.opener === null) {
            return "";
        }
        if (this.props.stats === null) {
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
              data={this.props.stats.table}
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
        </div>;
    }

}
