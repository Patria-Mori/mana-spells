/**
 * Due to the complexity of managing files in the application I have implemented this class, 
 * which takes care of the heavy lifting.
 * 
 * In this module the file storage is used as a sort of "database" for the module, and a reference,
 * though each spell actually stores a local copy of the data, which may be customized.
 */
class SpellFileManagerApi {

    // TODO: Replace "mana-spells" with reference to the module's ID.
    static source = "data";
    static circlesDataPath = "modules/mana-spells/data/circles.json"; // The path to the circles data file.

    /**
     * This method copies the circles data from the module's data folder to the world's data folder,
     * if the world does not already have a copy of the data.
     */
    static async copyCircleDataToWorld() {
        // Get the path to the world's data folder with the module's data folder appended.
        const folderPath = await this.getWorldPath() + "/mana-spells";
        // The test variable is used to check if the world already has a copy of the circles data.
        const test = this.fetchJSON(folderPath + "/circles.json");

        test.catch(error => {
            ManaSpellsModule.log(true, "No circles data found in world data folder, creating a copy.");

            const circlesData = this.fetchJSON(this.circlesDataPath);
            FilePicker.createDirectory(this.source, folderPath);
            this.writeJSON(this.source, folderPath, circlesData, "circles.json");
        });

    }

    /**
     * This method fetches a JSON file from the given path.
     * @param {string} path The path to the JSON file. 
     * @returns The JSON data.
     */
    static async fetchJSON(path) {
        const response = await fetch(path);
        const data = await response.json();

        return data;
    }

    /**
     * This method gets the path to the world's data folder.
     * @returns {string} The path to the world's data folder.
     */
    static async getWorldPath() {
        return `worlds/${game.world.id}`;
    }

    /**
     * This method writes a JSON file to the given path.
     * @param {string} source   The source of the file (e.g. the top-level folder under "FoundryVTT").
     * @param {string} path     The path to the folder where the file should be written.
     * @param {*} data          The data to write to the file.
     * @param {string} fileName The name of the file. 
     */
    static async writeJSON(source, path, data, fileName) {
        const file = new File([JSON.stringify(data, null, '')], fileName, { type: "application/json" });
        FilePicker.upload(source, path, file);
    }

}

