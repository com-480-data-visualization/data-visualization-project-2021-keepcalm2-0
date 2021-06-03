// set the dimensions and margins of the graph
function renderTreePlot(divId, columnKey, label) {
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 800 - margin.left - margin.right,
    height = 445 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Read data
  d3.csv("/EPFLDataViz/data/strava/activities_with_gpx.csv").then(function (data) {
    var dataParsed = [
      {
        name: "Origin",
        parent: "",
        value: "",
        label: label,
      },
    ];

    var timeByActivity = {};
    data.forEach((row) => {
      const activityType = row["Activity Type"];
      const activityTime = +row[columnKey];
      if (!(activityType in timeByActivity)) {
        timeByActivity[activityType] = 0;
      }
      timeByActivity[activityType] += Number.isNaN(activityTime)
        ? 0
        : activityTime;
    });

    delete timeByActivity["Workout"];
    delete timeByActivity["Virtual Ride"];
    delete timeByActivity["Weight Training"];
    delete timeByActivity["E-Bike Ride"];
    if(columnKey == "Distance") {
        delete timeByActivity["Swim"]
    }

    for (const [key, value] of Object.entries(timeByActivity)) {
      if (value) {
        dataParsed.push({
          name: key,
          parent: "Origin",
          value: value,
          label: label,
        });
      }
    }

    var domain = d3.map(dataParsed, elem => elem.value)
    var color = d3.scaleLinear().domain(domain).range(["#A8E5A0", "green"]);

    var root = d3
      .stratify()
      .id(function (d) {
        return d.name;
      }) // Name of the entity (column name is name in csv)
      .parentId(function (d) {
        return d.parent;
      })(
      // Name of the parent (column name is parent in csv)
      dataParsed
    );
    root.sum(function (d) {
      return +d.value;
    }); // Compute the numeric value for each entity

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3
      .treemap()
      .tile(d3.treemapSquarify.ratio(1))
      .size([width, height])
      .padding(4)(root);

    // use this information to add rectangles:
    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0;
      })
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .style("stroke", "black")
      .style("fill", function(d){ return color(d.data.value)} );
    //   .style("fill", "#69b3a2");

    // and to add the text labels
    svg
      .selectAll("title")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
        if(d.x1 - d.x0 < 30) {
            return d.x0;
        }
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 25;
      }) // +20 to adjust position (lower)
      .text(function (d) {
          if(d.x1 - d.x0 < 30) {
              return d.data.name[0]
          }
        return d.data.name;
      })
      .attr("font-size", "20px")
      .attr("fill", "white");

    svg
      .selectAll("description")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
          if(d.data.value < 100)
          return d.x0 + 6;
        return d.x0 + 3;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 40;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        if(d.x1 - d.x0 < 30) {
            return ;
        }
        return parseInt(d.data.value) + " " + d.data.label;
      })
      .attr("font-size", "15px")
      .attr("fill", "white");
  });
}

renderTreePlot('#treeplot_activities_type_duration', 'Elapsed Time', ' min')
renderTreePlot('#treeplot_activities_type_calories', 'Calories', ' cal')
renderTreePlot("#treeplot_activities_type_distance", "Distance", " km");
renderTreePlot("#treeplot_activities_type_effort", "Relative Effort", "");
