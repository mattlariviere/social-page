﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class User
    {
        public int Id { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }

    }
}
