/**
 * This class represents a "spell flag", which is a flag that is set on a spell item.
 * It is attached to the spell item as a flag, and contains the data for the spell.
 * 
 * It can be used to derive Spell objects used for the mana-circle module.
 */
class SpellFlag {

    name = null;
    baseLvl = 0;
    circles = [];
    custom = false;
    modVersion = null;

    /**
     * Creates a new SpellFlag object.
     * @param {string} name         The name of the spell.
     * @param {number} baseLvl      The base level of the spell.
     * @param {Circle[]} circles    The circles that comprise the spell.
     * @param {boolean} custom      Whether or not the spell is a custom spell.
     * @param {string} modVersion   The version of the module that the spell was created in.
     */
    constructor(name, baseLvl, circles, custom, modVersion) {
        this.name = name;
        this.baseLvl = baseLvl;
        this.circles = circles;
        this.custom = custom;
        this.modVersion = modVersion;
    }

    /**
     * Compares the other object to this one to see if they are equal.
     * Two SpellFlag objects are equal if they have the same name and circles.
     * @param {SpellFlag} other
     * @returns {boolean}  Whether or not the two objects are equal.
     */
    equals(other) {
        if (this.name != other.name) {
            return false;
        }

        if (this.circles.length != other.circles.length) {
            return false;
        } else {
            for (let i = 0; i < this.circles.length; i++) {
                if (!this.circles[i].equals(other.circles[i])) {
                    return false;
                }
            }
        }

        return true;
    }

}