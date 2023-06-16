import pkg from 'pg';
import client from 'pg';
const { Pool } = pkg;
const { Client } = client

const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
  })

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


