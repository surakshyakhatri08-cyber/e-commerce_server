import express from 'express';

const app = express();

app.use(express.json());

//health route
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "server is up and running",
        status: "success",
        data: null,
    });
});

export default app;