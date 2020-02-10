import Data from "./Data"

export default class Line{
    data: Array<Data> = [];

    constructor(number?: number) {
        if(number && number > 0){
            for (let index = 0; index < number; index++) {   
                this.addData();             
            }
        } else{
            this.addData();
        }
    }

    addData(): void{
        this.data.push(new Data());
    }
}