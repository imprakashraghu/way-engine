Command Model:

Core Commands:
- addNode
- removeNode
- updateNode
- moveNode
- addEdge
- removeEdge
- updateEdge
- select
- clearSelection

Command Structure:
- name
- payload (data required to run the command)
- execute()
- undo()  (optional, for history system)