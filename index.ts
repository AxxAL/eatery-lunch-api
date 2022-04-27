import "dotenv/config";
import express, { Request, Response } from "express";
import { Menu } from "./src/types/Menu";
import { ParseSSISMenu } from "./src/helpers/EateryAPI";
import { WeekDay } from "./src/types/WeekDay";
import { join } from "path";
import { getMenu, isMenuSaved } from "./src/helpers/DatabaseHelper";
import { DateTime } from "luxon";

const app = express();
const port = parseInt(process.env.PORT as string) || 3333;

app.get("/", async (req: Request, res: Response) => {
    return res.sendFile(join(__dirname, "index.html"));
});

app.get("/menu", async (req: Request, res: Response) => {
    let menu: Menu;
    try {
        const now: DateTime = DateTime.now();
        
        if (!await isMenuSaved(now.weekNumber, now.year)) {
            await ParseSSISMenu();
        }

        menu = await getMenu(now.weekNumber, now.year);

        res.send(menu);
    } catch(err) {
        res.send({ error: "Could not find this week's menu." })
        console.log(err);
        return;
    }  
});

app.get("/menu/day/:index", async (req: Request, res: Response) => {

    const index: number = parseInt(req.params.index);

    const now: DateTime = DateTime.now();
    
    let menu: Menu;

    try {
        menu = await getMenu(now.weekNumber, now.year);
    } catch(error) {
        res.send({ error: "Could not find this week's menu." })
        console.log(error);
        return;
    }

    try {
        const weekDay: WeekDay = menu.GetDay(index);
        return res.send(weekDay);
    } catch(error) {
        res.send({ error: "Could not fetch specified day." })
        console.log(error);
        return;
    }
});

app.get("/menu/week/:date", async (req: Request, res: Response) => {
    const params: string[] = req.params.date.split("-");

    if (params.length > 2) {
        return res.status(400).send({ error: "Incorrect date format." });
    }

    const week: number = parseInt(params[0]);
    const year: number = parseInt(params[1]);

    if (!await isMenuSaved(week, year)) {
        return res.status(400).send({ error: `Couldn't find menu matching date ${week}-${year}.` });
    }

    const weekMenu: Menu = await getMenu(week, year);
    return res.send(weekMenu);
});

app.get("*", async (req: Request, res: Response) => res.status(404).send({ error: "Endpoint does not exist." }) );

app.listen(port, () => {
    console.log(`Application running at: http://localhost:${port}`);
});