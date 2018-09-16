import {Injectable}      from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PopupService {

    //////////////////////////////
    showPopupDefault = {
        "type": "list",
        "show": false,
        "item": {
            "list_name": "List Not Selected",
            "name": "User Not Selected"
        }
    }

    //////////////////////////////
    private showPopup = new BehaviorSubject<any>(this.showPopupDefault);
    private deleteUser = new BehaviorSubject<any>({});
    private deleteList = new BehaviorSubject<any>({});
    private deleteStatus = new BehaviorSubject<string>("idle");

    //////////////////////////////
    showPopupObservable = this.showPopup.asObservable();
    deleteUserObservable = this.deleteUser.asObservable();
    deleteListObservable = this.deleteList.asObservable();
    deleteStatusObservable = this.deleteStatus.asObservable();

    //////////////////////////////
    updateShowPopup(popup) {
        this.showPopup.next(popup);
    }

    //////////////////////////////
    updateDeleteUser(user) {
        this.deleteUser.next(user);
    }

    //////////////////////////////
    updateDeleteList(list) {
        this.deleteList.next(list);
    }

    //////////////////////////////
    updateDeleteStatus(status) {
        this.deleteStatus.next(status);
    }

}