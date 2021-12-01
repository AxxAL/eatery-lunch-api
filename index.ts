require("dotenv").config();
import express, { Request, Response } from "express";
import { Menu } from "./src/types/Menu";
import { GetDayMenu, GetMenuForWeek, GetWeekMenu } from "./src/helpers/EateryAPI";
import { IsMenuCached } from "./src/helpers/Util";
import { WeekDay } from "./src/types/WeekDay";
import { join } from "path";
import { GetRequestCount, IncrementRequests } from "./src/Statistics";
import cors from "cors";
import { createMenuTable } from "./src/helpers/DatabaseHelper";

const app = express();
const port: number = Number(process.env.PORT) || 3333;

app.get("/database", async (req, res) => {
    try {
        await createMenuTable();
    } catch(err) { console.log(err) }
});

app.get("/", async (req, res) => {
    return res.sendFile(join(__dirname, "index.html"));
});

app.get("/menu", async (req: Request, res: Response) => {
    const weekMenu: Menu = await GetWeekMenu();
    IncrementRequests();
    return res.send(weekMenu);
});

app.get("/menu/day/:index", async (req: Request, res: Response) => {

    const index: number = Number(req.params.index);

    const weekDay: WeekDay = await GetDayMenu(index);

    if (weekDay == null) return res.status(400).send({ error: "Index out of bounds." });
    IncrementRequests();
    return res.send(weekDay);
});

app.get("/menu/week/:date", async (req: Request, res: Response) => {

    const menuDate: string = req.params.date;

    if (!(await IsMenuCached(menuDate))) return res.status(400).send({ error: `Couldn't find menu matching date ${menuDate}.` });

    const weekMenu: Menu = await GetMenuForWeek(menuDate);
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