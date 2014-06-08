using System.Web.Mvc;
using ProgressiveJS.Data;
using ProgressiveJS.UX;
using ProgressiveJS.com.Models;
using System.Threading;

namespace ProgressiveJS.com.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult Demo()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SingleButtonForm()
        {
            var isAjax = Request.IsAjaxRequest();

            var status = isAjax
                ? ProgressiveStatus.Default
                : ProgressiveStatus.Warning;
            var msg = !isAjax
                ? "Regular HTML forms can make for a bit of a jarring user experience."
                : "Progressively enhancing your forms makes your pages easier to use!";

            var response = this.RenderProgressiveAlert(status, msg);
            if (isAjax)
                return new ProgressiveResult(response);

            Thread.Sleep(1000);
            return RedirectToAction("Demo");
        }

        [HttpPost]
        public ActionResult DataForm(DataFormModel model)
        {
            var msgName = string.IsNullOrWhiteSpace(model.ToString())
                ? string.Empty
                : string.Format(", {0}", model.ToString());
            var msg = string.Format("Hello{0}! Did you know that ajax could be this easy?", msgName);
            var response = this.RenderProgressiveAlert(ProgressiveStatus.Default, msg);
            if (Request.IsAjaxRequest())
                return new ProgressiveResult(response);

            Thread.Sleep(1000);
            return RedirectToAction("Demo");
        }

        [HttpPost]
        public ActionResult WizardForm(WizardFormModel model)
        {


            return null;
        }

        public ActionResult FAQs()
        {
            return View();
        }

        public ActionResult License()
        {
            return View();
        }
    }
}