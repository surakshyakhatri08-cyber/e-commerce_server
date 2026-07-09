import app from './app';
import {connectDatabase} from './config/db.config';

const PORT = 8000;
const DB_URI = 'mongodb://localhost:27017';

//database connnection
connectDatabase(DB_URI);

app.listen(PORT, () => {
    console.log("Server is running at http://localhost:8000");
    console.log("Press ctrl+c for close the server");
});


//name, discription optional, logo/image in brand