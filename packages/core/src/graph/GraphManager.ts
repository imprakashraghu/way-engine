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
import { Port } from "../port/PortTypes";
import { updatePort as updatePortOnly } from "../port/PortManager";
import { Edge } from "../edge/EdgeTypes";
import { updateEdge as updateEdgeOnly } from "../edge/EdgeManager";
import { rewireEdge as rewireEdgeOnly } from "../edge/EdgeManager";
import { EventEmitter } from "../event/EventEmitter";
import { GraphEvent } from "../event/EventTypes";

export const graphEvents = new EventEmitter();

function emit(event: GraphEvent) {
  graphEvents.emit(event);
  graphEvents.emit({ type: "graph:changed" });
}

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

    emit({ type: "node:added", nodeId: nodeInput.id });
    
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

  emit({ type: "node:updated", nodeId });

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

  emit({ type: "node:removed", nodeId });

  return newGraph;
}

/**
 * Adds a port to a graph
 * @param graph Graph
 * @param portInput Port
 * @returns Graph
 */
export function addPort(graph: Graph, portInput: Port): Graph {
  // Node must exist
  if (!graph.nodes[portInput.nodeId]) {
    throw new Error(
      `addPort: Cannot add port. Node with id=${portInput.nodeId} does not exist.`
    );
  }

  // Port ID must be unique
  if (graph.ports[portInput.id]) {
    throw new Error(
      `addPort: Port with id=${portInput.id} already exists.`
    );
  }

  emit({ type: "port:added", portId: portInput.id, nodeId: portInput.nodeId });

  // Add the port
  return {
    ...graph,
    ports: {
      ...graph.ports,
      [portInput.id]: portInput,
    },
  };
}

/**
 * Updates port in a graph
 * @param graph Graph
 * @param portId string
 * @param patch Port
 * @returns 
 */
export function updatePort(
  graph: Graph,
  portId: string,
  patch: Partial<Port>
): Graph {
  const existing = graph.ports[portId];
  if (!existing) {
    throw new Error(`updatePort: Port with id=${portId} does not exist.`);
  }

  const updated = updatePortOnly(existing, patch);

  emit({ type: "port:updated", portId });

  return {
    ...graph,
    ports: {
      ...graph.ports,
      [portId]: updated,
    },
  };
}

/**
 * Removes port from a graph
 * @param graph Graph
 * @param portId string
 * @returns Graph
 */
export function removePort(graph: Graph, portId: string): Graph {
  const existing = graph.ports[portId];
  if (!existing) {
    throw new Error(`removePort: Port with id=${portId} does not exist.`);
  }

  const newGraph = { ...graph };

  // 1. Remove the port
  delete newGraph.ports[portId];

  // 2. Remove all edges that reference this port
  for (const edgeId in newGraph.edges) {
    const edge = newGraph.edges[edgeId];
    if (edge.sourcePortId === portId || edge.targetPortId === portId) {
      delete newGraph.edges[edgeId];
    }
  }

  emit({ type: "port:removed", portId });

  return newGraph;
}

/**
 * Adds an edge to a graph
 * @param graph Graph
 * @param edgeInput Edge
 * @returns Graph
 */
export function addEdge(graph: Graph, edgeInput: Edge): Graph {
  // Check if edge already exists
  if (graph.edges[edgeInput.id]) {
    throw new Error(
      `addEdge: Edge with id=${edgeInput.id} already exists.`
    );
  }

  // Source port must exist
  if (!graph.ports[edgeInput.sourcePortId]) {
    throw new Error(
      `addEdge: sourcePortId=${edgeInput.sourcePortId} does not exist.`
    );
  }

  // Target port must exist
  if (!graph.ports[edgeInput.targetPortId]) {
    throw new Error(
      `addEdge: targetPortId=${edgeInput.targetPortId} does not exist.`
    );
  }

  // Prevent same-port connection
  if (edgeInput.sourcePortId === edgeInput.targetPortId) {
    throw new Error(
      `addEdge: sourcePortId and targetPortId cannot be the same.`
    );
  }

  emit({ type: "edge:added", edgeId: edgeInput.id });

  return {
    ...graph,
    edges: {
      ...graph.edges,
      [edgeInput.id]: edgeInput,
    },
  };
}

/**
 * Updates an edge in a graph
 * @param graph Graph
 * @param edgeId string
 * @param patch Edge
 * @returns 
 */
export function updateEdge(
  graph: Graph,
  edgeId: string,
  patch: Partial<Edge>
): Graph {
  const existing = graph.edges[edgeId];
  if (!existing) {
    throw new Error(`updateEdge: Edge with id=${edgeId} does not exist.`);
  }

  const updated = updateEdgeOnly(existing, patch);

  emit({ type: "edge:updated", edgeId });

  return {
    ...graph,
    edges: {
      ...graph.edges,
      [edgeId]: updated,
    },
  };
}

/**
 * Removes an edge from an existing graph
 * @param graph Graph
 * @param edgeId string
 * @returns Graph
 */
export function removeEdge(graph: Graph, edgeId: string): Graph {
  if (!graph.edges[edgeId]) {
    throw new Error(`removeEdge: Edge with id=${edgeId} does not exist.`);
  }

  const newGraph = { ...graph };
  delete newGraph.edges[edgeId];

  emit({ type: "edge:removed", edgeId });

  return newGraph;
}

/**
 * Rewires an edge to a new source or target port.
 * @param graph Graph
 * @param edgeId string
 * @param patch Record
 * @returns Graph
 */
export function rewireEdge(
  graph: Graph,
  edgeId: string,
  patch: { sourcePortId?: string; targetPortId?: string }
): Graph {
  const existing = graph.edges[edgeId];
  if (!existing) {
    throw new Error(`rewireEdge: Edge with id=${edgeId} does not exist.`);
  }

  const newSource = patch.sourcePortId ?? existing.sourcePortId;
  const newTarget = patch.targetPortId ?? existing.targetPortId;

  // Validate new source
  if (!graph.ports[newSource]) {
    throw new Error(
      `rewireEdge: sourcePortId=${newSource} does not exist.`
    );
  }

  // Validate new target
  if (!graph.ports[newTarget]) {
    throw new Error(
      `rewireEdge: targetPortId=${newTarget} does not exist.`
    );
  }

  // Prevent reconnecting to same port
  if (newSource === newTarget) {
    throw new Error(
      `rewireEdge: sourcePortId and targetPortId cannot be the same.`
    );
  }

  const updated = rewireEdgeOnly(existing, patch);

  emit({ type: "edge:updated", edgeId });

  return {
    ...graph,
    edges: {
      ...graph.edges,
      [edgeId]: updated,
    },
  };
}