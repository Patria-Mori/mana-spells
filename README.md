# PM Mana - Spells

The mana-spells module is part of the PM Mana Foundry module project, and adds onto mana-circles (which builds on mana-base) to implement support for spells and spell-related automation.

## Main Features

The spells module has two main responsibilities, enhancing 5e spells with circles & providing UI/UX automation.

The module has a few main features, but in general it can be thought of as an extension to the mana-base module that similarly to the base mod mainly extends the "foundation" from the base mod without providing too much functionality itself.

 - **Spell Extension**: The core of the mod. The module provides and integrates a database that extends D&D 5e spells with Circles.
 - **Spell Flag API**: A utility API that is used to manage spell flags.
 - **Spell Automation**: The mod takes care of subtracting mana when a spell is cast, and will dynamically update the cost of spells in the UI depending on affinity profiles.

Together with the mana-circles mod the overall goal of the mods is to make it easy to use the mana system in Foundry, and to hopefully make it easier/better to manage spellcasting natively in Foundry instead of having to rely on external tools.

## Module structure

### Circle "Database"

In addition to the standard structure, this mod contains the circles.json file which acts as a "DB" of sorts. It is located in the "data" folder, and after the mod is installed, a copy is created in the world folder under "mana-spells". This copy can be edited to change the circles of spells, to add spells, etc.

### Script structure

The module consists of several scripts and sub-folders inside the "scripts" folder. This briefly describes them.
 - **api**: Consists of several APIs, to manage files, and to manage spellFlags.
 - **model**: Defines the relevant models in the mod.
- **moduleConfig.js**: Contains the configuration of the module.
- **moduleHooks.js**: Simple script that adds event listener hooks for the module.
- **moduleSettings.js**: Defines the settings for the module.