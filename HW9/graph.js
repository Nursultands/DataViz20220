var nodes_list = []
var edges_list = []

async function bootstraping(){
    var nodes = await d3.csv("nodelist.csv");
    var edges = await d3.csv("edgelist.csv");
    
    var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
        return hash;
    }, {})
    
    edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
    })

    nodes_list = nodes
    edges_list = edges

    createForceLayout(nodes_list, edges_list)
}

bootstraping()

async function createForceLayout(nodes_list, edges_list) {
    console.log("working creating force layout")
    var nodes = nodes_list
    var edges = edges_list

    var roleScale = d3.scaleOrdinal()
        .domain(["contractor", "employee", "manager"])
        .range(["#75739F", "#41A368", "#FE9922"]);

    
    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 50,
            right: 10,
            bottom: 10,
            left: 55
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    
  
    var width = window.innerWidth*0.8
    var height = window.innerWidth*0.8

    margin= {
        top: 50,
        right: 10,
        bottom: 10,
        left: 55
    }

    const svg = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink() 
        .id(d => d.id)
    ) 
    .force("charge", d3.forceManyBody().strength(-40)) 
    .force("center", d3.forceCenter(width/2, height/2)); 

     // creating the links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .style("stroke", "#9A8B7A")
        .style("opacity", .5)
        .style("stroke-width", d => d.weight);

    // creating the nodes
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", d => roleScale(d.role))
        .call(d3.drag()  
            .on("start", dragstarted) 
            .on("drag", dragged)      
            .on("end", dragended)     
        );

    // Text to nodes
    const text = svg.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.id)


    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(edges);


    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text.attr("x", d => d.x - 5) 
            .attr("y", d => d.y + 5); 
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fy = d.y; 
        d.fx = d.x;
    }


    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }


    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}


function add(){


    let toNode = $("#toNode").val()
    let newNode = $("#newNode").val()

    var map = d3.map(nodes_list, function(d) { return d.id; });
    let found = map.get(toNode)
    console.log(found);   

    let nodeExist = map.has(toNode)
    let nodeAlreadyExist = map.has(newNode)

    if (nodeAlreadyExist){
        alert("This new node already exists!!!")
        return
    }

    if (nodeExist){
        nodes_list.push({
            id: newNode,
            role: 'test',
            salary: '2000'
        });
    
        edges_list.push(
            {
                source: toNode,
                target: newNode,
                weight: 5
            }
        )

        d3.select("svg").remove();

        createForceLayout(nodes_list, edges_list)
    
    }else{
        alert("This node doesn't exist")
    }
}


function change(){


    console.log("NODE: ", nodes_list)

    let old_node = $("#oldNodeName").val()
    let new_node = $("#new_name_of_node").val()

    var map = d3.map(nodes_list, function(d) { return d.id; });

    let nodeAlreadyExist = map.has(new_node)
    let nodeExist = map.has(old_node)
    

    if (nodeAlreadyExist){
        alert("This new name of node already exists!!!")
        return
    }

    if (!nodeExist) {
        alert("This old name of node doesn't exists!!!")
        return
    }

    console.log(nodes_list)

    for (let i = 0; i < nodes_list.length; i++) {
        console.log(nodes_list[i].id)

        if (nodes_list[i].id == old_node){
            console.log(old_node)
            console.log("found!!!!", i)
            nodes_list[i].id = new_node
        }
    }

    console.log(nodes_list)

    d3.select("svg").remove();
    createForceLayout(nodes_list, edges_list)
}