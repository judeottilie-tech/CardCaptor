using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class SeedDemoAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1ac5ed5e-321b-43a5-b5cf-601f116f2bc8", "AQAAAAIAAYagAAAAELeRD5li3MF+nAJ9iMNI/VKQbd5ZG9hmkK4GCTB98QQA5rRUAustisDll7qQJ6r8Gw==", "d0421a93-dfa7-4b35-9b06-c6254a3482cc" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "14e95ce0-ccca-4a12-a26d-6354d318ac70", 0, "d589739e-9dd7-4586-b3ad-47e17346df25", "demo@cardcaptor.comx", false, false, null, null, null, "AQAAAAIAAYagAAAAEGfhBSqTZy9X/pudDnRxhjAEo35uUukm2f8FNovsAAIPDt8ZrtzYacz3fdrAQicxgw==", null, false, "156d41da-d344-4a10-9d95-31e08decba92", false, "DemoUser" });

            migrationBuilder.InsertData(
                table: "UserProfiles",
                columns: new[] { "Id", "DisplayName", "IdentityUserId" },
                values: new object[] { 2, "Demo User", "14e95ce0-ccca-4a12-a26d-6354d318ac70" });

            migrationBuilder.InsertData(
                table: "BinderPages",
                columns: new[] { "Id", "CreatedAt", "Title", "UserProfileId" },
                values: new object[] { 1, new DateTime(2026, 7, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Demo Binder", 2 });

            migrationBuilder.InsertData(
                table: "BinderPageCardSlots",
                columns: new[] { "Id", "BinderPageId", "CardId", "Position" },
                values: new object[,]
                {
                    { 1, 1, 4, 1 },
                    { 2, 1, 15, 2 },
                    { 3, 1, 2, 3 },
                    { 4, 1, 10, 4 },
                    { 5, 1, null, 5 },
                    { 6, 1, null, 6 },
                    { 7, 1, null, 7 },
                    { 8, 1, null, 8 },
                    { 9, 1, null, 9 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "BinderPageCardSlots",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "BinderPages",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "14e95ce0-ccca-4a12-a26d-6354d318ac70");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b020b42e-490b-421a-a0e7-7e55baa75716", "AQAAAAIAAYagAAAAEAEQ+07WsbWZGDv94cjLSDr5gS0ckWGI3uOy+OxHkevvrGay/+VugFFWWldY1i6FZg==", "191f09f2-bfd5-421f-bd2d-0cd49f7c5e27" });
        }
    }
}
