/* 
 * TS models of the datatypes found in csvs
*/

export class CountryData {
    name: string;
    countryCode: string;
    alpha3: string;
}
export class DataInventory {
    directory: string;
    inventories: DataInventoryItem[];
}
export class DataInventoryItem{
    destinationTable: string;
    fileName: string;
}