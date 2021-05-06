d3.csv("/data/sleep/sleep-export.csv").then((data) => {
    data = data.filter((dataPoint) => dataPoint.Id != "" && dataPoint.Id != "Id" && dataPoint.Hours > 0).slice(0, 20);
    let mapDate = (dataPoint) => {
        let date = dataPoint.From.split(" ").splice(0, 3).join("");
        return date;
      };

    data = data.map(elem => {
        return {
          Category:  mapDate(elem),
          type1: elem.Hours,
          type2: elem.DeepSleep,
        }
      })
    var w=$('.sleep_vs_deepsleep_container').width(),h=500,padding=40;
    var svg=d3.select('#sleep_vs_deepsleep_chart').append('svg')
                .attr('width', w)
                .attr('height', h);
    var stack=d3.stack()
                .keys(['type1','type2','type3']);
    
    var datasets=[d3.stack().keys(['type1','type3'])(data),
                  d3.stack().keys(['type2'])(data)];
  
    var num_groups=datasets.length;
  
    var xlabels=data.map(function(d){return d['Category']});
  
    var xscale=d3.scaleBand()
                    .domain(xlabels)
                    .range([padding,w-padding])
                    .paddingInner(0.5);
  
    var ydomain_min=d3.min(datasets.flat().map(function(row) {
                            return d3.min(row.map(function(d){return d[1];}));
                        }));
    var ydomain_max=d3.max(datasets.flat().map(function(row) {
                            return d3.max(row.map(function(d){return d[1];}));
                        }));
  
    var yscale=d3.scaleLinear()
                    .domain([0,ydomain_max])
                    .range([h-padding,padding]);
  
    var accent = d3.scaleOrdinal(d3.schemeBlues[6]);
    var xaxis=d3.axisBottom(xscale);
    var yaxis=d3.axisLeft(yscale);
  
    d3.range(num_groups).forEach(function(gnum) {
        svg.selectAll('g.group'+gnum)
            .data(datasets[gnum])
            .enter()
            .append('g')
                .attr('fill',accent)
                .attr('class', 'group'+gnum)
            .selectAll('rect')
            .data(d=>d)
            .enter()
            .append('rect')
                .attr('x',(d,i)=>xscale(xlabels[i])+(xscale.bandwidth()/num_groups)*gnum)
                .attr('y',d=>yscale(d[1]))
                .attr('width',xscale.bandwidth()/num_groups)
                .attr('height',d=>yscale(d[0])-yscale(d[1]));
            });
  
    svg.append('g')
            .attr('class','axis x')
            .attr('transform','translate(0,'+(h-padding)+")")
        .call(xaxis);
    svg.append('g')
            .attr('class','axis y')
            .attr('transform','translate('+padding+",0)")
        .call(yaxis);

})

// var data = [
//     {
//       Category: "cat1",
//       type1: 300,
//       type2: 450,
//       type3: 120
//     },
//     {
//       Category: "cat2",
//       type1: 400,
//       type2: 100,
//       type3: 200
//     },
//     {
//       Category: "cat3",
//       type1: 400,
//       type2: 100,
//       type3: 200
//     },
//     {
//       Category: "cat4",
//       type1: 400,
//       type2: 100,
//       type3: 200
//     }
//   ];

