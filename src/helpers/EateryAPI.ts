import axios, { AxiosResponse } from "axios";
import { join } from "path";
import { Menu } from "../types/Menu";
import { WeekDay } from "../types/WeekDay";
import { CacheMenu, GetWeekNumber, IsMenuCached, ParseJSONMenu, RemoveEmptyElements } from "./Util";

export const eateryApiUrl: string = "https://api.eatery.se/wp-json/eatery/v1/load";


/**
 * Gets current week's menu & returns it.
 */
export async function GetWeekMenu(): Promise<Menu> {

    const weekNumber: number = GetWeekNumber(new Date());
    const pathToCachedMenu: string = join(__dirname, "../../cache", `menu-week-${weekNumber}.json`);

    if (!(await IsMenuCached(weekNumber))) await ParseSSISMenu();
    

    const menu: Menu = await ParseJSONMenu(pathToCachedMenu);

    return menu;
}

export async function GetDayMenu(day: number): Promise<WeekDay> {

    const menu: Menu = await GetWeekMenu();

    const weekDay: WeekDay = menu.GetDay(day);

    return weekDay;
}
/**
 * Takes weeknumber and returns cached menu.
 */
export async function GetMenuForWeek(weekNumber: number): Promise<Menu> {

    const pathToMenu: string = join(__dirname, "../../cache", `menu-week-${weekNumber}.json`);
    const menu: Menu = await ParseJSONMenu(pathToMenu);

    return menu;
}

/**
 * Gets specified day's menu.
 */
/* TODO: Fix this.
export async function GetDayMenu(day: string): Promise<WeekDay> {
    const weekMenu: Menu = await GetWeekMenu();
    let dailyMenu: WeekDay;
    
    for (let i = 0; i < weekMenu.Count(); i++) {
        if (weekMenu.GetDay(i).day == day) {
            dailyMenu = weekMenu.GetDay(i);
        }
    }
    return dailyMenu;
}*/

/**
 * Fetches eatery's weekly menu, parses it & returns it.
 */
async function ParseSSISMenu(): Promise<void> {

    const request: AxiosResponse<any> = await axios.get(eateryApiUrl); // API request to eatery.

    const response = request.data.menues["521"]; // Get's Kista NOD's specific lunch menu from api request.
    
    let content: string[] = response.content.content.split("<p>"); // Splits eatery's menu into days.
    content = await RemoveEmptyElements(content); // Removes all empty elements.

    const weekNumber: number = response.content.title.replace( /^\D+/g, ''); // Get's week number.

    const menu: Menu = new Menu(Number(weekNumber));

    for (let i = 0; i < content.length; i++) {
        content[i] = content[i].replace(/(<([^>]+)>)/ig, ""); // Removes all HTML tags in eatery content array.
        let day: string[] = content[i].split("\n"); // Splits eatery day into weekday and dishes. ex. ["Måndag", "Lax", "Köttbullar", "Pastasallad"]
        day = await RemoveEmptyElements(day); // Removes empty items from array
        menu.AddDay(new WeekDay(day[0], day.slice(1, day.length))); // Adds day to weekday array.
    } // Goes through eatery's menu and registeres weekdays.
    
    await menu.CleanMenu(); // Removes illigitimate weekdays.

    await CacheMenu(menu); // Caches menu.
}