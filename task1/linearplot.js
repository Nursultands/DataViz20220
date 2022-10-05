async function linearplot(){
    console.log("Hello World!")
    const data = await d3.json("my_weather_data.json");
    // console.table(data)
    const dateParser = d3.timeParse("%Y-%m-%d");

    const уAccessorMin = (d) => d.temperatureMin;
    const yAccessorMax = (d) => d.temperatureMax;
    const xAccessor = (d) => dateParser(d.date);

    let dimensions = {
        width: window.innerWidth*0.9,
        height: 600,
        margin: {
            top : 100,
            left : 100,
            right : 100,
            bottom : 100

        }
    };

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const area_linearplot = d3.select("#area_linearplot");
    const svg = area_linearplot.append("svg");
    svg.attr("width", dimensions.width);
    svg.attr("height", dimensions.height);

    const bounded = svg.append("g").style("transform",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, уAccessorMin))
        .range([dimensions.boundedHeight,0]);

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])

    const lineGenerator_min = d3.line()
        .x(d=>xScale(xAccessor(d)))
        .y(d=>yScale(уAccessorMin(d)))

    const lineGenerator_max = d3.line()
        .x(d=>xScale(xAccessor(d)))
        .y(d=>yScale(yAccessorMax(d))) 

    
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    bounded.append("path")
        .attr("d", lineGenerator_min(data))
        .attr("fill", "none")
        .attr("stroke", "blue")

    bounded.append("path")
        .attr("d", lineGenerator_max(data))
        .attr("fill", "none")
        .attr("stroke", "red")

    bounded.append("g")
        .attr("transform", "translate(0, " + dimensions.boundedHeight + ")")
        .call(xAxis)

    bounded.append("g")
        .call(yAxis)

}

linearplot()