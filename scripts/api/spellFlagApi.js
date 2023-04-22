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
    
    // Advanced Utility Functions for creating and preparing spell flags.

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
            return;
        }

        const spellName = spellItem.name;
        const spellData = await this.lookupSpellCirclesData(spellName);
        if (spellData == undefined) {
            ManaSpellsModule.log(true, "Could not find the spell: " + spellName + " in the Circles DB."+
            "\n Either the name in the db/item is wrong, or the spell is not in the db.");
            return;
        }

        const circles = await this.enrichenCirclesData(spellData.circles);
        if (circles == undefined) {
            ManaSpellsModule.log(true, "Could not match the circles from the spell: " + 
            spellName + " to the Circles Definitions.");
            return;
        }

        const spellFlag = new SpellFlag(spellName, spellItem.system.level, circles, false, ManaSpellsModule.VERSION);
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