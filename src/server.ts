import mongoose from 'mongoose';
import app from './app';

mongoose.connect('mongodb://localhost:27017', {
    autoCreate: true,
    dbName: 'e-commerce_db',
})
.then(() => {
    console.log("Database Connected");
})
.catch((error) => {
    console.log("Database Connection Failed");
    console.log(error);
});

app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000");
    console.log("Press ctrl+c for close the server");
});