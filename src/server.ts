import 'dotenv/config';
import app from './app';
import {connectDatabase} from './config/db.config';
import ENV_CONFIG from './config/env.config';
import { verifySMTP} from './config/nodemailer.config';

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI!!;

//database connnection
connectDatabase(DB_URI);

app.listen(PORT, async () => {
    await verifySMTP();
    console.log(`Server is running at http://localhost:${PORT}`);
    // await sendEmail();
    console.log("Press ctrl+c for close the server");
});

