import { Collection, Db, MongoClient, WithId } from "mongodb";
import { Menu } from "../types/Menu";
import config from "../../config";
import { ParseSSISMenu } from "./EateryAPI";

const client: MongoClient = new MongoClient(config.databaseUri);

export async function isMenuSaved(weekNumber: number, year: number): Promise<boolean> {
    await client.connect();
    const database: Db = client.db();
    const result = await database.collection<Menu>("menus").findOne({ weekNumber, year });

    if (result == null) return false;

    return true;
}

export async function saveMenu(menu: Menu) {
    try {
        await client.connect();
        const database: Db = client.db();

        const collection: Collection<Menu> = database.collection<Menu>("menus");

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

    if (menu == null) {
        throw new Error("Menu not found!");
    }

    client.close();
    return menu;    
}