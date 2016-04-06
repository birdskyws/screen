var weibototal_url = '/app/home/index/cover';
var weibohot_url = '/app/home/index/weibohot';
var weibolist_url = '/app/home/index/weibo';
var myScroll1;
var myapp = angular.module('weiboApp', []);
myapp.controller('weibototal', function($scope, $http){
	$scope.weibo_total = function(){
		$http.get(weibototal_url).success(function(e) {
				$scope.articles = e.articles;
				$scope.fans = e.fans;
		})
	}
	$scope.weibo_total();
	setInterval($scope.weibo_total,60*10*1000)
});
myapp.controller('weibohot', function($scope, $http){
	$scope.weibo_hot = function(){
		$http.get(weibohot_url).success(function(e) {
				$scope.items = e;
		})
	}
	$scope.weibo_hot();
	setInterval($scope.weibo_hot,60*10*1000)
});
myapp.controller('weibolist', function($scope,$element,$http){
	var boxli;
	$scope.weibo_list = function(){
		$http.get(weibolist_url).success(function(e) {
			$scope.lists = e;
			for(var i=0;i<$scope.lists.length;i++){
				// console.log($scope.lists[i].pics.length)
				boxli = $scope.lists[i].pics.length;
					$scope.isActive = false;
				if(boxli == 4){
					// $scope.test = "boxul-4";
					$scope.isActive = true;
				}
			}
		})
	}
	$scope.fun = function(num){
		// console.log(pics)
		$(".weibo-popbox").slideDown("slow");
		weibo_popbox(num);
	}
	$scope.weibo_list();
	myscroll_list1();
	setInterval($scope.weibo_list,600*1000)
});
function weibo_popbox(num){
	var link = '';
	var opt = '';
	$('#box-close').on('click',function(){
		$('.weibo-popbox').hide();
		$('.weibo-pic').empty();
	});
	$.ajax({  
		type: 'post',
        dataType: 'json',
	    url: weibolist_url,
	    success: function(json){
            $.each(json, function(i, item) {
            	if(item.id==num){
                    $.each(item.pics, function(j, val) {
                        opt += '<li class="swiper-slide" id="dd'+j+'"><img src="'+val.normal+'"></li>'
                    })
                   	return false;
            	}
            });
            link = '<div class="swiper-container" id="swiper-weibo"><ul class="swiper-wrapper" id="weibo-dd">'+opt+'</ul></div>';
            $('.weibo-pic').html(link);
            // console.log(value)
            $("#weibo-dd li").each(function(i){
				$('#dd'+i).niceScroll({horizrailenabled:true,cursorcolor:"#000",cursoropacitymax:0,touchbehavior:true,nativeparentscrolling:false});
			})
            weibo_pic_scroll();
        },  
        error: function(){  
            // alert('网络异常');  
        } 
    })
}
function weibo_pic_scroll(){
	var weibo_swiper = new Swiper('#swiper-weibo', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        initialSlide :0,
        nextButton: '#weibo-picbox-right',
		prevButton: '#weibo-picbox-left',
  	});
}
function myscroll_list1(){
	myScroll1 = new IScroll('#weibo-box', {mouseWheel: true});
	myScroll1.refresh();
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}
