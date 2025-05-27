function init () {

    // (VARIABLES)
    // svg variables
    var h= 300;
    var w= 500;
    var padding = 30;

    // var to hold sortOrder boolean
    var sortOrder = false;
    
    
    // (DATASET) default dataset (IMPORT CSV HERE)
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
        // assign data array to dataset variable
        // data[0]= doctors.csv | data[1]= nurses.csv | data[2]= life_expectancies.csv
        dataset = data;

    // need to move chart functions here

    // print data to the console for each file to check if data is loaded properly
    console.table(dataset[0], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
    console.table(dataset[1], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
    console.table(dataset[2], ["country_code", "country_name", "time_period", "unit_type", "unit_value", "unit_of_measure"]);
    });

    // (SCALES)
    // (X) scale qualitative x axis using data set length (.domain) and a rounded range (.rangeRound)
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([padding, w])
        .paddingInner(0.05);

    // (Y) scale quantitative y axis data set (.domain) to a specific range (.range)
    var yScale = d3.scaleLinear()
        // domain range starts from 0 to largest value in dataset
        .domain([0, d3.max(dataset)])
        .range([h - padding, padding]);

    // (SVG CANVAS) select #chart-location and add the svg canvas, assigning attributes w and h
    var svg= d3.select ("#chart-location")
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

    // (BUTTONS)
    // (SORT BUTTON) 
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

    // function to sort bars in a specific order, takes boolean parameter (sortOrder)
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