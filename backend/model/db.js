const createMySQLConnection = require('../config/mysql');

let db;

const connectToDB = async () => {
    if (!db) {
        db = await createMySQLConnection();
    }
    return db;
};

module.exports = connectToDB;
