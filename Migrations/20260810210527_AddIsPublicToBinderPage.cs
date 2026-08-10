using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToBinderPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "BinderPages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "BinderPages",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsPublic",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "BinderPages");
        }
    }
}
