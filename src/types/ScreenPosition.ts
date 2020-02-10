export default class ScreenPosition{
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    divide(number: number): ScreenPosition{
        this.x = this.x / number;
        this.y = this.y / number;
        return this;
    }
}