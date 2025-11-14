// EdgeManager responsibilities:
//
// - createEdge()
// - updateEdge()
// - removeEdge()
// - rewireEdge()          (change source/target port)
// - validateEdge()        (later)
// - ensure ports are compatible (input/output)
//
// EdgeManager interacts with:
// - PortManager (to verify source/target ports exist)
// - NodeManager (for derived nodeId references)
// - GraphModel (to store edges in global graph)
//

import { Edge } from './EdgeTypes';

/**
 * Creates an edge
 * @param input Edge
 * @returns Edge
 */
export function createEdge(input: {
    id: string;
    sourcePortId: string;
    targetPortId: string;
    data?: Record<string, any>;
}) : Edge {
    if (!input.id) {
        throw new Error("createEdge: Edge must have an id.");
    }

    if (!input.sourcePortId) {
        throw new Error("createEdge: sourcePortId is required.");
    }

    if (!input.targetPortId) {
        throw new Error("createEdge: targetPortId is required.");
    }

    // Prevent accidental self-loops on the same port
    if (input.sourcePortId === input.targetPortId) {
        throw new Error("createEdge: sourcePortId and targetPortId cannot be the same port.");
    }

    // Construct the edge object
    const edge: Edge = {
        id: input.id,
        sourcePortId: input.sourcePortId,
        targetPortId: input.targetPortId,
        data: input.data ?? {},
    };

    return edge;
}

/**
 * Updates an edge by ID
 * @param existing Edge
 * @param patch Edge
 * @returns Edge
 */
export function updateEdge(
    existing: Edge,
    patch: Partial<Omit<Edge, "id" | "sourcePortId" | "targetPortId">>
) : Edge {

    if ("id" in patch) {
        throw new Error("updateEdge: Cannot update edge.id");
    }
    if ("sourcePortId" in patch || "targetPortId" in patch) {
        throw new Error("updateEdge: Use rewireEdge() to change source/target ports.");
    }

    const updated: Edge = {
        ...existing,
        ...patch,
        data: patch.data
        ? { ...existing.data, ...patch.data }
        : existing.data,
    };

    return updated;
}

/**
 * Removes an edge by ID (GraphModel handles actual deletion).
 * @param edge Edge
 * @returns Edge
 */
export function removeEdge(edge: Edge) {
    return edge;
}

/**
 * Changes the source or target port of an edge.
 * Ideal for dragging ends of edges in UI.
 * @param edge Edge
 * @param patch Edge
 * @returns Edge
 */
export function rewireEdge(edge: Edge, patch: {
    sourcePortId?: string;
    targetPortId?: string;
}) : Edge {

    const newSource = patch.sourcePortId ?? edge.sourcePortId;
    const newTarget = patch.targetPortId ?? edge.targetPortId;

    // Basic safety checks
    if (!newSource) {
        throw new Error("rewireEdge: sourcePortId cannot be empty.");
    }
    if (!newTarget) {
        throw new Error("rewireEdge: targetPortId cannot be empty.");
    }
    if (newSource === newTarget) {
        throw new Error("rewireEdge: source and target cannot be the same port.");
    }

    // Return updated edge
    return {
        ...edge,
        sourcePortId: newSource,
        targetPortId: newTarget,
    };
}

