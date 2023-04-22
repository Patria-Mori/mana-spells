// This section contains all the used hooks and their callbacks.
/**
 * This hook is called by the DevMode module when it is ready.
 */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    // Registers the module's debug flag with the dev mode module if it is installed.
    registerPackageDebugFlag(ManaSpellsModule.ID);
});


/**
 * A hook event that fires as Foundry is initializing, right before any initialization tasks have begun.
 */
Hooks.on("init", async function () {
    registerSpellsModuleSettings();
    SpellFileManagerApi.copyCircleDataToWorld();
});

/**
 * A hook event that fires when the game is fully ready.
 * Useful when you need the game data to be fully initialised.
 */
Hooks.on("ready", async function () {
    // SpellFlagApi.initialiseAllSpellFlags(); TODO: Uncomment this later (keeping it commented since porting all the spells might cause some errors).
    // SpellFlagApi.updateAllSpellFlags();
});

/**
 * Fires when an item is used, after the measured template has been created if one is needed.
 * @param {Item5e} item Item being used.
 * @param {ItemUseConfiguration} config Configuration data for the roll.
 * @param {ItemUseOptions} options Additional options for configuring item usage.
 */
Hooks.on("dnd5e.useItem", async function(item, config, options) {
    callSpellApi(item);
});

/**
 * Fires when an item is used, calling the SpellApi to cast the spell if it is a spell (and not a cantrip).
 * @param {Item5e} item Item being used.
 */
async function callSpellApi(item) {
    if (item.type == "spell" && item.system.level > 0) {
        const actorId = item.parent._id;
        const itemId = item._id;

        const spellFlag = await SpellFlagApi.getItemSpellFlag(actorId, itemId);

        const baseLvl = spellFlag.baseLvl;
        const castLvl = item.system.level;
        const reaction = item.system.activation.type.startsWith("reaction");

        const spell = new Spell(baseLvl, castLvl, spellFlag.circles, reaction);
        
        SpellApi.castSpell(spell, actorId);
    } 
}