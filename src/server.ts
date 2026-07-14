import 'dotenv/config';
import app from './app';
import {connectDatabase} from './config/db.config';
import ENV_CONFIG from './config/env.config';

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI!!;

//database connnection
connectDatabase(DB_URI);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log("Press ctrl+c for close the server");
});

