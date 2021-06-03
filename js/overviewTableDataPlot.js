// append the svg object to the body of the page

// Read data
d3.csv("/EPFLDataViz/data/strava/activities_with_gpx.csv").then(function (data) {
  // data = data.splice(0, 10)
  // console.log("data is: ", data);

  // and to add the text labels
  var table = d3
    .select("#overviewDataTable")
    .select("tbody")
    // .append('div')
    // .text("bou")

  var rows = table
    .selectAll('div')
    .data(data)
    .enter()
    .append('tr')
    // .append('th')
    .html(elem => {
      // console.log("elem: ", elem)
      return `<th>${elem['Activity ID']}</th>
              <th>${elem['Activity Name']}</th>
              <th>${elem['Activity Date']}</th>
              <th>${elem['Activity Type']}</th>
              <th>${elem['Average Heart Rate']}</th>
              <th>${elem['Calories']}</th>
              <th>${elem['Distance']}</th>
              <th>${elem['Elapsed Time']}</th>
              <th> <a href="/EPFLDataViz/one_activity_map.html?activity_id=${elem['Activity ID']}"><button class="btn btn-light"> View </button> </a> </th>
            `
    })
  
});
