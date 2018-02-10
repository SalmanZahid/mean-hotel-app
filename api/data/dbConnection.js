var MongoClient = require('mongodb').MongoClient;
var connectionString = "mongodb://localhost:27017/meanhotel";

var _connection = null;

const open = () => {
    MongoClient.connect(connectionString, function(err, client){
        if(err) {
            console.log("Db Connection Failed");
            return;
        }

        console.log("Successfull");
        _connection = client.db('meanhotel');
    });
}

const get = () => {
    return _connection;
}

module.exports = {
    open: open,
    get: get
};