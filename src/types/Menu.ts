import { WeekDay } from "./WeekDay";

export class Menu {
    private weeknumber: number;
    private days: WeekDay[] = [];

    constructor(weeknumber: number) {
        this.weeknumber = weeknumber;
    }

    public AddDay(day: WeekDay): void {
        this.days.push(day);
    }
}