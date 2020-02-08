import Data  from "./Data";
import ScreenPosition from "./ScreenPosition";

export default class Node {
    title: String;
    position: ScreenPosition;
    data: Array<Data> = [];

    constructor(title: string, position: ScreenPosition){
        this.title = title;
        this.position = position;
    }

    addData(data: Data): void{
        this.data.push(data);
    }

    addDatas(data: Data[]): void{
        this.data = this.data.concat(data);
    }

    moveToPosition(newPosition: ScreenPosition){
        this.position = newPosition;
    }
}