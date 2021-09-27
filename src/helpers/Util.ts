import { access, readdir, writeFile } from "fs/promises";
import { readFile } from "fs";
import { join } from "path";
import { Menu } from "../types/Menu";

const cachePath: string = join(__dirname, "../../cache");

/**
 * Removes null, undefined and empty strings from array and returns it.
 */
export async function RemoveEmptyElements(array: any[]): Promise<any[]> {
    for (let i = 0; i < array.length; i++){
        if (array[i] == "") array[i] = null; // Sets element to null if it is an empty string or whitespace.
    } // Goes through every element and checks for whitespace or if string is empty.
    array = array.filter((a) => a); // Removes all null & undefined elements.
    return array;
}

/**
 * Caches menu.
 */
/* TODO: Fix this.
export async function CacheMenu(menu: Menu): Promise<void> {

    if (await IsMenuCached(menu.GetWeekNumber())) return;

    const menuPath: string = join(cachePath, `menu-week-${menu.GetWeekNumber()}.json`);

    await writeFile(menuPath, JSON.stringify(menu))
        .then(() => console.log(`Cached menu: ${menuPath}`))
        .catch((err) => console.error(err));
}*/

/**
 * Returns true if menu is cached.
 */
/* TODO: Fix this.
export async function IsMenuCached(weekNumber: number): Promise<boolean> {
    await access(join(cachePath, `menu-week-${weekNumber}.json`))
        .then(() => {
            return true;
        }).catch((err) => console.error(`This week's menu is not cached. ${err}`));
    return false;
}*/

/**
 * Takes weeknumber and tries to find cached menu.
 */
/* TODO: Fix this.
export async function GetMenuByWeek(weekNumber: number): Promise<Menu | void> {
    if (!(await IsMenuCached(weekNumber))) return;

    let menu: Menu;

    try {
        readFile(join(cachePath, `menu-week-${weekNumber}.json`), (err, data) => {
            if (err) throw err;

            const json = JSON.parse(data.toString());

            menu = new Menu(json.weekNumber);
            json.days.forEach(day => {
                menu.AddDay(day);
            });
        });
    } catch (error) {
        console.error(error);
    }
    return menu;
}*/