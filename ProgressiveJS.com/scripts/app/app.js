var app = {
    __namespace: true,

    debug: false,

    log: function (msg, force) {
        if (app.debug || force) {
            if (!window.console) {
                window.console = { log: function () { } };
            }
            console.log(msg);
        }
    }
};
