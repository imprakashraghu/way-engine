import { KeyEvent } from "./KeyboardTypes";
import { SelectionManager } from "../selection/SelectionManager";
import { CommandManager } from "../commands/CommandManager";
import { DuplicateNodeCommand } from "../commands/MacroCommands";
import { DeleteSelectionCommand } from "../commands/MacroCommands";
import { MoveNodeCommand } from "../commands/NodeCommands";
import { BatchCommand } from "../commands/BatchCommand";
import { Graph } from "../graph/GraphTypes";

export class KeyboardManager {
  private selection: SelectionManager;
  private commandManager: CommandManager;

  constructor(selection: SelectionManager, commandManager: CommandManager) {
    this.selection = selection;
    this.commandManager = commandManager;
  }

  handleKey(graph: Graph, evt: KeyEvent): Graph {
    // DELETE or Backspace
    if (evt.key === "Delete" || evt.key === "Backspace") {
        const selected = this.selection.getSelectedNodeIds();
        if (selected.length > 0) {
            return this.commandManager.execute(
                new DeleteSelectionCommand(selected)
            );
        }
    }

    // Duplicate (Ctrl/Cmd + D)
    if ((evt.ctrl || evt.meta) && evt.key === "d") {
        const selected = this.selection.getSelectedNodeIds();
        if (selected.length > 0) {
            const commands = selected.map(id => new DuplicateNodeCommand(id));
            return this.commandManager.execute(
                new BatchCommand(commands)
            );
        }
    }

    // Select All
    if ((evt.ctrl || evt.meta) && evt.key === "a") {
        const allIds = Object.keys(graph.nodes);
        this.selection.selectOnly(allIds);
        return graph;
    }

    // Escape = clear
    if (evt.key === "Escape") {
        this.selection.clearAll();
        return graph;
    }

    // Arrow key movement
    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (arrows.includes(evt.key)) {
        const selected = this.selection.getSelectedNodeIds();
        if (selected.length === 0) return graph;

        const step = evt.shift ? 10 : 1;

        let dx = 0, dy = 0;
        if (evt.key === "ArrowUp") dy -= step;
        if (evt.key === "ArrowDown") dy = step;
        if (evt.key === "ArrowLeft") dx = -step;
        if (evt.key === "ArrowRight") dx = step;

        const commands = selected.map(id => {
            const node = graph.nodes[id];
            return new MoveNodeCommand(id, node.position.x + dx, node.position.y + dy);
        });

        return this.commandManager.execute(
            new BatchCommand(commands)
        );
    }

    if ((evt.ctrl || evt.meta) && evt.key === "z" && !evt.shift) {
        return this.commandManager.undo() ?? graph;
    }

    if ((evt.ctrl || evt.meta) && evt.key === "z" && evt.shift) {
        return this.commandManager.redo() ?? graph;
    }

    return graph;
  }
}
