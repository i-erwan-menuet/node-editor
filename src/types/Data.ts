export default class Data{
    value!: any;
    type: DataType = DataType.String;

    constructor(value?: any, type?: DataType) {
        this.value = value ? value : "";
        this.type = type ? type : DataType.String;
    }
}

export enum DataType{
    String = 0,
    Boolean = 1,
    Number = 2,
    Currency = 3,
    Percentage = 4
}