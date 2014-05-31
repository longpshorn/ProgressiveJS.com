/*!
*
* This plugin is used to help make progressively enhancing websites with ajax partial postbacks easier.
*
*/

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
; (function ($, window, document, undefined) {
    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    var
        // The progressive form plugin is specifically for progressively enhanced forms and wrapping elements
        // that should be submitted together as would normally be done when submitting a typical html form.
        formPluginName = 'progressiveJsform',
        formPluginAttrKey = 'pjs-form',
        formPluginNamespace = 'pjs.form',
        formPluginDefaults = {
            // A boolean indication of whether or not the target specified for the ProgressiveForm is a globalTarget
            // or if it exists within the form being submitted.
            globalTarget: true,

            // The target that should be updated by the mainResponse from the server's ProgressiveResponse
            target: '.pjs-response',

            // The event type that should be used to trigger a submission of the progressive form. To keep the form
            // completely progressive, 'submit' is the only viable event type option. However, if javascript support
            // is assumed, event delegation can be used to trigger other types of events such as change or click
            // events to individual elements within the form.
            eventType: 'submit',

            // A boolean indication of whether a form should be <em>cleared</em> following the ajax request completion
            clearForm: false,

            // A boolean indication of whether a form should be <em>reset</em> following the ajax request completion
            resetForm: true,

            // A comma-separated list of selectors for additional fields that are not within the form that should be sent with the request
            // e.g., '#StateDataParameter1,#StateDataParameter2'
            additionalFields: null,

            // In the event that a successful AJAX request should result in the user being redirected to a new page, the locationOnSuccess
            // parameter can be used to specify that location.
            locationOnSuccess: null,

            // A list of success functions that should be run pending a success ajax response
            successes: [],

            // A list of callback handles that may be specified to be called upon completion of the postback.
            callbacks: [],

            // A noop placeholder for the function that should be run after a progressive form completes its processing
            done: function () { }
        },

        // The progressive item plugin is for progressively enhanced html elements (i.e., anchors, checkboxes,
        // select elements, etc.) that will be used to trigger a postback on change, click, or other event.
        // The progressive item plugin is not truly capable of being used in a "progressively" enhanced approach
        // but is provided as a helper to increase the speed of application development when reliance on javascript
        // is assumed or implied.
        itemPluginName = 'progressiveJsItem',
        itemPluginAttrKey = 'pjs-item',
        itemPluginNamespace = 'pjs.item',
        itemPluginDefaults = {
            // The url that the progressive item should send a postback to. Must be specified by the progressive item
            // or via the href attribute for anchor elements.
            url: null,

            // The payload that should be sent with the postback. Can optionally be built up by the item itself in the
            // case the item is a checkbox or select box or other element, or, specific payload can be specified in the
            // event the item is triggered to send a callback.
            payload: {},

            // A boolean indication of whether or not the target specified for the ProgressiveItem is a globalTarget
            // or if it exists within the ProgressiveItem itself. Could be used in the case where a containing div
            // is made to be a ProgressiveItem that watches for a delegated / bubbled event for triggering.
            globalTarget: true,

            // The target that should be updated by the mainResponse from the server's ProgressiveResponse.
            target: '.pjs-response',

            // The type of postback that sshould be sent (i.e., get, post, put, delete, etc.).
            type: 'post',

            // The event type that will be used to trigger the progressive item to send a postback to the specified location.
            eventType: 'click',

            // A comma-separated list of selectors for additional fields that are not within the form that should be sent with the request
            // e.g., '#StateDataParameter1,#StateDataParameter2'.
            additionalFields: null,

            // A list of success functions that should be run pending a success ajax response
            successes: [],

            // A list of callback handles that may be specified to be called upon completion of the postback.
            callbacks: [],

            // A noop placeholder for the function that should be run after a progressive item completes its processing
            done: function () { }
        },

        // progressive js status code enum
        pjsStatusCode = {
            _default: 'Default',
            success: 'Success',
            warning: 'Warning',
            error: 'Error',
            redirect: 'Redirect'
        },

        // progressive js manipulator enum
        pjsManipulator = {
            after: 'after',
            attr: 'attr',
            before: 'before',
            html: 'html',
            refresh: 'refresh',
            removeAttr: 'removeAttr',
            replaceWith: 'replaceWith',
            text: 'text',
            wrap: 'wrap'
        };

    function reinitContent($target) {
        try {
            util.init($target);
        } catch (exception) {
            console.log({
                Message: 'Exception encountered during reinitialization of progressive form content.',
                Target: $target,
                Exception: exception
            });
        }
    }

    function handleMainResponse(mainResponse, $target, opts) {
        if (mainResponse !== undefined && mainResponse != null) {
            $target[mainResponse.manipulator](mainResponse.message);
            // we may have lost the reference to the target so we need to reselect it
            $target = opts.globalTarget
                ? $(opts.target)
                : $(opts.target, opts.form);

            reinitContent($target);
        }
    }

    function handleItems(items, $target) {
        for (var i = 0, ii = items.length; i < ii; i++) {
            var $element = $(items[i].selector),
                manipulator = items[i].manipulator,
                args = items[i].args,
                content = args;

            // TODO: needs more testing and needs to be modularized and reused with the handleMainResponse functionality
            if ($element.length && manipulator !== '') {
                if (manipulator === pjsManipulator.replaceWith)
                    content = $(items[i].args[0]);
                $element[manipulator].apply($element, content);

                // we may have lost the reference to the target so we need to reselect it
                if (manipulator !== pjsManipulator.replaceWith)
                    content = $(items[i].selector);

                if (manipulator === pjsManipulator.after)
                    content = content.next();
                else if (manipulator === pjsManipulator.before)
                    content = content.prev();
                else if (manipulator === pjsManipulator.replaceWith)
                    content = content.parent();
                else if (manipulator === pjsManipulator.wrap)
                    content = content.parent().parent();

                reinitContent(content);
            }
        }
    }

    function handleCommands(commands) {
        for (var i = 0, ii = commands.length; i < ii; i++)
            eval(commands[i].command).apply(commands[i].arguments);
    }

    function reloadContent(response, opts) {
        // Find the primary update target depending on whether it is a <em>global</em> target or within the form
        var $target = opts.globalTarget
            ? $(opts.target)
            : $(opts.target, opts.$context);

        if (!$.isPlainObject(response)) {
            // If the response is <em>NOT</em> a <em>plain object</em> in the JavaScript sense,
            // it will have already been added to the DOM by the <kbd>jquery.ajaxForm.js</kbd> library.
            // All we need to do here is reinitialize the JavaScript functionality for the update target.
            reinitContent($target);
        } else {
            // By convention, we expect the response to be a <em>ProgressiveResponse</em>.
            // Process the response as such.
            handleMainResponse(response.mainResponse, $target, opts);
            handleItems(response.items, $target);
            handleCommands(response.commands);
        }
    }

    function successHandler(response, textStatus, jqXhr, opts) {
        if (!$.isPlainObject(opts))
            return false;

        reloadContent(response, opts);

        var i = 0,
            ii = opts.successes.length,
            $context = opts.globalTarget
                ? $(opts.target)
                : $(opts.target, opts.$context);

        for (; i < ii; i++)
            opts.successes[i].apply($context, [response, textStatus, jqXhr || this.form, this.form]);

        if (response.statusCode == pjsStatusCode.redirect && opts.locationOnSuccess !== null)
            window.location = opts.locationOnSuccess;
    }

    function evaluateCallbacks(cbs, response) {
        for (var i = 0, ii = cbs.length; i < ii; i++) {
            // push the response on the parameter list for potential use
            cbs[i].parameters.push(response);
            // evaluate the callback
            eval(cbs[i].handle).apply(document, cbs[i].parameters);
        }
    }

    // ProgressiveForm constructor
    function ProgressiveForm(form, options) {
        this.form = form;
        this.$form = $(form);
        this.options = $.extend(true, { $context: this.$form }, formPluginDefaults, options, this.$form.data(formPluginAttrKey));
        this.init(this.$form, this.options);
    }

    ProgressiveForm.prototype.init = function ($form, options) {
        var submitHandler = function (form, event) {
            $(form).ajaxSubmit({
                target: options.globalTarget ? $(options.target) : $(options.target, $form),
                data: options.additionalFields != null ? $(options.additionalFields).serializeObject() : {},
                clearForm: options.clearForm,
                resetForm: options.resetForm,
                success: function (response, textStatus, jqXhr) {
                    successHandler(response, textStatus, jqXhr, options);
                    evaluateCallbacks(options.callbacks, response);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    options.done(jqXhr, textStatus);
                }
            });
        },
            validator = $.data($form[0], 'validator');

        if (validator !== undefined && validator !== null)
            validator.settings.submitHandler = submitHandler;
        else
            $form.on(options.eventType + formPluginNamespace, function (e) {
                e.preventDefault();
                submitHandler(this, e);
            });
    };

    // ProgressiveItem constructor
    function ProgressiveItem(item, options) {
        this.item = item;
        this.$item = $(item);
        this.options = $.extend(true, { $context: this.$item }, itemPluginDefaults, options, this.$item.data(itemPluginAttrKey));
        this.init(this.$item, this.options);
    }

    ProgressiveItem.prototype.init = function ($item, options) {
        $item.on(options.eventType + itemPluginNamespace, function (e) {
            e.preventDefault();

            var url = options.url || $item.attr('href'),
                // TODO: look for way to automatically include configurate RequestVerificationToken
                payload = $.extend(true, {}, d.payload, options.additionalFields);

            if ($item.is('[disabled]'))
                return;

            // if the progressive item is itself an input element, update the payload to include
            // its updated value.
            if ($this.attr('name') !== undefined) {
                payload[$this.attr('name')] = $this.val();
                // in the case that the progressive item is a checkbox or radio button,
                // add a selected value to the payload
                if ($this.is(':checkbox') || $this.is(':radio')) {
                    payload['selected'] = $this.prop('checked');
                }
            }

            // look for payload items within the context of the progressive item
            // that are currently not set and set them if possible
            for (var i in payload) {
                var p = payload[i];
                if (p === undefined || p === null || p === '') {
                    // name must be exactly the same as the payload parameter name
                    payload[i] = $('[name="' + i + '"]', $item).val();
                }
            }

            $.ajax({
                type: options.type,
                url: url,
                data: payload,
                success: function (response, textStatus, jqXhr) {
                    if (!$.isPlainObject(response)) {
                        // The response is not a ProgressiveResponse, treat it as
                        // a string and update the target with the new content.
                        var $target = options.globalTarget
                            ? $(options.target)
                            : $(options.target, $item);
                        $target.html(response);
                    }

                    successHandler(response, textStatus, jqXhr, options);
                    evaluateCallbacks(options.callbacks, response);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    options.done(jqXhr, textStatus);
                }
            });
        });
    }

    // A plugin wrapper around the constructor to prevent multiple instantiations
    $.fn[formPluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + formPluginName)) {
                $.data(this, 'plugin_' + formPluginName, new ProgressiveForm(this, options));
            }
        });
    }

    $.fn[itemPluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + itemPluginName)) {
                $.data(this, 'plugin_' + itemPluginName, new ProgressiveItem(this, options));
            }
        });
    }

    $.progressiveJs = {
        unobtrusive: {
            parse: function(selector) {
                var $selector = $(selector);
                $('[data-' + formPluginAttrKey + ']', $selector)[formPluginName]();
                $('[data-' + itemPluginAttrKey + ']', $selector)[itemPluginName]();
            }
        },

        status: pjsStatusCode
    }

    $(function () {
        $.progressiveJs.unobtrusive.parse(document);
    });
})(jQuery, window, document);