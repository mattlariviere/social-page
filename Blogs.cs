using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Blogs
    {
        public int Id { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public string ShortTitle { get; set; }
        public string Content { get; set; }
        public string ShortDescription { get; set; }
        public string Slug { get; set; }
        public bool StatusId { get; set; }
        public string PrimaryImage { get; set; }
        public string Tags { get; set; }
    }
}
