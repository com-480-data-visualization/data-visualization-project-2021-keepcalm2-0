// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 60, left: 80},
    width = 470 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// append svgs object to the body of the page
var svg_1 = d3.select("#hours_time_hexbin_plot")
            .append("svg")
              .attr("width", width+10 + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
var svg_2 = d3.select("#deep_sleep_time_hexbin_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

var svg_3 = d3.select("#cycles_time_hexbin_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// fonction that create the plot and reload if the radius change
function renderDensityPlotMovingTime(svg_, columnId,radius) {
  // read data
  d3.csv("/EPFLDataViz/data/df_sleep_analysis_movingtime.csv").then(function (data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 15000])
      .range([ 0, width ]);
    svg_.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add X label
    svg_.append("text")
      .attr("stroke", "grey")
      .attr("stroke-width", "0.1")
      .attr("x",  width/2-margin.right)
      .attr("y", height + margin.top + 30)
      .text("Moving time [s] ");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data.map(elem => parseFloat(elem[columnId])))])
      .range([ height, 0 ]);

    // Reformat the data: d3.hexbin() needs a specific format
    var inputForHexbinFun = []
    data.forEach(function(d) {
      inputForHexbinFun.push( [x(d['Moving Time']), y(d[columnId])] )  // Note that we had the transform value of X and Y !
    })

    // Prepare a color palette
    var color = d3.scaleSequential(d3.interpolateLab("white", "green"))
      .domain([0, 5]);

    // Compute the hexbin data
    var hexbin = d3.hexbin()
      .radius(radius) // size of the bin in px
      .extent([ [0, 0], [width, height] ])

    // Plot the hexbins
    svg_.append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height)

    // Create animation and append the svg (reload the svg every time we touch the slider)
    var modif = svg_.append("g")
                      .attr("clip-path", "url(#clip)")
                   .selectAll("path")
                   .data( hexbin(inputForHexbinFun) )

    modif.enter().append("path")
                 .merge(modif)
                 .transition()
                 .duration(1000)
                    .attr("d", hexbin.hexagon())
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .attr("fill", function(d) { return color(d.length); })
                    .attr("stroke", "black")
                    .attr("stroke-width", "0.1")

    svg_.append("g")
        .call(d3.axisLeft(y));
    // Y axis label:
    svg_.append("text")
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.right)
        .attr("x", -height/2-margin.top)
        .text(columnId)




})}
// Initialise the svg with a value of 10
renderDensityPlotMovingTime(svg_1, 'Hours',10)
renderDensityPlotMovingTime(svg_2, 'DeepSleep',10)
renderDensityPlotMovingTime(svg_3, 'Cycles',10)

// load the value of the slider and use the function
d3.select("#mySlider4").on("change", function (d) {
  svg_1.selectAll("*").remove();
  var radius=this.value
  renderDensityPlotMovingTime(svg_1, 'Hours',radius)})
d3.select("#mySlider5").on("change", function (d) {
  svg_2.selectAll("*").remove();
  var radius=this.value
  renderDensityPlotMovingTime(svg_2, 'DeepSleep',radius)})
d3.select("#mySlider6").on("change", function (d) {
  svg_3.selectAll("*").remove();
  var radius=this.value
  renderDensityPlotMovingTime(svg_3, 'Cycles',radius)})
