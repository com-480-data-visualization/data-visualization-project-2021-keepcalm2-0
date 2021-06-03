// set the dimensions and margins of the graph
var margin_hist = {top: 60, right: 60, bottom: 50, left: 60},
    width_ = $('.sleep_duration_container').width() - margin_hist.left - margin_hist.right,
    height_ = 500 - margin_hist.top - margin_hist.bottom;

// append the svg object to the body of the page
var svg_stacked = d3.select("#stackedbar_chart")
  .append("svg")
    .attr("width", width_ + margin_hist.left + margin_hist.right)
    .attr("height", height_ + margin_hist.top + margin_hist.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_hist.left + "," + margin_hist.top + ")");

// Get the Data for D3.v6
d3.csv("/EPFLDataViz/data/motivation_by_type.csv").then(function (data) {  console.log(data)
  data.forEach((item, i) => {console.log(item["activity_full_date"])
    item["activity_full_date"]=d3.timeParse("%Y-%m-%d")(item["activity_full_date"])})
  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data
  var stackedData = d3.stack()
    .keys(keys)
    (data)
  // Add X axis
   var x = d3.scaleTime()
     .domain(d3.extent(data, function(d) { return d["activity_full_date"]; }))
     .range([ 0, width_ ]);
   var xAxis = svg_stacked.append("g")
     .attr("transform", "translate(0," + height_ + ")")
     .call(d3.axisBottom(x).ticks(10))

   // Add X axis label:
   svg_stacked.append("text")
       .attr("text-anchor", "end")
       .attr("x", width_)
       .attr("y", height_+40 );







  // Add Y axis label:
  svg_stacked.append("text")
      .attr("text-anchor", "end")
      .attr("x", -50)
      .attr("y", -30 )
      .text("Moving Time [hr]")
      .attr("text-anchor", "start")


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height_, 0 ]);
  svg_stacked.append("g")
    .call(d3.axisLeft(y).ticks(15))


    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg_stacked.append("defs").append("svg_stacked:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_ )
        .attr("height", height_ )
        .attr("x", 0)
        .attr("y", 0);


    // Create the scatter variable: where both the circles and the brush take place
    var areaChart = svg_stacked.append('g')
      .attr("clip-path", "url(#clip)")

    // Area creation
    var area = d3.area()
      .x(function(d) { return x(d.data["activity_full_date"]); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })

    // Show areas
    areaChart
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)



      // HIGHLIGHT GROUP


      // What to do when one group is hovered
      var highlight = function(event, d){
        console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
      }

      // And when it is not hovered anymore
      var noHighlight = function(event, d){
        d3.selectAll(".myArea").style("opacity", 1)
      }

      // LEGEND

      // Add one dot in the legend for each name.
      var size = 20
      svg_stacked.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", $('.sleep_duration_container').width()-225)
          .attr("y", function(d,i){ return  i*(size+5)-50}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return color(d)})
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

      // Add one dot in the legend for each name.
      svg_stacked.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", $('.sleep_duration_container').width()-225 + size*1.2)
          .attr("y", function(d,i){ return i*(size+5) + (size/2)-50}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)



})
