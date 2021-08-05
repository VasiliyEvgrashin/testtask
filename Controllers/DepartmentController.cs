using AutoMapper;
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
    public class DepartmentController : ControllerBase
    {
        ApplicationDbContext applicationDbContext;
        public DepartmentController(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }
        // GET: api/<DepartmentController>
        [HttpGet]
        public async Task<IEnumerable<Department>> Get()
        {
            return await applicationDbContext.Department.Include(d => d.Employees).ToListAsync();
        }

        // GET api/<DepartmentController>/5
        [HttpGet("{id}")]
        public async Task<Department> Get(int id)
        {
            return await applicationDbContext.Department.Include(d => d.Employees).FirstOrDefaultAsync(s => s.Id == id);
        }

        // POST api/<DepartmentController>
        [HttpPost]
        public async Task<Department> Post([FromBody] Department value)
        {
            if (value.Id != 0)
            {
                Department exist = await applicationDbContext.Department.FirstOrDefaultAsync(s => s.Id == value.Id);
                if (exist != null)
                {
                    exist.Name = value.Name;
                }
            } else
            {
                await applicationDbContext.Department.AddAsync(value);
            }
            await applicationDbContext.SaveChangesAsync();
            return value;
        }

        // DELETE api/<DepartmentController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Department exist = applicationDbContext.Department.Include(d => d.Employees).FirstOrDefault(s => s.Id == id);

            if (exist != null)
            {
                applicationDbContext.Department.Remove(exist);
                applicationDbContext.SaveChanges();
            }
        }
    }
}
