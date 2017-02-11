define(['text!pages/ftpadd.html'], function (ftpadd) {
    d = Backbone.View.extend({
        el: app.el,
        events: {
            'keyup #addftp-form input': 'oneline',
            'change #addftp-form select': 'oneline',
            'click .ftp-connectionTest': 'testFtp',
            'click .ftp-server-delete': 'deleteftp',
            'click a.ftp-form-password-set-change': 'passwordFieldToggle',
            'click button.ftp-form-password-set-cancel': 'passwordFieldToggle',
            'change #use-pk': 'usePublicAuth',
            'keyup #portno' : 'portno',
        },
        portno: function(e){
            var $this = $(e.currentTarget);
            $this.data('useri', 1);
        },
        usePublicAuth: function (e) {
            var $pk = $('.pkey-ac');
            var $this = $(e.currentTarget);
            var $p = $('.pass-c');
            if ($this.prop('checked'))
                $pk.show(), $p.hide(), this.loadPublicAuth(); else $pk.hide(), $p.show();
        },
        loadPublicAuth: function () {
            var $sc = $('.ssh-c');
            var $sk = $('#ssh-k');
            var that = this;

            if ($sk.length != 0 && !$sk.data('loaded')) {
                $sc.html('<i class="gf gf-loading"></i> loading..');
                _ajax({
                    url: base + 'api/ftp/authkey',
                    method: 'get',
                    dataType: 'json',
                }).done(function (res) {
                    $sk.val(res.data.id);
                    $sc.html(res.data.command);
                    $sk.data('loaded', true);
                });
            }
        },
        passwordFieldToggle: function (e) {
            e.preventDefault();
            var $this = $(e.currentTarget);

            var $set = $('.ftp-form-password-set'), $field = $('.ftp-form-password-field');

            if ($field.is(':visible')) {
                $field.find('input').prop('disabled', true);
                $field.hide();
                $set.show();
            } else {
                $field.show();
                $set.hide();
                $field.find('input').prop('disabled', false);
            }
            this.oneline();
        },
        deleteftp: function (e) {
            e.preventDefault();
            var $this = $(e.currentTarget);
            var id = $this.attr('data-id');
            var that = this;
            $this.find('i').removeClass('fa-trash').addClass('fa-spin fa-spinner').attr('disabled', true);

            _ajax({
                url: base + 'api/ftp/isftpinuse',
                data: {
                    id: id,
                },
                method: 'get',
                dataType: 'json',
            }).done(function (data) {
                if (!data.status) {
                    $.confirm({
                        title: 'Remove FTP account?',
                        content: 'Are you sure to remove the FTP server.<br><i class="fa fa-info blue"></i>&nbsp; Files on this server will not be deleted.',
                        confirm: function () {
                            $this.find('i').addClass('fa-trash').removeClass('fa-spin fa-spinner').removeAttr('disabled');

                            _ajax({
                                url: base + 'api/ftp/delftp/' + id,
                                method: 'get',
                                dataType: 'json',
                            }).done(function (data) {
                                if (data.status) {
                                    noty({
                                        text: 'The ftp server was deleted.',
                                        type: 'success'
                                    });
                                    Router.navigate('ftp', {
                                        trigger: true
                                    });
                                } else {
                                    $.alert({
                                        'title': 'Problem',
                                        'content': data.reason
                                    });
                                }
                            });
                        },
                        cancel: function () {
                            $this.find('i').addClass('fa-trash').removeClass('fa-spin fa-spinner').removeAttr('disabled');
                        },
                        confirmButtonClass: 'btn-warning',
                        confirmButton: '<i class="fa fa-trash"></i>&nbsp; Remove',
                    });
                } else {
                    console.log(data.used_in);
                    branch = data.used_in[0];
                    $.confirm({
                        title: 'Linked with — <i class="fa fa-cloud"></i> ' + branch['project_name'],
                        content: 'Cannot delete a FTP account that is in use, please unlink it from the existing enviornment. ' + '<br> <a target="_blank" href="/project/' + branch['deploy_id'] + '/environments/manage/' + branch['id'] + '">' + branch['project_name'] + ' - <i class="fa fa-leaf green"></i> ' + branch['branch_name'] + '</a>',
                        confirmButton: 'Unlink',
                        cancelButton: 'Close',
                        confirm: function () {
                            Router.navigate('/project/' + branch['deploy_id'] + '/environments/manage/' + branch['id'], {
                                trigger: true,
                            });
                        },
                        cancel: function () {
                            $this.find('i').addClass('fa-trash').removeClass('fa-spin fa-spinner').removeAttr('disabled');
                        }
                    });
                }
            });
        },
        testFtp: function (e) {
            e.preventDefault();
            var that = this;
            var $this = $(e.currentTarget);
            var form = $('#addftp-form').serializeObject();
            if (!form.scheme || !form.host || !form.username) {
                $.alert({
                    title: false,
                    content: '<div class="space10"></div>' + 'Please enter enough data to connect to the FTP server.',
                    confirmButton: 'Dismiss',
                });
                return false;
            }
            $this.prop('disabled', true);
            var $s = $('.status .alert');
            $s.removeClass('alert-success alert-danger').addClass('alert-info').show().html('<i class="gf gf-loading gf-btn"></i> Trying to connect..')
            _ajax({
                url: base + 'api/ftp/test',
                dataType: 'json',
                method: 'post',
                timeout: 20000,
                data: form
            }).done(function (d) {
                if (d.status) {
                    $s.removeClass('alert-info').addClass('alert-success').html(d.message);
                } else {
                    $s.removeClass('alert-info').addClass('alert-danger').html(d.message);
                }
            }).error(function(e){
                if(e.statusText == 'timeout'){
                    $s.removeClass('alert-info').addClass('alert-danger').html('We tried hard to connect to your server, but we had to stop trying after 20 seconds.');
                }
            }).always(function(){
                $this.prop('disabled', false).find('i').removeClass('gf gf-loading gf-btn');
            });
        },
        hostValidate: /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i,
        ipValidate: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        oneline: function () {
            var $target = $('.ftp-oneline');
            var str = '';
            var host = $('input[name="host"]').val();
            var username = $('input[name="username"]').val();
            var pass = $('input[name="pass"]:not(:disabled)').val();
            var scheme = $('select[name="scheme"]').val();
            var path = $('input[name="path"]').val();
            var port = $('input[name="port"]').val();
            var $port = $('input[name="port"]');

            if (username)
                $('.sup-user').html('i.e. ' + username); else
                $('.sup-user').html('');

            $fssh = $('.f-ssh');
            $passc = $('.pass-c');
            if (scheme == 'sftp'){
                if(!$port.data('useri')) $port.val('22');
                $fssh.show();
                if($('#use-pk').prop('checked'))
                    $passc.hide();
                else
                    $passc.show();
            }else{
                if(!$port.data('useri')) $port.val('21');
                $passc.show();
                $fssh.hide();
            }

            if (this.hostValidate.test(host) || this.ipValidate.test(host)) {
                if (scheme && /ftp|ftps|sftp/.test(scheme)) {
                    str += scheme + '://';
                } else {
                    str += 'ftp://';
                }
                if (username) {
                    str += username;
                    if (pass) {
                        pass = pass.split('');
                        pass = $.map(pass, function () {
                            return '*';
                        });
                        str += ':' + pass.join('');
                    }
                    str += '@';
                }
                if (host) {
                    str += host;
                }
                if (port) {
                    str += ':' + port;
                } else {
                    str += ':21';
                }
                if (path) {
                    str += '' + path;
                } else {
                    str += '/';
                }
            }

            if (str === '') {
                str = 'ftp://example:password@production-example.com:21/path/to/target';
            }

            $target.html(str);
        },
        render: function (id) {
            var that = this;
            this.$el.html(this.$e = $('<div class="bb-loading">').addClass(viewClass()));
            if (id) {
                _ajax({
                    url: base + 'api/ftp/get/' + id,
                    dataType: 'json',
                    method: 'get',
                }).done(function (data) {
                    var template = _.template(ftpadd);

                    if (!data.data.length)
                        history.back();

                    template = template({
                        'ftp': data.data
                    });
                    that.$e.html(template);
                    that.oneline();
                    that.validation();
                    that.formState = $.param($('form#addftp-form').serializeArray());
                    console.log(that.formState);
                });
                that.id = id;
                setTitle('Edit ftp server');
            } else {
                var template = _.template(ftpadd);
                template = template({
                    'ftp': []
                });
                that.$e.html(template);
                that.id = false;
                that.validation();
                setTitle('Add ftp server');
            }
        },
        validation: function () {
            var that = this;
            $('#addftp-form').validate({
                debug: true,
                submitHandler: function (form) {
                    that.add(form);

                    return false;
                },
                errorClass: 'error',
                rules: {
                    'name': {
                        required: true
                    },
                    'scheme': 'validateScheme',
                    'host': 'validateHost',
                    'username': {
                        required: true,
                    },
                    'path': {
                        required: true,
                        'validatePath': true,
                        'validatePathSlash': true,
                    },
                    'port': {
                        required: true,
                        number: true,
                    }
                }
            });
            $.validator.addMethod('validatePath', function (value) {
                return !/(\/)\1+|\\/ig.test(value);
            }, 'Please enter a valid path');
            $.validator.addMethod('validatePathSlash', function (value) {
                return /^\/|^\\/.test(value);
            }, 'The path must contain a leading slash');
            $.validator.addMethod('validateScheme', function (value) {
                return value == 'ftp' || value == 'ftps' || value == 'sftp';
            }, 'Please enter a valid schema.');
            $.validator.addMethod('validateHost', function (value) {
                return that.hostValidate.test(value) || that.ipValidate.test(value);
            }, 'Please enter the Servers\'s URL or IP address.');
        },
        add: function (form) {
            var that = this;
            var $this = $(form);
            var data = $this.serializeArray();
            var param = (this.id) ? 'edit/' + this.id : 'add';

            $this.find(':input').prop('disabled', true);

            var $submitBtn = $this.find('button[type="submit"]');
            var submitBtnT = $submitBtn.html();
            $submitBtn.html('<i class="gf gf-loading gf-btn"></i> ' + (submitBtnT == 'Save' ? 'Saving' : 'Updating'));

            //console.log(that.formState);
            if (that.formState == $.param(data)) {
                create();
            } else {
                $connecting = $.dialog({
                    title: false,
                    content: '<i class="gf gf-loading gf-alert"></i>' + '<br>Please wait while we verify connection to your server...',
                    cancel: function () {
                        $this.find(':input:not([data-notform="true"])').prop('disabled', false);
                        $submitBtn.html(submitBtnT);
                        $tC.abort();
                    },
                    backgroundDismiss: false,
                });

                $tC = _ajax({
                    url: base + 'api/ftp/test',
                    data: data,
                    method: 'post',
                    timeout: 20000,
                    dataType: 'json',
                }).done(function (res) {
                    $connecting.close();
                    if (res.status) {
                        create();
                    } else {
                        $.confirm({
                            title: false,
                            content: '<div class="space10"></div>' + 'We faced some problems with your server. ' +
                            '<div class="space5"></div>' +
                            '<div class="row" style="background: #eee"><div class="col-md-12">' +
                            '<div class="space10"></div>' + res.message + '<div class="space10"></div></div></div>' +
                            '<div class="space5"></div>' +
                            'You can proceed with errors or review the configuration again.',
                            confirm: function () {
                                create();
                            },
                            cancel: function () {
                                $this.find(':input:not([data-notform="true"])').prop('disabled', false);
                                $submitBtn.html(submitBtnT);
                            },
                            confirmButton: 'Proceed anyway',
                            confirmButtonClass: 'btn-default',
                            cancelButtonClass: 'btn-success',
                            cancelButton: 'Review',
                        });
                    }
                }).error(function(e){
                    $connecting.close();
                    if(e.statusText == 'timeout'){
                        $.confirm({
                            title: false,
                            content: '<div class="space10"></div>' + 'We tried hard connecting to the server, but had to stop trying after 20 seconds. ' +
                            'You can proceed with errors or review the configuration again.',
                            confirm: function () {
                                create();
                            },
                            cancel: function () {
                                $this.find(':input:not([data-notform="true"])').prop('disabled', false);
                                $submitBtn.html(submitBtnT);
                            },
                            confirmButton: 'Proceed anyway',
                            confirmButtonClass: 'btn-default',
                            cancelButtonClass: 'btn-success',
                            cancelButton: 'Review',
                        });
                    }
                });
            }
            function create() {
                _ajax({
                    url: base + 'api/ftp/' + param,
                    data: data,
                    method: 'post',
                    dataType: 'json'
                }).done(function (data) {
                    $this.find(':input:not([data-notform="true"])').prop('disabled', false);
                    if (data.status) {
                        if (that.executeAfterAdd) {
                            that.executeAfterAdd();
                            return false;
                        }
                        noty({
                            text: ((that.id) ? 'Your changed are saved.' : 'Added server: ' + $this.find('[name="host"]').val() ),
                            type: 'success'
                        });
                        Router.navigate('ftp', {trigger: true});
                    } else {
                        noty({
                            text: data.reason,
                            type: 'warning'
                        });
                    }
                    $submitBtn.html('Update');
                });
            }
        },
    });

    return d;
});