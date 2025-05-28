function init () {

    // (VARIABLES)
    // svg variables
    var h= 600;
    var w= 1000;
    var padding = 50;

    var xScale;
    var yScale;
    var svg;

    // var to hold sortOrder boolean
    var sortOrder = false;
    
    // (DATASET) default dataset
    var dataset = [22, 10, 2, 19, 9, 15, 18, 12, 15, 6, 21, 8];

    // use 'Promise' to load multiple csv files
    Promise.all([
        // Load in doctors dataset using D3 and read six columns
        d3.csv("datasets/data_doctors_new_V3.csv", function(d) {
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
        d3.csv("datasets/data_nurses_new_V3.csv", function(d) {
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
        d3.csv("datasets/data_life_expectancies_new_V3.csv", function(d) {
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
        // dataset[0]= doctors.csv | dataset[1]= nurses.csv | dataset[2]= life_expectancies.csv
        dataset = data;

        // INSERT CHART FUNCTIONS HERE!!!

        // (DOCTORS) CHART
        // the anonymous function accesses a specific column from a single data file specified by [0], [1], [2], 
        // .map returns the anonymous function's result as a new array before assigning it to a variable
        var doctorValues = dataset[0].map(function(d) {
            return d.unit_value;
        });
        // log in console to check if it works
        console.log(doctorValues);
        // draw chart for doctors
        drawChart(doctorValues, "Doctors Chart", "Doctors");

        // (NURSES) CHART
        var nurseValues = dataset[1].map(function(d) {
            return d.unit_value;
        });
        // log in console to check if it works
        console.log(nurseValues);
        // draw chart for nurses
        drawChart(nurseValues, "Nurses Chart", "Nurses");

        // (LIFE EXPECTANCY) CHART
        var leValues = dataset[2].map(function(d) {
            return d.unit_value;
        });
        // log in console to check if it works
        console.log(leValues);
        // draw chart for life expectancy
        drawChart(leValues, "Life Expectancy Chart", "Life Expectancy");

        // print data to the console for each file to check if data is loaded properly
        console.table(dataset[0], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
        console.table(dataset[1], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
        console.table(dataset[2], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);

    });

    // function to generate a bar chart for an single dataset, takes two parameters . e.g. an array of numerical values and a title string 
    function drawChart(dataset, title, buttonLabel) {
        // (SCALES)
        // (X) scale qualitative x axis using data set length (.domain) and a rounded range (.rangeRound)
        xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .rangeRound([padding, w])
            .paddingInner(0.05);

        // (Y) scale quantitative y axis data set (.domain) to a specific range (.range)
        yScale = d3.scaleLinear()
            // domain range starts from 0 to largest value in dataset
            .domain([0, d3.max(dataset)])
            .range([h - padding, padding]);

        // (SVG CANVAS) 
        // svgDiv var holding selection of #chart-location with an added div
        var svgDiv = d3.select("#chart-location")
        .append("div")
        .attr("class", "svg-div");

        // Adds a h3 title inside each individual svgDiv, passed in when calling the function
        svgDiv.append("h2").text(title);

        // Add an svg canvas inside a new svgDiv, assigning attributes w and h
        svg= svgDiv
        .append("svg")
        .attr("width", w)
        .attr("height", h);

        // (AXES)
        // (X-AXIS)
        var xAxis = d3.axisBottom()
        // use same xScaling as chart
        .scale(xScale);
        // reference 'g' element for adding axis
        svg.append("g")
        // class id 'axis' for styling
        .attr("class", "x axis") 
        // moves axis to bottom of chart using transform, translate(x, y)
        .attr("transform", "translate(0, "+ (h - padding) +")")
        .call(xAxis);

        // (Y-AXIS)
        var yAxis = d3.axisLeft()
        // use same yScaling as chart
        .scale(yScale);
        svg.append("g")
        .attr("class", "y axis")
        // moves axis to left of chart using transform, translate(x, y)
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

        // (RECTANGLE) select and add rect shape elements to placeholders created from dataset values
        svg.selectAll("rect")
        .data (dataset)
        .enter()
        .append ("rect")

        // (RECTANGLE ATTRIBUTES)
        // (X) spread out rect shapes on x axis
        .attr("x", function(d, i) {
            return  xScale(i);
        })
        // (Y) make bottom of bars the same height
        .attr("y", function(d, i) {
            return yScale(d);
        })
        // (WIDTH) calculate width of bars using bandwidth()
        .attr("width", xScale.bandwidth())
        // (HEIGHT) anonymous function to assign bar heights, padding is included due to displaying axis
        .attr("height", function(d, i) {
            return h - padding - yScale(d);
        })

        // create a button for each chart
        dataset.forEach(function(buttonLabel) {
            // (CHART BUTTON) adds a chart button to 'buttonDiv'
            var chartButton = document.createElement("button")
            chartButton.class = ("chart-button");
            // (TEXT) button text
            chartButton.innerHTML = buttonLabel
            buttonDiv.appendChild(chartButton)
            // (LISTENER) on click
            d3.select (".chart-button")
            .on("click",function() {
                // insert action here
                }
            )
        });

    }

    // (BUTTONS)
    // (SORT BUTTON) adds a sort button to 'buttonDiv'
    var sortButton = document.createElement("button")
    sortButton.id = ("sortButton");
    // (TEXT) button text
    sortButton.innerHTML = ("Sort")
    buttonDiv.appendChild(sortButton)
    // (LISTENER) on click, sort bars
    d3.select ("#sortButton")
    // change sortOrder boolean and call sortBars()
    .on("click",function() {
        sortOrder = !sortOrder;
        sortBars(sortOrder);
        }
    );

    // function to sort bars in a specific order (ascending/descending), takes boolean parameter (sortOrder)
    function sortBars(sortOrder) {
        svg.selectAll("rect")
        // sort bars
        .sort(function(a, b) {
            // change sort order based on boolean
            if (sortOrder) {
                return (d3.ascending(a, b));
            } else {
                return (d3.descending(a, b));
            }
        })

        // smooth transition
        .transition()
        .delay(function(d, i){
            return i * 55;
        })
        .duration(500)
        .attr("x", function(d, i) {
        return xScale(i);
        });
    }

}

window.onload = init;