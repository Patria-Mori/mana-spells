/**
 * Due to the complexity of managing files in the application I have implemented this class, 
 * which takes care of the heavy lifting.
 * 
 * In this module the file storage is used as a sort of "database" for the module, and a reference,
 * though each spell actually stores a local copy of the data, which may be customized.
 */
class SpellFileManagerApi {

    static source = "data";
    static path = "modules/mana-spells";

}


