import { TrackedDataEntity } from "./TrackedDataEntity.js";

export class AssetOwnership extends TrackedDataEntity {    
    static tableName: string = 'asset_ownership';

    asset_id: string;
    asset_name: string;
    owner_name: string;
    owner_classification: string;
    percentage_of_ownership: string;
    owner_direct_parent: string;
    owner_grouping: string;
    operator_name: string;
    percentage_of_operation: string;
    data_source: string;
    url: string;
    recency: string;
    created_date: string;
    original_inventory_sector: string;

}