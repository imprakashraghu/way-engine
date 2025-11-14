State Model:

The state object contains references to all engine subsystems:

- graph (nodes, edges, metadata)
- selection
- viewport
- history
- validation
- events (emitter)

State Responsibilities:
- provide access to all subsystems
- coordinate updates between subsystems
- allow snapshotting (for history)
- allow serialization (save/load)
- maintain consistency across the engine

State Actions:
- getState()
- setState()
- resetState()
