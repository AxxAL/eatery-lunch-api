require("dotenv").config();
import { Collection, Db, MongoClient } from "mongodb";
import { Menu } from "../types/Menu";

const client: MongoClient = new MongoClient(String(process.env.DB_URI));

export async function isMenuSaved(weekNumber: number, year: number): Promise<boolean> {
    await client.connect();
    const database: Db = client.db();
    
    return database.collection<Menu>("menus").findOne({ weekNumber, year }) == null;
}

export async function saveMenu(menu: Menu) {
    try {
        await client.connect();
        const database: Db = client.db();

        const collection: Collection<Menu> = database.collection<Menu>("menus");

        if (await isMenuSaved(menu.GetWeek(), menu.GetYear())) return;

        const result = await collection.insertOne(menu);

        console.log(`Saved menu for week ${menu.GetWeek()} to database! Document ID: ${result.insertedId}`);

    } finally {
        await client.close();
    }
}

export async function getMenu(weekNumber: number, year: number): Promise<Menu> {

    await client.connect();
    const database: Db = client.db();

    const collection: Collection<Menu> = database.collection<Menu>("menus");
    const menu = await collection.findOne<Menu>(
        {
            weekNumber,
            year
        },
        {
            projection: {
                _id: 0,
                weekNumber: 1, 
                year: 1,
                days: 1
            }
        }
    );
    if (!menu) {
        throw new Error("Menu not found!");
    } else {
        client.close();
        return menu;
    }
}