d3.json(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then((dataGeo) => {
  d3.csv(
    '/EPFLDataViz/data/strava/activities_with_gpx.csv'
  ).then((data) => {
    ready(null, dataGeo, data);
  });
});

function ready(error, dataGeo, data) {
  data = data.map(dataPoint => {
    dataPoint.Distance /= 1000
    return dataPoint
  })

  // The svg
  var svg = d3.select("#geo_dataviz").attr('width', $('.geo_dataviz_container').width()),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Map and projection
  var projection = d3
    .geoMercator()
    .center([20, 40]) // GPS of location to zoom on
    .scale(200) // This is like the zoom
    .translate([width / 2, height / 2]);

  // Create a color scale
  var allContinent = d3
    .map(data, function (d) {
      return d['Activity Type'];
    })
    .keys();
  var color = d3.scaleOrdinal().domain(allContinent).range(d3.schemePaired);

  // Add a scale for bubble size
  var valueExtent = d3.extent(data, function (d) {
    return +d.Distance;
  });
  var size = d3
    .scaleSqrt()
    .domain(valueExtent) // What's in the data
    .range([1, 50]); // Size in pixel

  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#b8b8b8")
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "none")
    .style("opacity", 0.3);

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(
      data
        .sort(function (a, b) {
          return +b.Distance - +a.Distance;
        })
        .filter(function (d, i) {
          return d.lat != 0.0;
        })
    )
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return projection([+d.lng, +d.lat])[0];
    })
    .attr("cy", function (d) {
      return projection([+d.lng, +d.lat])[1];
    })
    .attr("r", function (d) {
      return size(+d.Distance);
    })
    .style("fill", function (d) {
      return color(d['Activity Type']);
    })
    .attr("stroke", function (d) {
      if (d.distance > 2000) {
        return "black";
      } else {
        return "none";
      }
    })
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.4);
}
