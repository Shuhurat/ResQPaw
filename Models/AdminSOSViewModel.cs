using System;
using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
public class AdminSOSViewModel
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string Address { get; set; }
    public string Message { get; set; }
    public string Status { get; set; }
    public string AssignedVetName { get; set; }
}


}