using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class AddBinderPageLike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BinderPageLikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BinderPageId = table.Column<int>(type: "integer", nullable: false),
                    UserProfileId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BinderPageLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BinderPageLikes_BinderPages_BinderPageId",
                        column: x => x.BinderPageId,
                        principalTable: "BinderPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BinderPageLikes_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BinderPageLikes_BinderPageId_UserProfileId",
                table: "BinderPageLikes",
                columns: new[] { "BinderPageId", "UserProfileId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BinderPageLikes_UserProfileId",
                table: "BinderPageLikes",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BinderPageLikes");
        }
    }
}
