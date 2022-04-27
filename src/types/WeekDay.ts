/**
 * Class to represent a day's menu.
 */
export class WeekDay {
    public day: string;
    public dishes: string[];

    constructor(day: string, dishes: string[]) {
        this.day = day.toLowerCase();
        this.dishes = dishes;
        this.CleanDishes();
    }

    /**
     * Cleans up dishes. (Replaces unicode chars etc.)
     */
    private CleanDishes() {
        for (let i = 0; i < this.dishes.length; i++) {
            this.dishes[i].toLowerCase();
            this.dishes[i] = this.dishes[i].replace("&#8211;", "-");
            this.dishes[i] = this.dishes[i].replace("&#8217;", "'");
        }
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