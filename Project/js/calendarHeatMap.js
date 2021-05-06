// / 2. Use the margin convention practice
d3.csv(
  "/data/samsung/com.samsung.shealth.activity.day_summary.202103301825.csv"
).then((data) => {
  // Create chart dimensions and scales
  var datax = data.map((dataPoint) => {
    return {
      Date: new Date(parseInt(dataPoint.day_time)).toISOString().slice(0, 10),
      ProductionValue: parseInt(dataPoint.active_time) / 60000,
    };
  });
  let result = new Map(
    datax.map((value) => [value["Date"], value["ProductionValue"]])
  );

  const width = $("#calendar_activity_heatmap").width(),
    height = 136,
    cellSize = 17;
  const color = d3
    .scaleQuantize()
    .domain([0, d3.max(datax.map((dataPoint) => dataPoint.ProductionValue))])
    .range([
      "#f3f6e7",
      "#e7eecf",
      "#dbe5b7",
      "#d0dd9f",
      "#c4d587",
      "#b8cd6f",
      "#acc457",
      "#a1bc3f",
      "#94b327",
      "#89ab0f",
    ]);

  // Draw the canvas
  const svg = d3
    .select("#calendar_activity_heatmap")
    .selectAll("svg")
    .data(
      d3.range(parseInt(datax[0]["Date"]) - 1, parseInt(datax[0]["Date"]) + 1)
    )
    .enter()
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (width - cellSize * 53) / 2 +
        "," +
        (height - cellSize * 7 - 1) +
        ")"
    );

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // draw the draw the data
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.1px")
    .selectAll("rect")
    .data((d) => {
      return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter()
    .append("rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", (d) => d3.timeMonday.count(d3.timeYear(d), d) * cellSize)
    .attr("y", (d) => d.getUTCDay() * cellSize)
    .datum(d3.timeFormat("%Y-%m-%d"))
    .attr("fill", (d) => {
      return color(result.get(d));
    })
    .on("mouseover", function (event, d) {
      console.log(d);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d + "<br/>" + Math.round(result.get(d)) + " minutes")
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke-width", "0.1px");
      tooltip.transition().duration(500).style("opacity", 0);
    })

  // adding year text (rotated vertically)
  svg
    .append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1em")
    .attr("text-anchor", "middle")
    .text((d) => d);

  // draw stroke for all months
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", "1.5px")
    .selectAll("path")
    .data((d) => d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
    .enter()
    .append("path")
    .attr("d", function (d) {
      const t1 = new Date(d.getFullYear(), d.getMonth() + 1, 0),
        d0 = d.getUTCDay(),
        w0 = d3.timeMonday.count(d3.timeYear(d), d),
        d1 = t1.getUTCDay(),
        w1 = d3.timeMonday.count(d3.timeYear(t1), t1);
      return (
        "M" +
        (w0 + 1) * cellSize +
        "," +
        d0 * cellSize +
        "H" +
        w0 * cellSize +
        "V" +
        7 * cellSize +
        "H" +
        w1 * cellSize +
        "V" +
        (d1 + 1) * cellSize +
        "H" +
        (w1 + 1) * cellSize +
        "V" +
        0 +
        "H" +
        (w0 + 1) * cellSize +
        "Z"
      );
    });
});
