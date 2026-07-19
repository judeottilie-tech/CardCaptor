using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class SeedCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b020b42e-490b-421a-a0e7-7e55baa75716", "AQAAAAIAAYagAAAAEAEQ+07WsbWZGDv94cjLSDr5gS0ckWGI3uOy+OxHkevvrGay/+VugFFWWldY1i6FZg==", "191f09f2-bfd5-421f-bd2d-0cd49f7c5e27" });

            migrationBuilder.InsertData(
                table: "Cards",
                columns: new[] { "Id", "ImageUrl", "Name" },
                values: new object[,]
                {
                    { 1, "https://tcg.one/scans/l/base_set/1.jpg", "Alakazam" },
                    { 2, "https://tcg.one/scans/l/base_set/2.jpg", "Blastoise" },
                    { 3, "https://tcg.one/scans/l/base_set/3.jpg", "Chansey" },
                    { 4, "https://tcg.one/scans/l/base_set/4.jpg", "Charizard" },
                    { 5, "https://tcg.one/scans/l/base_set/5.jpg", "Clefairy" },
                    { 6, "https://tcg.one/scans/l/base_set/6.jpg", "Gyarados" },
                    { 7, "https://tcg.one/scans/l/base_set/7.jpg", "Hitmonchan" },
                    { 8, "https://tcg.one/scans/l/base_set/8.jpg", "Machamp" },
                    { 9, "https://tcg.one/scans/l/base_set/9.jpg", "Magneton" },
                    { 10, "https://tcg.one/scans/l/base_set/10.jpg", "Mewtwo" },
                    { 11, "https://tcg.one/scans/l/base_set/11.jpg", "Nidoking" },
                    { 12, "https://tcg.one/scans/l/base_set/12.jpg", "Ninetales" },
                    { 13, "https://tcg.one/scans/l/base_set/13.jpg", "Poliwrath" },
                    { 14, "https://tcg.one/scans/l/base_set/14.jpg", "Raichu" },
                    { 15, "https://tcg.one/scans/l/base_set/15.jpg", "Venusaur" },
                    { 16, "https://tcg.one/scans/l/base_set/16.jpg", "Zapdos" },
                    { 17, "https://tcg.one/scans/l/base_set/17.jpg", "Beedrill" },
                    { 18, "https://tcg.one/scans/l/base_set/18.jpg", "Dragonair" },
                    { 19, "https://tcg.one/scans/l/base_set/19.jpg", "Dugtrio" },
                    { 20, "https://tcg.one/scans/l/base_set/20.jpg", "Electabuzz" },
                    { 21, "https://tcg.one/scans/l/base_set/21.jpg", "Electrode" },
                    { 22, "https://tcg.one/scans/l/base_set/22.jpg", "Pidgeotto" },
                    { 23, "https://tcg.one/scans/l/base_set/23.jpg", "Arcanine" },
                    { 24, "https://tcg.one/scans/l/base_set/24.jpg", "Charmeleon" },
                    { 25, "https://tcg.one/scans/l/base_set/25.jpg", "Dewgong" },
                    { 26, "https://tcg.one/scans/l/base_set/26.jpg", "Dratini" },
                    { 27, "https://tcg.one/scans/l/base_set/27.jpg", "Farfetch'd" },
                    { 28, "https://tcg.one/scans/l/base_set/28.jpg", "Growlithe" },
                    { 29, "https://tcg.one/scans/l/base_set/29.jpg", "Haunter" },
                    { 30, "https://tcg.one/scans/l/base_set/30.jpg", "Ivysaur" },
                    { 31, "https://tcg.one/scans/l/base_set/31.jpg", "Jynx" },
                    { 32, "https://tcg.one/scans/l/base_set/32.jpg", "Kadabra" },
                    { 33, "https://tcg.one/scans/l/base_set/33.jpg", "Kakuna" },
                    { 34, "https://tcg.one/scans/l/base_set/34.jpg", "Machoke" },
                    { 35, "https://tcg.one/scans/l/base_set/35.jpg", "Magikarp" },
                    { 36, "https://tcg.one/scans/l/base_set/36.jpg", "Magmar" },
                    { 37, "https://tcg.one/scans/l/base_set/37.jpg", "Nidorino" },
                    { 38, "https://tcg.one/scans/l/base_set/38.jpg", "Poliwhirl" },
                    { 39, "https://tcg.one/scans/l/base_set/39.jpg", "Porygon" },
                    { 40, "https://tcg.one/scans/l/base_set/40.jpg", "Raticate" },
                    { 41, "https://tcg.one/scans/l/base_set/41.jpg", "Seel" },
                    { 42, "https://tcg.one/scans/l/base_set/42.jpg", "Wartortle" },
                    { 43, "https://tcg.one/scans/l/base_set/43.jpg", "Abra" },
                    { 44, "https://tcg.one/scans/l/base_set/44.jpg", "Bulbasaur" },
                    { 45, "https://tcg.one/scans/l/base_set/45.jpg", "Caterpie" },
                    { 46, "https://tcg.one/scans/l/base_set/46.jpg", "Charmander" },
                    { 47, "https://tcg.one/scans/l/base_set/47.jpg", "Diglett" },
                    { 48, "https://tcg.one/scans/l/base_set/48.jpg", "Doduo" },
                    { 49, "https://tcg.one/scans/l/base_set/49.jpg", "Drowzee" },
                    { 50, "https://tcg.one/scans/l/base_set/50.jpg", "Gastly" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e148fae3-c3fa-4701-91ab-cf24d40075bf", "AQAAAAIAAYagAAAAECbdOjhNGOA6gb1E0JXjwP/L6Qmt2FjEhet96zRvGN6DHPTPttRKJbWO41dyZ7qDFg==", "ec709ab3-7a74-4323-a471-6ab43e6ec073" });
        }
    }
}
