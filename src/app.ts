import { CountryData } from "./models/csv-models";
import { DataInventory } from "./models/csv-models";
import { DataInventoryItem } from "./models/csv-models";
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { country_electricity_emissions } from "./models/db-models/country_electricity_emissions";

class App {
    filePathAbs: string;
    countryList: CountryData[];
    inventoryList: [];
    __filename;
    __dirname;
    /**
     *
     */
    constructor() {
        this.filePathAbs = '';
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);
    }

    public Start() {
        console.log('starting, setting up data');
        this.SetFilePath();
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
    *   Gets the app settings, then sets the location of the data_packages from 
    *   ClimateTrace into the `filePathAbs` var   
    */ 
    private SetFilePath(): void {
        const filePath = path.resolve(this.__dirname, "../data-files/importer-settings.json");

        var dataArray = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        this.filePathAbs = dataArray.dataPackagesFilePath;
        if (!this.filePathAbs){
            throw new Error('must pass param `filepath`')
        }
    }

    /* 
    *   For each country in the countryList, searches for that country's non-forest-sectors
    *   and saves each of their emissions data into the database 
    */ 
    private ImportData() {
        console.log('filepath: ' + this.filePathAbs);


        this.countryList.forEach(country => {
            if (country.alpha3 === "GBR"){
                // restrict to GBR for testing
                console.log(`importing ${country.name} - ${country.alpha3}`)
                this.inventoryList.forEach((inventoryList:  DataInventory) => {
                    console.log('--> ' + inventoryList.directory);
                    inventoryList.inventories.forEach((inventory: DataInventoryItem) => {
                        if (inventory.fileName == 'country_electricity-generation_emissions.csv')
                        console.log('-- --> ' + inventory.fileName + ' into ' + inventory.destinationTable);
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


