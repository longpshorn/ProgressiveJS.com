using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProgressiveJS.com.Models
{
    public class WizardFormModel : DataFormModel
    {
        public WizardFormModel(int step = 1)
        {
            Step = step;
        }

        public int Step { get; set; }
    }
}