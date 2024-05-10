# Creature sim

This is a simple creature simulator that is based upon an understanding of the AI in the P.F. Magic Petz games (1995-2002). The simulator consists of a World object containing various Entity objects. Entities are divided into Item (subdivided into different item types) and Creature objects that inherit from the base Entity object.

The Creature object has different motives that can be satisfied by moving toward items that emit the correct adjective - e.g. if hungry it will seek out items marked as 'tasty' - and run the relevant plan and state functions to fulfil its current goal. This mimics the adjective-based system implemented in the Petz games, albeit greatly simplified.

[Demo](https://codepen.io/jsanderson/pen/dyLeyEQ?editors=1010)

References:

* https://web.archive.org/web/20121001022009/http://www.interactivestory.net/papers/PetzAndBabyz.html
* https://web.archive.org/web/20121001022009/http://www.interactivestory.net/papers/PetzAndBabyz.html
