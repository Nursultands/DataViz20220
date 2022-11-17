async function createForceLayout() {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

     var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
return hash;
    }, {})

     edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
      })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
     .force("charge", d3.forceManyBody().strength(-40))
     .force("center", d3.forceCenter().x(300).y(300))
     .force("link", linkForce)
     .nodes(nodes)
     .on("tick", forceTick)

   simulation.force("link").links(edges)

// change nodes
   const index = (dataset) => {
    const source_id = dataset.source.id
    const target_id = dataset.target.id
    return edges.find_index(
        (d) => d.target.id == target_id && d.source.id === source_id
    );
   };
   
   const delete_link = (dataset) => {
    const idx = index(dataset);
    edges.splice(idx, 1);
    wrapper
        .selectAll("line.link")
        .data(edges, (d) => `${d.source.id}-${d.target.id}`)
        .exit()
        .remove()
   }
   
   const create_link = async (source, target) =>{
    edges.push({
        source: nodeHash[source],
        target: nodeHash[target],
        weight : 8,
    });

    simulation.force("link").links(edges);
    wrapper
        .selectAll("line.link")
        .data(edges, (d) => `${d.source.id}-${d.target.id}`)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("opacity", 0.5)
        .on("click", (event, d) => {
            if (!event.altKey) return;
            delete_link(d);
          })
          .style("stroke-width", (d) => d.weight);
    };


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

   const wrapper = d3.select("#wrapper")
       .append("svg")
       .attr("width", dimension.width)
       .attr("height", dimension.height)


  wrapper.selectAll("line.link")
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .on("click", (event, d) => {
        console.log("event", event);
        if (!event.altKey) return;
        deleteLink(d);
      })
      .style("stroke-width", (d) => d.weight);

   var nodeEnter = wrapper.selectAll("g.node")
      .data(nodes, d => d.id)
      .enter()
      .append("g")
      .attr("class", "node");
   nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", d => roleScale(d.role))
   nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(d => d.id);

    var clear_selection = () => {
        source_node_id = null;
            nodeEnter
                .selectAll("circle")
                .attr("stroke", "#9A8B7A")
                .attr("stroke-width", "1px");
    };

    document.body.addEventListener("mousedown", (event) => {
        if (event.target.nodeName != "circle") clear_selection()
    })

    var selection_ha = async (event, dataset) => {
        const {id} = dataset;
        const isAlreadyLinked = edges.some((node)=>{
            const id_s = [node.target.id, node.source.id];
            return id_s.includes(id) && id_s.includes(source_node_id);
        });

        if (isAlreadyLinked) return;
        if (event.ctrlKey && sourceNodeId) {
            create_link(sourceNodeId, id);
            await waitForFrame();
            clear_selection();
            return;
        }
    }

    clear_selection();
    sourceNodeId = nodeEnter
        .selectAll("circle")
        .filter((dataset) => dataset.id === id)
        .attr("stroke-width", "3px")
        .attr("stroke", "lightblue")
        .datum().id;


    nodeEnter
        .append("circle")
        .style("cursor", "pointer")
        .attr("r", 5)
        .style("fill", (d) => roleScale(d.role))
        .on("click", handleSelection);
    nodeEnter
        .append("foreignObject")
        .classed("node-text", true)
        .attr("x", -25)
        .attr("y", 8)
        .append("xhtml:body")
        .append("xhtml:span")
        .attr("contenteditable", true)
        .html((d) => d.id)
        .on("click", function () {
          nodeEnter.on(".drag", null);
        })
        .on("blur", function () {
          nodeEnter.call(drag(simulation));
        });

   function forceTick() {
     d3.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
     d3.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
   }
function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;

function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
    }
}
   

}

createForceLayout()
