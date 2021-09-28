import { access, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Menu } from "../types/Menu";
import { WeekDay } from "../types/WeekDay";

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
 * Caches menu by saving it to the cache directory.
 */
export async function CacheMenu(menu: Menu): Promise<void> {

    const menuPath: string = join(cachePath, `menu-week-${menu.GetWeekNumber()}.json`);

    await writeFile(menuPath, JSON.stringify(menu))
        .then(() => console.log(`Cached menu: ${menuPath}`))
        .catch((err) => console.error(err));
}

/**
 * Returns true if menu is cached.
 */
export async function IsMenuCached(weekNumber: number): Promise<boolean> {
    const cachedMenuPath: string = join(cachePath, `menu-week-${weekNumber}.json`);
    let isMenuCached: boolean = false;
    await access(cachedMenuPath)
        .then(() => isMenuCached = true)
        .catch((err) => console.error("Menu is not cached"));
    return isMenuCached;
}

export async function ParseJSONMenu(pathToMenu: string): Promise<Menu> {

    let jsonMenuObject: any;

    await readFile(pathToMenu)
        .then(data => {
            jsonMenuObject = JSON.parse(data.toString());
        }).catch(error => {
            console.error(error);
        });

    const menu: Menu = new Menu(jsonMenuObject.weekNumber);
    
    const days = jsonMenuObject.days;

    for (let i = 0; i < days.length; i++) {
        menu.AddDay(new WeekDay(days[i].day, days[i].dishes));
    }

    return menu;
}

export function GetWeekNumber(date: Date) {
    const firstDayOfYear: Date = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear: number = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7) - 1;
}