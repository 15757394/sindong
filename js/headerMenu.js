/**
 *	one_menu,two_menu用来存放一级导航和二级导航的链接
 *	search_id判断当前页面是否存在于二级导航里
 *	search_now当前的链接,不能用pathname,可能会被问号截断
 *	统一小写比较,search_now去掉.html以及/Home前缀
 **/

var one_menu = [];
var two_menu = {};
var search_id = '';

var search_now = location.pathname.toLowerCase();
// 帮助中心单独列一个
if (location.href.indexOf('?cid=') != -1) {
	var search_now = location.pathname.toLowerCase() + location.search.toLowerCase();
	// search_now = search_now.split('&')[0];
}
//去掉干扰的前缀
if (search_now.indexOf('/home') !== -1 && search_now !== '/home') {
	search_now = search_now.replace('/home', '')
}
if (search_now.indexOf('.html') !== -1) {
	search_now = search_now.replace('.html', '')
}
$(function() {
	//调整弹框样式
	if (typeof artDialog !== 'undefined') {
		if (typeof artDialog.defaults !== 'undefined') {
			artDialog.defaults.padding = "20px 10px 20px 6px";
		}
	}
	//首页高亮
	if (search_now == '' || search_now == "/") {
		$('.navLis li[_menu_nav=0]').addClass('now');
	}
	$('.navLis li').each(function(i, item) {
		var href = $(item).find('a').attr('href').toLowerCase();
		$(this).attr('data-href', href);
		one_menu.push(href);
	})
	$('.menu-down-cont').each(function(i, item) {
		var id = item.id;
		var arr = [];
		//二级导航的数组第一个是一级导航,后面的是二级导航
		arr.push($('.navLis li[_menu_nav=' + id + ']').find('a').attr('href'));
		$(item).find('a').each(function(x, y) {
			var href = $(y).attr('href').toLowerCase();
			// if(href.indexOf('?')!=-1){
			// 	href =href.split('?')[0]
			// }
			if (href.indexOf('.html') !== -1) {
				href = href.replace('.html', '')
			}
			arr.push(href);
		})
		two_menu[id] = arr;
	});
	//先判断一级导航
	//如果当前地址不在一级导航中
	if (one_menu.indexOf(search_now) !== -1) {
		$('.navLis li').eq(one_menu.indexOf(search_now)).addClass('now').siblings().removeClass('now');
		search_id = one_menu.indexOf(search_now);
	} else {
		//在判断二级导航
		if (one_menu.indexOf(search_now) == -1) {
			for (var i in two_menu) {
				if (two_menu[i].indexOf(search_now) !== -1) {
					var nowIndexHref = two_menu[i][0]; //取当前数组首位
					search_id = i;
					$('.navLis li[data-href="' + nowIndexHref + '"]').addClass('now');
					break;
				}
			}
		}
	}

	if (search_id == '') {
		var _pathname = window.location.pathname;
		if (_pathname == '/') {
			$('.navLis li[_menu_nav=0]').addClass('now');
		} else {
			for (var i = 0; i < one_menu.length; i++) {
				if (_pathname.indexOf(one_menu[i]) !== -1 && one_menu[i] !== '/') {
					$('.navLis li').eq(i).addClass('now').siblings().removeClass('now');
					search_id = i;
					break;
				}
			}
		}
		//如果仍然没有找到
		if (search_id == '') {
			if (_pathname == '/server' || _pathname == '/host/buy.html') {
				$('.navLis li[data-href="/yun"]').addClass('now');
			} else {
				// 如果以上都找不到，就继续找第一个关键词
				var _pathKey = _pathname.split('/')[1];
				if (_pathKey.length > 2) {
					_pathKey = '/' + _pathKey;
				}
				for (var i = 0; i < one_menu.length; i++) {
					if (_pathKey.indexOf(one_menu[i]) !== -1 && one_menu[i] !== '/') {
						$('.navLis li').eq(i).addClass('now').siblings().removeClass('now');
						search_id = i;
						break;
					}
				}
			}
		}
	}
	// 二级导航出现
	var qcloud = {};
	$('[_menu_nav]').hover(function() {
		var _nav = $(this).attr('_menu_nav');
		clearTimeout(qcloud[_nav + '_timer']);
		qcloud[_nav + '_timer'] = setTimeout(function() {
			$('[_menu_nav]').each(function() {
				$(this)[_nav == $(this).attr('_menu_nav') ? 'addClass' : 'removeClass']('chose');
			});
			$('#' + _nav).stop(true, true).slideDown(200);
		}, 150);
	}, function() {
		var _nav = $(this).attr('_menu_nav');
		clearTimeout(qcloud[_nav + '_timer']);
		qcloud[_nav + '_timer'] = setTimeout(function() {
			$('[_menu_nav]').removeClass('chose');
			$('#' + _nav).stop(true, true).slideUp(200);
		}, 150);
	});

	//默认一行五个
	var br_num = 5;
	$('.menu-down-cont .menu-dropdown>ul>li>.dr-list').each(function(i, item) {
		var child = $(item).find('a').length;
		if (child > br_num) {
			var html = '';
			var htmlArr = '';
			for (var i = 0; i < child; i++) {
				html += $(item).find('a').eq(i).prop("outerHTML");
				if ((i + 1) % br_num == 0 && i !== 0) {
					htmlArr += '<div class="dr-list">' + html + '</div>';
					html = '';
				} else if (i == child - 1) {
					if (i == 9) {
						console.log(9);
					}
					htmlArr += '<div class="dr-list" data-a="fdafba' + i + '">' + html + '</div>';
					html = '';
				}
			}
			$(item).addClass('remove');
			$(item).parent().append(htmlArr);
			$('.remove').remove();
		}
	})
})