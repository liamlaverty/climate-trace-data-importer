import pkg from 'pg';
import client from 'pg';
import { country_electricity_emissions } from '../models/db-models/country_electricity_emissions.js';
const { Pool } = pkg;
const { Client } = client

const pool = new Pool();

export class DbConnector {
    /**
     *
     */
    constructor() {
    }

    public query(text, params, callback) {
        console.log(`executing query ${text} ${params}`);
        return pool.query(text, params, callback);
    }

    private insert(query, callback) {
        return pool.query(query);
    }
        

    public insert_country_electricity_emissions(country_emissions: country_electricity_emissions, callback) {
        // console.log(`upserting query ${JSON.stringify(country_emissions)}`);
        const dateNow = Date.parse(new Date().toUTCString());
        const query = {
            name: 'insert-country-electricity-emissions',
            text: 
            `INSERT INTO country_electricity_emissions(
                iso3_country, 
                start_time, 
                end_time, 
                original_inventory_sector, 
                gas,
                emissions_quantity, 
                emissions_quantity_units, 
                temporal_granularity,
                origin_source, 
                source_created_date, 
                source_modified_date, 
                created_date,
                modified_date) 
                
                VALUES(
                    $1, 
                    $2, 
                    $3, 
                    $4, 
                    $5, 
                    $6,
                    $7, 
                    $8, 
                    $9,
                    $10, 
                    $11, 
                    $12, 
                    $13
                )`,
            values: [
                country_emissions.iso3_country,
                null, //Date.parse(country_emissions.start_time),
                null, //Date.parse(country_emissions.end_time),
                country_emissions.original_inventory_sector,
                country_emissions.gas,
                country_emissions.emissions_quantity,
                country_emissions.emissions_quantity_units,
                country_emissions.temporal_granularity,
                country_electricity_emissions.origin_source,
                null, //Date.parse(country_emissions.source_created_date),
                null, //Date.parse(country_emissions.source_modified_date),
                null, //dateNow,
                null, //dateNow
            ]
        }
        console.log(query);
        return this.insert(query, callback);
    }
    
}


