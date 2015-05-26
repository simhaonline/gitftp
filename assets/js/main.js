$(function () {
    window.escapeTag = function (arg) {
        var a = arg.replace(/</ig, '&lt;');
        a = a.replace(/>/ig, '&gt;');
        return a;
    }

    window.log = function (arg) {
        console.log(arg);
    }

    window.isValidUrl = function (url) {
        //  return /_^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$_iuS/.test(url);
    }

//    ajaxHelper
    window._ajax = function (arg) {
        return $.ajax(arg)
            .error(function (data) {
                switch (data.status) {
                    case 0:
                        _problem({
                            content: 'This is temporary!, <br>Seems like your internet isn\'t working at the moment.',
                            confirm: function () {
                                location.reload();
                                return false;
                            },
                            confirmButton: '<i class="fa fa-refresh fa-fw"></i> Reload',
                        });
                        break;
                    case 404:
                        _problem({
                            content: 'Page not found, <br><code>Error code: 404</code>',
                            confirm: function () {
                                history.back();
                            },
                            confrimButton: '<i class="fa fa-arrow-left fa-fw"></i> Back'
                        });
                        break;
                    case 500:
                        _problem({
                            content: 'The code has gone crazy, <br><code>Error code: 500</code>',
                            confirm: function () {
                                history.back();
                            },
                            confrimButton: '<i class="fa fa-arrow-left fa-fw"></i> Back'
                        });
                        break;
                    case 200:
                        _problem({
                            content: 'Something unexpected happened, <br><code>Error code: 200</code>',
                            confirm: function () {
                                history.back();
                            },
                            confrimButton: '<i class="fa fa-arrow-left fa-fw"></i> Back'
                        });
                        break;
                    default:
                        alert('error :' + data.status);
                }
            }).always(function (data) {
                if (!data.status) {

                    if (data.reason == '10001') {
                        _problem({
                            title: 'Logged out',
                            content: 'You\'ve been logged out, please login to proceed.',
                            confirm: function () {
                                var currentLocation = window.location.href;
                                window.location.href = home_url + 'login?b=' + currentLocation;
                            },
                            confirmButton: 'Login',
                        });
                    }

                }
            });
    }
    window._problem = function (a) {
        var b = {};
        $.extend(b, a, {
            title: a.title || 'Problem',
            content: a.text || 'Please try again later.',
            icon: 'fa fa-warning',
            confirmButtonClass: 'btn-warning'
        });
        $.confirm(b);
    }
    window._debug = true;
});