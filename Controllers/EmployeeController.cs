using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTask.Data;
using TestTask.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        ApplicationDbContext applicationDbContext;
        public EmployeeController(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }
        // GET: api/<EmployeeController>
        [HttpGet]
        public async Task<IEnumerable<Employee>> Get(int depid)
        {
            return await applicationDbContext.Employee.Where(s => s.DepartmentId == depid).ToListAsync();
        }

        // GET api/<EmployeeController>/5
        [HttpGet("{id}")]
        public async Task<Employee> GetItem(int id)
        {
            return await applicationDbContext.Employee.FirstOrDefaultAsync(s => s.Id == id);
        }

        // PUT api/<EmployeeController>
        [HttpPut]
        public async Task<Employee> Put([FromBody] Employee value)
        {
            Employee exist = await applicationDbContext.Employee.Include(d => d.Department).FirstOrDefaultAsync(s => s.Id == value.Id);
            if (exist != null)
            {
                exist.Name = value.Name;
                exist.Salary = value.Salary;
                exist.Fruit = value.Fruit;
            }
            await applicationDbContext.SaveChangesAsync();
            return value;
        }

        // POST api/<EmployeeController>/5
        [HttpPost("{id}")]
        public async Task<Employee> Post(int id, [FromBody] Employee value)
        {
            value.DepartmentId = id;
            await applicationDbContext.Employee.AddAsync(value);
            await applicationDbContext.SaveChangesAsync();
            return value;
        }

        // DELETE api/<EmployeeController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Employee exist = applicationDbContext.Employee.FirstOrDefault(s => s.Id == id);
            if (exist != null)
            {
                applicationDbContext.Employee.Remove(exist);
                applicationDbContext.SaveChanges();
            }
        }
    }
}
