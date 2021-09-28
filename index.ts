import express, { Request, Response } from "express";
import { Menu } from "./src/types/Menu";
import { GetDayMenu, GetMenuForWeek, GetWeekMenu } from "./src/helpers/EateryAPI";
import { IsMenuCached } from "./src/helpers/Util";
import { WeekDay } from "./src/types/WeekDay";
import { join } from "path";

const app = express();
const port: number = 3333;

app.get("/", async (req, res) => {
    return res.sendFile(join(__dirname, "index.html"));
});

app.get("/menu", async (req: Request, res: Response) => {
    const weekMenu: Menu = await GetWeekMenu();
    return res.send(weekMenu);
});

app.get("/menu/day/:index", async (req: Request, res: Response) => {

    const index: number = Number(req.params.index);

    const weekDay: WeekDay = await GetDayMenu(index);

    if (weekDay == null) return res.status(400).send({ error: "Could not find menu." });

    return res.send(weekDay);
});

app.get("/menu/week/:date", async (req: Request, res: Response) => {

    const menuDate: string = req.params.date;

    if (!(await IsMenuCached(menuDate))) return res.status(400).send({ error: `Couldn't find menu matching date ${menuDate}.` });

    const weekMenu: Menu = await GetMenuForWeek(menuDate);

    return res.send(weekMenu);
});

app.listen(3333, () => {
    console.log(`Application running at: http://localhost:${port}`);
});