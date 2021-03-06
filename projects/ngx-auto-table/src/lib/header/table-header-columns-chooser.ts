import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy
} from '@angular/core';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeaderKeyList } from '../models.internal';

@Component({
  selector: 'ngx-auto-table-header-columns-chooser',
  template: `
    <mat-form-field class="filter-columns overflow-hidden">
      <mat-icon matPrefix>view_column</mat-icon>
      <mat-select
        placeholder="Choose Columns..."
        [formControl]="chooseColumnsControl"
        multiple
      >
        <mat-option *ngFor="let h of headerKeyValues" [value]="h.key">
          {{ h.value }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      .filter-columns {
        margin-top: 11px;
        margin-bottom: -9px;
      }
    `
  ],
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableHeaderColumnsChooserComponent
  implements OnInit, OnDestroy {
  @Input()
  headerKeyValues: HeaderKeyList;
  @Input()
  cacheId: string;
  @Input()
  set selectedHeaderKeys(newSelected: string[]) {
    console.log('NgxAutoTableHeaderColumnsChooserComponent', { newSelected });
    this.chooseColumnsControl.setValue(newSelected, { emitEvent: false });
  }

  @Output()
  columnsChanged: EventEmitter<string> = new EventEmitter();

  autoCompleteObscureName = uuidv4();
  chooseColumnsControl = new FormControl();

  private $onDestroyed = new Subject();

  ngOnInit() {
    this.chooseColumnsControl.valueChanges
      .pipe(takeUntil(this.$onDestroyed), debounceTime(100))
      .subscribe(columnHeadersSelected => {
        if (this.cacheId) {
          this.columnsCacheSetToCache();
        }
        this.columnsChanged.emit(columnHeadersSelected);
      });

    this.columnsSetFromCache();
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  private getCacheId() {
    return this.cacheId + '-columns2';
  }

  private columnsSetFromCache() {
    const cacheKey = this.getCacheId();
    const selectedValsString = localStorage.getItem(cacheKey);
    if (!selectedValsString) {
      return;
    }
    try {
      const vals = JSON.parse(selectedValsString);
      this.chooseColumnsControl.setValue(vals);
    } catch (error) {
      console.warn('error parsing JSON in columns cache');
    }
  }

  private columnsCacheSetToCache() {
    const cacheKey = this.getCacheId();
    const selectedValues = this.chooseColumnsControl.value;
    localStorage.setItem(cacheKey, JSON.stringify(selectedValues));
  }
}
