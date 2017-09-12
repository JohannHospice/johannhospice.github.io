const MARGIN = 0;
(function () {
    var d3Skills = d3.select("#d3skills"),
        width = +d3Skills.style("width").split('px')[0],
        height = +d3Skills.style("height").split('px')[0];


    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(50).iterations(2).strength(2).id(function (d) {return d.id;}))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width / 2, height / 2 + MARGIN));

    window.onresize = function () {
        width = d3Skills.style("width").split('px')[0];
        height = d3Skills.style("height").split('px')[0];
        simulation.force("center", d3.forceCenter(width / 2, height / 2 + MARGIN));
    }

    //load data
    d3.json("/assets/skills.json", function (error, graph) {
        if (error) throw error;
    
        var link = d3Skills.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });


        //generate nodes
        var node = d3Skills.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        //shape
        var circles = node.append("circle")
            .attr("r", function (d) {
                return d.size * 5;
            })
            .attr("fill", function (d) {
                return color(d.group);
            })
        //label
        node.append("text")
            .text(function (d) {
                return d.id;
            })
            .attr('x', 20)
            .attr('y', ".5em");
        //tooltip
        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation.nodes(graph.nodes)
            .on("tick", function ticked() {
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
                node
                    .attr("transform", positionNode)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
            });

        simulation.force("link")
            .links(graph.links);
    });

    function positionNode(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
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

})()