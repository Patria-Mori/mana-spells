/**
 * This class contains the configuration for the module.
 */
class ManaSpellsModule {

    // Config stuff
    static ID = 'mana-spells';
    static VERSION = '0.1.0'; // The version is used to determine if the data models need to be updated.

    // The flags used in the module.
    static FLAGS = {

    }

    // The Handlebars templates used in the module.
    static TEMPLATES = {

    }

    /**
     * Used to log messages to the console with the module ID as a prefix.
     * @param {boolean} force   Whether or not to force the log message to be displayed. 
     * @param  {...any} args    The arguments to pass to the console.log function.
     */
    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

}