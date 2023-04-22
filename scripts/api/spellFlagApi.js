/**
 * The SpellFlag API contains various functions for setting and getting spell flags.
 */
class SpellFlagApi {
    // Basic Utility Functions for setting and unsetting flags.

    /**
     * Sets the spell flag on the spell item of the given actor.
     * @param {string} actorId  The ID of the actor.
     * @param {string} itemId   The ID of the spell item.
     * @param {*} flagData     The data to set the flag to.
     * @returns Promise of the flag being set.
     */
    static async setItemSpellFlag(actorId, itemId, flagData) {
        return game.actors.get(actorId)?.items.get(itemId)?.setFlag(ManaSpellsModule.ID, 
            ManaSpellsModule.FLAGS.SPELL_FLAG, flagData);
    }

    /**
     * Gets the spell flag from the spell item of the given actor.
     * @param {string} actorId  The ID of the actor.
     * @param {string} itemId   The ID of the spell item.
     * @returns Promise of the flag being retrieved.
     */
    static async getItemSpellFlag(actorId, itemId) {
        return game.actors.get(actorId)?.items.get(itemId)?.getFlag(ManaSpellsModule.ID,
            ManaSpellsModule.FLAGS.SPELL_FLAG);
    }

    /**
     * Unsets the spell flag on the spell item of the given actor.
     * @param {string} actorId  The ID of the actor.
     * @param {string} itemId   The ID of the spell item.
     * @returns Promise of the flag being unset.
     */
    static async unsetItemSpellFlag(actorId, itemId) {
        return game.actors.get(actorId)?.items.get(itemId)?.unsetFlag(ManaSpellsModule.ID, 
            ManaSpellsModule.FLAGS.SPELL_FLAG);
    }

    /**
     * Unsets the spell flag on all the spell items of the given actor.
     * @param {string} actorId  The ID of the actor. 
     * @returns Promise of the flags being unset.
     */
    static async unsetAllItemSpellFlags(actorId) {
        const actor = game.actors.get(actorId);
        if (actor == undefined) {
            ManaSpellsModule.log(true, "Could not find the actor with ID: " + actorId);
            return;
        }

        const items = actor.items;
        for (let item of items) {
            const type = item.type;
            if (type == "spell") {
                await this.unsetItemSpellFlag(actorId, item._id);
            }
        }
    }
    
    // Advanced Utility Functions for creating and preparing spell flags.

    /**
     * Utility function that iterates through all the actors and all their spells, 
     * and tries to initialis the spell flags automatically. 
     */
    static async initialiseAllSpellFlags() {
        const actors = game.actors;

        // Iterate through all the actors.
        for (let actor of actors) {
            const items = actor.items;

            // Iterate through all the items of the actor.
            for (let item of items) {
                const type = item.type;

                // Only initialise spell flags on spells items.
                if (type == "spell") {

                    // Check if the spell already a spell flag.
                    const spellFlag = await this.getItemSpellFlag(actor._id, item._id);
                    if (spellFlag == undefined) {
                        const init = await this.initialiseSpellFlagsOnSpell(actor._id, item._id);
                        if (init == undefined) {
                            ManaSpellsModule.log(true, "Could not initialise spell flags on the spell: " + item.name + 
                            "of the actor: " + actor.name + ".");
                        }
                    }
                }
            }
        }
        
        return;
    }

    /**
     * Utility function for updating flags on all spells.
     * Can be used to update flags when the module is updated, or when the circles.json file is updated.
     */
    static async updateAllSpellFlags() {
        const actors = game.actors;

        // Iterate through all the actors.
        for (let actor of actors) {
            const items = actor.items;

            // Iterate through all the items of the actor.
            for (let item of items) {
                const type = item.type;

                // Only initialise spell flags on spells items.
                if (type == "spell") {

                    // Check if the spell already a spell flag.
                    const spellFlag = await this.getItemSpellFlag(actor._id, item._id);
                    if (spellFlag != undefined) {
                        const update = await this.updateSpellFlagsOnSpell(actor._id, item);
                        if (update == undefined) {
                            ManaSpellsModule.log(true, "Could not update spell flags on the spell: " + item.name + 
                            "of the actor: " + actor.name + ".");
                        }
                    }
                }
            }
        }
        
        return;
    }

    /**
     * Utility function to print all the uninitialised spells to the console.
     * @param {string} actorId  The ID of the actor.
     */
    static async printUninitialisedSpellFlags(actorId) {
        const actor = game.actors.get(actorId);
        if (actor == undefined) {
            ManaSpellsModule.log(true, "Could not find the actor with ID: " + actorId);
            return;
        }

        const items = actor.items;
        for (let item of items) {
            const type = item.type;
            if (type == "spell") {
                const spellFlag = await this.getItemSpellFlag(actorId, item._id);
                if (spellFlag == undefined) {
                    ManaSpellsModule.log(true, "Spell: \"" + item.name + "\" is not initialised.");
                }
            }
        }
    }

    /**
     * This method initialises the spell flag on the spell item of the given actor based on the Circles data in the world.
     * @param {string} actorId  The ID of the actor.
     * @param {string} itemId   The ID of the spell item.
     * @returns Promise of the updated spell item.
     */
    static async initialiseSpellFlagsOnSpell(actorId, itemId) {
        const spellItem = game.actors.get(actorId).items.get(itemId);
        if (spellItem == undefined) {
            ManaSpellsModule.log(true, "Could not find the spell item with ID: " + itemId);
            return undefined;
        }

        const spellFlag = await this.retriveSpellFlagFromName(spellItem.name, spellItem.system.level);
        return await this.setItemSpellFlag(actorId, itemId, spellFlag);
    } 

    /**
     * This method updates the spell flag on the spell item of the given actor based on the Circles data in the world.
     * @param {string} actorId The ID of the actor.
     * @param {Item5e} item    The spell item.
     * @returns Promise of the updated spell item.
     */
    static async updateSpellFlagsOnSpell(actorId, item) {
        const itemId = item._id;
        const oldFlag = await this.getItemSpellFlag(actorId, itemId);
        if (oldFlag == undefined) {
            ManaSpellsModule.log(true, "Could not find the spell flag for the spell with ID: " + itemId);
            return undefined;
        }

        // Check if the flag is customised, if so, do not update.
        if (oldFlag.custom) {
            return undefined;
        }

        const newFlag = await this.retriveSpellFlagFromName(item.name, item.system.level);

        // Check if the module version is outdated or does not match the values from the circles.json file.
        if (oldFlag.version !== ManaSpellsModule.VERSION || !oldFlag.equals(newFlag)) {
            return await this.setItemSpellFlag(actorId, itemId, newFlag);
        }
    }

    /**
     * This method creates a SpellFlag object from the Circles data in the world.
     * @param {string} spellName  The name of the spell.
     * @param {number} spellLvl   The level of the spell.
     * @returns New SpellFlag object.
     */
    static async retriveSpellFlagFromName(spellName, spellLvl) {
        const spellData = await this.lookupSpellCirclesData(spellName);
        if (spellData == undefined) {
            ManaSpellsModule.log(true, "Could not find the spell: " + spellName + " in the Circles DB."+
            "\n Either the name in the db/item is wrong, or the spell is not in the db.");
            return undefined;
        }

        const circles = await this.enrichenCirclesData(spellData.circles);
        if (circles == undefined) {
            ManaSpellsModule.log(true, "Could not match the name of the circles from the spell: " + 
            spellName + " to the Circles Definitions.");
            return undefined;
        }

        return new SpellFlag(spellName, spellLvl, circles, false, ManaSpellsModule.VERSION);
    }

    /**
     * This method initialises the spell flag on the spell item of the given actor based on the custom circles data.
     * The custom circles data is an array of strings containing the names of the circles, this is intended as a convenience.
     * @param {string} actorId          The ID of the actor.
     * @param {string} itemId           The ID of the spell item. 
     * @param {string[]} customCircles  An array of string values containing the names of the circles.
     */
    static async initialiseCustomSpellFlagsOnSpell(actorId, itemId, customCircles) {
        const spellItem = game.actors.get(actorId).items.get(itemId);
        if (spellItem == undefined) {
            ManaSpellsModule.log(true, "Could not find the spell item with ID: " + itemId);
            return;
        }
        
        const circles = await this.enrichenCirclesData(customCircles);
        if (circles == undefined) {
            ManaSpellsModule.log(true, "Could not match the names of the provided circles to the Circles Definitions.");
            return;
        }

        const spellName = spellItem.name;
        const spellLvl = spellItem.system.level;

        const spellFlag = new SpellFlag(spellName, spellLvl, circles, true, ManaSpellsModule.VERSION);
        return await this.setItemSpellFlag(actorId, itemId, spellFlag);
    }

    /**
     * This method "enrichens" the list of circles by converting the strings to Circle objects.
     * @param {string[]} circles An array of string values containing the names of the circles.
     * @returns {Circle[]} An array of Circle objects.
     */
    static async enrichenCirclesData(circles) {
        let enrichedCircles = [];
        for (let circle of circles) {
            const enrichedCircle = CircleDefinitions.getCircleFromName(circle);
            if (enrichedCircle == undefined) {
                ManaSpellsModule.log(true, "Could not find the circle: " + circle + 
                ". Please check the spelling of the circle name or the circles definitions.");
                return undefined;
            }

            enrichedCircles.push(enrichedCircle);
        }

        return enrichedCircles;
    }

    /**
     * This method looks up the spell-data from the circles data file.
     * @param {string} spellName The name of the spell to look up. 
     * @returns The spell data or undefined if the spell was not found.
     */
    static async lookupSpellCirclesData(spellName) {
        const circlesData = await SpellFileManagerApi.fetchDefaultJSON();
        const spell = circlesData.spells.find(spell => spell.name === spellName)
        return spell;
    }

}