Integration Model:

Describes how each subsystem interacts:

State integrates:
- graph
- selection
- viewport
- history
- metadata
- validation
- events

Engine integrates:
- state
- commands
- event emitter
- serialization

Command System interacts with:
- graph
- selection
- history
- state

Validation interacts with:
- graph
- ports
- edges
- commands

Serialization interacts with:
- graph
- state
- metadata
- versioning

Events integrate with:
- all subsystems
- subscribers (external code)
