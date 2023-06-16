export class EnvVarValidator{
    /* 
    *   Verifies the process env vars are all set in this environment, 
    *   if not, exits the program with an exception
    */
    public static VerifyEnvVars(): void {
        const envVarKeys = [
            'DATA_PACKAGE_FILE_PATH',
            // 'POSTGRES_USER',
            // 'POSTGRES_PASSWORD',
            // 'POSTGRES_DB',
            'PGHOST',
            'PGUSER',
            'PGDATABASE',
            'PGPASSWORD',
            'PGPORT'
        ];

        for (let i = 0; i < envVarKeys.length; i++) {
            const pEnvVar = process.env[envVarKeys[i]];
            if (pEnvVar === null || pEnvVar === undefined || pEnvVar.length === 0) {
                throw new Error(`Process env var '${envVarKeys[i]}' was null or undefined. Set inside the file '.env' in the root of this project`);
            }
        }
        
        console.log('all env vars were set correctly');
    }
}