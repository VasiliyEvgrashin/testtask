import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Department } from '../Department';
import { Employee } from '../Employee';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'employee-form',
    templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnChanges {
    @Input() employee: Employee;
    @Input() departmentid: number;
    @Output() update = new EventEmitter<Employee>();
    @Output() new = new EventEmitter<Employee>();
    @Output() delete = new EventEmitter<Employee>();

    name = new FormControl('', [Validators.required]);
    salary = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]);

    showSave: boolean;

    baseUrl: string;

    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = ['Front', 'Back', 'Db', 'DevOps'];

    @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef<HTMLInputElement>;

    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;

        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.employee && changes.employee.currentValue) {
            this.name.setValue(changes.employee.currentValue.name);
            this.salary.setValue(changes.employee.currentValue.salary);
            if (changes.employee.currentValue.fruit) {
                this.fruits = changes.employee.currentValue.fruit.split(';');
            } else {
                this.fruits = [];
            }
        }
        if (changes.employee && changes.employee.currentValue == null) {
            this.clearcontrols();
        }
    }

    getErrorNameMessage() {
        if (this.name.hasError('required')) {
            return 'You must enter name';
        }
    }

    getErrorSalaryMessage() {
        if (this.salary.hasError('required')) {
            return 'You must enter salary';
        }
        if (this.salary.hasError('pattern')) {
            return 'You must enter only numbers';
        }
    }

    clearcontrols() {
        this.employee = null;
        this.name.setValue(null);
        this.salary.setValue(null);
        this.fruits = [];
    }

    newClick() {
        this.clearcontrols();
    }

    updateitem() {
        if (this.validate()) {
            this.employee.name = this.name.value;
            this.employee.salary = this.salary.value;
            this.employee.fruit = this.fruits.reduce((summ, value) => summ + ';' + value).replace(/.$/, '');
            this.http.put<Employee>(this.baseUrl + 'api/Employee', this.employee)
                .subscribe(result => {
                    this.employee = result;
                    this.update.emit(this.employee);
                }, error => console.error(error));
        }
    }

    insertClick() {
        if (this.validate() && !this.employee) {
            let newitem = new Employee();
            newitem.name = this.name.value;
            newitem.salary = this.salary.value;
            newitem.fruit = this.fruits.reduce((summ, value) => summ + ';' + value).replace(/.$/, '');
            this.http.post<Employee>(this.baseUrl + 'api/Employee/' + this.departmentid, newitem)
                .subscribe(result => {
                    this.employee = result;
                    this.new.emit(this.employee);
                }, error => console.error(error));
        }
    }

    deleteclick() {
        this.http.delete(this.baseUrl + 'api/Employee/' + this.employee.id)
            .subscribe(result => {
                console.log('delete: ' + this.employee.name);
                this.delete.emit(this.employee);
            }, error => console.error(error));
    }

    validate() {
        return this.name.valid && this.salary.valid;
    }

    fruitslen = 6;

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();


        // Add our fruit
        if (value && this.fruits!.length < this.fruitslen) {
            this.fruits.push(value);
        }

        // Clear the input value
        event.input.value = '';

        this.fruitCtrl.setValue(null);
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (this.fruits!.length < this.fruitslen) {
            this.fruits.push(event.option.viewValue);
            this.fruitInput.nativeElement.value = '';
            this.fruitCtrl.setValue(null);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
    }
}
