// MacroCommands.ts

import { Graph } from "../graph/GraphTypes";
import { Command } from "./CommandTypes";
import { BatchCommand } from "./BatchCommand";
import {
  AddNodeCommand,
  RemoveNodeCommand,
} from "./NodeCommands";
import { nanoid } from "nanoid";
import { AddPortCommand } from "./PortCommands";
import { AddEdgeCommand } from "./EdgeCommands";

/**
 * A MacroCommand is a reusable high-level operation
 * composed of multiple low-level commands.
 *
 * It ALWAYS uses BatchCommand internally.
 */
export abstract class MacroCommand implements Command {
  abstract label: string;

  /**
   * Subclasses must return an array of commands
   * that make up the macro.
   */
  abstract buildCommands(graph: Graph): Command[];

  execute(graph: Graph) {
    const batch = new BatchCommand(this.buildCommands(graph));
    return batch.execute(graph);
  }

  undo(graph: Graph) {
    const batch = new BatchCommand(this.buildCommands(graph));
    return batch.undo(graph);
  }
}

export class DuplicateNodeCommand extends MacroCommand {
  label = "Duplicate Node";

  private nodeId: string;

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }

  buildCommands(graph: Graph): Command[] {
    const node = graph.nodes[this.nodeId];

    if (!node) {
      return [];
    }

    const newNodeId = nanoid();

    const commands: Command[] = [];

    //
    // 1. Duplicate the node
    //
    commands.push(
      new AddNodeCommand({
        ...node,
        id: newNodeId,
        position: {
          x: node.position.x + 40,
          y: node.position.y + 40,
        },
        ports: [], // ports added later
      })
    );

    //
    // 2. Duplicate all ports
    //
    const ports = Object.values(graph.ports).filter(
      (p) => p.nodeId === this.nodeId
    );

    const portMap: Record<string, string> = {};

    for (const port of ports) {
      const newPortId = nanoid();
      portMap[port.id] = newPortId;

      commands.push(
        new AddPortCommand({
          ...port,
          id: newPortId,
          nodeId: newNodeId,
        })
      );
    }

    //
    // 3. Duplicate edges connected to this node’s ports
    //
    const edges = Object.values(graph.edges).filter(
      (e) => portMap[e.sourcePortId] || portMap[e.targetPortId]
    );

    for (const edge of edges) {
      const newEdgeId = nanoid();

      commands.push(
        new AddEdgeCommand({
          ...edge,
          id: newEdgeId,
          sourcePortId: portMap[edge.sourcePortId] ?? edge.sourcePortId,
          targetPortId: portMap[edge.targetPortId] ?? edge.targetPortId,
        })
      );
    }

    return commands;
  }
}

export class DeleteSelectionCommand extends MacroCommand {
  label = "Delete Selection";

  private selectedNodeIds: string[];

  constructor(selectedNodeIds: string[]) {
    super();
    this.selectedNodeIds = selectedNodeIds;
  }

  buildCommands() {
    return this.selectedNodeIds.map(
      (id) => new RemoveNodeCommand(id)
    );
  }
}