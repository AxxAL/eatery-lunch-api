/**
 * Class to represent a day's menu.
 */
export class WeekDay {
    public day: string;
    public dishes: string[];

    constructor(day: string, dishes: string[]) {
        this.day = day.toLowerCase();
        this.dishes = dishes;
    }
}

/**
 * Array of allowed weekdays.
 */
export const LegitimateWeekDays = [
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag"
]