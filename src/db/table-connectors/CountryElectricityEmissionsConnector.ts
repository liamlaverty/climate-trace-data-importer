import { CountryElectricityEmissions } from "../../models/db-models/CountryElectricityEmissions.js";
import { DbConnector } from "../DbConnector.js";

export class CountryElectricityEmissionsConnector {
    database: DbConnector;
    /**
     *
     */
    constructor(conn: DbConnector) {
        this.database = conn;
    }

    public insert = async(country_emissions: CountryElectricityEmissions, callback) => {
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
                CountryElectricityEmissions.origin_source,
                country_emissions.created_date,
                country_emissions.modified_date.length > 0 ? country_emissions.modified_date : null,
                dateNow,
                dateNow
            ]
        }
        // console.log(query);
        return await this.database.insert(query, callback);
    }
    

}