# Creature sim

This is a simple creature simulator that is based upon an understanding of the AI in the P.F. Magic Petz games (1995-2002). The simulator consists of a World object containing various Entity objects. Entities are divided into Item (subdivided into different item types) and Creature objects that inherit from the base Entity object.

The Creature object has different motives that can be satisfied by moving toward items that emit the correct adjective - e.g. if hungry it will seek out items marked as 'tasty' - and run the relevant plan and state functions to fulfil its current goal. This mimics the adjective-based system implemented in the Petz games, albeit greatly simplified.

![Glitch](https://cdn.glitch.com/a9975ea6-8949-4bab-addb-8a95021dc2da%2FLogo_Color.svg?v=1602781328576)

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people come together to build web apps and websites.

- Need more help? [Check out our Help Center](https://help.glitch.com/) for answers to any common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your app with private sharing, more storage and memory, domains and more.
