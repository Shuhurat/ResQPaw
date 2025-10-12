using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResQPaw.Migrations
{
    /// <inheritdoc />
    public partial class AddSOSFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Message",
                table: "SOSRequests",
                newName: "ReporterPhone");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "SOSRequests",
                newName: "ReporterName");

            migrationBuilder.AddColumn<string>(
                name: "AnimalCondition",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnimalType",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyType",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MediaFilePath",
                table: "SOSRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MediaPaths",
                table: "SOSRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReporterEmail",
                table: "SOSRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnimalCondition",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "AnimalType",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "EmergencyType",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "MediaFilePath",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "MediaPaths",
                table: "SOSRequests");

            migrationBuilder.DropColumn(
                name: "ReporterEmail",
                table: "SOSRequests");

            migrationBuilder.RenameColumn(
                name: "ReporterPhone",
                table: "SOSRequests",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "ReporterName",
                table: "SOSRequests",
                newName: "Address");
        }
    }
}
