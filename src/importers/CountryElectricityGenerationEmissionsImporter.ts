import * as fs from 'fs';
import { parse } from 'csv-parse';
import { CountryElectricityEmissions } from '../models/db-models/CountryElectricityEmissions.js';
import { CountryElectricityEmissionsConnector } from '../db/table-connectors/CountryElectricityEmissionsConnector.js';

export class CountryElectricityGenerationEmissionsImporter {

    static Import = async(filePath: string, countryAlpha3: string, dbConn: CountryElectricityEmissionsConnector) => {
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
            ],
            fromLine: 2,
            cast: (columnVal, context) => {
                if (context.column == 'emissions_quantity') {
                    const res = parseInt(columnVal);
                    return isNaN(res) ? 0 : res;
                }
                else { return columnVal; }
            }
        }, async (error, result: CountryElectricityEmissions[]) => {
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