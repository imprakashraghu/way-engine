import { Graph } from "./GraphTypes";
import { Node } from "../node/NodeTypes";
import { Port } from "../port/PortTypes";
import { Edge } from "../edge/EdgeTypes";

/**
 * Get a node by ID.
 */
export function getNode(graph: Graph, nodeId: string): Node | undefined {
  return graph.nodes[nodeId];
}

/**
 * Get a port by ID.
 */
export function getPort(graph: Graph, portId: string): Port | undefined {
  return graph.ports[portId];
}

/**
 * Get an edge by ID.
 */
export function getEdge(graph: Graph, edgeId: string): Edge | undefined {
  return graph.edges[edgeId];
}

/**
 * Get all ports that belong to a specific node.
 */
export function getPortsForNode(graph: Graph, nodeId: string): Port[] {
  return Object.values(graph.ports).filter(p => p.nodeId === nodeId);
}

/**
 * Get all edges connected to a specific port.
 */
export function getEdgesForPort(graph: Graph, portId: string): Edge[] {
  return Object.values(graph.edges).filter(
    e => e.sourcePortId === portId || e.targetPortId === portId
  );
}

/**
 * Get all edges connected to ANY port of a node.
 */
export function getEdgesForNode(graph: Graph, nodeId: string): Edge[] {
  const ports = getPortsForNode(graph, nodeId);
  const portIds = new Set(ports.map(p => p.id));

  return Object.values(graph.edges).filter(
    e => portIds.has(e.sourcePortId) || portIds.has(e.targetPortId)
  );
}

/**
 * Get all nodes directly connected to this node (neighbors).
 */
export function getConnectedNodes(graph: Graph, nodeId: string): Node[] {
  const edges = getEdgesForNode(graph, nodeId);

  const neighborIds = new Set<string>();

  for (const edge of edges) {
    const sourcePort = graph.ports[edge.sourcePortId];
    const targetPort = graph.ports[edge.targetPortId];

    if (!sourcePort || !targetPort) continue;

    const sourceNode = graph.nodes[sourcePort.nodeId];
    const targetNode = graph.nodes[targetPort.nodeId];

    if (sourceNode && sourceNode.id !== nodeId) {
      neighborIds.add(sourceNode.id);
    }
    if (targetNode && targetNode.id !== nodeId) {
      neighborIds.add(targetNode.id);
    }
  }

  return [...neighborIds].map(id => graph.nodes[id]);
}
