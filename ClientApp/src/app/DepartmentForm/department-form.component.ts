import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Department } from '../Department';

@Component({
    selector: 'department-form',
    templateUrl: './department-form.component.html'
})
export class DepartmentFormComponent implements OnChanges {
    @Input() department: Department;
    @Output() update = new EventEmitter<Department>();
    @Output() new = new EventEmitter<Department>();
    @Output() delete = new EventEmitter<Department>();

    name = new FormControl('', [Validators.required]);

    showSave: boolean;

    baseUrl: string;

    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.department && changes.department.currentValue) {
            this.name.setValue(changes.department.currentValue.name);
        }
        this.checkShowSave();
    }

    getErrorMessage() {
        if (this.name.hasError('required')) {
            return 'You must enter name';
        }
    }

    namechange() {
        this.checkShowSave();
    }

    checkShowSave() {
        if (this.department) {
            this.showSave = this.name.value && this.department.name != this.name.value;
        } else {
            this.showSave = this.name.value
        }
    }

    newClick() {
        this.department = null;
        this.name.setValue(null);
    }

    saveClick() {
        if (this.validate()) {
            let department = this.department ? this.department : new Department();
            let isnew: boolean = !this.department;
            department.name = this.name.value;
            this.http.post<Department>(this.baseUrl + 'api/Department', department)
                .subscribe(result => {
                    this.department = result;
                    if (isnew) {
                        this.new.emit(this.department);
                    } else {
                        this.update.emit(this.department);
                    }
                }, error => console.error(error));
        }
    }

    deleteclick() {
        this.http.delete(this.baseUrl + 'api/Department/' + this.department.id)
        .subscribe(result => {
            console.log('delete: ' + this.department.name);
            this.delete.emit(this.department);
        }, error => console.error(error));
    }

    validate() {
        return this.name.valid;
    }
}
