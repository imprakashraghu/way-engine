import { SelectionState } from "./SelectionTypes";

export class SelectionManager {
    private state: SelectionState;

    constructor() {
        this.state = {
        nodes: new Set(),
        ports: new Set(),
        edges: new Set(),
        };
    }

    getSelection(): SelectionState {
        return this.state;
    }

    clear() {
        this.state.nodes.clear();
        this.state.ports.clear();
        this.state.edges.clear();
    }

    selectNode(nodeId: string) {
        this.state.nodes.add(nodeId);
    }

    unselectNode(nodeId: string) {
        this.state.nodes.delete(nodeId);
    }

    toggleNode(nodeId: string) {
        if (this.state.nodes.has(nodeId)) {
            this.state.nodes.delete(nodeId);
        } else {
            this.state.nodes.add(nodeId);
        }
    }

    selectNodes(nodeIds: string[]) {
        for (const id of nodeIds) {
            this.state.nodes.add(id);
        }
    }

    selectOnly(nodeIds: string[]) {
        this.clear();
        for (const id of nodeIds) {
            this.state.nodes.add(id);
        }
    }

    isSelected(nodeId: string): boolean {
        return this.state.nodes.has(nodeId);
    }

    selectNodeWithShift(nodeId: string, shiftKey: boolean) {
        if (shiftKey) {
            this.toggleNode(nodeId);
        } else {
            this.selectOnly([nodeId]);
        }
    }

    selectPort(portId: string) {
        this.state.ports.add(portId);
    }

    selectEdge(edgeId: string) {
        this.state.edges.add(edgeId);
    }

    unselectPort(portId: string) {
        this.state.ports.delete(portId);
    }

    unselectEdge(edgeId: string) {
        this.state.edges.delete(edgeId);
    }

    clearAll() {
        this.state.nodes.clear();
        this.state.ports.clear();
        this.state.edges.clear();
    }

    selectAllNodes(nodeIds: string[]) {
        this.state.nodes = new Set(nodeIds);
    }

    getSelectedNodeIds(): string[] {
        return Array.from(this.state.nodes);
    }

    getSelectedPorts(): string[] {
        return Array.from(this.state.ports);
    }

    getSelectedEdges(): string[] {
        return Array.from(this.state.edges);
    }

    getSelectionCount(): number {
        return (
            this.state.nodes.size +
            this.state.ports.size +
            this.state.edges.size
        );
    }

}