// get the data
d3.csv("/EPFLDataViz/data/sleep/sleep-export.csv").then(function (data) {
  var margin = { top: 65, right: 35, bottom: 80, left: 40 },
    width =
      $(".sleep_duration_histogram_container").width() -
      margin.left -
      margin.right,
    height = 500 - margin.top - margin.bottom;

  // console.log("width: ", width, ", height: ", height);
  // append the svg object to the body of the page
  var svg_hist = d3
    .select("#sleep_duration_histogram_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg_hist
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", -5)
    .attr("y", -10)
    .text("Nights")
    .attr("text-anchor", "start");

  svg_hist
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 100)
    .attr("y", height + 40)
    .text("Sleep time [hr]")
    .attr("text-anchor", "start");
  data = data.filter(
    (dataPoint) =>
      dataPoint.Id != "" && dataPoint.Id != "Id" && dataPoint.Hours > 0
  );
  // console.log(data);
  // X axis: scale and draw:
  var x = d3
    .scaleLinear()
    .domain([0, 10]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);

  svg_hist
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.Hours;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(15)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg_hist.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg_hist element
  svg_hist
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return height - y(d.length);
    })
    .style("fill", "#69b3a2");
});
