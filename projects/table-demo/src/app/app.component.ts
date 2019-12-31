import { Component, OnInit } from '@angular/core';
import { AutoTableConfig } from '../../../ngx-auto-table/src/public_api';
import { BehaviorSubject } from 'rxjs';
import { take, debounceTime, startWith } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

interface TestRow {
  name: string;
  age: number;
  next_birthday: number;
  id_taken_from_db: string;
}

const randomNames = [
  'Betty',
  'Sherlene',
  'Holli',
  'Jacinto',
  'Dewayne',
  'Maureen',
  'Gwyneth',
  'Ellis',
  'Iva',
  'Treena',
  'Cordia',
  'Kirsten',
  'Tora',
  'Nelida',
  'Rosella',
  'Ronnie',
  'Shena',
  'Darcey',
  'Tad',
  'Ellsworth'
];
function MakeRandomRow(): TestRow {
  const randomName =
    randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomAge = Math.round(Math.random() * 25 + 20);
  return {
    name: randomName,
    age: randomAge,
    id_taken_from_db: Math.random()
      .toString(32)
      .slice(2),
    next_birthday: randomAge + 1
  };
}

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align:center">
      NGX Auto Table Testing
    </div>

    <form
      [formGroup]="formGroup"
      style="display: grid; grid-template-columns: 50% 50%;"
    >
      <div class="">
        <form-number formControlName="bulkSelectMaxCount"></form-number>
        <form-number formControlName="actionsVisibleCount"></form-number>
        <form-select-string
          [selections]="['name', 'age']"
          formControlName="initialSort"
        ></form-select-string>
        <form-select-string
          [selections]="['asc', 'desc']"
          formControlName="initialSortDir"
        ></form-select-string>
        <form-number formControlName="pageSize"></form-number>
        <form-select-string-multiple
          [selections]="['name', 'age']"
          formControlName="hideFields"
        ></form-select-string-multiple>
        <form-text formControlName="filterText"></form-text>
        <form-text formControlName="exportFilename"></form-text>
      </div>
      <div class="">
        <h2>Flags</h2>
        <form-toggle formControlName="hideFilter"></form-toggle>
        <form-toggle formControlName="hideHeader"></form-toggle>
        <form-toggle formControlName="hidePaginator"></form-toggle>
        <form-toggle formControlName="hideChooseColumns"></form-toggle>
        <form-toggle formControlName="disableSelect"></form-toggle>
        <form-toggle formControlName="disableHoverEffect"></form-toggle>
        <form-toggle formControlName="selectFirstOnInit"></form-toggle>
        <form-toggle formControlName="disableMobileScroll"></form-toggle>
        <form-toggle formControlName="debug"></form-toggle>
      </div>
    </form>

    <pre>
    {{ { config: formGroup.value } | json }}
    </pre
    >

    <button
      color="primary"
      mat-raised-button
      (click)="this.onClickAddRandomTake1()"
    >
      Add Random Name
    </button>

    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        age: {},
        mobile: { template: mobileTemplate, hide: true }
      }"
    ></ngx-auto-table>

    <ng-template #mobileTemplate let-row>
      <strong>{{ row.name }}</strong>
    </ng-template>
  `
})
export class AppComponent implements OnInit {
  config: AutoTableConfig<TestRow>;
  data$ = new BehaviorSubject<TestRow[]>(null);

  formGroup = new FormGroup({
    bulkSelectMaxCount: new FormControl(5),
    actionsVisibleCount: new FormControl(1),
    initialSort: new FormControl(),
    initialSortDir: new FormControl(),
    pageSize: new FormControl(10),
    hideFields: new FormControl(),
    hideFilter: new FormControl(),
    hideHeader: new FormControl(),
    hidePaginator: new FormControl(),
    hideChooseColumns: new FormControl(),
    filterText: new FormControl(),
    exportFilename: new FormControl(),
    disableSelect: new FormControl(),
    disableHoverEffect: new FormControl(),
    selectFirstOnInit: new FormControl(true),
    disableMobileScroll: new FormControl(),
    debug: new FormControl(true)
  });

  constructor() {}

  async fakeDelay(ms: number) {
    console.log('fake delay: begin for: ' + ms + 'ms');
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('fake delay: end...');
        resolve();
      }, ms);
    });
  }

  async ngOnInit() {
    this.formGroup.valueChanges
      .pipe(startWith(null), debounceTime(300))
      .subscribe(newConfigFlags => {
        this.makeCofig(this.formGroup.value);
      });
    await this.fakeDelay(3000);
    this.data$.next([
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow()
    ]);
  }
  async makeCofig(newConfigFlags) {
    this.config = null;
    await new Promise(res => setTimeout(res, 100));
    this.config = {
      ...newConfigFlags,
      data$: this.data$,
      actionsBulk: [
        {
          label: 'Long Delete (30s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(30000);
            await this.removeItems(rows);
            console.log({ rows });
          }
        },
        {
          label: 'Quick Delete (1s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(1000);
            await this.removeItems(rows);
            console.log({ rows });
          }
        },
        {
          label: 'Instant Delete',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.removeItems(rows);
            console.log({ rows });
          }
        }
      ],
      actions: [
        {
          label: 'Delete',
          icon: 'delete',
          onClick: async (row: TestRow) => {
            await this.removeItem(row);
          }
        },
        {
          label: 'Show',
          icon: 'remove_red_eye',
          onClick: (row: TestRow) => {
            console.log({ row });
          }
        }
      ]
    };
  }

  async onClickAddRandomTake1() {
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const randomItem = MakeRandomRow();
    console.log('app: adding random item', { currentItems, randomItem });
    currentItems.push(randomItem);
    this.data$.next(currentItems);
  }

  async removeItem(row: TestRow) {
    console.log('app: removing item', { row });
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const itemsAfterDelete = currentItems.filter(
      r => JSON.stringify(r) != JSON.stringify(row)
    );
    this.data$.next(itemsAfterDelete);
  }

  async removeItems(rows: TestRow[]) {
    console.log('app: removing items', { rows });
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const removeSet = new Set(rows.map(r => JSON.stringify(r)));
    const itemsAfterDelete = currentItems.filter(
      r => !removeSet.has(JSON.stringify(r))
    );
    this.data$.next(itemsAfterDelete);
  }
}
