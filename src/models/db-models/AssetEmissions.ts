import { TrackedDataEntity } from "./TrackedDataEntity.js";

export class AssetEmissions extends TrackedDataEntity {
    static tableName: string = 'asset_emissions';

    asset_id: string;
    iso3_country: string;
    original_inventory_sector: string;
    start_time: string;
    end_time: string;
    temporal_granularity: string;
    gas: string;
    emissions_quantity: string;
    emissions_factor: string;
    emissions_factor_units: string;
    capacity: string;
    capacity_units: string;
    capacity_factor: string;
    activity: string;
    activity_units: string;
    created_date: string;
    modified_date: string;
    asset_name: string;
    asset_type: string;
    st_astext: string;
}

