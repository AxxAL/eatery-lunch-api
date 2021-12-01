import axios, { AxiosResponse } from "axios";
import { DateTime } from "luxon";
import { join } from "path";
import { Menu } from "../types/Menu";
import { WeekDay } from "../types/WeekDay";
import { CacheMenu, GetWeekDate, IsMenuCached, ParseJSONMenu, RemoveEmptyElements } from "./Util";

export const eateryApiUrl: string = "https://api.eatery.se/wp-json/eatery/v1/load";

/**
 * Gets current week's menu & returns it.
 */
export async function GetWeekMenu(): Promise<Menu> {

    const weekDate: string = GetWeekDate(DateTime.now());
    
    const pathToCachedMenu: string = join(__dirname, "../../cache", `menu-week-${weekDate}.json`);

    if (!(await IsMenuCached(weekDate))) await ParseSSISMenu();

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
export async function GetMenuForWeek(weekDate: string): Promise<Menu> {

    const pathToMenu: string = join(__dirname, "../../cache", `menu-week-${weekDate}.json`);
    const menu: Menu = await ParseJSONMenu(pathToMenu);

    return menu;
}

/**
 * Fetches eatery's weekly menu, parses it & returns it.
 */
async function ParseSSISMenu(): Promise<void> {

    const request: AxiosResponse<any> = await axios.get(eateryApiUrl); // API request to eatery.

    const response = request.data.menues["521"]; // Gets Kista NOD's specific lunch menu from api request.
    
    let content: string[] = response.content.content.split("<p>"); // Splits eatery's menu into days.
    content = await RemoveEmptyElements(content); // Removes all empty elements.

    const weekNumber: number = response.content.title.replace( /^\D+/g, ''); // Gets week number.

    const menu: Menu = new Menu(DateTime.now().weekNumber);

    for (let i = 0; i < content.length; i++) {
        content[i] = content[i].replace(/(<([^>]+)>)/ig, ""); // Removes all HTML tags in eatery content array.
        content[i] = content[i].replace(/&amp;/g, "&"); // Formats ampersands.
        let day: string[] = content[i].split("\n"); // Splits eatery day into weekday and dishes. ex. ["Måndag", "Lax", "Köttbullar", "Pastasallad"]
        day = await RemoveEmptyElements(day); // Removes empty items from array
        menu.AddDay(new WeekDay(day[0], day.slice(1, day.length))); // Adds day to weekday array.
    } // Goes through eatery's menu and registeres weekdays.

    await CacheMenu(menu); // Caches menu.
}