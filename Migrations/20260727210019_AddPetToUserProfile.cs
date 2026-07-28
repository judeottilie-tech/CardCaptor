using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class AddPetToUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PetFeedCount",
                table: "UserProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "PetFullness",
                table: "UserProfiles",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "PetLastFedAt",
                table: "UserProfiles",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "StarterPokemon",
                table: "UserProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                "UPDATE \"UserProfiles\" SET \"StarterPokemon\" = 'Bulbasaur', \"PetFullness\" = 100, \"PetLastFedAt\" = NOW() WHERE \"StarterPokemon\" = '';");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "02b2d210-eb0c-438c-ada4-2297a6687a1d", "AQAAAAIAAYagAAAAEFZd9rR+LiFNkjQeXz8G7Fe2uuUp1S11h4CwyONd7rXcsdYlAb5VAULnfbju0hXVQw==", "17d2c9e6-3fc8-45a6-b1b7-61073fcb8de9" });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PetFeedCount", "PetFullness", "PetLastFedAt", "StarterPokemon" },
                values: new object[] { 0, 100.0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Bulbasaur" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PetFeedCount",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PetFullness",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PetLastFedAt",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "StarterPokemon",
                table: "UserProfiles");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "6309313d-a911-423a-966c-79e9c1cb3b95", "AQAAAAIAAYagAAAAEHFGEX6/FV7+H6QePvrAHMDDjl/x+vfxU8gA8PRyCJojcl2t0Fz2HpKifRzJPrCmKg==", "cb7eb756-cd1d-4bf2-bb4a-d3d0f70a7e8e" });
        }
    }
}
