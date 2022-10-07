async function bar_chart(tempAccessor){
    const tempLowAccessor = (d) => d.temperatureLow;
    const tempHighAccessor = (d) => d.temperatureHigh;
    const tempMinAccessor = (d) => d.temperatureMin;
    const tempMaxAccessor = (d) => d.temperatureMin;
    var wrapper;

    if (typeof wrapper !== 'undefined') wrapper.remove();
    var xAccessor;
    if (tempAccessor == "LOW") {
        xAccessor = tempLowAccessor
    }   
    else if (tempAccessor == "HIGH") {
        xAccessor = tempHighAccessor
    } 
    else if (tempAccessor == "MIN"){
        xAccessor = tempMinAccessor
    }
    else if (tempAccessor == "MAX"){
        xAccessor = tempMaxAccessor
    }
    console.log("I ma coming")

    const data = await d3.json("./my_weather_data.json")
    // console.table(data)
    const yAccessor = d => d.length;

    const width = 700
    let dimension = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,

        },
    }
    dimension.boundedWidth = dimension.width - dimension.margin.right - dimension.margin.left
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.height

    // Drawing canvas

    wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounds = wrapper.append("g")
        .style("translate", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = binsGen(data);
    console.log(bins);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimension.boundedHeight, 0])
        .nice()

    const BinGroup = bounds.append("g");
    const BinGroups = BinGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");

    const barPadding = 8
    const barRect = BinGroup.append("rect")
        .attr("x", d => xScaler(d.x0)+ barPadding / 2)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimension.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const mean = d3.max(bins, yAccessor) / 2;
    console.log(mean);

    const meanLine = bounds.append("Line")
        .attr("x1", 0)
        .attr("x2", dimension.boundedWidth)
        .attr("y1", yScaler(mean))
        .attr("y2", yScaler(mean))
        .attr("stroke", "red")
        .attr("stroke-dasharray", "2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x", 40)
        .attr("y", yScaler(mean) - 10)
        .text("Mean " + mean.toString())
        .attr("fill", "maroon")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const xAxisGen = d3.axisBottom(xScaler)
        .ticks(0);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .style("transform", `translateY(${dimension.boundedHeight}px)`)

    const xAxisLabel = bounds.append("text")
        .attr("x", dimensions.boundedWidth)
        .attr("y", yScaler(0) + 35)
        .text("Temperature")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const yAxisGen = d3.axisLeft(yScaler)
        .ticks(0);
    
    const yAxis = bounds.append("g")
        .call(yAxisGen)

    const yAxisLabel = bounds.append("text")
        .attr("x", 25)
        .attr("y", 30)
        .text("Count")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)) / 2)
        .attr("y", d => yScaler(-3))
        .text(yAccessor)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");



    
    return wrapper
    



}
bar_chart("HIGH")