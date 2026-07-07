import express from 'express';

const app = express();

app.use(express.json());




app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000");
    console.log("Press ctrl+c for close the server");
});