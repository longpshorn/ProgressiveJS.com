// HTML5 Dom-Ready Execution Utility
var util = {
    init: function (context) {
        var classNames = $(document).find('body')[0].getAttribute('id').split('-'),
            controller = classNames[0],
            action = classNames[1];

        // if they exist, call the methods on the context in the following order
        // common.init(context);
        // controller.init(context);
        // controller.action(context);
        // controller.finalize(context);
        // common.finalize(context);

        util.exec('common', 'init', context);
        if (controller) util.exec(controller, 'init', context);
        if (action) util.exec(controller, action, context);
        if (controller) util.exec(controller, 'finalize', context);
        util.exec('common', 'finalize', context);
    },

    exec: function (controller, action, context) {
        var ns = app;
        if (typeof ns === 'undefined') return;

        // if the action is not passed, use init as the default,
        // otherwise, use the action passed.
        action = (action === undefined) ? 'init' : action;

        // if the context isn't passed, the context should be the entire document,
        // otherwise, restrict the context to the passed context.
        context = (context !== undefined && context !== null)
            ? $(context)
            : $(document);

        // if we have a value for controller and the controller is contained within
        // the namespace object and the namespace has a method that is a function,
        // call that method.
        if (controller !== '' && ns[controller] && typeof ns[controller][action] === 'function') {
            ns[controller][action](context);
        }
    }
};

// document ready
$(function () {
    util.init();
});