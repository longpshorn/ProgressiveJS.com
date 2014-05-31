using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProgressiveJS.com.Models
{
    public class DataFormModel
    {
        [Required(ErrorMessage = "Your first name is required.")]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        public override string ToString()
        {
            var isFirstEmpty = string.IsNullOrWhiteSpace(FirstName);
            var isLastEmpty = string.IsNullOrWhiteSpace(LastName);
            if (!isFirstEmpty || !isLastEmpty)
            {
                if (!isFirstEmpty && !isLastEmpty)
                    return string.Format("{0} {1}", FirstName, LastName);
                if (!isFirstEmpty)
                    return FirstName;
                if (!isLastEmpty)
                    return LastName;
            }
            return string.Empty;
        }
    }
}