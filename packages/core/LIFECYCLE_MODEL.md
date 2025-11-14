Lifecycle Model:

Phases:
- init: create state, set defaults, prepare subsystems
- load: load graph from JSON, update state
- update: apply commands or state changes
- reset: clear state, reset to defaults
- destroy: remove listeners, clear events, cleanup resources

Engine Lifecycle Methods:
- init()
- load(json)
- reset()
- destroy()

Engine Events:
- engine:initialized
- engine:loaded
- engine:reset
- engine:destroyed
