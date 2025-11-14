import { DragSession } from "./DragTypes";
import { Graph } from "../graph/GraphTypes";
import { CommandManager } from "../commands/CommandManager";
import { MoveNodeCommand } from "../commands/NodeCommands";
import { BatchCommand } from "../commands/BatchCommand";

export class DragManager {
  private session: DragSession | null = null;
  private commandManager: CommandManager;

  constructor(commandManager: CommandManager) {
    this.commandManager = commandManager;
  }

  startDrag(graph: Graph, nodeIds: string[], pointer: { x: number; y: number }) {
    const startPositions: Record<string, { x: number; y: number }> = {};

    for (const id of nodeIds) {
        const node = graph.nodes[id];
        if (node) {
        startPositions[id] = {
            x: node.position.x,
            y: node.position.y,
        };
        }
    }

    this.session = {
        nodeIds,
        startPositions,
        startPoint: { x: pointer.x, y: pointer.y },
        lastDelta: { x: 0, y: 0 },
        active: true,
    };
    }

    updateDrag(graph: Graph, pointer: { x: number; y: number }): Graph {
        if (!this.session || !this.session.active) return graph;

        const { startPositions, startPoint, nodeIds } = this.session;

        const dx = pointer.x - startPoint.x;
        const dy = pointer.y - startPoint.y;

        let newGraph = graph;

        for (const id of nodeIds) {
            const pos = startPositions[id];
            if (!pos) continue;

            newGraph = {
            ...newGraph,
            nodes: {
                ...newGraph.nodes,
                [id]: {
                ...newGraph.nodes[id],
                position: {
                    x: pos.x + dx,
                    y: pos.y + dy,
                },
                },
            },
            };
        }

        this.session.lastDelta = { x: dx, y: dy };

        return newGraph;
    }

    endDrag(graph: Graph): Graph {
        if (!this.session || !this.session.active) return graph;

        const { nodeIds, startPositions, lastDelta } = this.session;

        this.session.active = false;

        // No movement = no-op
        if (lastDelta.x === 0 && lastDelta.y === 0) {
            return graph;
        }

        const commands = nodeIds.map((id) => {
            const startPos = startPositions[id];
            return new MoveNodeCommand(
            id,
            startPos.x + lastDelta.x,
            startPos.y + lastDelta.y
            );
        });

        const batch = new BatchCommand(commands);

        return this.commandManager.execute(batch);
    }

    cancelDrag(graph: Graph): Graph {
        if (!this.session || !this.session.active) return graph;

        const { startPositions } = this.session;

        let newGraph = graph;

        for (const id in startPositions) {
            const pos = startPositions[id];
            newGraph = {
            ...newGraph,
            nodes: {
                ...newGraph.nodes,
                [id]: {
                ...newGraph.nodes[id],
                position: { x: pos.x, y: pos.y },
                },
            },
            };
        }

        this.session.active = false;

        return newGraph;
    }
}
