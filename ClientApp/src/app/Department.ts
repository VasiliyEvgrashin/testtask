import { Employee } from "./Employee";

export class Department {
    id: number;
    name: string;
    employees: Array<Employee>;
}

export class ModelDeparment {
    salary: number;
    department: Department;
    selected: boolean = false;

    constructor(department: Department) {
        this.department = department;
        this.resolve();
    }

    resolve() {
        let employees = this.department.employees;
        this.salary = employees.length > 0 ?
            employees.map((v) => { return v.salary }).reduce((sum, current) => sum + current) / employees.length
            : 0;
    }
}