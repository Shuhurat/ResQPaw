using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResQPaw.Migrations
{
    /// <inheritdoc />
    public partial class AddVetTablAddVetTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Specialty = table.Column<string>(type: "TEXT", nullable: false),
                    Location = table.Column<string>(type: "TEXT", nullable: false),
                    VetClinic = table.Column<string>(type: "TEXT", nullable: false),
                    Availability = table.Column<string>(type: "TEXT", nullable: false),
                    Species = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    ExperienceYears = table.Column<int>(type: "INTEGER", nullable: false),
                    Services = table.Column<string>(type: "TEXT", nullable: true),
                    Rating = table.Column<double>(type: "REAL", nullable: true),
                    ProfilePhotoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    EmergencyService = table.Column<bool>(type: "INTEGER", nullable: false),
                    Website = table.Column<string>(type: "TEXT", nullable: true),
                    LanguagesSpoken = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vets", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vets");
        }
    }
}
