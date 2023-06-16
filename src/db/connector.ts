import pkg from 'pg';
import client from 'pg';
const { Pool } = pkg;
const { Client } = client

const pool = new Pool();

export class DbConnector {
    /**
     *
     */
    constructor() {
    }

    public query(text, params, callback) {
        console.log(`executing query ${text} ${params}`);
        return pool.query(text, params, callback);
    }
        
    
}


