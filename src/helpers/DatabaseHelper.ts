require("dotenv").config();
import { Connection, ConnectionConfig, createConnection } from "mysql";

const databaseConf: ConnectionConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
}

const connection: Connection = createConnection(databaseConf);

export async function createMenuTable() {
    const SQL = "CREATE TABLE IF NOT EXISTS menus (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, week_number INT, year INT)";
    connection.query(SQL, err => {
        if (err) {
            throw new Error("Could not create table in database! " + err);
        }
        console.log("Created database table!");
    });
}

export async function saveMenu() {
    connection.connect(() => {

    });
}