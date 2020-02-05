import { DataType,DataContentType } from '@/constants/Enumerations';

export default class Data{
    title: String;
    type: DataType;
    contentType: DataContentType;
    contentValue: String = "";

    constructor(title:string, type: DataType, contentType: DataContentType) {
        this.title = title;
        this.type = type;
        this.contentType = contentType;
    }
}