import { Graph } from "./GraphTypes";

/**
 * Top-level graph validator.
 * Returns an array of error messages. If the array is empty → graph is valid.
 */
export function validateGraph(graph: Graph): string[] {
  const errors: string[] = [];

  errors.push(
    ...validateNodesExistForPorts(graph),
    ...validatePortsExistForEdges(graph),
    ...validatePortOwnership(graph),
    ...validateNoDanglingEdges(graph)
  );

  return errors;
}

/**
 * Ensure every port belongs to an existing node.
 */
export function validateNodesExistForPorts(graph: Graph): string[] {
  const errors: string[] = [];

  for (const portId in graph.ports) {
    const port = graph.ports[portId];
    if (!graph.nodes[port.nodeId]) {
      errors.push(
        `Port ${portId} refers to missing nodeId=${port.nodeId}.`
      );
    }
  }

  return errors;
}

/**
 * Ensure every edge references existing source/target ports.
 */
export function validatePortsExistForEdges(graph: Graph): string[] {
  const errors: string[] = [];

  for (const edgeId in graph.edges) {
    const edge = graph.edges[edgeId];

    if (!graph.ports[edge.sourcePortId]) {
      errors.push(
        `Edge ${edgeId} refers to missing sourcePortId=${edge.sourcePortId}.`
      );
    }

    if (!graph.ports[edge.targetPortId]) {
      errors.push(
        `Edge ${edgeId} refers to missing targetPortId=${edge.targetPortId}.`
      );
    }
  }

  return errors;
}

/**
 * Ensure ports do not claim to belong to the wrong node.
 */
export function validatePortOwnership(graph: Graph): string[] {
  const errors: string[] = [];

  for (const portId in graph.ports) {
    const port = graph.ports[portId];

    // Node must have a ports array or list of ports
    const node = graph.nodes[port.nodeId];
    if (!node) continue; // Already covered in another validator

    if (node.ports && !node.ports.includes(portId)) {
      errors.push(
        `Port ${portId} claims nodeId=${port.nodeId}, but node does not reference this port.`
      );
    }
  }

  return errors;
}

/**
 * Ensure no edge references ports or nodes that were removed.
 */
export function validateNoDanglingEdges(graph: Graph): string[] {
  const errors: string[] = [];

  for (const edgeId in graph.edges) {
    const edge = graph.edges[edgeId];

    if (!graph.ports[edge.sourcePortId]) {
      errors.push(
        `Dangling edge ${edgeId}: missing sourcePortId=${edge.sourcePortId}.`
      );
    }

    if (!graph.ports[edge.targetPortId]) {
      errors.push(
        `Dangling edge ${edgeId}: missing targetPortId=${edge.targetPortId}.`
      );
    }
  }

  return errors;
}