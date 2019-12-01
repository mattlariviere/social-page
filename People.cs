using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class People
    {
        public int Id { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public string Bio { get; set; }
        public string Summary { get; set; }
        public string Headline { get; set; }
        public string Slug { get; set; }
        public bool StatusId { get; set; }
        public string PrimaryImage { get; set; }
        public List<Skills> Skills { get; set; }

    }
}
