import * as fs from 'fs';
import { parse } from 'csv-parse';
import { AssetElectricityGenerationEmissionsConnector } from '../db/table-connectors/AssetElectricityGenerationEmissionsConnector.js';
import { AssetEmissions } from '../models/db-models/AssetEmissions.js';


export class AssetElectricityGenerationEmissionsImporter {
    static Import = async(filePath: string, countryAlpha3: string, dbConn: AssetElectricityGenerationEmissionsConnector) => {
        console.log(`opening: ${filePath}`);
        console.log(`opening: ${filePath}`);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        parse(fileContents, {
            delimiter: ',',
            columns: [
                'asset_id',
                'iso3_country',
                'original_inventory_sector',
                'start_time',
                'end_time',
                'temporal_granularity',
                'gas',
                'emissions_quantity',
                'emissions_factor',
                'emissions_factor_units',
                'capacity',
                'capacity_units',
                'capacity_factor',
                'activity',
                'activity_units',
                'created_date',
                'modified_date',
                'asset_name',
                'asset_type',
                'st_astext',                
            ],
            fromLine: 2,
            cast: (columnVal, context) => {
                if (context.column == 'emissions_quantity' || 
                context.column == 'emissions_factor' ||
                context.column == 'capacity' ||
                context.column == 'capacity_factor' ) {
                    const res = parseInt(columnVal);
                    return isNaN(res) ? 0 : res;
                }
                else { return columnVal; }
            }
        }, async (error, result: AssetEmissions[]) => {
            if (error) {
                console.error(error);
            }
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                try {
                    const insResult = await dbConn.insert(result[i], null);
                } catch (er) {
                    console.error(`Err in ${countryAlpha3} on line ${i}: "${er}"`);
                }
            }
        });
    }
}