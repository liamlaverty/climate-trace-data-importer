import * as fs from 'fs';
import { parse } from 'csv-parse';
import { AssetEmissionsConnector } from '../db/table-connectors/AssetEmissionsConnector.js';
import { AssetEmissions } from '../models/db-models/AssetEmissions.js';


export class AssetEmissionsImporter {
    static Import = async(filePath: string, countryAlpha3: string, dbConn: AssetEmissionsConnector, includeActivityColumns: Boolean = false) => {
        console.log(`opening: ${filePath}`);
        const fileContents = fs.readFileSync(filePath, 'utf-8');

        const tableColumns = [
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
            'created_date',
            'modified_date',
            'asset_name',
            'asset_type',
            'st_astext',       
        ];
        if (includeActivityColumns){
            // some csv sets don't include this data, others do
            // 
            tableColumns.splice(13, 0, 'activity','activity_units'
            )
        }

        parse(fileContents, {
            delimiter: ',',
            columns: tableColumns,
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
            // console.log(result);
            for (var i = 0; i < result.length; i++) {
                try {
                    const insResult = await dbConn.insert(result[i], null);
                } catch (er) {
                    console.error(`Err in ${countryAlpha3} on csv-line ${i}: "${er}. Data: ${result[i]}"`);
                }
            }
        });
    }
}