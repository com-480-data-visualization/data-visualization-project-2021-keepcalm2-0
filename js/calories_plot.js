// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 60, left: 80},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// append svgs object to the body of the page
var svg_7 = d3.select("#hours_cal_hexbin_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

var svg_8 = d3.select("#deep_sleep_cal_hexbin_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

var svg_9 = d3.select("#cycles_cal_hexbin_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


// fonction that create the plot and reload if the radius change
function renderDensityPlot(svg__, columnId,radius) {
  // read data
  d3.csv("/EPFLDataViz/data/calories.csv").then(function (data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 2000])
      .range([ 0, width ]);
    svg__.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add X label
    svg__.append("text")
      .attr("stroke", "grey")
      .attr("stroke-width", "0.1")
      .attr("x",  width/2-margin.right)
      .attr("y", height + margin.top + 30)
      .text("Calories [J] ");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data.map(elem => parseFloat(elem[columnId])))])
      .range([ height, 0 ]);

    // Reformat the data: d3.hexbin() needs a specific format
    var inputForHexbinFun = []
    data.forEach(function(d) {
      inputForHexbinFun.push( [x(d.Calories), y(d[columnId])] )  // Note that we had the transform value of X and Y !
    })

    // Prepare a color palette
    var color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
      .domain([0, 5]);

    // Compute the hexbin data
    var hexbin = d3.hexbin()
      .radius(radius) // size of the bin in px
      .extent([ [0, 0], [width, height] ])

    // Plot the hexbins
    svg__.append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height)

    // Create animation and append the svg (reload the svg every time we touch the slider)
    var modif = svg__.append("g")
                      .attr("clip-path", "url(#clip)")
                   .selectAll("path")
                   .data( hexbin(inputForHexbinFun) )
                    .attr("d", hexbin.hexagon())
    modif.enter().append("path")
                 .merge(modif)
                 .transition()
                 .duration(1000)
                    .attr("d", hexbin.hexagon())
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .attr("fill", function(d) { return color(d.length); })
                    .attr("stroke", "black")
                    .attr("stroke-width", "0.1")

    svg__.append("g")
        .call(d3.axisLeft(y));
    // Y axis label:
    svg__.append("text")
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.right-10)
        .attr("x", -height/2-margin.top)
        .text(columnId)




})}
// Initialise the svg with a value of 10
renderDensityPlot(svg_7,'Hours',10)
renderDensityPlot(svg_8,'DeepSleep',10)
renderDensityPlot(svg_9,'Cycles',10)

// load the value of the slider and use the function
d3.select("#mySlider").on("change", function (d) {
  svg_7.selectAll("*").remove();
  selectedRadius=this.value
  renderDensityPlot(svg_7,'Hours',selectedRadius)
  })
d3.select("#mySlider2").on("change", function (d) {
  svg_8.selectAll("*").remove();
  selectedRadius=this.value
  renderDensityPlot(svg_8,'DeepSleep',selectedRadius)})
d3.select("#mySlider3").on("change", function (d) {
  svg_9.selectAll("*").remove();
  selectedRadius=this.value
  renderDensityPlot(svg_9,'Cycles',selectedRadius) })
