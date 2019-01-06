/*通用脚本*/
// 登录相关--不知道其他地方有没有引用Is_logined,放在外面
var cookie = {
    SET: function (name, value, days) {
        var expires = "";
        if (days) {
            var d = new Date();
            d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + d.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    GET: function (name) {
        var re = new RegExp("(\;|^)[^;]*(" + name + ")\=([^;]*)(;|$)");
        var res = re.exec(document.cookie);
        return res != null ? res[3] : null;
    }
};
var Is_logined = false;
var API_HOST = "/";
var paramString = "m=api&c=user&a=status";

function isChinese(str) { //判断是不是中文
    var reCh = /[u00-uff]/;
    return !reCh.test(str);
}

$(document).ready(function () {
    //判断是否登录
    window.getUserInfo = function () {
        $.getJSON(API_HOST + "?" + paramString + "&jsoncallback=?", function (responseData) {
            //手机和PC都在引用，做下判断
            if(typeof CONSTANTS != 'undefined'){
                if (!responseData.status) {
                    $('.start-b-warp').show();
                    Is_logined = false;
                }
                if (responseData.status) {
                    Is_logined = true;
                    $('.login-btn').hide();
                    $('.login-after').show();
                    $('.login-after .user-id').html(responseData.name);
                    $('.login-after .account-money').html(responseData.money);
                    $('.login-after .user_garde').html('('+responseData.grade_name+')');
                }
            }else{
                if (!responseData.status || !responseData.id) {
                    Is_logined = false;
                    $('#login').show();
                    $('#foot_cjyw').show();
                } else if (responseData.status && responseData.id) {
                    Is_logined = true;
                    $('#login').hide();
                    $('#logined').show();
                    $('#logined .nickname').html(responseData.name);
                    $('#logined .user_grade').html(responseData.grade_name);
                    $('#logined .money').html(responseData.money);
                    $('#logined .buycar_cunt').html(responseData.shopcart_count);
                    if (responseData.msgcount > 0) {
                        $('#msgcountbox').show();
                        $('#logined .msgcount').html(responseData.msgcount);
                    }
                }
            }
            //logined_callback -> ESONCalendar.js 商标注册，用来加载历史记录的回调函数
            if (typeof logined_callback == 'function') {
                logined_callback()
            }
        });
    };
    getUserInfo();
    //一级导航的标签 位置根据汉字计算
    var span_list = $('.icon-mianfei');
    for (var i = 0; i < span_list.length; i++) {
        var text_desc = span_list.eq(i).text();
        var Length = text_desc.length;
        if (isChinese(text_desc)) {
            if (Length == 1) {
                span_list.eq(i).css({
                    'right': '-12px'
                });
                span_list.eq(i).show();
            } else if (Length == 2) {
                span_list.eq(i).css({
                    'right': '-24px'
                });
                span_list.eq(i).show();
            } else if (Length == 3) {
                span_list.eq(i).css({
                    'right': '-36px'
                });
                span_list.eq(i).show();
            } else if (Length == 4) {
                span_list.eq(i).css({
                    'right': '-48px'
                });
                span_list.eq(i).show();
            } else if (Length > 4) {
                span_list.eq(i).css({
                    'right': '-60px'
                });
                span_list.eq(i).show();
            }
        } else {
            if (Length == 2) {
                span_list.eq(i).css({
                    'right': '-12px'
                });
                span_list.eq(i).show();
            } else if (Length == 3) {
                span_list.eq(i).css({
                    'right': '-18px'
                });
                span_list.eq(i).show();
            } else if (Length == 4) {
                span_list.eq(i).css({
                    'right': '-24px'
                });
                span_list.eq(i).show();
            } else if (Length == 5) {
                span_list.eq(i).css({
                    'right': '-30px'
                });
                span_list.eq(i).show();
            } else if (Length > 5) {
                span_list.eq(i).css({
                    'right': -6 * Length
                });
                span_list.eq(i).show();
            }
        }
    }
    //返回顶部按钮
    var $toTop = $("#toTop");
    $toTop.hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            if ($toTop.is(":hidden")) {
                $toTop.stop().fadeIn(500);
            }
        } else {
            if ($toTop.is(":visible")) {
                $toTop.stop().fadeOut(500);
            }
        }
    });
    $toTop.click(function () {
        $('body,html').stop().animate({
            scrollTop: 0
        }, 300);
        return false;
    });

    /*footer部分的脚本*/
    //侧边栏弹出
    $(".suspension-tel, .suspension-qrcode").hover(function () {
        $(this).children(".pop-detail").fadeIn(300);
    }, function () {
        $(this).children(".pop-detail").fadeOut(100);
    });

    //href="#a_null"的统一设置为无效链接
    $("a[href='#a_null']").click(function () {
        return false;
    });
    //验证码切换
    $(".show-captcha").on('click',function(){
        var src = $(this).attr('src');
        $(this).attr('src', '/?m=api&c=captcha&rnd='+Math.random());
    })
});

// 封装工具类方法
$(function () {
    window.NY = window.NY || {};

    // add feedback tips: warn/success/error
    if ($.dialog && $.dialog.tips) {
        var DEFAULT_TIPS_SHOW_DURATION = 2;
        var tipsTypeList = ["warn", "success", "error", "loading"];
        var tipsTypeMap = {
            warn: "alert"
        };

        $.each(tipsTypeList, function (i, tipsType) {
            var basicMethodType = tipsTypeMap[tipsType] || tipsType;

            window.NY[tipsType] = function (text, duration, callback) {
                duration = duration || DEFAULT_TIPS_SHOW_DURATION;

                return $.dialog.tips(text, duration, basicMethodType, callback);
            };
        });
    }

    // 作为ajax请求失败时 提示使用
    if (NY.warn) {
        NY.showBusy = function (duration, callback) {
            return NY.warn("服务器繁忙，请稍后重试！", duration, callback);
        };
    }

    // 显示登录框
    if ($.dialog) {
        var loginHost = "/";
        var loginFrameURL = loginHost + "login/index_frame.html";
        var loginActionURL = loginHost + "login/login.html";

        // loginSuccessCallback 仅登录成功后会调用
        NY.showLoginDialog = function (loginSuccessCallback, dialogConfig) {
            var loginDialog = null;
            var defaultDialogConfig = {
                title: "会员登录",
                okVal: "登录",
                width: 455,
                height: 220,
                ok: function () {
                    var iframe = this.iframe.contentWindow;
                    var iframe_form = $(iframe.document).find("form");
                    var param = {};
                    iframe_form.find("[name]").each(function () {
                        var $_input = $(this);

                        param[$_input.prop("name")] = $_input.val();
                    });

                    $.ajax({
                        type: "post",
                        url: loginActionURL,
                        data: param,
                        dataType: "json",
                        success: function (dataString) {
                            var responseData = dataString;
                            if (!responseData.result) {
                                NY.warn(responseData.text, 3, function () {
                                    iframe_form.find(".show-captcha-btn").trigger("click");
                                });
                                return;
                            }
                            window.location.reload();
                            // loginDialog.close();

                            // loginSuccessCallback.call(loginDialog, responseData);
                        },
                        error: function () {
                            NY.showBusy();
                        }
                    });

                    return false;
                },
                cancel: true
            };

            // 统一代理登录请求，不接收ok按钮事件重载
            // delete dialogConfig.ok;
            var config = $.extend(defaultDialogConfig, dialogConfig);

            loginDialog = $.dialog.open(loginFrameURL, config);

            return loginDialog;
        };

        // 业务方法：检查登录，弹出登录框并提交表单
        // afterLoginCall 接收 1 个参数：true:表示回调函数调用时为已登录状态，false:表示回调函数调用时为弹窗登录成功状态
        NY.loginCheckThenDo = function (afterLoginCall, dialogConfig) {
            $.ajax({
                url: "/login/check.html",
                cache: false,
                dataType: "json",
                success: function (responseData) {
                    if (!responseData.result) {
                        var config = $.extend({
                            okVal: "登录并提交"
                        }, dialogConfig);

                        NY.showLoginDialog(function (data) {
                            if (!data.result) {
                                NY.warn(data.text);
                            } else {
                                NY.success(data.text, 2, function () {
                                    afterLoginCall(false);
                                });
                            }
                        }, config);
                    } else {
                        afterLoginCall(true);
                    }
                },
                error: function () {
                    NY.showBusy();
                }
            });
        }
    }

    // 封装回车键事件响应方法
    NY.enterKey = function (element, handler, options) {
        options = options || {};
        var eventType = options.eventType || "keypress";
        var eventData = options.eventData;
        var isCtrlKey = options.isCtrlKey;
        var isShiftKey = options.isShiftKey;
        var isAltKey = options.isAltKey;

        var isBoolean = function (param) {
            return (typeof param === "boolean");
        };
        // 尽在按下回车键 且组合键符合设置时 才触发回调事件
        var myHandler = function (e) {
            var keyCode = e.which;
            var that = this;

            if ((keyCode == 10) || (keyCode == 13)) {
                // 如果指定了Ctrl、Shift、Alt等，则严格匹配相应组合键
                if (isBoolean(isCtrlKey) && (isCtrlKey !== e.ctrlKey)) {
                    return;
                } else if (isBoolean(isShiftKey) && (isShiftKey !== e.shiftKey)) {
                    return;
                } else if (isBoolean(isAltKey) && (isAltKey !== e.altKey)) {
                    return;
                }

                handler.call(that, e);
            }
        };

        // 相当于 将【$(element).keypress(eventData, myHandler);】中的keypress换成变量
        return $(element)[eventType](eventData, myHandler);
    };
});

// 埋点统计
$(function () {
    var deleteCookie = function (name) {
        document.cookie = name + "=;path=/;expires=" + (new Date().toUTCString());
    };

    // #id=richu-xxx[-yyy]
    var hash = location.hash.slice(1);
    var matchGroups = hash.match(/(\-\d+)/g);
    if (!matchGroups || (matchGroups.length > 2)) {
        // 不符合规则时，return但不删除识别码
        // deleteCookie("channelID");
        // deleteCookie("channelType");
        return;
    }

    var channelType = (matchGroups[0] || "").slice(1);
    var channelID = (matchGroups[1] || "").slice(1);
    if (!channelID) {
        channelID = channelType;
        deleteCookie("channelType");
    } else {
        document.cookie = "channelType=" + channelType + ";path=/";
    }
    document.cookie = "channelID=" + channelID + "; path=/";
});


$(function () {
    // 关闭弹框
    $('.close_right,#alert_wrap_box').click(function (e) {
        var _this = $(e.target);
        if (_this.attr('class').indexOf('close_right') !== -1 || _this.attr('id') == "alert_wrap_box") {
            $('#alert_wrap_box').hide();
        } else {
            // return false;
        }
    })
    // 点击 self_search 自助查询之后添加cookie,时限为24小时
    $('#self_search,.success_btnn').on("click", function () {
        setCookie("alertShow", "no", "d1");
    })
})
//商标搜索弹框 首页 商标首页 综合查询
function submit_need() {
    if (!typeof NY) {
        console.log('NY未引用');
    }
    var trade_name = $('#trade_name').val();
    var you_name = $('#you_name').val();
    var you_phone = $('#you_phone').val();
    var you_yzm = $('#you_yzm').val();
    if (!trade_name) {
        NY.error('请输入商标名字');
        return false;
    }
    if (!you_name) {
        NY.error('请输入您的名字');
        return false;
    }
    if (!you_phone) {
        NY.error('请输入您的联系方式');
        return false;
    }
    if (!you_yzm) {
        NY.error('请输入验证码');
        return false;
    }

    //验证 验证码是否正确
    $.ajax({
        //验证码验证接口
        url: "/trademark/tmVerify.html?captcha=" + you_yzm,
        cache: false,
        dataType: "json",
        success: function (data) {
            //如果验证码正确
            if (data.result) {
                $.ajax({
                    type: "POST",
                    url: "/build/demand_save",
                    data: {
                        "type": 2,
                        "UserName": you_name,
                        "tel": you_phone,
                        "Content": trade_name,
                        "checkcode": you_yzm
                    },
                    dataType: "JSON",
                    success: function (res) {
                        if (res.result) {
                            // NY.success(res.text);
                             $('.alert_form').addClass('hide');
                            $('.alert_success').removeClass('hide');
                            setTimeout(function() {
                                location.reload();
                            }, 2000);
                            // NY.success(res.text);
                            // $('.alert_form').addClass('hide');
                            // $('.alert_success').removeClass('hide');
                            // //清空表单
                            // $('#trade_name').val('')
                            // $('#you_name').val('')
                            // $('#you_phone').val('')
                        } else {
                            NY.error(res.text);
                        }
                    }
                });
            } else {
                NY.warn(data.text, 1, function () {
                    // 刷新验证码
                    $('#alert_wrap_box .show-captcha').trigger("click")
                });
            }
        },
        error: function () {
            NY.showBusy();
        }
    });

}

/**
 * 检测是否应该出现弹框
 * 检测 cookie alertShow no 不显示弹框
 * 检测页面隐藏域 tm_need_input 1 显示弹框
 */
function checkAlert() {
    var isAlertShow = $('input[name="tm_need_input"]').val();
    var flag = getCookie("alertShow");
    if (isAlertShow == 1) {
        if (flag == 'no') {
            return false;
        }
        return true
    } else {
        return false;
    }
    if (flag) {
        return true;
    } else {
        return false;
    }
}

//写cookies
//默认一天
function setCookie(name, value) {
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}