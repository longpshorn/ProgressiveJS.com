using System.Web;
using System.Web.Optimization;

namespace ProgressiveJS.com
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles
                .Add(
                    new ScriptBundle("~/bundles/libs")
                        .Include(
                            "~/scripts/jquery-1.11.1.js",
                            "~/scripts/jquery.validate.js",
                            "~/scripts/jquery.validate.unobtrusive.js",
                            "~/scripts/jquery.form.js",
                            "~/scripts/jquery.progressive.js",

                            "~/scripts/foundation/foundation.js",
                            "~/scripts/foundation/foundation.abide.js",
                            "~/scripts/foundation/foundation.accordion.js",
                            "~/scripts/foundation/foundation.alert.js",
                            "~/scripts/foundation/foundation.clearing.js",
                            "~/scripts/foundation/foundation.dropdown.js",
                            "~/scripts/foundation/foundation.equalizer.js",
                            "~/scripts/foundation/foundation.interchange.js",
                            "~/scripts/foundation/foundation.joyride.js",
                            "~/scripts/foundation/foundation.magellan.js",
                            "~/scripts/foundation/foundation.offcanvas.js",
                            "~/scripts/foundation/foundation.orbit.js",
                            "~/scripts/foundation/foundation.reveal.js",
                            "~/scripts/foundation/foundation.slider.js",
                            "~/scripts/foundation/foundation.tab.js",
                            "~/scripts/foundation/foundation.tooltip.js",
                            "~/scripts/foundation/foundation.topbar.js"
                        )
                );

            bundles
                .Add(
                    new ScriptBundle("~/bundles/app")
                        .Include(
                            "~/scripts/app/app.js",
                            "~/scripts/app/app.common.js",

                            "~/scripts/util.js"
                        )
                );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles
                .Add(
                    new ScriptBundle("~/bundles/modernizr")
                        .Include("~/scripts/modernizr-*")
                );

            bundles
                .Add(
                    new StyleBundle("~/content/css")
                        .Include("~/content/css/app.css")
                );

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
