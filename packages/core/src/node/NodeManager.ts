// NodeManager responsibilities:
//
// - createNode(id, position, optional fields)
// - updateNode(id, new fields)
// - moveNode(id, new position)
// - removeNode(id)
// - attachPort(nodeId, portId)
// - detachPort(nodeId, portId)
//
// NodeManager interacts with:
// - Graph (to store nodes)
// - Validation (to ensure the node is valid)
// - Events (to emit node:added, node:updated)
//

import { Node, NodePosition } from './NodeTypes';

/**
 * Used to create a node with required and optional fields.
 * @param input {Node}
 * @returns {Node}
 */
export function createNode(input: {
    id: string;
    position: NodePosition;
    type?: string;
    data?: Record<string, any>;
    ports?: string[];
}) : Node {

    if (!input.id) {
        throw new Error('Node must have a valid id');
    }

    if (!input.position) {
        throw new Error('Node must have a valid position');
    }

    const node: Node = {
        id: input.id,
        position: input.position,
        type: input.type || undefined,
        data: input.data || {},
        ports: input.ports || []
    };

    return node;
}

/**
 * Used to update an existing node with new fields.
 * @param existing {Node} - The existing node to update.
 * @param patch {Partial<Omit<Node, 'id'>>} - The fields to update.
 * @returns {Node} - The updated node.
 */
export function updateNode(existing: Node, patch: Partial<Omit<Node, 'id'>>) : Node {

    if ("id" in patch) {
        throw new Error("Cannot update node.id. IDs are immutable.");
    }

    const updated: Node = {
        ...existing,          // start with the old node
        ...patch,             // apply shallow updates
        position: patch.position
        ? { ...existing.position, ...patch.position }
        : existing.position,
        data: patch.data
        ? { ...existing.data, ...patch.data }
        : existing.data,
        ports: patch.ports ?? existing.ports,
    };

    return updated;
}

/**
 * Used to move a node to given x and y
 * @param node {Node}
 * @param newPosition {NodePosition} 
 */
export function moveNode(existing: Node, newPosition: NodePosition) : Node {
    if (typeof newPosition.x !== "number" || typeof newPosition.y !== "number") {
        throw new Error("moveNode: position must include numeric x and y.");
    }

    return {
        ...existing,
        position: {
            x: newPosition.x,
            y: newPosition.y,
        },
    };
}

/**
 * Removes a node by ID
 * This function does NOT remove it from the graph yet — 
 * the Graph model will handle that.
 * @param node {Node}
 */
export function removeNode(node: Node) : Node {
    return node;
}

/**
 * Adds port ID to a node
 * @param node {Node}
 * @param portId {string}
 * @returns {Node}
 */
export function addPortToNode(node: Node, portId: string) : Node {
    if (!portId) {
        throw new Error("addPortToNode: portId is required.");
    }

    // Prevent duplicates
    if (node.ports?.includes(portId)) {
        return node; // no change
    }

    return {
        ...node,
        ports: [...(node.ports ?? []), portId],
    };
}

/**
 * Removes port ID from a node
 * @param node {Node}
 * @param portId {string}
 * @returns {Node}
 */
export function removePortFromNode(node: Node, portId: string) : Node {
    if (!portId) {
        throw new Error("removePortFromNode: portId is required.");
    }

    if (!node.ports || !node.ports.includes(portId)) {
        return node; // no change
    }

    return {
        ...node,
        ports: node.ports.filter(p => p !== portId),
    };
}