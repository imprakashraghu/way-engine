import { MarqueeSession } from "./MarqueeTypes";
import { Graph } from "../graph/GraphTypes";
import { SelectionManager } from "../selection/SelectionManager";
import { Node } from '../node/NodeTypes';

export class MarqueeManager {
    private session: MarqueeSession | null = null;
    private selection: SelectionManager;

    constructor(selection: SelectionManager) {
        this.selection = selection;
    }

    startMarquee(pointer: { x: number; y: number }) {
        this.session = {
            active: true,
            startPoint: { x: pointer.x, y: pointer.y },
            endPoint: { x: pointer.x, y: pointer.y }
        };
    }

    updateMarquee(graph: Graph, pointer: { x: number; y: number }) {
        if (!this.session || !this.session.active) return;

        this.session.endPoint = {
            x: pointer.x,
            y: pointer.y
        };
    }

    endMarquee(graph: Graph, pointer: { x: number; y: number }, shiftKey: boolean) {
        if (!this.session || !this.session.active) return;

        this.session.endPoint = pointer;

        const bounds = this.getBounds();
        if (!bounds) return;

        const hits: string[] = [];

        // Check all nodes
        for (const node of Object.values(graph.nodes)) {
            if (this.nodeInBounds(node, bounds)) {
            hits.push(node.id);
            }
        }

        // Apply selection with SHIFT behavior
        if (shiftKey) {
            // add/remove without clearing
            hits.forEach((id) => {
            if (this.selection.isSelected(id)) {
                this.selection.unselectNode(id);
            } else {
                this.selection.selectNode(id);
            }
            });
        } else {
            // replace selection
            this.selection.selectOnly(hits);
        }

        this.session.active = false;
    }


    cancelMarquee() {
        if (!this.session) return;
        this.session.active = false;
    }

    private getBounds() {
        if (!this.session) return null;

        const { startPoint, endPoint } = this.session;

        return {
            left: Math.min(startPoint.x, endPoint.x),
            right: Math.max(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            bottom: Math.max(startPoint.y, endPoint.y)
        }
    }

    private nodeInBounds(node: Node, bounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }) : boolean {
        const x = node.position.x;
        const y = node.position.y;

        // Point-in-rectangle test
        return (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        );
    }

}