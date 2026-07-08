import mongoose  from "mongoose";

export const connectDatabase = (DB_URI: string) => {
    mongoose.connect(DB_URI, {
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
};
