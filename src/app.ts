import { DbConnector } from './db/DbConnector.js';

import { CountryData } from "./models/csv-models";
import { DataInventory } from "./models/csv-models";
import { DataInventoryItem } from "./models/csv-models";
import { EnvVarValidator } from './EnvVarValidator.js';

import 'dotenv/config'

import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

import { CountryEmissionsConnector } from './db/table-connectors/CountryEmissionsConnector.js';
import { AssetEmissionsConnector } from './db/table-connectors/AssetEmissionsConnector.js';
import { CountryEmissionsImporter } from './importers/CountryEmissionsImporter.js';
import { AssetEmissionsImporter } from './importers/AssetEmissionsImporter.js';

class App {
    filePathAbs: string;
    db: DbConnector;
    countryList: CountryData[];
    inventoryList: [];
    __filename;
    __dirname;
    countryElectricityEmissionsConnector: CountryEmissionsConnector;
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
        this.countryElectricityEmissionsConnector = new CountryEmissionsConnector(this.db);
        this.assetEmissionsConnector = new AssetEmissionsConnector(this.db);

        this.SetCountryList();
        this.SetInventoryList();

        // console.log('importing data');
        this.ImportData();
        // console.log('completed importing data');

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
            //  if (thisCountry.alpha3 !== "GBR")// && thisCountry.alpha3 !== "AFG") 
            //  {
            //      continue;
            //  }

            for (var il = 0; il < this.inventoryList.length; il++) {
                const thisInventoryList: DataInventory = this.inventoryList[il];

                for (var inventoryIdx = 0; inventoryIdx < thisInventoryList.inventories.length; inventoryIdx++) {
                    const thisInventory: DataInventoryItem = thisInventoryList.inventories[inventoryIdx];

                    const filePath = path.resolve(this.filePathAbs, `./climate_trace/country_packages/non_forest_sectors/${thisCountry.alpha3}/${thisInventoryList.directory}/${thisInventory.fileName}`);
                    if (!fs.existsSync(filePath)) {
                        console.log(`${thisCountry.alpha3}: file at path did not exist: '${filePath}'`);
                    } else {
                        switch (thisInventory.fileName) {
                            case 'country_cropland-fires_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_enteric-fermentation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_manure-management_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-agricultural-soil-emissions_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_rice-cultivation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_synthetic-fertilizer-application_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-onsite-fuel-usage_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_residential-and-commercial-onsite-fuel-usage_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_fluorinated-gases_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_coal-mining_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_oil-and-gas-production-and-transport_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_oil-and-gas-refining_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-fossil-fuel-operations_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_solid-fuel-transformation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_aluminum_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_cement_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_chemicals_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-manufacturing_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_pulp-and-paper_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_steel_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_bauxite-mining_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_copper-mining_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_iron-mining_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_rock-quarrying_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_sand-quarrying_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_electricity-generation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-energy-use_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_domestic-aviation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_international-aviation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_other-transport_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_railways_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_road-transportation_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_shipping_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_biological-treatment-of-solid-waste-&-biogenic_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_incineration-and-open-burning-of-waste_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_solid-waste-disposal_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'country_wastewater-treatment-and-discharge_emissions.csv':
                                CountryEmissionsImporter.Import(filePath,
                                    thisCountry.alpha3,
                                    this.countryElectricityEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'asset_cropland-fires_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'asset_enteric-fermentation_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;

                            case 'asset_manure-management_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'asset_synthetic-fertilizer-application-top500_emissions.csv':
                                console.warn(`skipped asset_synthetic-fertilizer-application-top500_emissions for country ${thisCountry.alpha3} (enormous strings in CAN)`)
                                break;
                            case 'asset_rice-cultivation-top500_emissions.csv':
                                console.warn(`skipped asset_rice-cultivation-top500_emissions for country ${thisCountry.alpha3} (enormous files)`)
                                break;


                             case 'asset_aluminum_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;
                             case 'asset_cement_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;
                             case 'asset_electricity-generation_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;
                             case 'asset_coal-mining_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;
                            case 'asset_steel_emissions.csv':
                               AssetEmissionsImporter.Import(
                                   filePath,
                                   thisCountry.alpha3,
                                   this.assetEmissionsConnector,
                                   thisInventory.csvColumns);
                               break;

                             case 'asset_oil-and-gas-refining_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;


                             case 'asset_oil-and-gas-production-and-transport_emissions.csv':
                                 AssetEmissionsImporter.Import(
                                     filePath,
                                     thisCountry.alpha3,
                                     this.assetEmissionsConnector,
                                     thisInventory.csvColumns);
                                 break;

                            case 'asset_solid-waste-disposal_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;

                            case 'asset_domestic-aviation_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'asset_international-aviation_emissions.csv':
                                AssetEmissionsImporter.Import(
                                    filePath,
                                    thisCountry.alpha3,
                                    this.assetEmissionsConnector,
                                    thisInventory.csvColumns);
                                break;
                            case 'asset_road-transportation_emissions.csv':
                                console.warn(`skipped road transport emissions for country ${thisCountry.alpha3} (geodata not implemented)`)
                                break;
                            case 'asset_shipping_emissions.csv':
                                console.warn(`skipped shipping transport emissions for country ${thisCountry.alpha3} (geodata not implemented)`)
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
application.Start().then(() => console.log('complete - wait for terminal to return control'));

// (async () => application.Start())();
// console.log('completed')

