using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToBinderPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "BinderPages",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "02a7b74f-8791-44ca-a5de-9df186536535", "AQAAAAIAAYagAAAAED0YJuo3oc5NA8508V9DErvgMXDo9tWsE/tk5CM/YSRKFtvtFxLcV9rK/LrgD2lrGg==", "da5dbabd-64d1-459d-afd7-ffaf17478737" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "BinderPages");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "02b2d210-eb0c-438c-ada4-2297a6687a1d", "AQAAAAIAAYagAAAAEFZd9rR+LiFNkjQeXz8G7Fe2uuUp1S11h4CwyONd7rXcsdYlAb5VAULnfbju0hXVQw==", "17d2c9e6-3fc8-45a6-b1b7-61073fcb8de9" });
        }
    }
}
