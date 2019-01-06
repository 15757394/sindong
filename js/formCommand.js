/**
 * 首页 建站模板页面调用此处代码
 * /home 、/build
 */
$(function () {
    // 获取焦点
    $('.commit input').on('focus', function () {
        var _this = $(this),
            _placeholder = _this.attr('data-placeholder'),
            _value = _this.val();
        _this.next().hide();
        if (_value == _placeholder) {
            _this.val('')
        }
    })
    //失去焦点
    $('.commit input').on('blur', function () {
        var _this = $(this),
            _placeholder = _this.attr('data-placeholder'),
            _value = _this.val();
        if (_value == '') {
            _this.val(_placeholder)
            _this.next().show();
        }
    })
    $('.commit textarea').on('focus', function () {
        var _this = $(this),
            _placeholder = _this.attr('data-placeholder'),
            _value = _this.val();
        if (_value == _placeholder) {
            _this.text('')
            _this.next().hide();
        }
    })
    $('.commit textarea').on('blur', function () {
        var _this = $(this),
            _placeholder = _this.attr('data-placeholder'),
            _value = _this.val();
        if (_value == '') {
            _this.text(_placeholder)
            _this.next().show();
        }
    })
    $('.submit-demand').click(function () {
        var company = $('#Company').val();
        var telphone = $('#tel').val();
        var userName = $('#UserName').val();
        var qq = $('#QQ').val();
        var demandInfo = $('#Content').val();
        var checkcode = $('#checkcode').val();

        var inputArr = ['Company', 'tel', 'UserName', 'Content', 'checkcode'];
        var flag = true;
        var tel_reg = /^1[0-9]{10}$/;

        inputArr.every(function (x) {
            var id = x;
            var _value = $('#' + id).val();
            var _placeholder = $('#' + id).attr('data-placeholder');
            if (_value == _placeholder) {
                NY.error('请填写' + _placeholder);
                flag = false;
                $('#' + id).next().show();
                return false;
            } else {
                return true
            }
        })

        var data = {
            'Company': company,
            'tel': telphone,
            'UserName': userName,
            'QQ': qq,
            'Content': demandInfo,
            'checkcode': checkcode,
        }
        if (flag) {
            if (!tel_reg.test(telphone)) {
                NY.error('请填写正确格式的电话号码');
                $('#tel').next().show();
                return false;
            }
            $.ajax({
                type: "post",
                url: "/build/demand_save",
                data: data,
                dataType: "JSON",
                success: function (data) {
                    if (data.result) {
                        NY.success('提交成功');
                        //提交成功后 表单清空
                         $('#Company').val($('#Company').attr('data-placeholder'));
                         $('#tel').val($('#tel').attr('data-placeholder'));
                         $('#UserName').val($('#UserName').attr('data-placeholder'));
                         $('#QQ').val($('#QQ').attr('data-placeholder'));
                         $('#Content').val($('#Content').attr('data-placeholder'));
                         $('#checkcode').val($('#checkcode').attr('data-placeholder'));
                         $(".show-captcha").click();
                    } else {
                        NY.error(data.text);
                        $(".show-captcha").click();
                    }
                }
            });
        }
        return false;
    })

})