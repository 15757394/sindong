"use strict";
// 公共函数 为了避免和public.js混淆 特地新建一个文件
if(!Array.prototype.indexOf){  
    Array.prototype.indexOf = function(val){  
        var value = this;  
        for(var i =0; i < value.length; i++){  
            if(value[i] == val) return i;  
        }  
        return -1;  
    }
}
var EP = {
    pcArea:['396px','auto'],
    pcoffset:'264px',
    init: function () {
        // 移动端做下适配
        if(typeof CONSTANTS != 'undefined'){
            if(CONSTANTS.versions.mobile){
                EP.pcArea = ['90vw','auto'];
                EP.pcoffset = '30%';
            }
        }
    },
	// 页面可能有多个验证码出现，需要明确需要的验证码
    // 验证码 
    checkCode: function (opt) {
        var html = '<div class="layer-code">'+
        '		<span class="layer-code-span">验证码：</span>'+
        '		<input type="text" class="layer-code-input"  id="layerCheckCode"  placeholder="请输入验证码"  name="layerCheckCode" autofocus="autofocus">'+
        '		<span class="layer-code-img">'+
        '			<img src="/?m=api&c=captcha&rnd=@{RAND}" alt="看不清楚，换一张" srcset="" onclick="EP.refreshCode(this);">'+
        '		</span>'+
        '	</div>';
        var options = {
            type:1,
            title: '请输入验证码',
            content: html.replace("@{RAND}", Math.random()),
            skin: 'layer-check-code',
            offset:EP.pcoffset,
            shade :0.4,//自定义颜色 [0.8, '#393D49']    //不显示遮罩 0
            area: EP.pcArea,
            resize :false,
            btn: ['查询', '取消'],
            success:function(e){
                $('.layer-check-code .layer-code-input').focus();
                try
                {
                //在这里运行代码
                FastClick.attach(document.body); 
                }
              catch(err)
                {
                    console.log(err)
                //在这里处理错误
                }
            },
            yes: function (index) {
                console.log(index);
            },
            btn2: function () {
                if(opt.btn[1]!='取消'){
                    window.open('/register')
                }
            }
        }
        if (typeof opt != 'undefined') {
            $.extend(true, options, opt)
        }
        if(typeof CONSTANTS != 'undefined'){
            if(CONSTANTS.versions.mobile || $('body').hasClass('mobile')){
                setTimeout(function(){
                    layer.open(options);
                },300)
            }
        }else{
            layer.open(options);
        }
    },
    //弹框提示
    // icon 提示图标 默认异常图标
    // end 关闭弹层触发的函数
    warn: function (text, options) {
        var opt = {
            icon: 7,
            shade: 0.3,
            time:2000,
            offset:EP.pcoffset,
            content:'服务器繁忙，请稍候重试',
            skin:'layer-custom-dialog layer-custom-warn'
        }
        opt.content = text ? text : '服务器繁忙，请稍候重试';
        if (typeof (options) != 'undefined') {
            $.extend(true, opt, options)
        }
        layer.msg(text, opt);
    },
    success:function (text, options) { 
        var opt = {
            icon: 8,
            shade: 0.3,
            time:2000,
            area:['auto','auto'],
            offset:EP.pcoffset,
            content:'提交成功',
            skin:'layer-custom-dialog layer-custom-success'
        }
        opt.content = text ? text : '提交成功';
        if (typeof (options) != 'undefined') {
            $.extend(true, opt, options)
        }
        layer.msg(text, opt);
     },
    error: function (text, options) {
        var opt = {
            icon: 7,
            shade: 0.3,
            time:2000,
            offset:EP.pcoffset,
            content:'服务器繁忙，请稍候重试',
            skin:'layer-custom-dialog layer-custom-error'
        }
        opt.content = text ? text : '服务器繁忙，请稍候重试';
        if (typeof (options) != 'undefined') {
            $.extend(true, opt, options)
        }
        layer.msg(text, opt);
    },
    confirm:function(text,options,yes,no){
       var title = text?text:'系统提示';
        layer.confirm(title, options, function(){
            yes()
          }, function(){
              no()
          });
    },
    // 微信绑定二维码放到公共方法
    ewmAlert:function(html,options){
        var opt = {
            type: 1,
            title: false,
            closeBtn: 0,
            area: 'auto',
            offset:'30%',
			time:120000,
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: html
          }
        if (typeof (options) != 'undefined') {
            $.extend(true, opt, options)
        }
        layer.open(opt);
    },

    loading:function(text,options){
        var opt = {
            icon: 8,
            shade: 0.3,
            time:9000,
            area:['auto','auto'],
            offset:EP.pcoffset,
            content:'努力加载中，请稍候···',
            skin:'layer-custom-dialog layer-custom-loading'
        }
        opt.content = text ? text : '努力加载中，请稍候···';
        if (typeof (options) != 'undefined') {
            $.extend(true, opt, options)
        }
        layer.msg(text, opt);
    },
    // 刷新验证码
    refreshCode:function (dom) { 
        var dom = dom?$(dom):$('.layer-check-code .layer-code-img img');
        dom.attr('src', '/?m=api&c=captcha&rnd='+Math.random());
    },
    // ajax方法 
    requestUrl: function (type, url, data, callback) {
        var opt = {
            type: type,
            url: url,
            data: data,
            dataType: "JSON",
            success: function (data) { 
                 //如果验证码正确
                 if (data.result) {
                    layer.closeAll();
                    // shorMessage 不需要验证码提交成功的弹框
                    if(typeof shorMessage == 'undefined'){
                        EP.success('验证成功！');
                    }
                    callback(data);
                } else {
                    EP.warn(data.text, {
                        time: 1500,
                        end: function () {
                            // 刷新验证码 同时清空已输入
                            $(".layer-check-code .layer-code-input").val('');
                            EP.refreshCode();
                        }
                    })
                }
             },
            error: function (error) {
                console.log(error);
                EP.warn();
            }
        }
        $.ajax(opt);
    },
    requestAjax: function (type, url, data, callback) {
        var opt = {
            type: type,
            url: url,
            data: data,
            dataType: "JSON",
            success: function (data) { 
                callback(data)
             },
            error: function (error) {
                EP.warn();
            }
        }
        $.ajax(opt);
    }

}
$(document).ready(function () {
    EP.init();
    $("img").on("error", function () {
        $(this).attr("src", "/template/Home/Default/PC/Static/img/module/trademark/shangbiaoimg.png");
      });
});

function fix_image(img, w, h){
    var b = img.height / img.width;
    if(w>0){
	    if(img.width>w){
		    img.width = w;
		    img.height = parseInt(w * b);
	    }
    }
    if(h>0){
	    if(img.height>h){
		    img.height = h;
		    img.width = parseInt(h / b);
	    }
    }
}
function checkImg(obj) {
    obj.src = '/template/Home/Default/PC/Static/img/module/trademark/shangbiaoimg.png';
}

// 绑定微信二维码方法
function bindClick(callback){
    EP.loading('正在生成绑定二维码');
    $.get('/home/WeChat/QrCode?type=bind', function(data) {
        layer.closeAll();
        if (data.result == true) {
            EP.ewmAlert('<div style="background:#fff;"><img src="' + data.url + '" width="215" height="215" style="margin: 15px;"/></div>');
            var n = 0;
            var timer = setInterval(checkQrCode,2000);//两秒请求一次
            //轮询检测二维码是否被扫描
            function checkQrCode() {
                n++;
                //2分钟之后停止请求,清空定时器
                if(n>=60){
                    clearInterval(timer);
                    return false;
                }
                $.get('/home/WeChat/bind?ticket='+data.ticket,function(data) {
                    if (data.result == true) {
                        if (data.is_exist != 0) {
                            clearInterval(timer);
                            EP.success('微信绑定成功！');
                            setTimeout(function(){
                                layer.closeAll();
                                if(typeof callback != 'undefined'){
                                    callback();
                                }else{
                                    location.reload();
                                }
                            },1500)
                        }
                    }
                });
            }
        } else  {
            EP.error('生成二维码失败，请重试！')
        }
    })
}