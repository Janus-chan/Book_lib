const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let database;

async function getDatabase(params) {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017/")
    database = client.db("shop");

    if (!database) {
        console.log("database not connected");
    }

    return database;
}
module.exports = {getDatabase,ObjectID};
