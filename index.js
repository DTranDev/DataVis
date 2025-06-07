function init () {

    // (VARIABLES)
    // svg variables
    var svg;
    var h= 600;
    var w= 1000;
    var padding = 50;

    // obtain div id from html document
    var buttonDiv = document.getElementById("buttonDiv");

    // variable to hold formatting of x-axis labels
    // e.g. (2016-AUS)
    var xAxisLabels = function(d) {
            return d.time_period + "-" + d.country_code;
        };

    // (TOOLTIP) Create tooltip div (initially hidden)
    var tooltip = d3.select("#chartDiv")
        .append("div")
        .attr("class", "tooltipDiv")
        .style("opacity", 0);

    // Chart titles (Customise chart titles here)
    var doctorChartTitle = "Doctors Chart";
    var nurseChartTitle = "Nurses Chart";
    var mortalityChartTitle = "Avoidable Mortality Chart";

    // var to hold the currently selected chart's id
    var currentChartID;
    // var to hold a copy of the current chart's data
    var currentChartData;
    // array variables to hold sort orders of charts
    var currentSortOrder = [];
    // holds a copy of the original data order for manipulation purposes
    var unsortedChartOrder = [];
    var chartScales = [];

    // holds a collection of unique country_names for labelling chart legend
    var setOfCountryNames = new Map();
    var barColour; 
    
    // (DATASET) default dataset for testing
    var dataset = [22, 10, 2, 19, 9, 15, 18, 12, 15, 6, 21, 8];

    // 'Promise' to load multiple csv files
    Promise.all([
        // Load in doctors dataset using D3 and read six columns
        d3.csv("datasets/data_doctors.csv", function(d) {
        return {
            country_code: d.country_code,
            country_name: d.country_name,
            time_period: +d.time_period,
            unit_type: d.unit_type,
            unit_value: +d.unit_value,
            unit_of_measure: d.unit_of_measure
            };
        }),
        // Load in nurses dataset using D3 and read six columns
        d3.csv("datasets/data_nurses.csv", function(d) {
        return {
            country_code: d.country_code,
            country_name: d.country_name,
            time_period: +d.time_period,
            unit_type: d.unit_type,
            unit_value: +d.unit_value,
            unit_of_measure: d.unit_of_measure
            };
        }),
        // Load in life expectancies dataset using D3 and read six columns
        d3.csv("datasets/data_mortality.csv", function(d) {
        return {
            country_code: d.country_code,
            country_name: d.country_name,
            time_period: +d.time_period,
            unit_type: d.unit_type,
            unit_value: +d.unit_value,
            unit_of_measure: d.unit_of_measure
            };
        })
    ]).then(function(data){
        // (DATA) assign 'data' array to 'dataset' variable
        dataset = data;
        var doctorsData = dataset[0];
        var nursesData = dataset[1];
        var mortalityData = dataset[2];

        // INSERT CHART FUNCTIONS HERE!!!

        // get the country name of each dataset and set to store in map in place of their respective country_codes
        [doctorsData, nursesData, mortalityData].forEach(function(chartData) {
            chartData.forEach(function(d, i) {
                setOfCountryNames.set(d.country_name);
            });
        });

        // basic d3 native scheme colour scale
        barColour = d3.scaleOrdinal()
        .domain(Array.from(setOfCountryNames))
        .range(d3.schemeCategory10);

        // log in console to check if it works
        console.log(doctorsData);
        // draw chart for doctors
        drawChart(doctorsData, "Doctors", doctorChartTitle);

        // (NURSES) CHART
        // log in console to check if it works
        console.log(nursesData);
        // draw chart for nurses
        drawChart(nursesData, "Nurses", nurseChartTitle);

        // (LIFE EXPECTANCY) CHART
        // log in console to check if it works
        console.log(mortalityData);
        // draw chart for life expectancy
        drawChart(mortalityData, "Avoidable-Mortality", mortalityChartTitle);

        // print data to the console for each file to check if data is loaded properly
        console.table(dataset[0], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
        console.table(dataset[1], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
        console.table(dataset[2], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);

        // show doctor chart by default
        showChart("Doctors", doctorsData);

    });

    // (DRAW CHART)
    // function to generate a bar chart for an single dataset, takes three parameters.
    // e.g. drawChart(doctors, "Doctors", "doctors.csv")
    function drawChart(dataset, chartID, chartTitle) {

        var xScale;
        var yScale;

        // (SCALES)
        // (X) scale qualitative x axis using data set length (.domain) and a rounded range (.rangeRound)
        xScale = d3.scaleBand()
            .domain(dataset.map(xAxisLabels))
            .rangeRound([padding, w])
            .paddingInner(0.05);

        // (Y) scale quantitative y axis data set (.domain) to a specific range (.range)
        yScale = d3.scaleLinear()
            // domain range starts from 0 to largest value in dataset
            .domain([0, d3.max(dataset.map(function(d) {
                return d.unit_value;
            }))])
            .range([h - padding, padding]);

        // create an associative array and store current x,y scales in chartScales
        chartScales[chartID] = {
            xScale: xScale,
            yScale: yScale
        };

        // (SVG CANVAS) 
        // svgDiv var holding selection of #chart-location with an added div
        var svgDiv = d3.select("#chart-location")
            .append("div")
            .attr("class", "svg-div");

        // Adds a h3 title inside each individual svgDiv, passed in when calling the function
        svgDiv.append("h2").text(chartTitle);

        // Add an svg canvas (chart) inside svgDiv, assigning attributes w and h
        svg= svgDiv
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        
        // assign id to finished chart, uses argument passed in when calling drawChart()
        svgDiv.attr("id", chartID)
            // hide all charts by default
            .style("display", "none");

        // (AXES)
        // (X-AXIS)
        var xAxis = d3.axisBottom()
            // use same xScaling as chart
            .scale(xScale);
            // reference 'g' element for adding axis
        svg.append("g")
            // class id 'axis' for styling
            .attr("class", "x-axis") 
            // moves axis to bottom of chart using transform, translate(x, y)
            .attr("transform", "translate(0, "+ (h - padding) +")")
            .call(xAxis)
            // style and rotate labels
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-55)")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");
            
        // (Y-AXIS)
        var yAxis = d3.axisLeft()
            // use same yScaling as chart
            .scale(yScale);
        svg.append("g")
            .attr("class", "y-axis")
            // moves axis to left of chart using transform, translate(x, y)
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        // (RECTANGLE) select and add rect shape elements to placeholders created from dataset values
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")

            // (RECTANGLE ATTRIBUTES)
            // (X) spread out rect shapes on x axis
            .attr("x", function(d, i) {
                return  xScale(xAxisLabels(d));
            })
            // (Y) make bottom of bars the same height
            .attr("y", function(d, i) {
                return yScale(d.unit_value);
            })
            // (WIDTH) calculate width of bars using bandwidth()
            .attr("width", xScale.bandwidth())
            // (HEIGHT) anonymous function to assign bar heights, padding is included due to displaying axis
            .attr("height", function(d, i) {
                return h - padding - yScale(d.unit_value);
            })
            .attr("fill", function (d, i) {
                return barColour(d.country_code);
            })

            // mouseover effects 
            .on("mouseover", function(event, d) {
                d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("fill-opacity", 1.0)

                d3.select(".tooltipDiv")
                // unhide tooltip
                .style("opacity", 0.8)

                // formatting for tooltip
                tooltip.html(
                    "<p><strong>Country:</strong> " + d.country_name + "<br/>"+
                    "<strong>Code:</strong> " + d.country_code + "<br/>"+
                    "<strong>Year:</strong> " + d.time_period + "<br/>"+
                    "<strong>Value:</strong> " + d.unit_value + " " + d.unit_of_measure + "<br/>"+
                    "<strong>Type:</strong> " + d.unit_type + "</p>"
                )

                // position tooltip relative to the mouse
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 90) + "px");
            })

            // on mousemove, 
            .on("mousemove", function(event, d) {
                d3.select(".tooltipDiv")
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 90) + "px");
            })

            // on mouseout,
            .on("mouseout", function(event, d) {
                d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 0)

                d3.select(".tooltipDiv")
                .style("opacity", 0);
            })

        // saves a copy of the original data order for restoration purposes
        unsortedChartOrder[chartID] = dataset.map(function(d) {
            return {
            country_code: d.country_code,
            country_name: d.country_name,
            time_period: +d.time_period,
            unit_type: d.unit_type,
            unit_value: +d.unit_value,
            unit_of_measure: d.unit_of_measure
            };
        });

        // call to add a button, (runs for each chart to create three buttons)
        addChartButton(chartID, dataset);

        // create the legend once when loading first default chart
        if (chartID == "Doctors") { 

            // obtain legend div
            var legendDiv = d3.select("#legendDiv");
            // clear existing legends
            legendDiv.select("#legendDiv").remove();

            // add a div for legend
            var chartLegend = legendDiv
                .append("div")
                .attr("id", "chartLegend")

            // assign values for legend labels
            var legendLabels = Array.from(setOfCountryNames);

            // add a legend into the div
            chartLegend.selectAll(".legendLabel")
                .data(legendLabels)
                .enter()
                .append("div")
                .attr("class", "legendLabel")
                .each(function(d) {
                    // format a square colour box for each label
                    var item = d3.select(this);
                    item.append("span")
                        .style("background-color", barColour(d))
                        .style("display", "inline-block")
                        .style("width", "15px")
                        .style("height", "15px")
                        .style("margin-right", "7px");
                    // add the text for the label
                    item.append("span").text(d);
                });
        }
    }

    // (BUTTONS)
    // (CHART BUTTON) adds a chart button to 'buttonDiv'
    function addChartButton(chartID, chartData) {
        var chartButton = document.createElement("button")
        chartButton.classList.add("chart-button");
        // (LABEL) button label uses 'chartID' passed when calling the drawChart() function, replacing "-" with spaces because chartID is also assigned to svgDiv id
        chartButton.innerHTML = chartID.replace("-", " ")
        buttonDiv.appendChild(chartButton)
        // (LISTENER) on click
        d3.select(chartButton)
        .on("click",function() {
            showChart(chartID, chartData);
            }
        );
    }

    // (SHOW CHART) hides all svg charts and displays one
    function showChart(chartID, chartData) {
        // hide all charts
        d3.selectAll(".svg-div")
        .style("display", "none");
        // show this specific chart
        d3.select ("#" + chartID)
        .style("display", "block");

        // assign the active chart's id to the current chart variable
        currentChartID = chartID;
        currentChartData = chartData;
    }

    // (SORT BUTTON) adds a sort button to 'buttonDiv'
    var sortButton = document.createElement("button")
    sortButton.id = ("sortButton");
    // (LABEL) button label
    sortButton.innerHTML = ("Sort")
    buttonDiv.appendChild(sortButton)
    // (LISTENER) on click, sort bars
    d3.select("#sortButton")
    // change sortOrder boolean and call sortBars()
    .on("click",function() {
        // pass in data from the current chart to be copied and sorted
        sortBars(currentChartData);
        }
    );

    // (RESET BUTTON) adds a reset button to 'buttonDiv'
    var resetButton = document.createElement("button")
    resetButton.id = ("resetButton");
    // (LABEL) button label
    resetButton.innerHTML = ("Reset")
    buttonDiv.appendChild(resetButton)
    // (LISTENER) on click, sort bars
    d3.select("#resetButton")
    // change sortOrder boolean and call sortBars()
    .on("click",function() {

        // load orignal order of current chart
        var initialData = unsortedChartOrder[currentChartID];
        // pass in original data from the current chart to be copied and sorted
        sortBars(initialData, true);
        }
    );

    // (SORT FUNCTION) sort bars in a specific order (ascending/descending) with optional reset parameter
    function sortBars(chartData, reset = false) {
        // select the svg with the current active chart
        activeSVG = d3.select("#" + currentChartID).select("svg");

        if (!reset) {
            // toggle/change the sort order for the current chart
            currentSortOrder[currentChartID] = !currentSortOrder[currentChartID];
            // create a variable from the toggled sort order of the current chart
            newSortOrder = currentSortOrder[currentChartID];
        }

        // create a variable/copy from the current chart data for sorting
        currentDataset = chartData.map(function(d) {
            return {
                country_code: d.country_code,
                country_name: d.country_name,
                time_period: d.time_period,
                unit_type: d.unit_type,
                unit_value: d.unit_value,
                unit_of_measure: d.unit_of_measure
            };
        });

        if (!reset) {
            // sort the copied data
            currentDataset.sort(function(a, b) {
                // change sort order based on the new toggled sort order
                if (newSortOrder) {
                    return (d3.ascending(a.unit_value, b.unit_value));
                } else {
                    return (d3.descending(a.unit_value, b.unit_value));
                }
            })
        }
        
        // update the xScale with new sorted data values
        var sortedXScale = currentDataset.map(xAxisLabels)

        var xScale = chartScales[currentChartID].xScale;
        var yScale = chartScales[currentChartID].yScale;

        xScale.domain(sortedXScale);

        // select, re-beind data, assign transition effects and update 'x' for all rects within the current svg
        activeSVG.selectAll("rect")
        // rebind the data
        .data(currentDataset, xAxisLabels)
        // smooth transition
        .transition()
        .delay(function(d, i){
            return i * 25;
        })
        .duration(250)
        // update x location
        .attr("x", function(d, i) {
        return xScale(xAxisLabels(d));
        });

        // select the x-axis within the current svg
        activeSVG.select(".x-axis")
        // transition animations/smoothing
        .transition()
        .duration(250)
        // update x-axis by calling it again (after re- assigning xScale)
        .call(d3.axisBottom(xScale));

        currentChartData = currentDataset;
    }

}

window.onload = init;