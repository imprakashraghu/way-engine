"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("core");
console.log("=== Starting Basic Graph Example ===");
// --------------------------------------------------
// 1. CREATE EMPTY GRAPH
// --------------------------------------------------
let graph = (0, core_1.createGraph)();
console.log("\nInitial graph:");
console.log(graph);
// --------------------------------------------------
// 2. ADD TWO NODES
// --------------------------------------------------
graph = (0, core_1.addNode)(graph, {
    id: "n1",
    position: { x: 100, y: 150 },
    ports: []
});
graph = (0, core_1.addNode)(graph, {
    id: "n2",
    position: { x: 300, y: 150 },
    ports: []
});
console.log("\nAfter adding nodes:");
console.log(graph.nodes);
// --------------------------------------------------
// 3. UPDATE A NODE
// --------------------------------------------------
graph = (0, core_1.updateNode)(graph, "n1", {
    position: { x: 150, y: 200 }
});
console.log("\nAfter updating node n1:");
console.log(graph.nodes);
// --------------------------------------------------
// 4. ADD PORTS
// --------------------------------------------------
graph = (0, core_1.addPort)(graph, {
    id: "p1",
    nodeId: "n1",
    type: "output"
});
graph = (0, core_1.addPort)(graph, {
    id: "p2",
    nodeId: "n2",
    type: "input"
});
console.log("\nAfter adding ports:");
console.log(graph.ports);
// --------------------------------------------------
// 5. ADD EDGE
// --------------------------------------------------
graph = (0, core_1.addEdge)(graph, {
    id: "e1",
    sourcePortId: "p1",
    targetPortId: "p2"
});
console.log("\nAfter adding edge e1:");
console.log(graph.edges);
// --------------------------------------------------
// 6. UPDATE EDGE
// --------------------------------------------------
graph = (0, core_1.updateEdge)(graph, "e1", {
    data: { label: "connected" }
});
console.log("\nAfter updating edge e1:");
console.log(graph.edges);
// --------------------------------------------------
// 7. REMOVE PORT
// --------------------------------------------------
graph = (0, core_1.removePort)(graph, "p1");
console.log("\nAfter removing port p1 (edges referencing it are removed too):");
console.log(graph.ports);
console.log(graph.edges);
// --------------------------------------------------
// 8. REMOVE NODE
// --------------------------------------------------
graph = (0, core_1.removeNode)(graph, "n1");
console.log("\nAfter removing node n1:");
console.log(graph.nodes);
console.log(graph.ports);
console.log(graph.edges);
// --------------------------------------------------
// END
// --------------------------------------------------
console.log("\n=== Example finished successfully ===");
