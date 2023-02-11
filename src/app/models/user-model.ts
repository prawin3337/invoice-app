export class User {
    loginId: number;
    comId: number;
    email: string;
    sysDate: string;
    userContact: string;
    userEmail: string;
    userName: string;
    userStatus: number;
    userType: string;

    constructor(loginId: number = -1, // -1 denotes to unset loginId
                comId: number = -1, // -1 denotes to unset comId
                email: string = "", 
                sysDate: string = "", 
                userContact: string = "", 
                userEmail: string = "", 
                userName: string = "", 
                userStatus: number = 0, 
                userType: string = "") {
        this.loginId = loginId,
        this.comId = comId;
        this.email = email;
        this.sysDate = sysDate;
        this.userContact = userContact;
        this.userEmail = userEmail;
        this.userName = userName;
        this.userStatus = userStatus;
        this.userType = userType;
    }
}