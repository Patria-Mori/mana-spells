# PM Mana - Spells

The mana-spells module is part of the PM Mana Foundry module project, and adds onto mana-circles (which builds on mana-base) to implement support for spells and spell-related automation.

## Main Features

The spells module has two main responsibilities, enhancing 5e spells with circles & providing UI/UX automation.

The module has a few main features, but in general it can be thought of as an extension to the mana-base module that similarly to the base mod mainly extends the "foundation" from the base mod without providing too much functionality itself.

 - **Spell Extension**: The core of the mod. The module provides and integrates a database that extends D&D 5e spells with Circles.
 - **Spell Automation**: The mod takes care of subtracting mana when a spell is cast, and will dynamically update the cost of spells in the UI depending on affinity profiles.

Together with the mana-circles mod the overall goal of the mods is to make it easy to use the mana system in Foundry, and to hopefully make it easier/better to manage spellcasting natively in Foundry instead of having to rely on external tools.