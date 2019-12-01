using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Microsoft.CSharp;

namespace Sabio.Models.Domain
{
    public class Skills
    {
        [JsonProperty("Id")]
        public int Id { get; set; }
        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}
