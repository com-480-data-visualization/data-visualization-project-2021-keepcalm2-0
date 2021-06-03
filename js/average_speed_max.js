// Use our data with a visualisation form the dataset data_speed1 to data_speed2
// all the preprocessing is made in the file preprocessing.ipynb
var data_speed1 = [
   {group: "Ride", value: 0},
   {group: "Run", value: 0},
   {group: "Swim", value: 0}
];

var data_speed2 = [
   {group: "Ride", value: 4.397185*3.6},
   {group: "Run", value: 2.832024*3.6},
   {group: "Swim", value:0.667112*3.6}];

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_speed = d3.select("#average_speed")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x_ = d3.scaleBand()
  .range([ 0, width ])
  .domain(data_speed1.map(function(d) { return d.group; }))
  .padding(0.2);
svg_speed.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x_))

// Add Y axis
var y_ = d3.scaleLinear()
  .domain([0, 30])
  .range([ height, 0]);
svg_speed.append("g")
  .call(d3.axisLeft(y_));

// function that update the plot for a given variable:
function update(data_speed1) {

  var u = svg_speed.selectAll("rect")
    .data(data_speed1)

  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x_(d.group); })
      .attr("y", function(d) { return y_(d.value); })
      .attr("width", x_.bandwidth())
      .attr("height", function(d) { return height - y_(d.value); })
      .attr("fill", "#165543")
  }

// Initialize the plot with the first dataset
update(data_speed1)
