
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.timeParse("%b-%Y");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the line
    var priceline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });



    // Adds the svg canvas
    var svg = d3.select("body")
    .append("svg")
    .style("background-color","#ffffff")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // gridlines in x axis function
    function make_x_gridlines() {
    return d3.axisBottom(x)
    .ticks(24)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
    return d3.axisLeft(y)
    .ticks(5)
    }


    // Get the data
    d3.csv("data.csv", function(error, data) {
    data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
    .key(function(d) {return d.symbol;})
    .entries(data);

    // set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {

    svg.append("path")
        .attr("class", "line")
        .style("stroke", function() { // Add the colours dynamically
            return d.color = color(d.key); })
        .attr("id", 'tag'+d.key.replace(/\s+/g, ''))
        .attr("d", priceline(d.values))
        .style("opacity", 0);

    // Add the Legend
    svg.append("text")
        .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
        .attr("y", height + (margin.bottom/2)+ 31)
        // .attr("y", height + (margin.bottom/2)+ 10)
        .attr("class", "legend")    // style the legend
        .style("fill", function() { // Add the colours dynamically
            return d.color = color(d.key); })
        .on("click", function(){
            // Determine if current line is visible
            var active   = d.active ? false : true,
            newOpacity = active ? 1 : 0;
            // Hide or show the elements based on the ID
            d3.select("#tag"+d.key.replace(/\s+/g, ''))
                .transition().duration(100)
                .style("opacity", newOpacity);
            // Update whether or not the elements are active
            d.active = active;

             var active1 =d.active1 ? false: true,
             newClass = active1? "legend1" : "legend";

             d3.select(this).attr("class", newClass);
             d.active1 = active1;
            })

        .text(d.key);

    });

    svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    )

    // add the Y gridlines
    svg.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    )

    // Add the X Axis
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
           .ticks(24)
           .tickFormat(d3.timeFormat("%b-%y"))
    )
    .selectAll("text")
    .attr("transform", "rotate(41)")
    .style("text-anchor", "start");

    // text label for the x axis
    svg.append("text")
    .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height + margin.top + 17) + ")")
    .style("text-anchor", "end")
    .attr("class", "axislabel")
    .text("Month - Year");

    // Add the Y Axis
    svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("class", "axislabel")
    .text("Number of Citations");

    });
