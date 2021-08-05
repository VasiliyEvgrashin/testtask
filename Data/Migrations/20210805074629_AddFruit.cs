using Microsoft.EntityFrameworkCore.Migrations;

namespace TestTask.Data.Migrations
{
    public partial class AddFruit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Fruit",
                table: "Employee",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fruit",
                table: "Employee");
        }
    }
}
