import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { scaleLinear, scaleTime, axisLeft, axisBottom, extent, min, max, nest, merge} from 'd3'
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

var voronoiBig = require('d3-voronoi')
var voronoiFunc = voronoiBig.voronoi


export class AVAILStats extends React.Component<void, Props, void> {
  constructor () {
    super()
    this.state = {
      interval: 30,
      graph: 'logins'
    }
    this.renderGraph = this.renderGraph.bind(this)
    this._hasData = this._hasData.bind(this)
    this._getData = this._getData.bind(this)
  }

  _hasData(){
    if(this.state.graph == "logins"){
      return (this.props.AVAILStats && 
        this.props.AVAILStats[this.state.graph] && 
        this.props.AVAILStats[this.state.graph][this.state.interval])      
    }
    if(this.state.graph == "users"){
      return (this.props.AVAILStats && 
        this.props.AVAILStats[this.state.graph] && 
        this.props.AVAILStats[this.state.graph][this.state.interval] &&
        this.props.AVAILStats[this.state.graph][this.state.interval][7] &&   
        this.props.AVAILStats[this.state.graph][this.state.interval][30] &&   
        this.props.AVAILStats[this.state.graph][this.state.interval][90]        
        ) 
    }    
  }

  _getData(){
    if(this.state.graph == "logins"){
      return this.props.loadLoginsData(this.state.interval)        
    }
    if(this.state.graph == "users"){
      if(!this.props.AVAILStats[this.state.graph][this.state.interval]){
        return this.props.loadUsersData(7,this.state.interval)                 
      }
      else if(!this.props.AVAILStats[this.state.graph][this.state.interval][30]){
        return this.props.loadUsersData(30,this.state.interval)           
      }
      else if(!this.props.AVAILStats[this.state.graph][this.state.interval][90]){
        return this.props.loadUsersData(90,this.state.interval)           
      } 
    }    
  }

  componentDidMount(){
    if(!this._hasData()){
      console.log("empty didmount")
      return this._getData()
    }
    this.renderGraph(this.props.AVAILStats[this.state.graph][this.state.interval])
  }

  componentDidUpdate(){
    if(!this._hasData()){
      console.log("empty didupdate")
      return this._getData()
    }
    this.renderGraph(this.props.AVAILStats[this.state.graph][this.state.interval])
  }

  renderGraph(inputData){
    var scope = this;
    select("#root").select("span").select("svg").remove("*");
    console.log("rendergraph",inputData)

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 780 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    if(this.state.graph == "logins"){ 
      var data = inputData;
      var x = scaleTime()
          .range([0, width])
          .domain(extent(data, function(d) {var curDate = new Date(d.series); return curDate }))

      var y = scaleLinear()
          .range([height, 0])
          .domain(extent(data, function(d) {return +d.count; }));
    }
    if(this.state.graph == "users"){
      //Flattens all data into one array for things like making axes
      var data = [];
      Object.keys(inputData).forEach(series => {
        inputData[series].forEach(element => {
          data.push(element);
        })
      })

      var x = scaleTime()
          .range([0, width])
          .domain(extent(data, function(d) {var curDate = new Date(d.series); return curDate }))

      var y = scaleLinear()
          .range([height, 0])
          .domain(extent(data, function(d) {return +d.count; }));
    }

    var voronoi = voronoiFunc()
        .x(function(d) { var curDate = new Date(d.series); return x(curDate); })
        .y(function(d) { return y(+d.count); })
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])

    var xAxis = axisBottom(x); 
    var yAxis = axisLeft(y)

    var line = d3line()
      line.x(function(d) {var curDate = new Date(d.series); return x(curDate); })
      line.y(function(d) {return y(+d.count); });

    var svg = select("#root").select("span").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
        .call(axisBottom(x));

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    var focusCircle = g.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focusCircle");

    focusCircle.append("circle")
        .attr("r", 4.5)
        .style("fill","purple")
        .style("opacity","1");

    var focusText = g.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focusText");

    focusText.append("text")
        .style("font-size", "11px");

    var focusLabel = g.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focusLabel");

    focusLabel.append("text")
        .style("font-size", "13px");

    if(this.state.graph == "logins"){
      drawLine(data,"black","logins")     
    }
    else{
      Object.keys(inputData).forEach(series => {
        if(series == 7){
          var color = "red"
        }
        else if(series == 30){
          var color = "blue"
        }
        else{
          var color = "green"
        }

        drawLine(inputData[series],color,series)
      })   
    }
  
    var voronoiGroup = g.append("g")
        .attr("class", "voronoi")
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("opacity","0")

    voronoiGroup.selectAll("path")
      .data(voronoi.polygons(data.map(function(d) {return d; })))
      .enter().append("path")
        .attr("d", function(d) {return d ? "M" + d.join("L") + "Z" : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d){
      var curDate = new Date(d.data.series);
      var mouseLine = d.data.line
      var classLabel = select(mouseLine).attr("class")

      if(classLabel == "logins"){
        focusLabel.attr("transform", "translate(20,10)");
        focusLabel.select("text").text("Logins per Day")
      }
      else{
        focusLabel.attr("transform", "translate(20,10)");
        focusLabel.select("text").text("Unique users over the past "+classLabel+" days")        
      }

      focusCircle.attr("transform", "translate(" + x(curDate) + "," + y(+d.data.count) + ")");
      focusText.select("text").text("Date: "+(d.data.series.split("T")[0]) +" | " + d.data.count);
      focusText.attr("transform", "translate(20,30)");
      select(mouseLine).style("stroke-width","4px")
    }
    function mouseout(d){
      var mouseLine = d.data.line

      select(mouseLine).style("stroke-width","2px")
      focusCircle.attr("transform", "translate(-100,-100)");
      focusText.attr("transform", "translate(-100,-100)");
      focusLabel.attr("transform", "translate(-100,-100)");
    }

    function drawLine(data,color,className){
      var curLine;

      var curColor = color ? color : "black"

      svg.append("path")
          .attr("class", className)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("d", function(){curLine = this; data.line = curLine; return line(data)})
          .style("fill","none")
          .style("stroke",curColor)
          .style("stroke-width","2px")  

      data.forEach(element => {
        element.line = curLine;
      })            
    }
  }

  render(){
    var scope = this;
    if(!this._hasData()){
      console.log("empty render")
      this._getData()
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

    this.renderGraph(this.props.AVAILStats[this.state.graph][this.state.interval])

    var legend;
    if(this.state.graph == "users"){
      legend = (
        <div className="pull-left" style={{marginLeft:"20px"}}>
          <div style={{color:"red"}}>7 days</div>
          <div style={{color:"blue"}}>30 days</div>
          <div style={{color:"green"}}>90 days</div>
        </div>
        )
    }

    return (
      <div className="container">
        <span id="graphDiv" className="graphDiv"></span>
        <div id="intervalSelect" className="row col-xs-3 pull-left">
          <Select 
          className={classes['Select']}
          name="metroSelect"
          value={graphSelectOptions.filter(d => { return d.value === this.state.graph })[0]}
          options={graphSelectOptions}
          onChange={graphSelectChange} 
          placeholder="Graph Select"
          clearable={false}
          />  
          <Select 
          className={classes['Select']}
          name="metroSelect"
          value={intervalSelectOptions.filter(d => { return d.value === this.state.interval })[0]}
          options={intervalSelectOptions}
          onChange={intervalSelectChange} 
          placeholder="Interval Select"
          clearable={false}
          />  
        {legend}
        </div>
      </div>
      )
  }
}

AVAILStats.propTypes = {
  loadLoginsData: React.PropTypes.func.isRequired,
  loadUsersData: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({

})

export default connect((mapStateToProps), {

})(AVAILStats)
