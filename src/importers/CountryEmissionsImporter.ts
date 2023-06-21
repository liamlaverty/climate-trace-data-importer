import * as fs from 'fs';
import { parse } from 'csv-parse';
import { CountryEmissions } from '../models/db-models/CountryEmissions.js';
import { CountryEmissionsConnector } from '../db/table-connectors/CountryEmissionsConnector.js';

export class CountryEmissionsImporter {

    static Import = async(filePath: string, countryAlpha3: string, dbConn: CountryEmissionsConnector, 
        csvColumns: string[]) => {
        console.log(`opening: ${filePath}`);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        parse(fileContents, {
            delimiter: ',',
            columns: csvColumns,
            fromLine: 2,
            cast: (columnVal, context) => {
                if (context.column == 'emissions_quantity') {
                    const res = parseInt(columnVal);
                    return isNaN(res) ? 0 : res;
                }
                else { return columnVal; }
            }
        }, async (error, result: CountryEmissions[]) => {
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