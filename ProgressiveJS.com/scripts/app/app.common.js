if (typeof app === 'undefined') app = {};

app.common = {
    init: function (context) {
        app.log('common init start');

        $(context).foundation();
        //$('[data-pjs-form]', context).progressiveJsForm();
        //$('[data-pjs-item]', context).progressiveJsItem();

        app.log('common init end');
    },

    finalize: function (context) {
        app.log('common finalize start');
        app.log('common finalize end');
    }
};
