using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class AddLayoutToBinderPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Columns",
                table: "BinderPages",
                type: "integer",
                nullable: false,
                defaultValue: 3);

            migrationBuilder.AddColumn<int>(
                name: "Rows",
                table: "BinderPages",
                type: "integer",
                nullable: false,
                defaultValue: 3);

            migrationBuilder.UpdateData(
                table: "BinderPages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Columns", "Rows" },
                values: new object[] { 3, 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Columns",
                table: "BinderPages");

            migrationBuilder.DropColumn(
                name: "Rows",
                table: "BinderPages");
        }
    }
}
