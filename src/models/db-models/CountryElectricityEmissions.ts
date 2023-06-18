import { TrackedDataEntity } from "./TrackedDataEntity.js";


export class CountryElectricityEmissions extends TrackedDataEntity {

    static tableName: string = 'country_electricity_emissions';

    id: string;
    iso3_country: string;
    start_time: string;
    end_time: string;
    original_inventory_sector: string;
    gas: string;
    emissions_quantity: number;
    emissions_quantity_units: string;
    temporal_granularity: string;
    created_date: string;
    modified_date: string;
}