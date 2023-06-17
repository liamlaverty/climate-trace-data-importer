import { DbConnector } from './db/connector.js';

import { CountryData } from "./models/csv-models";
import { DataInventory } from "./models/csv-models";
import { DataInventoryItem } from "./models/csv-models";
import { EnvVarValidator } from './EnvVarValidator.js';

import 'dotenv/config'

import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { country_electricity_emissions } from "./models/db-models/country_electricity_emissions";

class App {
    filePathAbs: string;
    db: DbConnector;
    countryList: CountryData[];
    inventoryList: [];
    __filename;
    __dirname;
    /**
     *
     */
    constructor() {
        EnvVarValidator.VerifyEnvVars();
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);

        this.filePathAbs = process.env.DATA_PACKAGE_FILE_PATH;
    }

    public Start() {
        console.log('starting, setting up data');
        this.db = new DbConnector();

        this.SetCountryList();
        this.SetInventoryList();

        console.log('importing data');
        this.ImportData();
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
    private async ImportData() {
        console.log('filepath: ' + this.filePathAbs);


        this.countryList.forEach(country => {
            if (country.alpha3 === "GBR") { //  || country.alpha3 === 'USA') {
                // restrict to GBR for testing
                // console.log(`importing ${country.name} - ${country.alpha3}`)
                this.inventoryList.forEach((inventoryList: DataInventory) => {
                    // console.log(country.alpha3 + '--> ' + inventoryList.directory);
                    inventoryList.inventories.forEach((inventory: DataInventoryItem) => {
                        if (inventory.fileName == 'country_electricity-generation_emissions.csv') {

                            // foreach row in the db, insert

                            const filePath = path.resolve(this.filePathAbs, `./climate_trace/country_packages/non_forest_sectors/${country.alpha3}/${inventoryList.directory}/${inventory.fileName}`);
                            console.log(`opening: ${filePath}`);
                            const fileContents = fs.readFileSync(filePath, 'utf-8');
                            parse(fileContents, {
                                delimiter: ',',
                                columns: [
                                    'iso3_country',
                                    'start_time',
                                    'end_time',
                                    'original_inventory_sector',
                                    'gas',
                                    'emissions_quantity',
                                    'emissions_quantity_units',
                                    'temporal_granularity',
                                    'created_date',
                                    'modified_date'
                                ]
                            }, (error, result: country_electricity_emissions[]) => {
                                if (error) {
                                    console.error(error);
                                }
                                console.log(result); 
                                for (var i = 1; i < result.length; i++){
                                    const insResult = this.db.insert_country_electricity_emissions(result[i], null);
                                }
                            })

                            // then run select * from 
                            let result = this.db.query(
                                'SELECT * FROM country_electricity_emissions', null, null
                            );
                            // console.log('result' + result);
                        }
                    });
                });

            }
        });
        // find files in the path:
        // \climate_trace\country_packages\non_forest_sectors\GBR\power\country_electricity-generation_emissions.csv


        fs.readdir(this.filePathAbs, (err, files) => {
            files.forEach(file => {
                console.log(file)
            });

        });

    }

}

const application = new App();
application.Start();


