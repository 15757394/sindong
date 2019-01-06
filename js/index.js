/////////////////////////////////////////////////////////////////////////////////首页
//banner
function banner(obj) {
	var now = 0;
	var flag = true;
	var num = $(".imgs", obj).length;
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		$('.btnn ul', obj).width(num * 30);
	}

	$('.imgs', obj).eq(now).css('left', $(window).width() / 2 - 960);
	$(window).resize(function () {
		$('.imgs', obj).eq(now).css('left', $(window).width() / 2 - 960);
		if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
			$('.btnn ul', obj).width(num * 30);
		}
	})
	$(".btn", obj).eq(0).css("background", "#fff");

	function move() {
		if (flag) {
			var next = now + 1;
			flag = false;
			if (next >= $(".imgs", obj).length) {
				next = 0;
			}
			$(".imgs", obj).eq(now).animate({
				"left": $(window).width() / 2 - 2880
			});
			$(".btn", obj).eq(next).css("background", "#fff");
			$(".btn", obj).eq(now).css("background", "transparent");
			$(".imgs", obj).eq(next).animate({
				"left": $(window).width() / 2 - 960
			}, function () {
				$(".imgs", obj).eq(now).css("left", '100%');
				now = next;
				flag = true;
			});
		} else {
			return
		}
	}

	$(".btn", obj).each(function (index) {
		var index = index;
		$(this).mouseover(function () {
			if (flag) {
				flag = false;
				if (now != index) {
					$(this).css("background", "#fff");
					$(".btn", obj).eq(now).css("background", "transparent");
					if (now > index) {
						$(".imgs", obj).eq(index).css({
							"left": $(window).width() / 2 - 2880
						});
						$(".imgs", obj).eq(now).animate({
							"left": '100%'
						});
						$(".imgs", obj).eq(index).animate({
							"left": $(window).width() / 2 - 960
						}, function () {
							now = index;
							flag = true;
						});
					} else {
						$(".imgs", obj).eq(now).animate({
							"left": $(window).width() / 2 - 2880
						});
						$(".imgs", obj).eq(index).animate({
							"left": $(window).width() / 2 - 960
						}, function () {
							$(".imgs", obj).eq(now).css({
								"left": '100%'
							});
							now = index;
							flag = true;
						});
					}
				} else {
					flag = true;
				}
			}
		})
	})
	var t = setInterval(move, 3000);
	obj.hover(function () {
		clearInterval(t);
	}, function () {
		t = setInterval(move, 3000);
	})
}
banner($('#banner .picture'))


//搜索框下模拟复选框
$('#banner .banner-search ul').on('click', 'li', function () {
	if (this.className == 'show') {
		$(this).removeClass('show')
	} else if (this.className !== 'show') {
		$(this).addClass('show');
	}
})

// 查询资质相关代码
var search_type = 'all';
$(function () {
	// 鼠标移入出现下拉框
	$('#slide-button').mouseenter(function () {
		$('.slide-box').show();
		$('#slide-button').addClass('active');
	})
	$('#slide-button').mouseleave(function () {
		$('.slide-box').hide();
		$('#slide-button').removeClass('active');
	})
	$('#slide_box .li').click(function () {
		var _this = $(this);
		_this.attr('data-checked', 'true').siblings().removeAttr('data-checked');
		search_type = _this.data().value;
		$('.yixuan').text(_this.data().text);
		$('.slide-box').hide();
		$('#slide-button').removeClass('active');
	});
	// 非IE下使用swiper
	if (!$('body').hasClass('IE_hack')) {
		var mySwiper = new Swiper('.mouse-event .swiper-container', {
			loop: true,
			autoplay: true,
			pagination: {
				el: '.swiper-picture .swiper-pagination',
				clickable: true
			},
			effect: 'fade', //开启淡入淡出
			fadeEffect: {
				crossFade: false,
			},
			preventClicks: false,
			simulateTouch: false //禁止鼠标拖动
		});
		$('.mouse-event').on('mouseenter', function () {
			mySwiper.autoplay.stop();
		})
		$('.mouse-event').on('mouseleave', function () {
			mySwiper.autoplay.start();
		})
	}
	// 查询资质
	var all_search = function () {
		var strdomain = $('#strdomain').val();
		if (strdomain == '') {
			NY.error('请输入要查询的品牌或域名');
			return false;
		}
		var ret = /^[\S]{0,62}(\.[\S]{0,62})+$/;
		if (ret.test(strdomain)) {
			window.location.href = "/domain/aptitude?domain=" + strdomain + '&trade=' + strdomain;
		} else {
			var newarr = new Array;
			$('ul#domain_hz li.show').each(function () {
				var hz = $(this).find('span').html();
				newarr.push(hz);
			})
			if (newarr.length == 0) {
				NY.warn('请选择要查询的后缀');
			}
			if (newarr.length > 0 && $('#strdomain').val() != '') {
				var strdomain_arr = [];
				$.each(newarr, function (i, v) {
					strdomain_arr.push(strdomain + v);
				})
				window.location.href = "/domain/aptitude?domain=" + strdomain_arr + '&trade=' + strdomain;
			}
		}
		return false;
	}
	//搜索域名
	var domain_search = function () {
		var strdomain = $('#strdomain').val();
		if (strdomain == '') {
			NY.error('请输入要查询的域名');
			return false;
		}
		var ret = /^[\S]{0,62}(\.[\S]{0,62})+$/;
		if (ret.test(strdomain)) {
			window.open("/domain/result?domain=" + strdomain);
		} else {
			var newarr = new Array;
			$('ul#domain_hz li.show').each(function () {
				var hz = $(this).find('span').html();
				newarr.push(hz);
			})
			if (newarr.length == 0) {
				NY.warn('请选择要查询的后缀');
			}
			if (newarr.length > 0 && $('#strdomain').val() != '') {
				var strdomain_arr = [];
				$.each(newarr, function (i, v) {
					strdomain_arr.push(strdomain + v);
				})
				window.location.href = "/domain/result?domain=" + strdomain_arr;
			}
		}
		return false;
	}
	// 搜索商标
	var trade_search = function () {
		var strdomain = $('#strdomain').val();
		if (strdomain == '') {
			NY.error('请输入您要查询的商标');
			return false;
		}
		if (checkAlert()) {
			$('#trade_name').val(strdomain);
			$('#alert_wrap_box').show();
			$('.alert_wrap_box .show-captcha').attr('src','/?m=api&c=captcha&rnd='+Math.random());
		} else {
			window.location.href = '/trademark/searchlist?keywords=' + strdomain + '&select_type=1';
		}
	}

	function chaxun(key) {
		if (key == 'all') {
			all_search()
			return;
		}
		if (key == 'domain') {
			domain_search();
			return;
		}
		if (key == 'trade') {
			trade_search();
			return;
		}
	}
	$('#domain_serch').click(function () {
		chaxun(search_type);
	})
	//自助查询
	$('#self_search,.success_btnn').click(function () {
		$('#alert_wrap_box').hide();
		var strdomain = $('#strdomain').val();
		window.location.href = '/trademark/searchlist?keywords=' + strdomain + '&select_type=1';
	})
	$('#strdomain').keyup(function (event) {
		if (event.keyCode == 13) {
			chaxun(search_type);
		}
	})

	// 搜索框左边的数字动画效果
	new CountUp("J_domainRegCount", 0, +($("#J_domainRegCount").attr('data-count')), 0, 1.5, {
		useEasing: true,
		useGrouping: true,
		separator: ',',
		decimal: '.',
		prefix: '',
		suffix: ''
	}).start();

	// 公告轮播图使用swiper插件
	var notice_list = $('#notice_list a');
	if (notice_list.length > 0) {
		var html = '';
		var total = '';
		if (notice_list.length > 1) {
			var swiper_index = 0;
			notice_list.each(function (i, item) {
				html += $(item).prop("outerHTML");
				swiper_index++;
				if (swiper_index % 2 == 0) {
					total += '<li class="swiper-slide">' + html + '</li>';
					html = '';
					swiper_index = 0;
				} else if (i == notice_list.length - 1) {
					total += '<li class="swiper-slide">' + html + '</li>';
				}
			})
			$('.swiper-notice .content').html(total);
		}
		var notice_swiper = new Swiper('.swiper-notice', {
			loop: true,
			autoplay: {
				delay: 3000,
				stopOnLastSlide: false,
				disableOnInteraction: true,
			},
			direction: 'vertical'
			// pagination: {
			// 	el: '.swiper-pagination',
			// 	clickable: true,
			// },
		});
	}
})




$(function () {
	
	$('.iact-service .tr-li .tr-center').each(function () {
		var str = $(this).text();
		if (str.length > 46) {
			$(this).html(str.substring(0, 46) + '...')
		}
	})
	$('#our_adv .sc-li').on('mouseover', function () {
		var _this = $(this);
		if (_this.hasClass('active')) {
			return false;
		}
		$(this).addClass('active').siblings().removeClass('active');
	})
	$('#property_service .sc-tab .sc-li').on('click', function () {
		var _index = $(this).index();
		var _this = $(this);
		if (_this.hasClass('active')) {
			return false;
		}
		_this.addClass('active').siblings().removeClass('active');
		$('#property_service .tab-content').addClass('hide');
		$('#property_service .tab-content').eq(_index).removeClass('hide');
		if (_index == 3) {
			trade_swiper.update();
			trade_swiper.pagination.update();
		}
	})
	var trade_swiper = new Swiper('.library-service .swiper-container', {
		// loop:true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
		},
	});
})