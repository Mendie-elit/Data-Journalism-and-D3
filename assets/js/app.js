// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // append a div to the body to create tooltips, assign it a class
  d3.select("#scatter")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//   Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("./data.csv")
  .then(function (censusData) {
    for (var i = 0; i < censusData.length; i++) {
      // console.log(data.abbr);
      console.log(censusData[i].abbr)
    }
    // if (error) return console.warn(error);

    console.log(censusData);

    // Step 4: Parse the data
    // Format the data 
    // =================================
    censusData.forEach(function (d) {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      d.healthcareLow = +d.healthcareLow;
      d.healthcareHigh = +d.healthcareHigh;
      d.obesity = +d.obesity;
      d.obesityLow = +d.obesityLow;
      d.obesityHigh = +d.obesityHigh;
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokesHigh = +d.smokesHigh;
    });



    // // Step 5: Create Scales
    // //= ============================================

    var yLinearScale = d3.scaleLinear()
      .range([height, 0]);


    var xScale = d3.scaleLinear()
      .range([0, width]);



    // // Step 6: Create Axes
    // // =============================================
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    function findMinAndMax(dataColumnX) {
      xMin = d3.min(censusData, function (d) {
        return +d[dataColumnX] * 0.8;
      });
    

      xMax = d3.max(censusData, function (d) {
        return +d[dataColumnX] * 1.1;
      });

      yMax = d3.max(censusData, function (d) {
        return +d.healthcare * 1.1;
      });

    }
    // default x-axis
    var currentAxisLabelX = "poverty";

    // Call findMinandMax() with smokes as default
    findMinAndMax(currentAxisLabelX);

    // Set the domain of an axis to extend from the min to the max value of the data column
    xScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);

    

    // // Step 7: Append the axes to the chartGroup - ADD STYLING
    // // ==============================================
    // // Add bottomAxis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "axis-text")
      .call(bottomAxis);

    // Append a group for y-axis, then display it
    chartGroup.append("g")
      .call(leftAxis);


    // Append y-axis label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - height / 1.5)
      .attr("dy", "1em")
      .attr("class", "axis-text")
      .attr("data-axis-name", "healthcare")
      .attr("font-weight", "bold")
      .text("Lacks Healthcare (%)");

    // Append x-axis labels
    chartGroup.append("text")
      .attr("transform",
        "translate(" + width / 2.5 + " ," + (height + margin.top + 40) + ")")
      .attr("data-axis-name", "poverty")
      .attr("font", "25px")
      .attr("font-weight", "bold")
      .text("In Poverty (%)");

    // // Step 8: Add circles
    // // ==============================================
    var circles = chartGroup.selectAll(".state")
      .data(censusData)
      .enter()

    circles
      .append("circle")
      .attr("class", "state")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .style("fill", "darkblue")
      .style("opacity", .5)
      .style("stroke-width", ".2");

      // Initialize tooltip
    var tooltip = d3.tip()
      .attr("class", "tooltip")
      .offset([80,-60])
      .style("background", "lightsteelblue")
      .html(function(d){
        return (`<strong>${d.state}<strong><br>In Poverty: ${d.poverty}%<br>Lack Healthcare: ${d.healthcare}%`);
    });
  // Create the tooltip in chartGroup  
    chartGroup.call(tooltip);


    // add text to circles
    circles.append("text")
    // define where the text should start should be the same as the data 
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      // the .text returns a string of the cx and cy points
      .text(d => d.abbr)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .attr("class", "circleText")
      // add event listener to display tooltip
      .on("mouseover", function(d){
        tooltip.show(d, this);
      })
      // create mouseout event listener to hide tooltip
      .on("mouseout", function(d){
        tooltip.hide(d);
      });
  

    // NEW! Step 9: Add color coded titles to the x-axis
    // // YOUR CODE HERE

    // chartGroup.append("text")
    //   // Position the text
    //   // Center the text:
    //   // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "16px")
    //   .attr("fill", "green")
    //   .text("Lacks Healthcare (%)");

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "16px")
    //   .attr("fill", "orange")
    //   .text("In Poverty (%)");

  });