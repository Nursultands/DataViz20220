async function build_matrix() {
    console.log("Hello World")
    const nodes = await d3.csv("data_nodes.csv")
    const edges = await d3.csv("data_edges.csv")
    // console.table(nodes)
    // console.table(edges)
    
    function adjacencyMatrix(nodes, edges) {
        var matrix = [];
        var edgesHash = {};
        edges.forEach(edge => {
            var company = edge.company+"-"+edge.projects;
            edgesHash[company] = edge;
        })
        for(let i=0; i<nodes.length; i++){
            for (let j=0; j<nodes.length; j++){
                var uel = nodes[i]
                var bel = nodes[j]
                var grid = {
                    company: uel.company+"-"+bel.company,
                    x:j,
                    y:i,
                    weights:0
                }
                if  (edgesHash[grid.company]){
                    grid.weights = parseInt(edgesHash[grid.company].weights);
                }
                matrix.push(grid);

            }
        }

        return matrix
    } 
    var dimension = {
        width: window.innerWidth*0.9,
        height: window.innerWidth*0.9,
        margin : {
            top : 260,
            left : 250,
            right : 250,
            bottom : 300,
        }
    }   

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height",dimension.height)

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    var data = adjacencyMatrix(nodes, edges)
    console.table(data);
   
    const pole = bounds
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "grid")
    .attr("width", 12.5) 
    .attr("height", 12.5)
    .attr("x", d=>d.x*12.5)
    .attr("y", d=>d.y*12.5)
    .style("fill-opacity", d=>d.weights*0.6) 

    const namesX = wrapper
        .append("g")
        .attr("transform", "translate(253,250)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y", (d, i) => i*12.5+6.25)
        .text(d=>d.country_projects)
        .attr("transform", "rotate(270)")
        .style("text-anchor", "up")



    const namesY = wrapper
        .append("g")
        .attr("transform", "translate(240, 263)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y", (d, i)=>i*12.5+6.25)
        .text(d=>d.company)
        .style("text-anchor", "end")

}

build_matrix();