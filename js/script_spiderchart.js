// set the dimensions and margins of the graph
var w = 500,
	h = 500;

var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

//Legend titles
var LegendOptions = ['Winter&Fall','Summer&Spring'];

//Input our data in the RadarChart
var data_spider = [
		  [
        {axis: "E-Bike Ride", value: 0.016470},
        {axis: "Bike Ride", value: 0.403165},
        {axis: "Swim", value: 0.049165},
        {axis: "Virtual Ride", value: 0.012087},
        {axis: "Walk", value: 0.038390},
        {axis: "Weight Training", value: 0.053658},
        {axis: "Run", value: 0.352912},
        {axis: "Hike", value: 0.024569},
        {axis: "Workout", value: 0.049583}
		  ],[
        {axis: "E-Bike Ride", value: 0},
        {axis: "Bike Ride", value: 0.260501},
        {axis: "Swim", value: 0.062079},
        {axis: "Virtual Ride", value:0},
        {axis: "Walk", value: 0.077482},
        {axis: "Weight Training", value: 0},
        {axis: "Run", value: 0.346681},
        {axis: "Hike", value: 0.189265},
        {axis: "Workout", value: 0.063991}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.4,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#spider_chart", data_spider, mycfg);

// Initiate legend

var svg = d3.select("#spider_chart")
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h+100)

//Create the title for the legend

var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)')
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Type of athletes by season");

//Initiate Legend

var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)')
	;

	//Create colour squares that we also can moved as we want
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;

	//Create text next to squares so he can be moved as we want
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;
