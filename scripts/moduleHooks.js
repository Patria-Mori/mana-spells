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
});

/**
 * A hook event that fires when the game is fully ready.
 * Useful when you need the game data to be fully initialised.
 */
Hooks.on("ready", async function () {

});