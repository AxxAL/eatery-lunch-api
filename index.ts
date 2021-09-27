import express, { Request, Response } from "express";
import { Menu } from "./src/types/Menu";
import { GetWeekMenu } from "./src/helpers/EateryAPI";

const app = express();
const port: number = 3333;

app.get("/", async (req: Request, res: Response) => {
    const weekMenu: Menu = await GetWeekMenu();
    return res.send(weekMenu);
});

app.listen(3333, () => {
    console.log(`Application running at: http://localhost:${port}`);
});