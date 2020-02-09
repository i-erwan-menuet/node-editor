import Data  from "./Data";
import ScreenPosition from "./ScreenPosition";

export default class Node {
    title: string;
    position: ScreenPosition;
    data: Array<Data> = [];
    headers: Array<string> = [];

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

    addHeader(header: string):void{
        this.headers.push(header);
    }

    moveToPosition(newPosition: ScreenPosition){
        this.position = newPosition;
    }
}