async function bar_chart(tempAccessor){
    const data = await d3.json("my_weather_data.json")
    const yAccessor = (d) => d.lenght;

    let dimensions = {
        width: 600,
        height: 600 * 0.6,
        margin: {
            top : 50,
            bottom: 50,
            left: 30,
            right:50,
        },
        
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const wrapper = d3.select("#wrapper")
        .html("")  // clear div before drawing
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g").style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);
    
    const xScaler = d3.scaleLinear()
        .domain([d3.extent(data, tempAccessor)])
        .range([75, dimensions.boundedWidth])
        console.log("good")

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(tempAccessor)
        .thresholds(8);

    const bins = binsGen(data);
    console.log(bins)

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHight, 20])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g")

    const barPadding = 1
    const shift = 50
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding/2 + shift) //added shifting
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");





    

    



}
bar_chart()