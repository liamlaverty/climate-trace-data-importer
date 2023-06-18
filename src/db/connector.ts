import pkg from 'pg';
import client from 'pg';
import { country_electricity_emissions } from '../models/db-models/country_electricity_emissions.js';
const { Pool } = pkg;
const { Client } = client


export class DbConnector {

    private pool;

    /**
     *
     */

    constructor() {
        this.pool = new Pool();
    }

    public query = async (text, params, callback) => {
        const client = await this.pool.connect();
        const result = client.query(text, params, callback);
        try {
            await result;
        } catch (error) {
            console.error('err ' + error);
            throw error;
        }
        client.release();
        return result;
    }

    private insert = async (query, callback) => {
        const client = await this.pool.connect();
        const result = client.query(query);
        try {
            await result;
        } catch (error) {
            console.error(error);
            throw error;
        }
        client.release();
        return result;
    }




    public insert_country_electricity_emissions = async(country_emissions: country_electricity_emissions, callback) => {
        // console.log(`upserting query ${JSON.stringify(country_emissions)}`);
        const dateNow = new Date().toISOString();
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
                )
                ON CONFLICT
                    ON CONSTRAINT country_electricity_emissions_pkey
                        DO NOTHING
                `,
            values: [
                country_emissions.iso3_country,
                country_emissions.start_time,
                country_emissions.end_time,
                country_emissions.original_inventory_sector,
                country_emissions.gas,
                country_emissions.emissions_quantity,
                country_emissions.emissions_quantity_units,
                country_emissions.temporal_granularity,
                country_electricity_emissions.origin_source,
                country_emissions.source_created_date,
                country_emissions.source_modified_date,
                dateNow,
                dateNow
            ]
        }
        console.log(query);
        return await this.insert(query, callback);
    }

}


