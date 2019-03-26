import { __spread, __values, __assign, __awaiter, __generator } from 'tslib';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSort, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { CsvModule } from '@ctrl/ngx-csv';
import { Component, Input, ViewChild, Output, EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
var AutoTableComponent = /** @class */ (function () {
    function AutoTableComponent() {
        this.selectedBulk = new EventEmitter();
        this.columnDefinitions = {};
        this.columnDefinitionsAll = {};
        this.columnDefinitionsAllArray = [];
        this.headerKeysAll = [];
        this.headerKeysAllVisible = [];
        this.headerKeysDisplayed = [];
        this.headerKeysDisplayedMap = {};
        this.pageSize = 25;
        this.filterControl = new FormControl();
        // Bulk items selection
        this.selectionMultiple = new SelectionModel(true, []);
        this.selectionSingle = new SelectionModel(false, []);
    }
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.dataSourceSubscription = this.config.data$
            .pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return !!e; })))
            .subscribe((/**
         * @param {?} originalData
         * @return {?}
         */
        function (originalData) {
            console.log('ngx-auto-table, subscribed: ', { originalData: originalData });
            _this.dataSource = new MatTableDataSource(originalData);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            if (originalData && !originalData.length) {
                _this.hasNoItems = true;
                return;
            }
            else {
                _this.hasNoItems = false;
            }
            if (_this.config.pageSize) {
                _this.pageSize = _this.config.pageSize;
            }
            /** @type {?} */
            var firstDataItem = originalData[0];
            _this.initDisplayedColumns(firstDataItem);
            _this.initExport(originalData);
            _this.initFilter(originalData);
        }));
        if (this.config.clearSelected) {
            this.clearSelectedSubscription = this.config.clearSelected.subscribe((/**
             * @return {?}
             */
            function () {
                console.log('ngx-auto-table: clearSelected');
                _this.selectionMultiple.clear();
                _this.selectionSingle.clear();
            }));
        }
    };
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
        }
        if (this.clearSelectedSubscription) {
            this.clearSelectedSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} filterValue
     * @return {?}
     */
    AutoTableComponent.prototype.applyFilter = /**
     * @param {?} filterValue
     * @return {?}
     */
    function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.selectionMultiple.clear();
        this.selectionSingle.clear();
    };
    /**
     * @param {?} originalData
     * @return {?}
     */
    AutoTableComponent.prototype.initFilter = /**
     * @param {?} originalData
     * @return {?}
     */
    function (originalData) {
        if (!originalData.length) {
            return;
        }
        /** @type {?} */
        var firstRow = originalData[0];
        /** @type {?} */
        var keysData = new Set(Object.keys(firstRow));
        /** @type {?} */
        var keysHeader = new Set(this.headerKeysDisplayed);
        keysHeader.delete('__bulk');
        keysHeader.delete('__star');
        /** @type {?} */
        var allFieldsExist = Array.from(keysHeader).reduce((/**
         * @param {?} acc
         * @param {?} cur
         * @return {?}
         */
        function (acc, cur) {
            return keysData.has(cur) && acc;
        }), true);
        console.log('ngx-auto-table: initFilter()', {
            rowFields: keysData,
            allFieldsExist: allFieldsExist,
            headerKeysDisplayed: this.headerKeysDisplayed
        });
        this.dataSource.filterPredicate = (/**
         * @param {?} data
         * @param {?} filterText
         * @return {?}
         */
        function (data, filterText) {
            var e_1, _a;
            if (!filterText) {
                return true;
            }
            if (!allFieldsExist) {
                /** @type {?} */
                var lower = JSON.stringify(data).toLowerCase();
                return lower.includes(filterText);
            }
            try {
                for (var _b = __values(Array.from(keysHeader)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    /** @type {?} */
                    var dataVal = data[key];
                    /** @type {?} */
                    var str = JSON.stringify(dataVal);
                    /** @type {?} */
                    var isFound = str.toLowerCase().includes(filterText);
                    if (isFound) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    };
    /**
     * @param {?} originalData
     * @return {?}
     */
    AutoTableComponent.prototype.initExport = /**
     * @param {?} originalData
     * @return {?}
     */
    function (originalData) {
        var _this = this;
        this.exportFilename = this.config.exportFilename;
        if (!this.exportFilename) {
            return;
        }
        this.exportData = originalData.map((/**
         * @param {?} dataItem
         * @return {?}
         */
        function (dataItem) {
            if (!_this.config.exportRowFormat) {
                return dataItem;
            }
            return _this.config.exportRowFormat(dataItem);
        }));
    };
    /**
     * @param {?} key
     * @return {?}
     */
    AutoTableComponent.prototype.getKeyHeader = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var inputDef = this.columnDefinitions[key];
        if (inputDef && inputDef.header != null) {
            return inputDef.header;
        }
        return this.toTitleCase(key);
    };
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    AutoTableComponent.prototype.toTitleCase = /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.replace('_', ' ').replace(/\w\S*/g, (/**
         * @param {?} txt
         * @return {?}
         */
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }));
    };
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    AutoTableComponent.prototype.initDisplayedColumns = /**
     * @param {?} firstDataItem
     * @return {?}
     */
    function (firstDataItem) {
        this.initColumnDefinitions(firstDataItem);
        this.headerKeysAll = Object.keys(this.columnDefinitionsAll);
        this.headerKeysAllVisible = this.headerKeysAll;
        if (this.config.hideFields) {
            // Hide fields if specified
            /** @type {?} */
            var hideFields_1 = new Set(this.config.hideFields);
            this.headerKeysAllVisible = this.headerKeysAll.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return !hideFields_1.has(x); }));
        }
        /** @type {?} */
        var displayed = this.columnDefinitionsAllArray
            .filter((/**
         * @param {?} def
         * @return {?}
         */
        function (def) { return !def.hide; }))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.field; }));
        this.setDisplayedColumns(displayed);
        // Set currently enabled items
        this.filterControl.setValue(this.headerKeysDisplayed);
    };
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    AutoTableComponent.prototype.initColumnDefinitions = /**
     * @param {?} firstDataItem
     * @return {?}
     */
    function (firstDataItem) {
        var _this = this;
        // Set all column defintions, which were explicitly set in config
        /** @type {?} */
        var inputDefintionFields = Object.keys(this.columnDefinitions);
        inputDefintionFields.forEach((/**
         * @param {?} field
         * @return {?}
         */
        function (field) {
            /** @type {?} */
            var inputDefintion = _this.columnDefinitions[field];
            _this.columnDefinitionsAll[field] = {
                header: _this.getKeyHeader(field),
                template: inputDefintion.template,
                hide: inputDefintion.hide,
                forceWrap: inputDefintion.forceWrap
            };
        }));
        // Set all column defintions read from the "input data"
        /** @type {?} */
        var inputDataKeys = Object.keys(firstDataItem);
        inputDataKeys.forEach((/**
         * @param {?} field
         * @return {?}
         */
        function (field) {
            if (!!_this.columnDefinitionsAll[field]) {
                // skip if definition exists
                return;
            }
            _this.columnDefinitionsAll[field] = {
                header: _this.toTitleCase(field),
                hide: true
            };
        }));
        this.columnDefinitionsAllArray = Object.keys(this.columnDefinitionsAll).map((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            return __assign({}, _this.columnDefinitionsAll[k], { field: k });
        }));
        console.log('ngx-auto-table: initColumnDefinitions', {
            firstDataItem: firstDataItem,
            inputDefintionFields: inputDefintionFields
        });
    };
    // Sets the displayed columns from a set of fieldnames
    // Sets the displayed columns from a set of fieldnames
    /**
     * @param {?} selected
     * @return {?}
     */
    AutoTableComponent.prototype.setDisplayedColumns = 
    // Sets the displayed columns from a set of fieldnames
    /**
     * @param {?} selected
     * @return {?}
     */
    function (selected) {
        var _this = this;
        // Initialize all keys as false
        this.headerKeysAllVisible.forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) { return (_this.headerKeysDisplayedMap[k] = false); }));
        // Set selected as true
        selected.forEach((/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return (_this.headerKeysDisplayedMap[c] = true); }));
        this.headerKeysDisplayed = Object.keys(this.headerKeysDisplayedMap).filter((/**
         * @param {?} k
         * @return {?}
         */
        function (k) { return _this.headerKeysDisplayedMap[k]; }));
        // Add bulk select column at start
        if (this.config.actionsBulk) {
            this.headerKeysDisplayed.unshift('__bulk');
        }
        // Add actions column at end
        if (this.config.actions) {
            this.headerKeysDisplayed.push('__star');
        }
    };
    /** Whether the number of selected elements matches the total number of rows. */
    /**
     * Whether the number of selected elements matches the total number of rows.
     * @return {?}
     */
    AutoTableComponent.prototype.isAllSelected = /**
     * Whether the number of selected elements matches the total number of rows.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var numSelected = this.selectionMultiple.selected.length;
        /** @type {?} */
        var numRows = this.config.bulkSelectMaxCount || this.dataSource.filteredData.length;
        return numSelected >= numRows;
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    AutoTableComponent.prototype.masterToggle = /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    function () {
        this.isAllSelected()
            ? this.selectionMultiple.clear()
            : this.selectAll();
        this.selectedBulk.emit(this.selectionMultiple.selected);
    };
    /**
     * @private
     * @return {?}
     */
    AutoTableComponent.prototype.selectAll = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
        /** @type {?} */
        var cutArray = this.dataSource.filteredData;
        if (this.config.bulkSelectMaxCount) {
            cutArray = this.dataSource.filteredData.slice(0, this.config.bulkSelectMaxCount);
        }
        cutArray.forEach((/**
         * @param {?} row
         * @return {?}
         */
        function (row) {
            _this.selectionMultiple.select(row);
        }));
    };
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.isMaxReached = /**
     * @return {?}
     */
    function () {
        if (!this.config.bulkSelectMaxCount) {
            return false;
        }
        return (this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AutoTableComponent.prototype.onColumnFilterChange = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        console.log({ $event: $event });
        /** @type {?} */
        var selectedValues = this.filterControl.value;
        this.setDisplayedColumns(selectedValues);
        this.initFilter(this.dataSource.data);
    };
    /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    AutoTableComponent.prototype.onClickBulkItem = /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    function ($event, item) {
        if ($event) {
            /** @type {?} */
            var isSelected = this.selectionMultiple.isSelected(item);
            if (!this.isMaxReached()) {
                this.selectionMultiple.toggle(item);
            }
            else {
                if (isSelected) {
                    this.selectionMultiple.deselect(item);
                }
                else {
                    this.warn("Max Selection of \"" + this.config.bulkSelectMaxCount + "\" Reached");
                }
            }
            this.selectedBulk.emit(this.selectionMultiple.selected);
        }
    };
    /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    AutoTableComponent.prototype.onClickRow = /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    function ($event, row) {
        console.log('ngx-auto-table: onClickRow()', { $event: $event, row: row });
        if (this.config.onSelectItem) {
            this.selectionSingle.select(row);
            this.config.onSelectItem(row);
        }
    };
    /**
     * @param {?} action
     * @return {?}
     */
    AutoTableComponent.prototype.onClickBulkAction = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.onClick(this.selectionMultiple.selected)];
                    case 1:
                        _a.sent();
                        this.selectionMultiple.clear();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} msg
     * @return {?}
     */
    AutoTableComponent.prototype.warn = /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { };
    AutoTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-auto-table',
                    template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <div class=\"filters-container flex-h align-center space-between\">\r\n      <mat-form-field class=\"filter\" *ngIf=\"!hasNoItems && !config.hideFilter\">\r\n        <mat-icon matPrefix>search</mat-icon>\r\n        <input\r\n          matInput\r\n          (keyup)=\"applyFilter($event.target.value)\"\r\n          placeholder=\"Search Rows...\"\r\n          #filterField\r\n        />\r\n        <mat-icon\r\n          class=\"has-pointer\"\r\n          matSuffix\r\n          (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n          >clear</mat-icon\r\n        >\r\n      </mat-form-field>\r\n      <mat-form-field\r\n        class=\"filter-columns overflow-hidden\"\r\n        *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n      >\r\n        <mat-icon matPrefix>view_column</mat-icon>\r\n        <mat-select\r\n          placeholder=\"Choose Columns...\"\r\n          [formControl]=\"filterControl\"\r\n          (selectionChange)=\"onColumnFilterChange($event)\"\r\n          multiple\r\n        >\r\n          <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n            {{ getKeyHeader(key) }}\r\n          </mat-option>\r\n        </mat-select>\r\n      </mat-form-field>\r\n    </div>\r\n    <div\r\n      class=\"bulk-actions flex-h align-center space-between\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <span class=\"item-count\">\r\n        ({{ selectionMultiple.selected.length }} Items Selected)\r\n        {{ isMaxReached() ? ' Max Reached!' : '' }}\r\n      </span>\r\n      <span class=\"buttons flex-h align-center\">\r\n        <button\r\n          mat-raised-button\r\n          *ngFor=\"let action of config.actionsBulk\"\r\n          (click)=\"onClickBulkAction(action)\"\r\n        >\r\n          <mat-icon>{{ action.icon }}</mat-icon>\r\n          <span>{{ action.label }}</span>\r\n        </button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row>\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row\r\n    style=\"display: flex; align-items: centered; justify-content: space-between;\"\r\n  >\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                    styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.table-header{width:100%;background-color:#fff;margin-top:15px;height:70px}.table-header .filters-container .filter,.table-header .filters-container .filter-columns{margin:10px}.table-header .bulk-actions{position:absolute;top:0;transition:1.2s;height:70px;background-color:#c4efb3;width:100%}.table-header .bulk-actions .item-count{color:#006400;padding-left:10px}.table-header .bulk-actions .buttons button{margin-right:10px}.hidden{top:-70px!important;overflow:hidden!important}.selected-row-multiple{background-color:#eee}.selected-row-single{background-color:#b5deb6}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
                }] }
    ];
    AutoTableComponent.propDecorators = {
        selectedBulk: [{ type: Output }],
        config: [{ type: Input }],
        columnDefinitions: [{ type: Input }],
        paginator: [{ type: ViewChild, args: [MatPaginator,] }],
        sort: [{ type: ViewChild, args: [MatSort,] }]
    };
    return AutoTableComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AppTableLoaderComponent = /** @class */ (function () {
    function AppTableLoaderComponent() {
    }
    AppTableLoaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-toolbar-loader',
                    template: "\n    <mat-toolbar-row>\n      <div class=\"loader-container is-button-icon\">\n        <div class=\"loader-div\">\n          <mat-spinner [diameter]=\"40\"></mat-spinner>\n        </div>\n      </div>\n    </mat-toolbar-row>\n  ",
                    styles: ["\n      .loader-container {\n        width: 100% !important;\n        display: flex !important;\n        padding: 0px 0px;\n        z-index: 100000000;\n      }\n      .loader-div {\n        margin: auto;\n      }\n      .loader-container,\n      .is-button-icon {\n        display: inline-block;\n        margin: 0;\n        margin-bottom: -4px;\n        margin-right: 5px;\n      }\n    "]
                }] }
    ];
    return AppTableLoaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AppExportCsvExportComponent = /** @class */ (function () {
    function AppExportCsvExportComponent() {
    }
    AppExportCsvExportComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-table-csv-export',
                    template: "\n    <a\n      *ngIf=\"dataArray\"\n      csvLink\n      [data]=\"dataArray\"\n      [filename]=\"filename\"\n      mat-raised-button\n    >\n      <mat-icon title=\"Export as CSV\">file_download</mat-icon>\n      <span>Export CSV</span>\n    </a>\n  ",
                    styles: ["\n      a {\n        color: black;\n      }\n      mat-icon {\n        padding-right: 5px;\n      }\n    "]
                }] }
    ];
    AppExportCsvExportComponent.propDecorators = {
        dataArray: [{ type: Input }],
        filename: [{ type: Input }]
    };
    return AppExportCsvExportComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var sharedComponents = [AutoTableComponent, AppTableLoaderComponent];
var AutoTableModule = /** @class */ (function () {
    function AutoTableModule() {
    }
    AutoTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: __spread(sharedComponents, [AppExportCsvExportComponent]),
                    exports: sharedComponents,
                    imports: [
                        CsvModule,
                        ReactiveFormsModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatButtonToggleModule,
                        MatCheckboxModule,
                        MatFormFieldModule,
                        MatIconModule,
                        MatInputModule,
                        MatMenuModule,
                        MatPaginatorModule,
                        MatProgressBarModule,
                        MatProgressSpinnerModule,
                        MatSelectModule,
                        MatSortModule,
                        MatTableModule,
                        MatToolbarModule,
                        CommonModule,
                        RouterModule,
                    ]
                },] }
    ];
    return AutoTableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AutoTableModule, AutoTableComponent, AppExportCsvExportComponent as ɵb, AppTableLoaderComponent as ɵa };

//# sourceMappingURL=ngx-auto-table-lib.js.map