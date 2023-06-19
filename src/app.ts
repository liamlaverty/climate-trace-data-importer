import { DbConnector } from './db/DbConnector.js';

import { CountryData } from "./models/csv-models";
import { DataInventory } from "./models/csv-models";
import { DataInventoryItem } from "./models/csv-models";
import { EnvVarValidator } from './EnvVarValidator.js';

import 'dotenv/config'

import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { CountryElectricityEmissionsConnector } from './db/table-connectors/CountryElectricityEmissionsConnector.js';
import { CountryElectricityGenerationEmissionsImporter } from './importers/CountryElectricityGenerationEmissionsImporter.js';
import { AssetEmissionsImporter } from './importers/AssetEmissionsImporter.js';
import { AssetEmissionsConnector } from './db/table-connectors/AssetEmissionsConnector.js';

class App {
    filePathAbs: string;
    db: DbConnector;
    countryList: CountryData[];
    inventoryList: [];
    __filename;
    __dirname;
    countryElectricityEmissionsConnector: CountryElectricityEmissionsConnector;
    assetEmissionsConnector: AssetEmissionsConnector;
    /**
     *
     */
    constructor() {
        EnvVarValidator.VerifyEnvVars();
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);

        this.filePathAbs = process.env.DATA_PACKAGE_FILE_PATH;
    }

    public Start = async () => {
        console.log('starting, setting up data');
        this.db = new DbConnector();
        this.countryElectricityEmissionsConnector = new CountryElectricityEmissionsConnector(this.db);
        this.assetEmissionsConnector = new AssetEmissionsConnector(this.db);

        this.SetCountryList();
        this.SetInventoryList();

        console.log('importing data');
        await this.ImportData();
        console.log('completed importing data');

    }

    /* 
    *   Gets the country list from the country-list.json file
    *   and saves it into `countryList`
    */
    private SetCountryList(): void {
        const filePath = path.resolve(this.__dirname, "../data-files/data/country-list.json");
        this.countryList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    /* 
    *   Gets the inventory list from the data-inventories.json file
    *   and saves it into `countryList`
    */
    private SetInventoryList(): void {
        const filePath = path.resolve(this.__dirname, "../data-files/data/data-inventories.json");
        this.inventoryList = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        // console.log(JSON.stringify(this.inventoryList))
    }

    /* 
    *   For each country in the countryList, searches for that country's non-forest-sectors
    *   and saves each of their emissions data into the database 
    */
    private ImportData = async () => {
        console.log('filepath: ' + this.filePathAbs);

        for (var c = 0; c < this.countryList.length; c++) {
            const thisCountry = this.countryList[c];
            if (thisCountry.alpha3 !== "GBR" && thisCountry.alpha3 !== "AFG") { continue; }

            for (var il = 0; il < this.inventoryList.length; il++) {
                const thisInventoryList: DataInventory = this.inventoryList[il];

                for (var inventoryIdx = 0; inventoryIdx < thisInventoryList.inventories.length; inventoryIdx++) {
                    const thisInventory: DataInventoryItem = thisInventoryList.inventories[inventoryIdx];

                    const filePath = path.resolve(this.filePathAbs, `./climate_trace/country_packages/non_forest_sectors/${thisCountry.alpha3}/${thisInventoryList.directory}/${thisInventory.fileName}`);
                    if (!fs.existsSync(filePath)) {
                        console.log(`${thisCountry.alpha3}: file at path did not exist: '${filePath}'`);
                    } else {
                        switch (thisInventory.fileName) {
                            //  case 'country_electricity-generation_emissions.csv':
                            //      await CountryElectricityGenerationEmissionsImporter.Import(filePath,
                            //          thisCountry.alpha3,
                            //          this.countryElectricityEmissionsConnector);
                            //      break;

                            //  case 'asset_aluminum_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;
                            //  case 'asset_cement_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;
                            //  case 'asset_electricity-generation_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;
                            //  case 'asset_coal-mining_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;
                            // case 'asset_steel_emissions.csv':
                            //    await AssetEmissionsImporter.Import(
                            //        filePath,
                            //        thisCountry.alpha3,
                            //        this.assetEmissionsConnector,
                            //        thisInventory.csvColumns);
                            //    break;
                            
                            //  case 'asset_oil-and-gas-refining_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;


                            //  case 'asset_oil-and-gas-production-and-transport_emissions.csv':
                            //      await AssetEmissionsImporter.Import(
                            //          filePath,
                            //          thisCountry.alpha3,
                            //          this.assetEmissionsConnector,
                            //          thisInventory.csvColumns);
                            //      break;

                            // case 'asset_solid-waste-disposal_emissions.csv':
                            //     await AssetEmissionsImporter.Import(
                            //         filePath,
                            //         thisCountry.alpha3,
                            //         this.assetEmissionsConnector,
                            //         thisInventory.csvColumns);
                            //     break;

                            case 'asset_domestic-aviation_emissions.csv':
                                await AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            default:
                                // console.log(`did not import file ${thisInventory.fileName}`);
                                break;
                        }
                    }
                }
            }
        }

        // console.log('completed import')
    }
}

const application = new App();
(async () => await application.Start())();
// console.log('completed')

