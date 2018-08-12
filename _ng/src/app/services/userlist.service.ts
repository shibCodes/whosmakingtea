import {Injectable}      from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserListService {

    //////////////////////////////
    private selectedList = new BehaviorSubject<any>({});
    private allLists = new BehaviorSubject<any>([]);

    //////////////////////////////
    selectedListObservable = this.selectedList.asObservable();
    allListsObservable = this.allLists.asObservable();

    //////////////////////////////
    updateSelectedList(list) {
        this.selectedList.next(list);
    }

    //////////////////////////////
    updateAllLists(lists) {
        this.allLists.next(lists);
    }

}


// in the component
// actionStateSubscription:Subscription;

// update it with this
//this.actionService.updateActionState(this.actionOpen);

// in ngOnInit
//////////////////////////////
/*this.actionStateSubscription = this.actionService.actionObservable$.subscribe(
    actionState => this.updateActionState(actionState));*/

