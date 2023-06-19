import * as fs from 'fs';
import { parse } from 'csv-parse';
import { AssetEmissionsConnector } from '../db/table-connectors/AssetEmissionsConnector.js';
import { AssetEmissions } from '../models/db-models/AssetEmissions.js';


export class AssetEmissionsImporter {
    static Import = async(filePath: string, countryAlpha3: string, dbConn: AssetEmissionsConnector, 
        csvColumns: string[]
        ) => {
        console.log(`opening: ${filePath}`);
        const fileContents = fs.readFileSync(filePath, 'utf-8');

        parse(fileContents, {
            delimiter: ',',
            columns: csvColumns,
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
                console.error(`error reading ${filePath}` + error);
            }
            // console.log(result);
            for (var i = 0; i < result.length; i++) {
                try {
                    const insResult = await dbConn.insert(result[i], null);
                } catch (er) {
                    console.error(`Err in ${countryAlpha3} on csv-line ${i}: "${er}. Data: ${JSON.stringify(result[i])}"`);
                }
            }
        });
    }
}