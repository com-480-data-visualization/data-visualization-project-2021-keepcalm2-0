// import * as d3 from '../libs/d3.min.js';

function renderSleepBarPlot(containerId, svgId, columnId) {
  d3.csv("/data/sleep/sleep-export.csv").then((data) => {
    data = data.filter((dataPoint) => dataPoint.Id != "" && dataPoint.Id != "Id" && dataPoint.Hours > 0).slice(0, 100);
    var width = $(containerId).width();
    var height = 500;
    var margin = 80;
  
    const container = d3
      .select(svgId)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1 px solid red");
  
    const dataWeek = data.reverse();
    let mapDate = (dataPoint) => {
      let date = dataPoint.From.split(" ").splice(0, 3).join("");
      return date;
    };
    const xScale = d3
      .scaleBand()
      .domain(dataWeek.map(mapDate))
      .rangeRound([0, width])
      .padding(0.3)
      .paddingOuter(1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map(elem => parseFloat(elem[columnId])))])
      .rangeRound([height - margin, margin]);
  
    var barColor = d3.scaleLinear()
      .domain([0, d3.max(data.map(elem => parseFloat(elem[columnId])))])
      .range(["red", "forestgreen"]);
  
    // Show axis
    container.append("g").call(d3.axisRight(yScale));
    container
      .append("g")
      .classed("xAxis", true)
      .attr("transform", "translate(5,495) rotate(0)")
      .call(d3.axisTop(xScale))
      .call(g => g.select(".domain").remove())
      ;
  
    container.selectAll('.xAxis').selectAll('.tick')
    .attr('transform', (dataPoint,i)=>{
        return 'translate('+ xScale(dataPoint)+', -30) rotate(60)';
     })
  
    container.selectAll('line').remove()
     
  
    // Show bars
    const bars = container
      .selectAll("bar")
      .data(dataWeek)
      .enter()
      .append("rect")
      .attr("width", xScale.bandwidth())
      .attr("height", (dataPoint) => height - margin - yScale(dataPoint[columnId]))
      .attr("x", (dataPoint) => xScale(mapDate(dataPoint)))
      .attr("y", (dataPoint) => yScale(dataPoint[columnId]))
      .attr("fill", (d) => {
        return barColor(d[columnId]);
      })
      ;
  });
}

renderSleepBarPlot('.sleep_duration_container', '#sleep_duration_bar_plot', 'Hours')
renderSleepBarPlot('.sleep_duration_container', '#deep_sleep_duration_bar_plot', 'DeepSleep')
renderSleepBarPlot('.sleep_duration_container', '#sleep_cycles_bar_plot', 'Cycles')