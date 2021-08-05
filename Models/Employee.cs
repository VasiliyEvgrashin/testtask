using System.Text.Json.Serialization;

namespace TestTask.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public int DepartmentId { get; set; }
        [JsonIgnore]
        public virtual Department Department { get; set; }
        public string Name { get; set; }
        public decimal Salary { get; set; }
        public string Fruit { get; set; }
    }
}
