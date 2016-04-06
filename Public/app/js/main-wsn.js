$('docuemnt').ready(function(){
	/*全局函数处理 */
	var weiboscroll,weixinscroll,videoscroll;
	var swiper0,swiper1,swiper2,swiper4,video_ppt_swiper,weibo_swiper;
	var dd = ["#jfjb-video", "#jfjb-index", "#jfjb-weibo","#jfjb-weixin","#jfjb-paper","#jfjb-overview","#jfjb-footer","#jfjb-readfooter","#jfjb-readnewspape","#jfjb-readnewspaper"];
	var video_url     = '/jfjb/app/index/cvideo';
	var weixin_url    = '/jfjb/app/index/cweixin';
	var weibo_url     = '/jfjb/app/index/cweibo';
	var jfjb_url      = '/jfjb/app/index/cjfjb';
	var weibohot_url  = '/jfjb/app/index/weibohot';
	var varweibofans_url = '/jfjb/app/index/cover';

	var begin_style  = 'glyphicon glyphicon-play f-White';
 	var end_style    = 'glyphicon glyphicon-pause f-White';

	var video_data  =   0;
	var weixin_data =   0;
	var weibo_data  =   0;
	var jfjb_data   =   0;
	var weibofans_data = 0;
	var hot_data  =  0;
	var weixin_i  =  0;
	var ticket    =   0;
	var wsn_page_show=function(s)
	{
		$('#video-read').trigger("userclick"); 
		$('#video-index').trigger("userclick");
		$('#box-close').trigger('click'); 
		for(var i=0;i<dd.length;i++)
		{
			$(dd[i]).hide();
		} 
		for(var j=0;j<s.length;j++)
		{
			$(s[j]).show();
		}

	}
	var wsn_index_show=function()
	{		
		var s = ["#jfjb-footer","#jfjb-index"];
		for(var i=0;i<dd.length;i++)
		{
			$(dd[i]).hide();
		} 
		for(var j=0;j<s.length;j++)
		{
			$(s[j]).show();
		}
	}
	var wsn_index_newspaper =function()
	{
	   var temp_data = jfjb_data.data; 
	   var link = '<p class="paper-img"  title="'+temp_data[0].pubdate+'" name="'+jfjb_data.code+'" value="'+1+'"><img src="'+temp_data[0].pics[0].min+'"></p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
       $('.jfjb-newspaper-show').html(link);
	}
	var	wsn_index_weibo = function()
	{
        var item = weibo_data.data[0];
        var link = '<p>'+item.text+'</p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
        $('.jfjb-weibo-show').html(link);
	}
	var	wsn_index_weixin = function()
	{

		var item = weibofans_data;
		var link = '<p>【'+item.title+'】'+item.weixin+'</p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
		$('.jfjb-weixin-show').html(link);
	}
	var wsn_index_video = function()
	{
		var item = video_data.data[0];
		$('#video-index').attr('src',item.video);
		$('#video-index').attr('poster',item.pic);
		$('#current-1').text('00:00');
       	$('#but-1').removeClass(end_style)
       	$('#but-1').addClass(begin_style)
       	$('#video-play-1').show();
       	$('#timeBar-1').css('width', 0+'%');
	}
	var wsn_weixin_day = function(){
	    var link = "";
	    var json = weixin_data;
        $.each(json.data, function(i, item) {
            link += '<li value="'+item.pic+'" title="'+item.title+'" name='+json.code+'><dl class="wl-title"><dt>'+item.title+'</dt><dd>'+item.pubdate+'</dd></dl></li>';
            if (i == 7){
                return false
            }
        });
        $('#weixin-day').html(link)
        $(".opt-img img").attr('src',json.data[0].pic);
	}
	var wsn_weixin_change_page = function(){
	    var num = weixin_i;
	    var dd = weixin_i+8;
	    var len = weixin_data.data.length;
	    if(dd>len-1)
	    {
	    	dd = len;
	    	weixin_i=7;
	    }
	    else
	    {
	    	weixin_i = weixin_i+8;
	    }
	    var link = "";
	    var json = weixin_data;
        $.each(json.data, function(i, item) {
            if (i > num){
                link += '<li class="weixin-move" value="'+item.pic+'"><dl class="wl-title"><dt>'+item.title+'</dt><dd>'+item.pubdate+'</dd></dl></li>';
                if(i == dd){
                    return false;
                }
            }
        });
        $('#weixin-old').html(link);
	}
	var wsn_weibo_list = function(){
		var text = "";
		var opt = "";
		var img = "";
		var data = "";
		var list = "";
		var json = weibo_data;
        $.each(json.data, function(i, item) {
            opt = '';
            text = '<dl id="t'+i+'" name='+i+'><dt name='+json.code+'><p>'+item.text+'</p></dt>'
            $.each(item.pics, function(j, val) {
                opt += '<li><img src="'+val.min+'" name="'+val.normal+'"></li>'
            })
            
            img = '<dd><ul class="boxul clear" name="'+item.sinaid+'">'+opt+'</ul><div class="box-big" name="'+i+'"></div></dd>'
            var date = item.pubtime;
            var subdate = date.substring(5,16);
            data = '<dd><p><span>日期：'+subdate+'</span><span>评论：'+item.comment+'</span><span>转发：'+item.repost+'</span></p></dd></dl>'
            list += text + img + data;
            
        });
        $('.weibo-list').empty();
        $('.weibo-list').html(list);
		/*       
		$(".weibo-list ul").each(function(i){
            var boxli = $(this).find("li").length
            //四张图片固定为上下两张图片
			if(boxli == 4){
				$('#box-'+i+'').addClass('boxul-4');
			}
        });
        */
        setTimeout(function () {
            weiboscroll.refresh();
            weiboscroll.scrollTo(0,0);
        }, 1);
	}
	var wsn_video_play=function()
	{
        var link = "";
        var pic = '';
        var json = video_data;
        var item = json.data[0];
        link = '<video id="video-read" name="'+json.code+'"  src="'+item.video+'"></video>';
        $('#video-read').attr('name',json.code);
        $('#video-read').attr('src',item.video);
        pic = item.pic;
	    $('#video-display img').attr('src',pic);		                
	}
	var wsn_video_list = function()
	{
        var link = "";
        json = video_data;
        $.each(json.data, function(i, item) {
            link += '<li value="'+item.pic+'" title="《军报每天读》'+item.pubdate+'" name="'+item.video+'"><dl><dt><img src="'+item.pic+'"><div class="dd"></div></dt><dd><p>《军报每天读》'+item.pubdate+'</p></dd></dl></li>';
        });
        $('#video-list').html(link);
        $('.video-ul div').eq(0).removeClass("dd");
		setTimeout(function () {
		    videoscroll.refresh();
		    videoscroll.scrollTo(0,0);
		}, 0);             
	}
	var wsn_newspaper_day = function()
	{
		var json = jfjb_data;
		var item = json.data[0];
		var link = "";
		swiper0.removeAllSlides();
    	$.each(item.pics, function(j, val) {
    		j=j+1
        	link += '<div class="swiper-slide wsnpaper1" title="'+item.pubdate+'" name="'+item.pagenum+'" value="'+j+'"><img src="'+val.min+'"></div>';
        });
		$('#swiper-day .swiper-wrapper').html(link);
		swiper0.update();
	}
	var wsn_newspaper_list = function(){
        var link = "";
        var text = "";
        var link1 = "";
        var title = "";
        var dd1 = "";
        var dd2 = "";
        var json = jfjb_data;
        var item = jfjb_data.data;
        swiper1.removeAllSlides();
        $.each(json.data, function(i, item) {
        	if(i>0){
                $.each(item.pics, function(j, val) {
            		if (j==0){
                		link = '<div class="swiper-slide wsnspaper2" name="'+item.pagenum+'" title="'+item.pubdate+'"><img src="'+val.min+'"><p>'+item.pubdate+'</p></div>';
                    	return false;
                    }
                });
        	}
			title = item.pubdate;
			dd1=title.replace("-","");
			dd2=dd1.replace("-","");
    		link1 += '<li role="presentation" name="'+item.pagenum+'" value="'+dd2+'">'+dd2+'</li>';
            text += link; 
        });          
        $('#swiper-all .swiper-wrapper').html(text);
        swiper1.update();
        $('#pages_date').html(link1);
	}
	var	wsn_newspaper_read = function()
	{
		var item =jfjb_data.data[0];
		var chapter = item.pubdate;
		chapter = chapter.replace("-","");
		chapter = chapter.replace("-","");
		var imgsrc_list = "";
		swiper2.removeAllSlides();
		for(var i=1;i<=2;i++){
			imgsrc_list += '<div class="swiper-slide wsnpaper3"><img name="'+i+'" src="/jfjb/Public/cache/jfjb/'+chapter+'/'+i+'.jpg"></div>';
		}
		$('#readnewspaper').html(imgsrc_list);
		swiper2.update();
		swiper2.slideTo(0);	
	}
	var wsn_readnewspaper_opt = function(title1,sum,value1){		
		swiper2.removeAllSlides();
		var chapter = title1;
		$('#chapter span').text(chapter)
		var imgsrc_list = "";
		for(var i=1;i<=sum;i++){
			imgsrc_list += '<div class="swiper-slide wsnpaper3"><img name="'+i+'" src="/jfjb/Public/cache/jfjb/'+chapter+'/'+i+'.jpg"></div>';
		}
		$('#readnewspaper').html(imgsrc_list);				
		swiper2.update();
		value1 =value1>0?(value1-1):0;
		swiper2.slideTo(value1);
	}
	var wsn_hot_list = function(){
		var list="";
		$.each(hot_data, function(i, item) {
		    var date = item.pubtime;
		    var subdate = date.substring(5,10);
		    list += '<dl><dt><h3></h3></dt><dd><p>'+item.text+'</p><div class="clear"><p class="float-left"><span>转发：'+item.repost+'</span><span>评论：'+item.comment+'</span></p><p class="float-right"><span>日期：'+subdate+'</span></p></div></dd></dl>';
		});
		var list1 = '<div class="weibo-hot-title"><img src="images/weibo-hot.png"></div>' + list
		$('.weibo-hot').html(list1);
        var link = '<div class="weibo-article">微博：<span>'+weibofans_data.articles+'</span></div><div class="weibo-fans">粉丝：<span>'+weibofans_data.fans+'</span></div>';
        $('#weibo-total').html(link)
	}
	var wsn_weibo_event=function()
	{
		//弹出框弹出
		$('#weibo-list').on('click',"li",function(){
			if (weiboscroll.click == 1 ){
				var num = $(this).parent().attr('name')
				var opt ="";
                $.each(weibo_data.data, function(i, item) {
                	if(item.sinaid==num){
                        $.each(item.pics, function(j, val) {
                            opt += '<li class="swiper-slide wsnweibo" id="dd'+j+'"><img src="'+val.normal+'"></li>'
                        })
                       	return false;
                	}
                });
                $('#weibo-dd').html(opt);
                $(".weibo-popbox").slideDown("slow");
                $("#weibo-dd li").each(function(i){
					$('#dd'+i).niceScroll({horizrailenabled:true,cursorcolor:"#000",cursoropacitymax:0,touchbehavior:true,nativeparentscrolling:false});
				})
                weibo_swiper.update();
			}
		});
		//弹出框关闭
		$('#box-close').on('click',function(){			
			$("#weibo-dd li").each(function(i){
				$('#dd'+i).getNiceScroll().remove();
				$('#dd'+i).html('');
			})
			weibo_swiper.removeAllSlides();				
			$('#weibo-dd').html('');
			$('.weibo-popbox').hide();
		});
	}
	var wsn_weixin_event=function()
	{
		$(".weixin-list").on("click","li",function()
		{
			opt_img_src=$(this).attr('value');
			$(".opt-img img").attr('src',opt_img_src);
			$(".weixin-list li").removeClass("weixin-link"); 
		    $(this).addClass("weixin-link");
		});
		$("#weixin-change").click(function()
		{
			wsn_weixin_change_page();
			var trun = '<i class="musicPlay"></i>'
        	$('.trun').html(trun);
		});
        $(".opt-img img").load(function(){
        	setTimeout(function () {
        	    weixinscroll.refresh();
        		weixinscroll.scrollTo(0,0);
        	}, 0);
		});
	}
	var wsn_video_event = function()
	{
        $('.video-ul').on('click',"li",function(){
        	if (videoscroll.click == 1 ){
                var v_video = $(this).attr('name');
                $('#video-read').attr('src',v_video);
                var v_img1  =  $(this).attr('value');
				$('#video-pic').attr('src',v_img1);
				$('#video-play-2').hide();
				$('#video-pic').hide()
				$('#but-2').removeClass("glyphicon glyphicon-play f-White")
				$('#but-2').addClass("glyphicon glyphicon-pause f-White")
				$('#video-read').load();
				$('#video-read')[0].play(); 
				$('.video-ul div').addClass("dd");
				$(this).find('div').removeClass("dd");
        	}
        });
        //视频页初始化总时间
    	$('#video-read').on('loadedmetadata', function() {
    		var second = Math.floor($('#video-read')[0].duration % 60);    
            var minite = Math.floor(($('#video-read')[0].duration / 60) % 60);
            if(minite < 10){ 
    			minite = "0" + minite; 
    		} 
    		if(second < 10){ 
    			second = "0" + second; 
    		}
    	   	$('#duration-2').text(minite+':'+second);
    	});
    	//首页初始化总时间
		$('#video-index').on('loadedmetadata', function() {
			var second = Math.floor($('#video-index')[0].duration % 60);    
	        var minite = Math.floor(($('#video-index')[0].duration / 60) % 60);
	        if(minite < 10){ 
				minite = "0" + minite; 
			} 
			if(second < 10){ 
				second = "0" + second; 
			}
		   	$('#duration-1').text(minite+':'+second);
		})
    	//时间进度显示和进度条
		$('#video-read').on('timeupdate', function() {
			var second = Math.floor($('#video-read')[0].currentTime % 60);    
	        var minite = Math.floor(($('#video-read')[0].currentTime / 60) % 60);
	        if(minite < 10){ 
				minite = "0" + minite; 
			} 
			if(second < 10){ 
				second = "0" + second; 
			}
		   	$('#current-2').text(minite+':'+second);
		   	var currentPos = $('#video-read')[0].currentTime; 
			var maxduration = $('#video-read')[0].duration; 
			var percentage = 100 * currentPos / maxduration;
			$('#timeBar-2').css('width', percentage+'%');
		});
		$('#video-index').on('timeupdate', function() {
			var second = Math.floor($('#video-index')[0].currentTime % 60);    
	        var minite = Math.floor(($('#video-index')[0].currentTime / 60) % 60);
	        if(minite < 10){ 
				minite = "0" + minite; 
			} 
			if(second < 10){ 
				second = "0" + second; 
			}
		   	$('#current-1').text(minite+':'+second);
		   	var currentPos = $('#video-index')[0].currentTime; 
			var maxduration = $('#video-index')[0].duration; 
			var percentage = 100 * currentPos / maxduration;
			$('#timeBar-1').css('width', percentage+'%');
		});
		//进度条拖动
		//var video=$('video-read');
		$('#progressBar-2').mousedown(function(e) {

		   var maxduration = $('#video-read')[0].duration; 
		   var position = e.pageX - $(this).offset().left; 
		   var percentage = 100 * position / $(this).width();
		   if(percentage > 100) {
		      percentage = 100;
		   }
		   if(percentage < 0) {
		      percentage = 0;
		   }
		   $('#timeBar-2').css('width', percentage+'%');
		   $('#video-read')[0].currentTime = maxduration * percentage / 100;
		});
		$('#progressBar-1').mousedown(function(e) {

		   var maxduration = $('#video-index')[0].duration; 
		   var position = e.pageX - $(this).offset().left; 
		   var percentage = 100 * position / $(this).width();
		   if(percentage > 100) {
		      percentage = 100;
		   }
		   if(percentage < 0) {
		      percentage = 0;
		   }
		   $('#timeBar-1').css('width', percentage+'%');
		   $('#video-index')[0].currentTime = maxduration * percentage / 100;
		});

		//点击播放大按钮开始播放视频
		$('#video-play-2').on('click',function(){
			$('#video-pic').hide();
	       	$('#video-read')[0].play();
	       	$(this).hide();
	       	$('#but-2').removeClass(begin_style)
	       	$('#but-2').addClass(end_style)
	    });
    	$('#video-play-1').on('click',function(){
    		//$('#video-pic').hide();
           	$('#video-index')[0].play();
           	$(this).hide();
           	$('#but-1').removeClass(begin_style)
           	$('#but-1').addClass(end_style)
        });

	    //点击播放小按钮开始视频，停止视频播放
	    $('#but-2').on('click',function(){
			//jfjb.jfjb_audioReset();
	    	if($('#video-read')[0].paused) {
		       	$('#video-read')[0].play();
				$('#video-pic').hide();
		       	$('#video-play-2').hide();
		       	$('#but-2').removeClass(begin_style)
		       	$('#but-2').addClass(end_style)
		    }else{
		       	$('#video-read')[0].pause();
	       		$('#video-play-2').show();
				//$('#video-pic').show();
		       	$('#but-2').removeClass(end_style)
		       	$('#but-2').addClass(begin_style)
		    }
		    return false;
	    });

        $('#but-1').on('click',function(){
    		//jfjb.jfjb_audioReset();
        	if($('#video-index')[0].paused) {
    	       	$('#video-index')[0].play();
    	       	$('#video-play-1').hide();
    	       	$('#but-1').removeClass(begin_style)
    	       	$('#but-1').addClass(end_style)
    	    }else{
    	       	$('#video-index')[0].pause();
           		$('#video-play-1').show();
    	       	$('#but-1').removeClass(end_style)
    	       	$('#but-1').addClass(begin_style)
    	    }
    	    return false;
        });
	    //var video = $('#video-read');  
	    if($('#video-read').length!=0){
			$('#video-read')[0].addEventListener('ended', switchNextVideo, true);
		}

	    if($('#video-index').length!=0){
			$('#video-index')[0].addEventListener('ended', switchNextVideo2, true);
		}

      	$('#video-read').bind("userclick",function(event){	      		
	       	if($(this).get(0).paused && $(this).get(0).currentTime == 0)
	       	{
	       		return;
	       	}
	       	else{
	       		$(this).get(0).pause();
		       	$('#but-2').removeClass(end_style)
			       	$('#but-2').addClass(begin_style)
			       	$('#video-play-2').show();
			       	$('#timeBar-2').css('width', 0+'%');
			       	$('#current-2').text('00:00');
					$(this).get(0).currentTime = 0;
	                $(this).get(0).pause();
					$('#video-pic').show();
	       	}
      	});

      	$('#video-index').bind("userclick",function(event){	      		
	       	if($(this).get(0).paused && $(this).get(0).currentTime == 0)
	       	{
	       		return;
	       	}
	       	else{
	       		$(this).get(0).pause();
		       	$('#but-1').removeClass(end_style)
		       	$('#but-1').addClass(begin_style)
		       	$('#video-play-1').show();
		       	$('#timeBar-1').css('width', 0+'%');
		       	$('#current-1').text('00:00');
				$('#video-index')[0].load();
	       	}
      	});
	}
	function switchNextVideo(){
       	$('#but-2').removeClass(end_style)
       	$('#but-2').addClass(begin_style)
       	$('#video-play-2').show();
       	$('#timeBar-2').css('width', 0+'%');
       	$('#current-2').text('00:00');
		$('#video-read')[0].currentTime = 0;
		$('#video-read')[0].pause();
		$('#video-pic').show();
	}
	function switchNextVideo2(){
       	$('#but-1').removeClass(end_style)
       	$('#but-1').addClass(begin_style)
       	$('#video-play-1').show();
       	$('#timeBar-1').css('width', 0+'%');
       	$('#current-1').text('00:00');
		$('#video-index')[0].load();
	}
	var wsn_paper_event =function()
	{
		$('#swiper-all .swiper-wrapper').on("click",".swiper-slide",function(){
			wsn_readnewspaper_opt($(this).attr('title').replace("-","").replace("-",""),$(this).attr('name'));
			wsn_page_show(["#jfjb-readnewspaper","#jfjb-readfooter"]);
		})
		$('#swiper-day .swiper-wrapper').on("click",".swiper-slide",function(){
			wsn_readnewspaper_opt($(this).attr('title').replace("-","").replace("-",""),$(this).attr('name'),$(this).attr('value'));
			wsn_page_show(["#jfjb-readnewspaper","#jfjb-readfooter"]);
		})
		$('#chapter').on('click',"li",function(){
			issn = $(this).attr('value');
			sum = parseInt($(this).attr('name'));
			wsn_readnewspaper_opt(issn,sum);
		});
	}
	var wsn_index_page=function()
	{
		wsn_page_show(["#jfjb-index","#jfjb-footer"]);
		swiper4.stopAutoplay();swiper4.startAutoplay();
	}
	var wsn_weixin_page=function()
	{
		wsn_page_show(["#jfjb-weixin","#jfjb-footer"]);
		weixinscroll.refresh();weixinscroll.scrollTo(0,0);
	}
	var wsn_weibo_page=function()
	{
		wsn_page_show(["#jfjb-weibo","#jfjb-footer"]);
		weiboscroll.refresh();weiboscroll.scrollTo(0,0);
	}
	var wsn_paper_page=function()
	{
		wsn_page_show(["#jfjb-paper","#jfjb-footer"]);
	}
	var wsn_video_page=function()
	{
		wsn_page_show(["#jfjb-video","#jfjb-footer"]);
		videoscroll.refresh();videoscroll.scrollTo(0,0);
	}
	var wsn_index_event=function()
	{
		$('#index').click(function(){
			wsn_index_page();
		})
		$('[id=weixin]').click(function(){
			wsn_weixin_page();
		})
		$('[id=weibo]').click(function(){
			wsn_weibo_page();
		})
		$('[id=newspaper]').click(function(){
			wsn_paper_page();
		})
		$('#video').click(function()
		{
			wsn_video_page();
		})

	}
	var initData = function()
	{
		jfjb_data = pjfjb;
		video_data = pvideo;
		weixin_data = pweixin;
		weibo_data = pweibo;
		weibofans_data = pfans;
		hot_data = phot;
		

		//微博
		weiboscroll = new IScroll('#weibo-box', {mouseWheel: true});
		weibo_swiper = new Swiper('#swiper-weibo', {
	        pagination: '.swiper-pagination',
	        slidesPerView: 1,
	        paginationClickable: true,
	        spaceBetween: 0,
	        initialSlide :0,
	        nextButton: '#weibo-picbox-right',
			prevButton: '#weibo-picbox-left',
      	});
		//微信
		weixinscroll = new IScroll('#weixin-bigimg', {mouseWheel: true});
		//视频
		videoscroll = new IScroll('#video-box', {mouseWheel: true});
		
		video_ppt_swiper = new Swiper('#jfjb-video-ppt', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        nextButton: '#jfjb-ppt-right',
				prevButton: '#jfjb-ppt-left',
		  	});
        //报纸
		swiper0 = new Swiper('#swiper-day', {
	        pagination: '.swiper-pagination',
	        slidesPerView: 3,
	        paginationClickable: true,
	        spaceBetween: 30,
	        initialSlide :0,
	        nextButton: '#day-menu-right',
			prevButton: '#day-menu-left',
	  	});
		swiper1 = new Swiper('#swiper-all', {
	        pagination: '.swiper-pagination',
	        slidesPerView: 3,
	        paginationClickable: true,
	        spaceBetween: 30,
	        initialSlide :0,
	        nextButton: '#all-menu-right',
			prevButton: '#all-menu-left',
      	});
		swiper2 = new Swiper('#readnewspaper-all', {
	        pagination: '#pages_num',
	        slidesPerView: 1,
	        paginationClickable: true,
	        spaceBetween: 30,
	        initialSlide :0,
	        watchSlidesProgress : true,
	        paginationBulletRender: function (index, className) {
		      	return '<li class="' + className + '">' + (index + 1) + '<span name = "'+(index + 1)+'"></span></li>';
		  	}
      	});
      	swiper4 = new Swiper('#jfjb-host', {
      			        pagination: '.swiper-pagination',
      			        paginationClickable: true,
      			        spaceBetween: 30,
      			        initialSlide :0,
      			        centeredSlides: true,
      			        autoplay: 5000,
      			        autoplayDisableOnInteraction: false
      	});
	}
	var initElement = function()
	{
		
		wsn_index_weibo();
		wsn_index_weixin();
		wsn_index_newspaper();
		wsn_index_video();

		wsn_weibo_list();
		wsn_hot_list();

		wsn_weixin_day();
		wsn_weixin_change_page();

		wsn_video_play();
		wsn_video_list();

		wsn_newspaper_day();
		wsn_newspaper_list();
		
		//overview_show();

	}
	var initEvent=function()
	{
		wsn_index_event();
		wsn_weibo_event();
		wsn_weixin_event();
		wsn_video_event();
		wsn_paper_event();
	}
	var updateWeibo=function()
	{
		//console.log("updateWeibo");return;
		$.ajax({
		    type: 'post',
		    dataType: 'json',
		    url: weibo_url,
		    success: function(json){
		    	if(json.code>weibo_data.code)
		    	{
		    		weibo_data = json;
		    		wsn_index_weibo();
		    		wsn_weibo_list();
		    	}
		    },  
		    error: function(){  

		    } 
		});
	}
	var updateWeixin = function()
	{
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: weixin_url,
            success: function(json){
            	if(json.code > weixin_data.code)
            	{
            		weixin_data = json;
            		wsn_index_weixin();
            		wsn_weixin_day();
            		weixin_i = 0;
            		wsn_weixin_change_page();
            	}
            },  
            error: function(){  
                // alert('网络异常');  
            } 
        });
	}
	var updateNewspaper = function()
	{
		$.ajax({
		    type: 'post',
		    dataType: 'json',
		    url: jfjb_url,
		    success: function(json){
		    	if(json.code >jfjb_data.code)
		    	{
		    		jfjb_data = json;
		    		wsn_newspaper_day();
		    		wsn_newspaper_list();
		    	}
		    },  
		    error: function(){  
		        // alert('网络异常');  
		    } 
		});
	}
	var updateVideo = function()
	{
		$.ajax({
		    type: 'post',
		    dataType: 'json',
		    url: video_url,
		    success: function(json){
		    	if(json.code > video_data.code)
		    	{
		    		//刷新页面
		    		if(ticket>600)
		    		{
		    			location.reload(true);return;
		    		}
		    	}
		    },  
		    error: function(){  
		        // alert('网络异常');  
		    } 
		});
	}
	var updateTotal = function()
	{
		setInterval(function(){updateWeibo()},1000*60*15);
		setInterval(function(){updateWeixin()},1000*60*60);
		setInterval(function(){updateNewspaper()},1000*60*10);
		setInterval(function(){updateVideo()},1000*60*10);
	}
	var init = function(){
		initData();
		initEvent();
		initElement();
		wsn_newspaper_read();
		wsn_index_show();
		updateTotal();
		document.getElementById("main").addEventListener("click",function(){
			ticket = 1;
		},true);
		setInterval(function()
		{
			ticket++;
			if(ticket<15*60){
				return;
			}else
			{
				ticket=1;
				if($('#jfjb-index').is(":hidden")==false){wsn_weixin_page();return;}
				if($('#jfjb-weixin').is(":hidden") == false){wsn_weibo_page();return;}
				if($('#jfjb-weibo').is(":hidden") == false){wsn_video_page();return;}
				if($('#jfjb-video').is(":hidden") == false){wsn_paper_page();return;}
				if($('#jfjb-paper').is(":hidden") == false){wsn_index_page();return;}
				if($('#jfjb-readnewspaper').is(":hidden") == false){wsn_index_page();return;}
			}
		},1000);
	}
	init();

});
