import { NgModule } from '@angular/core';
import { IconPlusCircle, IconXCircle, IconCheckCircle, IconSave, IconCircle, IconRefreshCw, IconAlertCircle, IconEdit3, IconMoreHorizontal, IconTrash2, IconX } from 'angular-feather';

const icons = [
  IconPlusCircle, 
  IconXCircle, 
  IconCheckCircle, 
  IconSave, 
  IconCircle, 
  IconRefreshCw, 
  IconAlertCircle, 
  IconEdit3, 
  IconMoreHorizontal, 
  IconTrash2, 
  IconX
];

@NgModule({
  exports: icons
})
export class IconsModule { }
