import { error } from "console";

export class EnvVarValidator{
    /* 
    *   Verifies the process env vars are all set in this environment, 
    *   if not, exits the program with an exception
    */
    public static VerifyEnvVars(): void {
        const envVarKeys = [
            'DATA_PACKAGE_FILE_PATH',
            'PGHOST',
            'PGUSER',
            'PGDATABASE',
            'PGPASSWORD',
            'PGPORT'
        ];

        const errors = [];
        for (let i = 0; i < envVarKeys.length; i++) {
            const pEnvVar = process.env[envVarKeys[i]];
            if (pEnvVar === null || pEnvVar === undefined || pEnvVar.length === 0) {
                errors.push(`Process env var '${envVarKeys[i]}' was null or undefined. Set inside the file '.env' in the root of this project`)

            }
        }

        if (errors.length > 0) {
            let errMessage = `${errors.length} errors in envvars. Errors:`;
            let idx = 0;
            errors.forEach(thisErr => {
                errMessage += ` |Err ${idx}: ${thisErr}`;
                idx++;
            });
            throw new Error(errMessage)
        }
        
        console.log('all env vars were set correctly');
    }
}