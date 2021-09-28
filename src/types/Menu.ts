import { LegitimateWeekDays, WeekDay } from "./WeekDay";

/**
 * Class to represent a week's menu's.
 */
export class Menu {
    private weekNumber: number;
    private year: number;
    private days: WeekDay[];

    constructor(weekNumber: number) {
        this.weekNumber = weekNumber;
        this.year = new Date().getFullYear();
        this.days = [];
    }

    /**
     * Adds a day to the menu.
     */
    public AddDay(day: WeekDay): boolean {
        try {
            this.days.push(day);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public GetDay(index: number): WeekDay {
        return this.days[index];
    }

    /**
     * Removes day at specified index.
     */
    public RemoveDay(index: number): boolean {
        try {
            this.days.splice(index, 1);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Returns weeknumber of menu.
     */
    public GetWeekNumber(): number {
        return this.weekNumber;
    }

    /**
     * Returns year of menu.
     */
    public GetYear(): number {
        return this.year;
    }

    /**
     * Returns amount of elements in menu;
     */
    public Count(): number {
        return this.days.length;
    }

    /**
     * Removes any weekdays out of menu if they don't match any fields in LegitimateWeekDays.
     */
    public async CleanMenu(): Promise<void> {
        for (let i = 0; i < this.days.length; i++) {
            if (!LegitimateWeekDays.includes(this.days[i].day)) this.RemoveDay(i);
        }
    }
}