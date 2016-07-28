import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { scaleLinear, scaleTime, axisLeft, axisBottom, extent, min, max } from 'd3'
import classes from './AVAILStats.scss'
import Select from 'react-select'
import 'react-select/dist/react-select.css';

var selection = require('d3-selection')
var select = selection.select
var selectAll = selection.selectAll

var shape = require('d3-shape')
var d3line = shape.line

export class AVAILStats extends React.Component<void, Props, void> {

  componentDidMount(){
    if(Object.keys(this.props.AVAILStats).length == 0){
      console.log("empty")
      return this.props.loadStatsData()
    }
    this.renderGraph(this.props.AVAILStats.AVAILStats)    
  }

  componentDidUpdate(){
    if(Object.keys(this.props.AVAILStats).length == 0){
      console.log("empty")
      return this.props.loadStatsData()
    }
    this.renderGraph(this.props.AVAILStats.AVAILStats)     
  }

  renderGraph(data){
    select("#root").select("span").select("svg").remove("*");

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 780 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;


    console.log(data)
    var x = scaleTime()
        .range([0, width])
        .domain(extent(data, function(d) {var curDate = new Date(d.series); return curDate }));

 

    var y = scaleLinear()
        .range([height, 0])
        .domain(extent(data, function(d) {return +d.count; }));

    var xAxis = axisBottom(x) 
    var yAxis = axisLeft(y)

    var line = d3line()
      line.x(function(d) {var curDate = new Date(d.series); return x(curDate); })
      line.y(function(d) {return y(+d.count); });


    var svg = select("#root").select("span").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

  svg.append("g")
      .attr("class", "axis axis--y")
      .call(axisLeft(y))
    .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .style("fill","none")
      .style("stroke","black");


  }


  render(){
    if(Object.keys(this.props.AVAILStats).length == 0){
      console.log("empty")
      this.props.loadStatsData()
      return <span />
    }
    var selectOptions = [{value:7,label:"7 Days"},{value:30,label:"30 Days"},{value:90,label:"90 Days"}]

    function selectChange (value){
      
      console.log(value)
    }


    this.renderGraph(this.props.AVAILStats.AVAILStats)
    return (
      <div className="container">
        <span id="graphDiv" className="graphDiv"></span>
        <div className={'col-xs-2 pull-left'} style={{float:"left"}}>
          <Select 
          className={classes['Select']}
          name="metroSelect"
          value={selectOptions.filter(d => { return d.value === this.props.metroId })[0]}
          options={selectOptions}
          onChange={selectChange} 
          placeholder="Interval Select"
          clearable={false}
          />  
        </div>
      </div>
      )
  }
}

AVAILStats.propTypes = {
  loadStatsData: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({

})

export default connect((mapStateToProps), {

})(AVAILStats)
