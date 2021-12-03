import config from "./config";
import express, { Request, Response } from "express";
import { Menu } from "./src/types/Menu";
import { ParseSSISMenu } from "./src/helpers/EateryAPI";
import { WeekDay } from "./src/types/WeekDay";
import { join } from "path";
import { GetRequestCount, IncrementRequests } from "./src/Statistics";
import cors from "cors";
import { getMenu, isMenuSaved } from "./src/helpers/DatabaseHelper";
import { DateTime } from "luxon";

const app = express();
const port: number = Number(config.port) || 3333;

app.get("/", async (req: Request, res: Response) => {
    return res.sendFile(join(__dirname, "index.html"));
});

app.get("/menu", async (req: Request, res: Response) => {
    try {
        const now: DateTime = DateTime.now();
        
        if (!await isMenuSaved(now.weekNumber, now.year)) {
            await ParseSSISMenu();
        }

        const weekMenu: Menu = await getMenu(now.weekNumber, now.year);
        IncrementRequests();
        return res.send(weekMenu);
    } catch(err) {
        console.log(err);
    }  
});

app.get("/menu/day/:index", async (req: Request, res: Response) => {

    const index: number = Number(req.params.index);

    const now: DateTime = DateTime.now();
    const weekMenu: Menu = await getMenu(now.weekNumber, now.year);
    const weekDay: WeekDay = weekMenu.GetDay(index);

    if (weekDay == null) return res.status(400).send({ error: "Index out of bounds." });
    IncrementRequests();
    return res.send(weekDay);
});

app.get("/menu/week/:date", async (req: Request, res: Response) => {
    const params: string[] = req.params.date.split("-");

    if (params.length > 2) {
        return res.status(400).send({ error: "Incorrect date format." });
    }

    const week: number = Number(params[0]);
    const year: number = Number(params[1]);

    if (!await isMenuSaved(week, year)) {
        return res.status(400).send({ error: `Couldn't find menu matching date ${week}-${year}.` });
    }

    const weekMenu: Menu = await getMenu(week, year);
    IncrementRequests();
    return res.send(weekMenu);
});

app.get("/stats/requests", cors(), (req: Request, res: Response) => {
    const requestCount: number = GetRequestCount();
    return res.send({ requestCount });
});

app.get("*", async (req: Request, res: Response) => res.status(404).send({ error: "Page not found." }) );

app.listen(port, () => {
    console.log(`Application running at: http://localhost:${port}`);
});