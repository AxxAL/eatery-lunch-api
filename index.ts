import express from "express";
import axios, { AxiosResponse } from "axios";
import { WeekDay } from "./src/types/WeekDay";
import { Menu } from "./src/types/Menu";

const app = express();
const port: number = 3333;
const eateryapi: string = "https://api.eatery.se/wp-json/eatery/v1/load";

app.get("/", async (req, res) => {
    try {
        
        const request: AxiosResponse<any> = await axios.get(eateryapi); // API request to eatery.
        const response = request.data.menues["521"]; // Get's Kista NOD's specific lunch menu from api request.

        let content: string[] = response.content.content.split("<p>"); // Splits eatery's menu into days.
        content = await RemoveEmptyElements(content); // Removes all empty elements.
        
        let menu: Menu = new Menu(39); // Today's week's menu | Holds all weekdays.

        for (let i = 0; i < content.length; i++) {
            content[i] = content[i].replace(/(<([^>]+)>)/ig, ""); // Removes all HTML tags in eatery content array.
            let day: string[] = content[i].split("\n"); // Splits eatery day into weekday and dishes. ex. ["Måndag", "Lax", "Köttbullar", "Pastasallad"]
            day = await RemoveEmptyElements(day); // Removes empty items from array
            menu.AddDay(new WeekDay(day[0], day.slice(1, day.length))); // Adds day to weekday array.
        } // Goes through eatery's menu and registeres weekdays.

        return res.send(menu); // Returns weekdays as json.
    } catch (err) {
        console.log(err);
    }
});

async function RemoveEmptyElements(array: any[]): Promise<any[]> {
    for (let i = 0; i < array.length; i++){
        if (array[i] == "") array[i] = null; // Sets element to null if it is an empty string or whitespace.
    } // Goes through every element and checks for whitespace or if string is empty.
        
    array = array.filter((a) => a); // Removes all null & undefined elements.
    return array;
} // Removes null, undefined and empty strings from array and returns it.

app.get("/raw", async (req, res) => {
    try {
        const request: AxiosResponse<any> = await axios.get(eateryapi);
        const response = request.data.menues["521"];
        return res.send(response);
    } catch (err) {
        console.log(err);
    }
});

app.listen(3333, () => {
    console.log(`Server running @ http://localhost:${port}!`);
});