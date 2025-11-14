import { Graph } from "../graph/GraphTypes";
import { HitResult } from "./HitTypes";

const PORT_HIT_RADIUS = 12;

export class HitTester {

    private hitTestPorts(graph: Graph, point: { x: number; y: number }): HitResult {
        for (const port of Object.values(graph.ports)) {
            // skip ports without a position to avoid accessing undefined
            if (!port.position) {
                continue;
            }

            const dx = point.x - port.position.x;
            const dy = point.y - port.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= PORT_HIT_RADIUS) {
                return { type: "port", id: port.id };
            }
        }

        return { type: "none", id: null };
    }

    private hitTestNodes(graph: Graph, point: { x: number; y: number }): HitResult {
        for (const node of Object.values(graph.nodes)) {
            const dx = point.x - node.position.x;
            const dy = point.y - node.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // treat node as a point with radius 20 for now
            if (dist <= 20) {
                return { type: "node", id: node.id };
            }
        }

        return { type: "none", id: null };
    }

    private hitTestEdges(graph: Graph, point: { x: number; y: number }): HitResult {
        const DIST_THRESHOLD = 8;

        for (const edge of Object.values(graph.edges)) {
            const src = graph.ports[edge.sourcePortId];
            const tgt = graph.ports[edge.targetPortId];

            if (!src || !tgt) continue;

            // skip ports without a position to avoid accessing undefined
            if (!src.position || !tgt.position) {
                continue;
            }

            const { x: x1, y: y1 } = src.position;
            const { x: x2, y: y2 } = tgt.position;
            const { x: px, y: py } = point;

            const dx = x2 - x1;
            const dy = y2 - y1;

            let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
            t = Math.max(0, Math.min(1, t));

            const lx = x1 + t * dx;
            const ly = y1 + t * dy;

            const dist = Math.sqrt((px - lx) ** 2 + (py - ly) ** 2);

            if (dist <= DIST_THRESHOLD) {
                return { type: "edge", id: edge.id };
            }
        }

        return { type: "none", id: null };
    }

    hitTest(graph: Graph, point: { x: number; y: number }): HitResult {
        // 1. Try ports
        const portHit = this.hitTestPorts(graph, point);
        if (portHit.type !== "none") return portHit;

        // 2. Try nodes
        const nodeHit = this.hitTestNodes(graph, point);
        if (nodeHit.type !== "none") return nodeHit;

        // 3. Try edges
        const edgeHit = this.hitTestEdges(graph, point);
        if (edgeHit.type !== "none") return edgeHit;

        return { type: "none", id: null };
    }

}
