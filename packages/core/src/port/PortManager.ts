// PortManager responsibilities:
//
// - createPort()
// - updatePort()
// - removePort()
// - repositionPort()
// - attachToNode()
// - detachFromNode()
//
// Later:
// - validatePort()
// - ensure correct types (input/output)
// - connect compatibility with edges

import { Port, PortPosition, PortType } from './PortTypes';
import { addPortToNode, removePortFromNode } from '../node/NodeManager';
import { Node } from '../node/NodeTypes';

/**
 * Creates a port
 * @param input Port
 * @returns Port
 */
export function createPort(input: {
    id: string;
    nodeId: string;
    type: PortType;
    position?: PortPosition;
    data?: Record<string, any>;
}) : Port {

    if (!input.id) {
    throw new Error("createPort: Port must have an id.");
  }

  if (!input.nodeId) {
    throw new Error("createPort: Port must belong to a nodeId.");
  }

  if (!input.type) {
    throw new Error("createPort: Port must have a type (input/output/default).");
  }

  // Optional position validation (if provided)
  if (input.position) {
    if (typeof input.position.x !== "number" || typeof input.position.y !== "number") {
      throw new Error("createPort: position.x and position.y must be numbers.");
    }
  }

  // Construct the final Port object
  const port: Port = {
    id: input.id,
    nodeId: input.nodeId,
    type: input.type,
    position: input.position ?? undefined,
    data: input.data ?? {},
  };

  return port;
}

/**
 * Updates a port by ID
 * @param existing Port
 * @param patch Port
 * @returns Port
 */
export function updatePort(
    existing: Port, 
    patch: Partial<Omit<Port, "id" | "nodeId">>
) : Port {

    if ("id" in patch) {
        throw new Error("Cannot update port.id. IDs are immutable.");
    }
    if ("nodeId" in patch) {
        throw new Error("Cannot update port.nodeId once created.");
    }

    const updated: Port = {
        ...existing,
        ...patch,
        position: patch.position
        ? { ...existing.position, ...patch.position }
        : existing.position,
        data: patch.data
        ? { ...existing.data, ...patch.data }
        : existing.data,
    };

    return updated;
}

/**
 * Removes a port by ID
 * @param port Port
 * @returns Port
 */
export function removePort(port: Port): Port {
    return port;
}

/**
 * Attach a port to an existing node
 * @param node Node
 * @param port Port
 * @returns Node
 */
export function attachPortToNode(node: Node, port: Port) : Node {
    if (node.id !== port.nodeId) {
        throw new Error(
        `attachPortToNode: Port belongs to nodeId=${port.nodeId}, but tried to attach to nodeId=${node.id}`
        );
    }

    return addPortToNode(node, port.id);
}

/**
 * Detach a port form an existing node
 * @param node Node
 * @param port Port
 * @returns Node
 */
export function detachPortFromNode(node: Node, port: Port) : Node {
    if (node.id !== port.nodeId) {
        throw new Error(
        `detachPortFromNode: Port belongs to nodeId=${port.nodeId}, but tried to detach to nodeId=${node.id}`
        );
    }

    return removePortFromNode(node, port.id);
}