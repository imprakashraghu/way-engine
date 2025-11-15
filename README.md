# ⚡ OpenFlow (Graph Engine) — A Modular Graph & Interaction Framework for Visual Editors

A lightweight, model-first graph engine for building visual editors, workflow tools, diagramming apps, and low-code interfaces.

This library gives you a fully structured graph core (nodes, ports, edges), plus systems for selection, history, commands, interactions, hit-testing, keyboard, and serialization — all cleanly separated and fully extensible.

---

## 🚀 Features

### 🧠 Model-First Architecture
Everything is built around a consistent graph data model:
- Nodes
- Ports
- Edges
- Graph state
- Validation
- Selectors
- Utils

### 🎛 Modular Engine Systems
Each system is isolated and replaceable:
- Event System
- Selection System
- Command System
- History (Undo/Redo)
- Interaction System (drag, marquee, etc.)
- Hit Testing
- Keyboard Input
- Serialization

### 🪶 Lightweight & Headless
The engine runs without any renderer — perfect for:
- React
- Next.js
- Node.js
- Python bindings
- CLI tools
- Server-side layout

### 🔌 Extensible by Design
You can add:
- Custom node types
- Custom commands
- Custom interactions
- Custom validation rules
- Custom serialization formats

---

## 📦 Installation

```bash
pnpm add open-flow
# or
npm install open-flow
# or
yarn add open-flow
```

---

## 🧩 Quick Start

```ts
import { createGraph, addNode, addEdge } from 'open-flow';

// Create graph
const graph = createGraph();

// Add nodes
const nodeA = addNode(graph, {
  id: 'A',
  type: 'default',
  position: { x: 100, y: 100 },
});

const nodeB = addNode(graph, {
  id: 'B',
  type: 'default',
  position: { x: 300, y: 100 },
});

// Add an edge
addEdge(graph, {
  id: 'A->B',
  source: { node: 'A', port: 'out' },
  target: { node: 'B', port: 'in' },
});
```

---

## 🧱 Architecture Overview

```
open-flow/
  ├── Core Model
  │     ├── GraphModel
  │     ├── NodeModel
  │     ├── PortModel
  │     └── EdgeModel
  │
  ├── Engine Systems
  │     ├── Event System
  │     ├── Selection System
  │     ├── History System
  │     └── Command System
  │
  ├── Interaction Systems
  │     ├── DragManager
  │     ├── MarqueeManager
  │     ├── HitTester
  │     └── KeyboardManager
  │
  └── Serialization
        └── GraphSerializer
```

Each system is isolated, testable, and replaceable.

---

## 🧰 What You Get Out of the Box

### Core Model
- GraphManager
- NodeManager
- PortManager
- EdgeManager

### Engine Systems
- Events (node/port/edge/graph)
- Selection (single + multi)
- Commands (structured updates)
- History (undo/redo)

### Interaction Systems
- Dragging
- Marquee selection
- Hit testing (nodes, ports, edges)
- Keyboard shortcuts

### Serialization
- JSON export/import
- Safe graph rehydration

---

## 🛠 Example: Undo/Redo with Commands

```ts
commandManager.execute({
  type: "node:add",
  payload: { id: "N1", position: { x: 100, y: 200 } }
});

historyManager.undo();
historyManager.redo();
```

---

## 🔍 Example: Hit Testing

```ts
const hit = hitTester.hitTest(pointer);

if (hit.type === "node") {
  console.log("Node under cursor:", hit.nodeId);
}
```

---

## 💾 Serialization

```ts
const json = graphSerializer.export(graph);
const restored = graphSerializer.import(json);
```

---

## 🗺 Roadmap

- Renderer plugins (HTML/SVG/Canvas/WebGL)
- React bindings (@graph-engine/react)
- Next.js integration
- Python bindings
- CLI tools
- Layout algorithms (Dagre/ELK)
- Theme system
- Plugin system
- Collaboration layer (Yjs/CRDT)

---

## 🤝 Contributing

Pull requests are welcome!
Please open an issue to discuss new features or improvements.

---

## 📝 License

MIT License
