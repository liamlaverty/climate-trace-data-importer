import { DbConnector } from './db/connector.js';

import { CountryData } from "./models/csv-models";
import { DataInventory } from "./models/csv-models";
import { DataInventoryItem } from "./models/csv-models";

import 'dotenv/config'

import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
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
        this.VerifyEnvVars();
        this.filePathAbs = '';
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);
        this.db = new DbConnector();


        this.filePathAbs = process.env.DATA_PACKAGE_FILE_PATH;

    }

    public Start() {
        console.log('starting, setting up data');
        this.VerifyEnvVars();
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
    *   Verifies the process env vars are all set in this environment, 
    *   if not, exits the program with an exception
    */
    private VerifyEnvVars(): void {
        const envVarKeys = [
            'DATA_PACKAGE_FILE_PATH',
            'POSTGRES_USER',
            'POSTGRES_PASSWORD',
            'POSTGRES_DB'
        ];

        for (let i = 0; i < envVarKeys.length; i++) {
            const pEnvVar = process.env[envVarKeys[i]];
            if (pEnvVar === null || pEnvVar === undefined || pEnvVar.length === 0) {
                throw new Error(`Process env var '${envVarKeys[i]}' was null or undefined. Set inside the file '.env' in the root of this project`);
            }
        }
    }


    /* 
    *   For each country in the countryList, searches for that country's non-forest-sectors
    *   and saves each of their emissions data into the database 
    */
    private async ImportData() {
        console.log('filepath: ' + this.filePathAbs);


        this.countryList.forEach(country => {
            if (country.alpha3 === "GBR" || country.alpha3 === 'USA') {
                // restrict to GBR for testing
                // console.log(`importing ${country.name} - ${country.alpha3}`)
                this.inventoryList.forEach((inventoryList: DataInventory) => {
                    // console.log(country.alpha3 + '--> ' + inventoryList.directory);
                    inventoryList.inventories.forEach((inventory: DataInventoryItem) => {
                        if (inventory.fileName == 'country_electricity-generation_emissions.csv') {
                            // console.log('-- --> ' + inventory.fileName + ' into ' + inventory.destinationTable);
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


