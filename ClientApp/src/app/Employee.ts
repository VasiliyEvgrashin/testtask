export class Employee {
    id: number;
    departmentId: number;
    name: string;
    salary: number;
    fruit: string;
}

export class ModelEmployee {
    employee: Employee;
    selected: boolean = false;

    constructor(employee: Employee) {
        this.employee = employee;
    }
}