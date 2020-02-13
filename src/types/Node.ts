import Line  from "./Line";
import Data  from "./Data";
import ScreenPosition from "./ScreenPosition";

export default class Node {
    title: string;
    position: ScreenPosition;
    lines: Array<Line> = [];

    constructor(title: string, position: ScreenPosition){
        this.title = title;
        this.position = position;
    }

    addLine(): void{
        let nb = this.lines.length > 0 ? this.lines[0].data.length : 1;
        let line = new Line(nb);
        this.lines.push(line);
    }
    setLines(lines: Array<Line>){
        this.lines = lines;
    }

    addColumn():void{
        this.lines.forEach(line => {
            line.addData();
        });
    }

    moveToPosition(newPosition: ScreenPosition){
        this.position = newPosition;
    }
}