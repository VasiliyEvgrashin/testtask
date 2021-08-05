import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Department, ModelDeparment } from '../Department';
import { Employee, ModelEmployee } from '../Employee';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  model: MatTableDataSource<ModelDeparment> = new MatTableDataSource<ModelDeparment>();
  displayedColumnsDepartment: string[] = ['id', 'name', 'salary'];
  displayedColumnsEmployee: string[] = ['id', 'name', 'salary'];
  currentdept: Department;
  listEm: MatTableDataSource<ModelEmployee> = new MatTableDataSource<ModelEmployee>();
  currentEm: Employee;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Department[]>(baseUrl + 'api/Department').subscribe(result => {
      this.model.data = result.map((v: Department) => { return new ModelDeparment(v) });
    }, error => console.error(error));
  }

  depclick(dep: ModelDeparment) {
    this.model.data.forEach((v) => v.selected = false);
    dep.selected = true;
    this.currentdept = dep.department;
    this.listEm.data = dep
      .department
      .employees
      .map((e: Employee) => { return new ModelEmployee(e) });
      this.model = new MatTableDataSource<ModelDeparment>(this.model.data);
      this.currentEm = null;
  }

  emclick(em: ModelEmployee) {
    this.listEm.data.forEach((v) => v.selected = false);
    em.selected = true;
    this.currentEm = em.employee;
  }

  formatToCurrency = amount => {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  updatemodel(ev: Department) {
    let exist = this.model.data.find((p) => p.department.id == ev.id);
    if (exist && exist.department) {
      exist.department = ev;
      this.model = new MatTableDataSource<ModelDeparment>(this.model.data);
    }
  }

  insertinmodel(ev: Department) {
    this.model.data.push(new ModelDeparment(ev));
    this.model = new MatTableDataSource<ModelDeparment>(this.model.data);
  }

  removefrommodel(ev: Department) {
    let exist = this.model.data.find((p) => p.department.id == ev.id);
    if (exist && exist.department) {
      let index = this.model.data.indexOf(exist, 0);
      this.model.data.splice(index, 1);
      this.model = new MatTableDataSource<ModelDeparment>(this.model.data);
      this.currentdept = null;
    }
  }

  updateEmodel(ev: Employee) {
    let exist = this.listEm.data.find((p) => p.employee.id == ev.id);
    if (exist && exist.employee) {
      exist.employee = ev;
      this.listEm = new MatTableDataSource<ModelEmployee>(this.listEm.data);
      this.updatemainmodel(this.listEm.data);
    }
  }

  insertinEmodel(ev: Employee) {
    this.listEm.data.push(new ModelEmployee(ev));
    this.listEm = new MatTableDataSource<ModelEmployee>(this.listEm.data);
    this.updatemainmodel(this.listEm.data);
  }

  removefromEmodel(ev: Employee) {
    let exist = this.listEm.data.find((p) => p.employee.id == ev.id);
    if (exist && exist.employee) {
      let index = this.listEm.data.indexOf(exist, 0);
      this.listEm.data.splice(index, 1);
      this.listEm = new MatTableDataSource<ModelEmployee>(this.listEm.data);
      this.updatemainmodel(this.listEm.data);
    }
  }

  updatemainmodel(le: ModelEmployee[]) {
    if (this.currentdept && this.currentdept.id > 0) {
      let exist = this.model.data.find((p) => p.department.id == this.currentdept.id);
      if (exist && exist.department) {
        exist.department.employees = le.map((v) => { return v.employee });
        exist.resolve();
      }
    }
  }
}
