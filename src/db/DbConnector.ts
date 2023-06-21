import pkg from 'pg';
import client from 'pg';
import { CountryEmissions } from '../models/db-models/CountryEmissions.js';
const { Pool } = pkg;
const { Client } = client

export class DbConnector {

    private pool;

    /**
     *
     */

    constructor() {
        this.pool = new Pool();
    }

    public query = async (text, params, callback) => {
        const client = await this.pool.connect();
        const result = client.query(text, params, callback);
        try {
            await result;
        } catch (error) {
            console.error('err ' + error);
            throw error;
        }
        client.release();
        return result;
    }

    public insert = async (query, callback) => {
        const client = await this.pool.connect();
        const result = client.query(query);
        try {
            await result;
        } catch (error) {
            console.error(error);
            throw error;
        }
        client.release();
        return result;
    }




   

}


