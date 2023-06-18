import { AssetEmissions } from "../../models/db-models/AssetEmissions.js";
import { DbConnector } from "../DbConnector.js";

export class AssetElectricityGenerationEmissionsConnector {
    database: DbConnector; 

    /**
     *
     */
    constructor(conn: DbConnector) {
        this.database = conn;        
    }

    public insert = async (asset_emissions: AssetEmissions, callback) => {
        const dateNow = new Date().toISOString();
        const query = {
            name: 'insert-asset-emissions',
            text: `INSERT INTO asset_emissions (
                asset_id, 
                iso3_country, 
                original_inventory_sector, 
                start_time, 
                end_time,
                temporal_granularity, 
                gas, 
                emissions_quantity, 
                emissions_factor, 
                emissions_factor_units,
                capacity, 
                capacity_units, 
                capacity_factor, 
                activity, 
                activity_units, 
                source_created_date,
                source_modified_date, 
                asset_name, 
                asset_type, 
                st_astext,
                origin_source, 
                created_date, 
                modified_date)
                
                VALUES(
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
                )
                ON CONFLICT
                    ON CONSTRAINT asset_emissions_pkey
                        DO NOTHING`,
            values: [
                asset_emissions.asset_id,
                asset_emissions.iso3_country,
                asset_emissions.original_inventory_sector,
                asset_emissions.start_time,
                asset_emissions.end_time,
                asset_emissions.temporal_granularity,
                asset_emissions.gas,
                asset_emissions.emissions_quantity,
                asset_emissions.emissions_factor,
                asset_emissions.emissions_factor_units,
                asset_emissions.capacity,
                asset_emissions.capacity_units,
                asset_emissions.capacity_factor,
                asset_emissions.activity,
                asset_emissions.activity_units,
                asset_emissions.created_date,
                asset_emissions.modified_date,
                asset_emissions.asset_name,
                asset_emissions.asset_type,
                asset_emissions.st_astext,
                AssetEmissions.origin_source,
                dateNow,
                dateNow
            ]
        }
        return await this.database.insert(query, callback);
    }
}