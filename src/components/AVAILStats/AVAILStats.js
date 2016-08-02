import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { scaleLinear, scaleTime, axisLeft, axisBottom, extent, min, max} from 'd3'
import classes from './AVAILStats.scss'
import Select from 'react-select'
import 'react-select/dist/react-select.css';

var selection = require('d3-selection')
var select = selection.select
var selectAll = selection.selectAll

var shape = require('d3-shape')
var d3line = shape.line

var time = require('d3-time')
var timeDay = time.timeDay


export class AVAILStats extends React.Component<void, Props, void> {
  constructor () {
    super()
    this.state = {
      interval: 30,
      graph: 'logins'
    }
    this.renderGraph = this.renderGraph.bind(this)
  }

  componentDidMount(){
    if(!this.props.AVAILStats || !this.props.AVAILStats[this.state.interval]){
      console.log("empty")
      return this.props.loadStatsData(this.state.interval)
    }
    this.renderGraph(this.props.AVAILStats[this.state.interval])    
  }

  componentDidUpdate(){
    if(!this.props.AVAILStats || !this.props.AVAILStats[this.state.interval]){
      console.log("empty")
      return this.props.loadStatsData(this.state.interval)
    }
    this.renderGraph(this.props.AVAILStats[this.state.interval])    
  }

  renderGraph(data){
    select("#root").select("span").select("svg").remove("*");

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 780 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;


    var x = scaleTime()
        .range([0, width])
        .domain(extent(data, function(d) {var curDate = new Date(d.series); return curDate }))



    var y = scaleLinear()
        .range([height, 0])
        .domain(extent(data, function(d) {return +d.count; }));

    var xAxis = axisBottom(x); 
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
    var scope = this;
    if(!this.props.AVAILStats || !this.props.AVAILStats[this.state.interval]){
      console.log("empty")
      this.props.loadStatsData(this.state.interval)
      return <span />
    }
    var intervalSelectOptions = [{value:7,label:"7 Days"},{value:30,label:"30 Days"},{value:90,label:"90 Days"}]
    var graphSelectOptions = [{value:'logins',label:"Logins per day"},{value:'users',label:"Users past N days"}]


    function intervalSelectChange (value){
      console.log(value)
      if(value){
        scope.setState({interval:value.value})
      }
    }

    function graphSelectChange (value){
      console.log(value)
      if(value){
        scope.setState({graph:value.value})
      }
    }

    console.log("render",this)
    this.renderGraph(this.props.AVAILStats[this.state.interval])
    return (
      <div className="container">
        <span id="graphDiv" className="graphDiv"></span>
        <div className="row col-xs-2 pull-left" style={{marginRight:"5px"}}>
          <Select 
          className={classes['Select']}
          name="metroSelect"
          value={graphSelectOptions.filter(d => { return d.value === this.state.graph })[0]}
          options={graphSelectOptions}
          onChange={graphSelectChange} 
          placeholder="Graph Select"
          clearable={false}
          />  
        </div>
        <div className="row col-xs-2 pull-left" >
          <Select 
          className={classes['Select']}
          name="metroSelect"
          value={intervalSelectOptions.filter(d => { return d.value === this.state.interval })[0]}
          options={intervalSelectOptions}
          onChange={intervalSelectChange} 
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
