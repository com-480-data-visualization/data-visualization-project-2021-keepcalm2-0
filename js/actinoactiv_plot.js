// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 50, left: 80},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append svgs object to the body of the page
var svg4 = d3.select("#hours_activ_hexbin_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var svg5 = d3.select("#deep_sleep_activ_hexbin_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var svg6 = d3.select("#cycles_activ_hexbin_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// fonction that create the plot and reload if the radius change
function renderDensityPlotActivityvsnon(svg, columnId,radius) {
  // read data
  d3.csv("/EPFLDataViz/data/nights_recorded_activity_vs_no_activity_balanced.csv").then(function (data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 1])
      .range([ 50, width-30 ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
   // Add X label
    svg.append("text")
      .attr("stroke", "grey")
      .attr("stroke-width", "0.1")
      .attr("x",  width/2-margin.right)
      .attr("y", height + margin.top + 20)
      .text("Activity");

    // Add Y axis label will follow at the end
    var y = d3.scaleLinear()
      .domain([0, d3.max(data.map(elem => parseFloat(elem[columnId])))])
      .range([ height, 0 ]);

    // Reformat the data: d3.hexbin() needs a specific format

    var inputForHexbinFun = []
    data.forEach(function(d) {
      inputForHexbinFun.push( [x(d["activity"]), y(d[columnId])] )  // Note that we had the transform value of X and Y
    })

    // Prepare a color palette
    var color = d3.scaleSequential(d3.interpolateLab("white", "red"))
      .domain([0, 5]);

    // Compute the hexbin data
    var hexbin = d3.hexbin()
      .radius(radius) // size of the bin in px
      .extent([ [0, 0], [width, height] ])

    // Plot the hexbins
    svg.append("clipPath")
        .attr("id", "clip")
       .append("rect")
        .attr("width", width)
        .attr("height", height)

    // Create animation and append the svg (reload the svg every time we touch the slider)

    var modif = svg.append("g")
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

    svg.append("g")
      .call(d3.axisLeft(y));
    // Y axis label:
    svg.append("text")
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.right)
        .attr("x", -height/2-margin.top)
        .text(columnId)




  })}
  // Initialise the svg with a value of 10
  renderDensityPlotActivityvsnon(svg4, 'Hours',10)
  renderDensityPlotActivityvsnon(svg5, 'DeepSleep',10)
  renderDensityPlotActivityvsnon(svg6, 'Cycles',10)

  // load the value of the slider and use the function
  d3.select("#mySlider7").on("change", function (d) {
    svg4.selectAll("path").remove();
    svg4.selectAll("g").remove();
    selectedRadius=this.value
    renderDensityPlotActivityvsnon(svg4, 'Hours',selectedRadius)})
  d3.select("#mySlider8").on("change", function (d) {
    svg5.selectAll("path").remove();
    svg5.selectAll("g").remove();
    selectedRadius=this.value
    renderDensityPlotActivityvsnon(svg5, 'DeepSleep',selectedRadius)})
  d3.select("#mySlider9").on("change", function (d) {
    svg6.selectAll("path").remove();
    svg6.selectAll("g").remove();
    selectedRadius=this.value
    renderDensityPlotActivityvsnon(svg6, 'Cycles',selectedRadius) })
