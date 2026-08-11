using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCaptor.Migrations
{
    /// <inheritdoc />
    public partial class ScopeSideboardToBinderPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Existing rows' UserProfileId values have no valid meaning as a
            // BinderPageId once the column is renamed - the sideboard is moving
            // from "one per user" to "one per binder page" scope, so a straight
            // rename would silently misattribute every existing card to whatever
            // page happens to share that numeric id. Clear them out rather than
            // carry over corrupted associations.
            migrationBuilder.Sql("DELETE FROM \"SideboardCards\";");

            migrationBuilder.DropForeignKey(
                name: "FK_SideboardCards_UserProfiles_UserProfileId",
                table: "SideboardCards");

            migrationBuilder.RenameColumn(
                name: "UserProfileId",
                table: "SideboardCards",
                newName: "BinderPageId");

            migrationBuilder.RenameIndex(
                name: "IX_SideboardCards_UserProfileId",
                table: "SideboardCards",
                newName: "IX_SideboardCards_BinderPageId");

            migrationBuilder.AddForeignKey(
                name: "FK_SideboardCards_BinderPages_BinderPageId",
                table: "SideboardCards",
                column: "BinderPageId",
                principalTable: "BinderPages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SideboardCards_BinderPages_BinderPageId",
                table: "SideboardCards");

            migrationBuilder.RenameColumn(
                name: "BinderPageId",
                table: "SideboardCards",
                newName: "UserProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_SideboardCards_BinderPageId",
                table: "SideboardCards",
                newName: "IX_SideboardCards_UserProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_SideboardCards_UserProfiles_UserProfileId",
                table: "SideboardCards",
                column: "UserProfileId",
                principalTable: "UserProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
