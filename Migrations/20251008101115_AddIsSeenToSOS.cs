using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResQPaw.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSeenToSOS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSeen",
                table: "SOSRequests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SeenByVetId",
                table: "SOSRequests",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSeen",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "SeenByVetId",
                table: "SOSRequests");
        }
    }
}
