// GraphManager responsibilities:
//
// Node operations:
// - addNode(node)
// - updateNode(id, patch)
// - removeNode(id)
//
// Port operations:
// - addPort(port)
// - updatePort(id, patch)
// - removePort(id)
//
// Edge operations:
// - addEdge(edge)
// - updateEdge(id, patch)
// - removeEdge(id)
// - rewireEdge(id, newSourcePortId or newTargetPortId)
//
// Derived references:
// - resolve sourceNodeId/targetNodeId from port.nodeId
//
// Graph integrity checks:
// - ensure nodes exist before adding ports
// - ensure ports exist before adding edges
// - ensure no circular references (optional)
// - ensure no orphan ports after removing nodes
// - ensure no orphan edges after removing ports

import { Graph } from "./GraphTypes";
import { Node } from "../node/NodeTypes";
import { updateNode as updateNodeOnly } from "../node/NodeManager";

/**
 * Creates an inital graph (empty one)
 * @param initial Record<string, any>
 * @returns Graph
 */
export function createGraph(initial?: {
    metadata?: Record<string, any>;
    version?: string;
}) : Graph {

    return {
        nodes: {},
        ports: {},
        edges: {},
        metadata: initial?.metadata || {},
        version: initial?.version ?? "1.0.0"
    };
}

/**
 * Adds a node to a initliazed graph
 * @param graph Graph
 * @param nodeInput Node
 * @returns Graph
 */
export function addNode(graph: Graph, nodeInput: Node) : Graph {
    if (graph.nodes[nodeInput.id]) {
        throw new Error(`addNode: A node with id=${nodeInput.id} already exists.`);
    }

    return {
        ...graph,
        nodes: {
            ...graph.nodes,
            [nodeInput.id]: nodeInput,
        },
    };
}

/**
 * Updates a node by ID inside a graph
 * @param graph Graph
 * @param nodeId string
 * @param patch Node
 * @returns Graph
 */
export function updateNode(graph: Graph, nodeId: string, patch: Partial<Node>): Graph {
  const existing = graph.nodes[nodeId];
  if (!existing) {
    throw new Error(`updateNode: Node with id=${nodeId} does not exist.`);
  }

  const updated = updateNodeOnly(existing, patch);

  return {
    ...graph,
    nodes: {
      ...graph.nodes,
      [nodeId]: updated,
    },
  };
}

/**
 * Updates graph by removing a node by ID
 * @param graph Graph
 * @param nodeId string
 * @returns Graph
 */
export function removeNode(graph: Graph, nodeId: string): Graph {
  const existing = graph.nodes[nodeId];
  if (!existing) {
    throw new Error(`removeNode: Node with id=${nodeId} does not exist.`);
  }

  const newGraph = { ...graph };

  // 1. Remove all ports belonging to this node
  for (const portId in newGraph.ports) {
    const port = newGraph.ports[portId];
    if (port.nodeId === nodeId) {
      delete newGraph.ports[portId];

      // Also remove any edges connected to this port
      for (const edgeId in newGraph.edges) {
        const edge = newGraph.edges[edgeId];
        if (edge.sourcePortId === portId || edge.targetPortId === portId) {
          delete newGraph.edges[edgeId];
        }
      }
    }
  }

  // 2. Remove the node itself
  delete newGraph.nodes[nodeId];

  return newGraph;
}