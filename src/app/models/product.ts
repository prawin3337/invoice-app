export interface productObj {
    proId: number,
    proNm: string,
    proHsn: string,
    proDesc: string,
    proCat: string,
    proMake: string,
    proStatus: number,
    proGst: number,
    proType: number,
    comId: number,
    sysDate: Date
}

export class Product implements productObj {
    proId: number;
    proNm: string;
    proHsn: string;
    proDesc: string;
    proCat: string;
    proMake: string;
    proStatus: number;
    proGst: number;
    proType: number;
    comId: number;
    sysDate: Date;

    constructor() {

    }
}