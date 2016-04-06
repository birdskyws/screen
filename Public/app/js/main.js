$('docuemnt').ready(function(){
	/*全局函数处理 */
	var weiboscroll;
	var weixinscroll;
	var videoscroll;
	var swiper0,swiper1,swiper2,jfjb_ppt_swiper,weibo_swiper;
	var jfjb = {
/**************************************************************************************************************/
/*  对象私有变量
***************************************************************************************************************/
		//接口地址
		video_url		   :   '/jfjb/app/index/cvideo',
		weixin_url         :   '/jfjb/app/index/cweixin',
		weibo_url          :   '/jfjb/app/index/cweibo',
		jfjb_url           :   '/jfjb/app/index/cjfjb',
		weibohot_url       :   '/jfjb/app/index/weibohot',
		weibofans_url      :   '/jfjb/app/index/cover',
		//军报每天读变量
        videolist          :   $('#video-list'),
        videodisplay       :   $('#video-display'),
		//军报每天读第几个视频变量
		video_number       :   0,
		//微博变量
        weibolist          :   $('.weibo-list'),
        weibohot           :   $('.weibo-hot'),
		//微信变量
        optimg             :   $('#opt-img'),
        weixinday          :   $('#weixin-day'),
        weixinbigimg       :   $('#opt-img'),
        weixinold          :   $('#weixin-old'),
        weixinchange       :   $('#weixin-change'),
		//首页视屏变量
        videoshow          :   $('#video-show1'),
		// 全局变量
		begin_style        :   'glyphicon glyphicon-play f-White',
		end_style          :   'glyphicon glyphicon-pause f-White',
		// 时间变量
		time_number        :   600,
		time_break         :   600,


/**************************************************************************************************************/
/*  视频通用方法处理函数
***************************************************************************************************************/
		video_begin : function(video,timeDrag,progress,video_star,video_button,durationT,timeBar,current_time){
			// var video = videoBegin;
			// $('.video-ul div').eq(0).removeClass("dd");
			//计算视频播放时间分钟数
			video.on('loadedmetadata', function() {
				var second = Math.floor(video[0].duration % 60);    
		        var minite = Math.floor((video[0].duration / 60) % 60);
		        if(minite < 10){ 
					minite = "0" + minite; 
				} 
				if(second < 10){ 
					second = "0" + second; 
				}
			   	durationT.text(minite+':'+second);
			});
			 
			//计算视频总共时间
			video.on('timeupdate', function() {
				var second = Math.floor(video[0].currentTime % 60);    
		        var minite = Math.floor((video[0].currentTime / 60) % 60);
		        if(minite < 10){ 
					minite = "0" + minite; 
				} 
				if(second < 10){ 
					second = "0" + second; 
				}
			   	current_time.text(minite+':'+second);
			   	var currentPos = video[0].currentTime; 
				var maxduration = video[0].duration; 
				var percentage = 100 * currentPos / maxduration;
				timeBar.css('width', percentage+'%');
			});

			//根据视频播放时间计算滚动条长度 
			progress.mousedown(function(e) {
			   timeDrag = true;
			   updatebar(e.pageX);
			});
			$(document).mouseup(function(e) {
			   if(timeDrag) {
			      timeDrag = false;
			      updatebar(e.pageX);
			   }
			});
			$(document).mousemove(function(e) {
			   if(timeDrag) {
			      updatebar(e.pageX);
			   }
			});
			var updatebar = function(x) {
			   var maxduration = video[0].duration; 
			   var position = x - progress.offset().left; 
			   var percentage = 100 * position / progress.width();
			   if(percentage > 100) {
			      percentage = 100;
			   }
			   if(percentage < 0) {
			      percentage = 0;
			   }
			 
			   //Update progress bar and video currenttime
			   timeBar.css('width', percentage+'%');
			   video[0].currentTime = maxduration * percentage / 100;
			};


			//点击播放大按钮开始播放视频
			video_star.on('click',function(){
				$('#video-pic').hide();
				jfjb.jfjb_audioReset();
		       	video[0].play();
		       	video_star.hide();
		       	video_button.removeClass(jfjb.begin_style)
		       	video_button.addClass(jfjb.end_style)
		    });

		    //点击播放小按钮开始视频，停止视频播放
		    video_button.on('click',function(){
				jfjb.jfjb_audioReset();
		    	if(video[0].paused) {
			       	video[0].play();
					$('#video-pic').hide();
			       	video_star.hide();
			       	video_button.removeClass(jfjb.begin_style)
			       	video_button.addClass(jfjb.end_style)
			    }else{
			       	video[0].pause();
		       		video_star.show();
					$('#video-pic').show();
			       	video_button.removeClass(jfjb.end_style)
			       	video_button.addClass(jfjb.begin_style)
			    }
			    return false;
		    });

		    //监听视频是否播放完成，完成后将停止播放的样式显示
		    if(video.length!=0){
				video[0].addEventListener('ended', switchNextVideo, true);
			}
			function switchNextVideo(){
		       	video_button.removeClass(jfjb.end_style)
		       	video_button.addClass(jfjb.begin_style)
		       	video_star.show();
		       	timeBar.css('width', 0+'%');
		       	current_time.text('00:00');
				var v_img = video.attr('poster');
				video["src"] = video.attr('src');
				video.load();
				video.attr('poster',v_img)
				video[0].pause();
				$('#video-pic').show();
			}
		},

/**************************************************************************************************************/
/*  军报天天读关联处理函数
***************************************************************************************************************/
		//军报天天读视屏功能
		video_read : function(){
			var timeDrag2 = false;
			var progress2 = $('#progressBar-2');
			var video_star2 = $('#video-play-2');
			var video_button2 = $('#but-2');
			var duration2 = $('#duration-2');
			var timeBar2 = $('#timeBar-2');
			var current_time2 = $('#current-2');
			var video2 = $('#video-read');
			$('#video-read')["src"] = $('#video-read').attr('src');
			$('#video-read').load();
	       	$('#but-2').removeClass(jfjb.end_style)
	       	$('#but-2').addClass(jfjb.begin_style)
	       	$('#video-play-2').show();
	       	$('#timeBar-2').css('width', 0+'%');
			jfjb.video_begin(video2,timeDrag2,progress2,video_star2,video_button2,duration2,timeBar2,current_time2);
		},
		//军报天天读初始化视频
		video_play : function(){
            var link = "";
            var text = "";
            var play = "";
            var pic = '';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                    // console.log('遍历数据1',json.data)
                    $.each(json.data, function(i, item) {
                        if (i==0){
                            link = '<video id="video-read" name="'+json.code+'"  src="'+item.video+'"></video>';
                            text = '《军报每天读》'+item.pubdate+''
                            pic = item.pic;
                            return false;
                        }
                    });
                    var link1 = link+'<img src='+pic+' id="video-pic"><div class="video-play" id="video-play-2"><i class="glyphicon glyphicon-play f-White1"></i></div><div class="video-button"><div class="video-but"><i class="glyphicon glyphicon-play f-White" id="but-2"></i><div class="play-time"><span class="current" id="current-2">00:00</span>&nbsp;<b>/</b>&nbsp;<span id="duration-2" class="duration"></span></div></div><div class="progressBar" id="progressBar-2"><div class="timeBar" id="timeBar-2"></div></div></div>'
					$('.video-begin h3').html(text)
                    jfjb.videodisplay.html(link1);
					jfjb.video_read();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //军报每天读视频更新
        video_play_update : function(){
            var link = "";
            var text = "";
            var play = "";
            var oldvideo="";
            var newvideo="";
            var newposter="";
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                    // console.log('遍历数据1',json)
                    $.each(json.data, function(i, item) {
                        if (i==0){
                            newvid=item.video;
                            newposter = item.pic;
                            return false;
                        }
                    });
                    oldvideo = $('#video-read').attr('src');
                    if(oldvideo!=newvid){
	                    $('#video-read').attr('src',newvideo);
						$('#current-2').text('00:00');
						var v_img1 = newposter;
						// $('#video-read').attr('poster',v_img1)
	                	$('#video-pic').attr('src',v_img1)
				       	$('#but-2').removeClass(jfjb.end_style)
				       	$('#but-2').addClass(jfjb.begin_style)
				       	$('#video-play-2').show();
				       	$('#timeBar-2').css('width', 0+'%');
						$('#video-read')[0].load();
                    }
					$('#current-2').text('00:00');
					var v_img1 = $('#video-index').attr('poster');
					// $('#video-read').attr('poster',v_img1)
	                $('#video-pic').attr('src',v_img1)
			       	$('#but-2').removeClass(jfjb.end_style)
			       	$('#but-2').addClass(jfjb.begin_style)
			       	$('#video-play-2').show();
			       	$('#timeBar-2').css('width', 0+'%');
	                $('#video-read').attr('src',newvideo);
		            var vi = $('#video-read')[0];
                    vi.load();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //军报天天读视频列表
		video_list : function(){
            var link = "";
            var text = "";
            var play = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                	// console.log('视频列表',json)
                    $.each(json.data, function(i, item) {
                        link += '<li value="'+item.pic+'" title="《军报每天读》'+item.pubdate+'" name="'+item.video+'"><dl><dt><img src="'+item.pic+'"><div class="dd"></div></dt><dd><p>《军报每天读》'+item.pubdate+'</p></dd></dl></li>';
                    });
                    jfjb.videolist.html(link);
                    var number = parseInt(jfjb.video_number)
                    if(number==0){
						$('.video-ul div').eq(0).removeClass("dd");
					}else{
						$('.video-ul div').eq(number).removeClass("dd");
					}
            		jfjb.video_choose();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //军报天天读 点击右侧图片加重新加载视频并播放功能
        video_choose : function(){ 
            $('.video-ul li').on('click',function(){
            	if (videoscroll.click == 1 ){
					jfjb.jfjb_audioReset();
	                var v_img1 = $(this).attr('value');
	                // $('#video-read').attr('poster',v_img1)
	                $('#video-pic').attr('src',v_img1)
	                var v_video = $(this).attr('name');
	                var v_title = $(this).attr('title');
	                $('.video-begin h3').text(v_title)
	                $('.video-ul div').addClass("dd")
	                jfjb.video_number = $(this).index()
	                $(".video-ul div").eq($(this).index()).removeClass("dd"); 
	                $('#video-read').attr('src',v_video);
	                $('#video-play-2').hide();
	                $('#video-pic').hide()
	                $('#but-2').removeClass("glyphicon glyphicon-play f-White")
	                $('#but-2').addClass("glyphicon glyphicon-pause f-White")
	                $('#video-read').load();
	                $('#video-read')[0].play(); 
            	}
            });
            $('#fullscreen').on('click', function() {
			   //For Webkit
			   $('#video-read')[0].webkitEnterFullscreen();
			 
			   //For Firefox
			   $('#video-read')[0].mozRequestFullScreen();
			   //For Firefox
			   $('#video-read')[0].msEnterFullscreen();
			 
			   return false;
			});
        },
        //军报天天读10分钟更新列表
        video_list_update : function(){
        	var video = $('#video-list li').eq(0).attr('name')
        	$.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                	// console.log('视频列表',json)
                    $.each(json, function(i, item) {
                    	if(video!=item.video){
                        	jfjb.video_list();
                        }else{
                        	return false
                        }
                    });
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
		video_scroll_list : function(){
			if(videoscroll!=null)
			{
				videoscroll.destroy();
			}
			videoscroll = new IScroll('#video-box', {mouseWheel: true});
				// myscroll.refresh();
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},

		//军报每天读PPT滑动功能
		video_jfjb_ppt : function(){
			var host1 = '<div class="swiper-container" id="jfjb-video-ppt" style="height:795px"><ul class="swiper-wrapper"><li class="swiper-slide"><img src="images/jfjb-video-1.jpg"></li><li class="swiper-slide"><img src="images/jfjb-video-2.jpg"></li><li class="swiper-slide"><img src="images/jfjb-video-3.jpg"></li><li class="swiper-slide"><img src="images/jfjb-video-4.jpg"></li><li class="swiper-slide"><img src="images/jfjb-video-5.jpg"></li></ul></div><div class="jfjb-ppt-arrow" id="jfjb-ppt-left"><i class="glyphicon glyphicon-menu-up"></i></div><div class="jfjb-ppt-arrow jfjb-ppt-arrow-top" id="jfjb-ppt-right"><i class="glyphicon glyphicon-menu-down"></i></div>'
			$('.jfjb-ppt').html(host1)			
			if(jfjb_ppt_swiper!=null)
			{
				jfjb_ppt_swiper.destroy();
			}			
			jfjb_ppt_swiper = new Swiper('#jfjb-video-ppt', {
				// direction : 'vertical',
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        nextButton: '#jfjb-ppt-right',
				prevButton: '#jfjb-ppt-left',
	      	});
		},

/**************************************************************************************************************/
/*  解放军报关联处理函数
***************************************************************************************************************/
		//今日报纸滚动功能
		newspaper_day_scroll : function(){			
			if(swiper0!=null)
			{
				swiper0.destroy();
			}		
			swiper0 = new Swiper('#swiper-day', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 3,
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        nextButton: '#day-menu-right',
				prevButton: '#day-menu-left',
	      	});
			// swiper.slideTo(0, 10, false);
		},
		//所有报纸滚动功能
		newspaper_list_scroll : function(){			
			if(swiper1!=null)
			{
				swiper1.destroy();
			}
			swiper1 = new Swiper('#swiper-all', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 3,
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        nextButton: '#all-menu-right',
				prevButton: '#all-menu-left',
	      	});
			// swiper1.slideTo(0, 10, false);
		},
		//今日所有报纸版面滚动功能
		newspaper_daylist_scroll : function(value){
			var value1 = value;
			if(value1=="" || value1==null){
				value1 = 0;
			}else{
				value1 = value1 - 1;
			}
			if(swiper2!=null){
				swiper2.destroy();
			}
			swiper2 = new Swiper('#readnewspaper-all', {
		        pagination: '#pages_num',
		        slidesPerView: 1,
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :value1,
		        watchSlidesProgress : true,
		        paginationBulletRender: function (index, className) {
			      	return '<li class="' + className + '">' + (index + 1) + '<span name = "'+(index + 1)+'"></span></li>';
			  	}
	      	});
		},
		//今日报纸
		newspaper_day : function(){
            var link = "";
            var text = "";
            var num = 0;
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.jfjb_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        if (i==0){
                        	$.each(item.pics, function(j, val) {
                        		j=j+1
                            	link += '<div class="swiper-slide" title="'+item.pubdate+'" name="'+item.pagenum+'" value="'+j+'"><img src="'+val.min+'"></div>';
                            });
                        	return false;
                        }
                    });
                    var link1 = '<div class="swiper-container swiper-height" id="swiper-day"><div class="swiper-wrapper">'+link+'</div></div>'
                    $('#jfjb-daynewspaper').html(link1);
                    jfjb.newspaper_day_scroll();
                    jfjb.readnewspaper();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//所有报纸列表
		newspaper_list : function(){
            var link = "";
            var text = "";
            var link1 = "";
            var text2 = "";
            var title = "";
            var dd1 = "";
            var dd2 = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.jfjb_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                    	if(i>0){
	                        $.each(item.pics, function(j, val) {
	                    		if (j==0){
	                        		link = '<div class="swiper-slide" name="'+item.pagenum+'" title="'+item.pubdate+'"><img src="'+val.min+'"><p>'+item.pubdate+'</p></div>';
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
                    var text1 = '<div class="swiper-container swiper-height" id="swiper-all"><div class="swiper-wrapper">'+text+'</div></div>'
                    $('#jfjb-oldnewspaper').html(text1);
                    $('#pages_date').html(link1);
                    jfjb.newspaper_list_scroll();
                    jfjb.readnewspaper();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//点击报纸，显示阅读的报纸
		readnewspaper : function(){
			var title = '';
			var dd1 = '';
			var dd2 = '';
			var sum = 0;
			var value = '';
			var issn= '';
			//点击今日报纸，显示阅读今日的报纸
			$('#jfjb-daynewspaper div.swiper-slide').on('click',function(e){
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').hide();
				$('#jfjb-footer').hide();
				$('#jfjb-footer').show();
				$('#jfjb-footer').hide();
				$('#jfjb-readfooter').show();
				$('#jfjb-readnewspaper').show();
				title = $(this).attr('title');
				dd1=title.replace('-','');
				dd2=dd1.replace('-','');
				sum = parseInt($(this).attr('name'));
				jfjb.jfjb_audioReset();
				value = $(this).attr('value');
				jfjb.readnewspaper_opt(dd2,sum,value);
			})
			//点击所有报纸中的头版，选择要看的日期报纸
			$('#jfjb-oldnewspaper div.swiper-slide').on('click',function(){
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').hide();
				$('#jfjb-footer').hide();
				$('#jfjb-footer').show();
				$('#jfjb-footer').hide();
				$('#jfjb-readfooter').show();
				$('#jfjb-readnewspaper').show();
				title = $(this).attr('title');
				dd1=title.replace('-','');
				dd2=dd1.replace('-','');
				sum = parseInt($(this).attr('name'));
				jfjb.jfjb_audioReset();
				jfjb.readnewspaper_opt(dd2,sum);

			})
			//点击日期选择需要看的报纸
			$('#chapter li').on('click',function(){
				jfjb.jfjb_audioReset();
				issn = $(this).attr('value');
				sum = parseInt($(this).attr('name'));
				$('#chapter span').text(issn);
				jfjb.readnewspaper_opt(issn,sum);
				// console.log(issn+'---'+sum)
			});
		},
		//阅读报纸滑动功能
		readnewspaper_opt : function(title1,sum,value1){
			var chapter = title1;
			var value3 = value1;
			if(value3=="" || value3==null){
				value3 = 1;
			}
			$('#chapter span').text(chapter)
			var imgsrc_list = "";
			for(var i=1;i<=sum;i++){
				imgsrc_list += '<div class="swiper-slide"><img name="'+i+'" src="/jfjb/Public/cache/jfjb/'+chapter+'/'+i+'.jpg"></div>';
			}
			var imgsrc_list1 = '<div class="swiper-container newspaper-read-list" id="readnewspaper-all"><div class="swiper-wrapper" id="readnewspaper">'+imgsrc_list+'</div></div>'
			var pages = '<ul class="selectionul1 clear" id="pages_num"></ul>'
			/*
			if()
			*/
			$('.newspaper-read').html(imgsrc_list1);
			$('#pagination').html(pages)
			jfjb.newspaper_daylist_scroll(value3);
		},
		//报纸开始
		newspaper_star : function(){
			jfjb.newspaper_day();
			jfjb.newspaper_list();
		},
/**************************************************************************************************************/
/*  微博关联处理函数
***************************************************************************************************************/ 
		//微博图片滑动功能
		
		weibo_pic_scroll : function(){
			if(weibo_swiper!=null)
			{
				weibo_swiper.destroy();
			}
			weibo_swiper = new Swiper('#swiper-weibo', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 1,
		        paginationClickable: true,
		        spaceBetween: 0,
		        initialSlide :0,
		        nextButton: '#weibo-picbox-right',
				prevButton: '#weibo-picbox-left',
	      	});
		},
		  
        //微博列表生成
        weibo_list : function(){
            var text = "";
            var opt = "";
            var img = "";
            var data = "";
            var list = "";
        	$.ajax({  
        		type: 'post',
                dataType: 'json',
        	    url: jfjb.weibo_url,
        	    success: function(json){
                    // console.log('微博列表',json)
                    $.each(json.data, function(i, item) {
                        text = '<dl id="t'+i+'" name='+i+'><dt name='+json.code+'><p>'+item.text+'</p></dt>'
                        $.each(item.pics, function(j, val) {
                            opt += '<li><img src="'+val.min+'" name="'+val.normal+'"></li>'
                        })
                        
                        img = '<dd><ul class="boxul clear" name="'+item.sinaid+'">'+opt+'</ul><div class="box-big" name="'+i+'"></div></dd>'
                        var date = item.pubtime;
                        var subdate = date.substring(5,16);
                        data = '<dd><p><span>日期：'+subdate+'</span><span>评论：'+item.comment+'</span><span>转发：'+item.repost+'</span></p></dd></dl>'
                        list += text + img + data;
                        opt = '';
                    });
                    jfjb.weibolist.empty();
                    jfjb.weibolist.html(list);
            		jfjb.weibo_img();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
		weibo_scroll_list : function(){
			if(weiboscroll!=null)
			{
				weiboscroll.destroy();
			}
			weiboscroll = new IScroll('#weibo-box', {mouseWheel: true});
				// myscroll.refresh();
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
        //微博图九宫格
        weibo_img : function(){
            $(".weibo-list ul").each(function(i){
                var boxli = $(this).find("li").length
                var ulid = 'box-'+i;
                var divid = 'div-'+i;
                var boxulid = $('.weibo-list ul').eq(i).attr('id',ulid)
                var boxbivid = $('.weibo-list div').eq(i).attr('id',divid)
                var tt = '';
                //四张图片固定为上下两张图片
				if(boxli == 4){
					$('#box-'+i+'').addClass('boxul-4');
				}
				//点击图片弹出一个层
				$('#box-'+i).on('click',function(){
					if (weiboscroll.click == 1 ){
						var num = $(this).attr('name')
						//console.log(num)
	                    $(".weibo-popbox").slideDown("slow");
						jfjb.weibo_popbox(num,boxli);
					}
				});
            });
        },
        //微博弹出框功能
        weibo_popbox : function(num){
        	var link = '';
        	var opt = '';
			$('#box-close').on('click',function(){
				$('.weibo-popbox').hide();
				$('.weibo-pic').html('');
			});
			$.ajax({  
        		type: 'post',
                dataType: 'json',
        	    url: jfjb.weibo_url,
        	    success: function(json){
                    $.each(json.data, function(i, item) {
                    	if(item.sinaid==num){
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
                    jfjb.weibo_pic_scroll();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //微博粉丝，文章总数加载
        weibo_sum : function(){
            var link = "";
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.weibofans_url,
                success: function(json){
                    link = '<div class="weibo-article">微博：<span>'+json.articles+'</span></div><div class="weibo-fans">粉丝：<span>'+json.fans+'</span></div>';
                    $('#weibo-total').html(link);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            }) 
        },
        //最火微博列表生成
        weibo_hot_list : function(){
            var text = "";
            var opt = "";
            var img = "";
            var data = "";
            var list = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weibohot_url,
                success: function(json){
                    $.each(json, function(i, item) {
                        var date = item.pubtime;
                        var subdate = date.substring(5,10);
                        list += '<dl><dt><h3></h3></dt><dd><p>'+item.text+'</p><div class="clear"><p class="float-left"><span>转发：'+item.repost+'</span><span>评论：'+item.comment+'</span></p><p class="float-right"><span>日期：'+subdate+'</span></p></div></dd></dl>';
                    });
                    var list1 = '<div class="weibo-hot-title"><img src="images/weibo-hot.png"></div>' + list
                    jfjb.weibohot.html(list1);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //微博开始
        weibo_star : function(){
            jfjb.weibo_list();
            jfjb.weibo_sum();
            jfjb.weibo_hot_list();
        },

/**************************************************************************************************************/
/*  微信关联处理函数
***************************************************************************************************************/
        //今日微信列表生成
        weixin_day : function(){
            var link = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        link += '<li value="'+item.pic+'" title="'+item.title+'" name='+json.code+'><dl class="wl-title"><dt>'+item.title+'</dt><dd>'+item.pubdate+'</dd></dl></li>';
                        if (i == 7){
                            return false
                        }

                    });
                    jfjb.weixinday.html(link)
                    jfjb.selectweixin();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //初始化微信大图
        weixin_img : function(){
            var link = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        link += '<img src="'+item.pic+'">';
                        if (i == 0){
                            return false
                        }
                    });
                    jfjb.weixinbigimg.html(link);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //微信换一换初始化列表
        weixin_change : function(){
            var link = "";
            var num = 7;
            var dd = num+8;
            var d2 = 0;
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        d2 = json.length;
                        if (i > num){
                            link += '<li value="'+item.pic+'"><dl class="wl-title"><dt>'+item.title+'</dt><dd>'+item.pubdate+'</dd></dl></li>';
                            if(i == dd){
                                return false;
                            }
                        }

                    });
                    var link1 = link + '<i num="'+d2+'"></i>';
                    jfjb.weixinold.html(link1)
                    jfjb.selectweixin();
                    jfjb.weixin_change_next();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //微信换一换翻页功能
        weixin_change_next : function(){
        	var y;
        	var rotYINT;
        	var ny = 0;
            var num = 15;
            var sum = $('#weixin-old i').attr('num')
            var dd = 0;
            jfjb.weixinchange.on('click',function(){
				jfjb.jfjb_audioReset();
                dd = num+8;
                jfjb.weixin_change_page(num,dd);
                num = dd; 
                if(dd>=(sum-1)){
                    num = 7;
                    dd = 0;
                }
                var trun = '<i class="musicPlay"></i>'
            	$('.trun').html(trun);
            })
        },
        //微信动态换一换列表
        weixin_change_page : function(num,dd){
            var link = "";
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        if (i > num){
                            link += '<li class="weixin-move" value="'+item.pic+'"><dl class="wl-title"><dt>'+item.title+'</dt><dd>'+item.pubdate+'</dd></dl></li>';
                            if(i == dd){
                                return false;
                            }
                        }

                    });
                    jfjb.weixinold.html(link);
                    jfjb.selectweixin();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },
        //点击微信列表显示大图
        selectweixin : function(){
            //今日微信功能
            $('.weixin-newday li').on('click',function(){
				jfjb.jfjb_audioReset();
            	$(".weixin-oldday li").removeClass("weixin-link"); 
            	$(".weixin-newday li").removeClass("weixin-link"); 
                $(".weixin-newday li").eq($(this).index()).addClass("weixin-link"); 
                var link = $(this).attr('value');
                var imgs = '<img src="'+link+'">';
                jfjb.weixinbigimg.empty();
				jfjb.weixinbigimg.html(imgs);
                $(".opt-img img").load(function(){
	                $('.opt-img').scrollTop(0);
	                var imgH = $('.opt-img img').height();
	                $('.opt-img img').css('height',imgH)
                	jfjb.myscroll_list();
				});
            })
            //微信换一换功能
            $('.weixin-oldday li').on('click',function(){
				jfjb.jfjb_audioReset();
            	$(".weixin-newday li").removeClass("weixin-link"); 
            	$(".weixin-oldday li").removeClass("weixin-link"); 
                $(".weixin-oldday li").eq($(this).index()).addClass("weixin-link"); 
                var link = $(this).attr('value');
                var imgs = '<img src="'+link+'">';
                jfjb.weixinbigimg.empty();
				jfjb.weixinbigimg.html(imgs);
                $(".opt-img img").load(function(){
	                $('.opt-img').scrollTop(0);
	                var imgH = $('.opt-img img').height();
	                $('.opt-img img').css('height',imgH)
                	jfjb.myscroll_list();
				});
            })
        },
        //微信开始
        weixin_star : function(){
            jfjb.weixin_day();
            jfjb.weixin_change();
            jfjb.weixin_img();
        },
        //微信每10分钟更新列表
        weixin_star_update : function(){
        	var weixin = $('#weixin-day li').eq(0).attr('title');
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        if(weixin!=item.title){
                        	jfjb.weixin_star();
                        }else{
                        	return false
                        }
                    });
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
        },

/**************************************************************************************************************/
/*  发布概况关联处理函数
***************************************************************************************************************/
		overview_show : function(){
			var url = '/jfjb/public/cache/tj/tj.jpg';
			var time = new Date().getTime();
			var imgurl = '<img src='+url +'?t='+time+'>';
			$('#overview-img').html(imgurl)
		},
		//微博PPT滑动功能
		/*
		jfjb_weibo_ppt : function(){
			var host1 = '<div class="jfjb-weibo-left"><div class="jfjb-weibo-ppt-arrow"><div class="jfjb-weiboppt-arrow" id="jfjb-weiboppt-left"><i class="glyphicon glyphicon-menu-up"></i></div><div class="jfjb-weiboppt-arrow jfjb-weiboppt-top" id="jfjb-weiboppt-right"><i class="glyphicon glyphicon-menu-down"></i></div></div></div><div class="swiper-container jfjb-weibo-center" id="jfjb-weibo-ppt"><ul class="swiper-wrapper"><li class="swiper-slide"><img src="images/weibo-01.jpg"></li><li class="swiper-slide"><img src="images/weibo-02.jpg"></li><li class="swiper-slide"><img src="images/weibo-03.jpg"></li><li class="swiper-slide"><img src="images/weibo-04.jpg"></li><li class="swiper-slide"><img src="images/weibo-05.jpg"></li><li class="swiper-slide"><img src="images/weibo-06.jpg"></li><li class="swiper-slide"><img src="images/weibo-07.jpg"></li><li class="swiper-slide"><img src="images/weibo-08.jpg"></li></ul></div><div class="jfjb-weibo-right"></div>'
			$('.jfjb-weibo-ppt').html(host1)
			jfjb_weiboppt_swiper = new Swiper('#jfjb-weibo-ppt', {
				// direction : 'vertical',
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        nextButton: '#jfjb-weiboppt-right',
				prevButton: '#jfjb-weiboppt-left',
	      	});
		},
		*/

/**************************************************************************************************************/
/*  首页关联处理函数
***************************************************************************************************************/
		//首页视频功能
		video_index : function(){
			var timeDrag1 = false;
			var progress1 = $('#progressBar-1');
			var video_star1 = $('#video-play-1');
			var video_button1 = $('#but-1');
			var duration1 = $('#duration-1');
			var timeBar1 = $('#timeBar-1');
			var current_time1 = $('#current-1');
			var video1 = $('#video-index');
			$('#current-1').text('00:00');
	       	$('#but-1').removeClass(jfjb.end_style)
	       	$('#but-1').addClass(jfjb.begin_style)
	       	$('#video-play-1').show();
	       	$('#timeBar-1').css('width', 0+'%');
			jfjb.video_begin(video1,timeDrag1,progress1,video_star1,video_button1,duration1,timeBar1,current_time1);
			$('#video-index')["src"] = $('#video-index').attr('src');
			var v_img1 = $('#video-index').attr('poster');
			$('#video-index').attr('poster',v_img1)
			$('#video-index').load();
		},
		//军报每天读主持人滚动功能
		jfjb_host_scroll : function(){
			var host = '<h3>军报每天读主持人</h3><div class="swiper-container" id="jfjb-host"><div class="swiper-wrapper" id=""><dl class="swiper-slide"><dt><img src="images/host-02.jpg"></dt><dd><p>贺嘉庆，山西石楼人，毕业于重庆大学广播电视新闻学专业。中尉军衔，成都军区某团副指导员。曾获“富春杯”全国大学生演讲大赛优秀奖，被评为该校“优秀国防生”、“优秀毕业生”。2013年，获成都军区“四会”优秀政治教员评比竞赛一等奖，被总政表彰为全军“四会”优秀政治教员，荣立三等功一次。2014年10月，获解放军报“军报每天读”主持人大赛三等奖，现为《军报每天读》栏目主持人。</p></dd></dl><dl class="swiper-slide"><dt><img src="images/host-05.jpg"></dt><dd><p>夏青，安徽铜陵人，毕业于安徽广播学院播音主持专业。下士军衔，安徽省军区文工团主持人。被评为“优秀士兵”一次，获嘉奖两次；曾获“2010世界小姐选美大赛”上海赛区十强；“全国航模天使模特选拔赛”安徽赛区亚军；铜陵首届“丽人大赛”最佳上镜奖；“砀山梨花仙子”主持人大赛亚军；2014年10月，获解放军报“军报每天读”主持人大赛三等奖，现为《军报每天读》栏目主持人。</p></dd></dl></div></div>'
			$('.summary').html(host);
			if(swiper4!=null)
			{
				swiper4.destroy();
			}
			var swiper4 = new Swiper('#jfjb-host', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 30,
		        initialSlide :0,
		        centeredSlides: true,
		        autoplay: 5000,
		        autoplayDisableOnInteraction: false
	      	});
		},
		//首页视频初始化
		video_index_show : function(){
            var link = "";
            var text = "";
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        if (i==0){
                            link = '<video src="'+item.video+'" class="video" id="video-index" poster="'+item.pic+'" name="'+json.code+'" ></video>';
                            return false;
                        }
                    });
                    var link1 = link+'<div class="video-play" id="video-play-1"><i class="glyphicon glyphicon-play f-White1"></i></div><div class="video-button"><div class="video-but"><i class="glyphicon glyphicon-play f-White" id="but-1"></i><div class="play-time"><span class="current" id="current-1">00:00</span>&nbsp;<b>/</b>&nbsp;<span class="duration" id="duration-1"></span></div></div><div class="progressBar" id="progressBar-1"><div class="timeBar" id="timeBar-1"></div></div></div>';
                    jfjb.videoshow.html(link1);
                    jfjb.video_index();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//首页视频更新
		video_index_update : function(){
            var link = "";
            var text = "";
            var oldvideo="";
            var newvideo="";
            var newposter="";
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                    $.each(json.data, function(i, item) {  
                        if (i==0){
                            newvideo=item.video;
                            newposter = item.pic;
                            return false;
                        }
                    });
                    oldvideo = $('#video-index').attr('src');
                    if(oldvideo!=newvideo){
	                    $('#video-index').attr('src',newvideo);
						$('#current-1').text('00:00');
						var v_img1 = newposter;
						$('#video-index').attr('poster',v_img1)
				       	$('#but-1').removeClass(jfjb.end_style)
				       	$('#but-1').addClass(jfjb.begin_style)
				       	$('#video-play-1').show();
				       	$('#timeBar-1').css('width', 0+'%');
						$('#video-index').load();
						return false;
                    }
					$('#current-1').text('00:00');
					var v_img1 = $('#video-index').attr('poster');
					$('#video-index').attr('poster',v_img1)
			       	$('#but-1').removeClass(jfjb.end_style)
			       	$('#but-1').addClass(jfjb.begin_style)
			       	$('#video-play-1').show();
			       	$('#timeBar-1').css('width', 0+'%');
                    var vi = $('#video-index')[0];
                    vi.load();
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//首页最新微信加载
		weixin_show : function(){
            var link = "";
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: jfjb.weibofans_url,
                success: function(json){
                    link = '<p>【'+json.title+'】'+json.weixin+'</p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
                    $('.jfjb-weixin-show').html(link);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//首页最新解放军报加载
		newspaper_show : function(){
            var link = "";
            var text = "";
            var num = 0;
            $.ajax({  
                type: 'post',
                dataType: 'json',
                url: jfjb.jfjb_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                        if (i==0){
                        	$.each(item.pics, function(j, val) {
                        		if (j==0){
                        			j=j+1
                            		link = '<p class="paper-img"  title="'+item.pubdate+'" name="'+json.code+'" value="'+j+'"><img src="'+val.min+'"></p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
                        			return false;
                            	}
                            });
                        	return false;
                        }
                    });
                    $('.jfjb-newspaper-show').html(link);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//首页最新微博加载
		weibo_show : function(){
            var text = "";
        	$.ajax({  
        		type: 'post',
                dataType: 'json',
        	    url: jfjb.weibo_url,
        	    success: function(json){
                    $.each(json.data, function(i, item) {
                    	if (i==0){
	                        text = '<p>'+item.text+'</p><div><i class="glyphicon glyphicon-circle-arrow-right"></i></div>';
                    	}
                    });
                    $('.jfjb-weibo-show').html(text);
                },  
                error: function(){  
                    // alert('网络异常');  
                } 
            })
		},
		//首页加载
		index_one : function(){
			$('#jfjb-video').hide();
			$('#jfjb-weibo').hide();
			$('#jfjb-weixin').hide();
			$('#jfjb-paper').hide();
			$('#jfjb-readfooter').hide();
			$('#jfjb-readnewspaper').hide();
			$('#jfjb-index').show();
			$('#jfjb-footer').show();
			$('#jfjb-readfooter').hide();
		},
		//点击导航选择要显示的模块
		selectmodule : function(){
			//隐藏模块
			$('#jfjb-video').hide();
			$('#jfjb-weibo').hide();
			$('#jfjb-weixin').hide();
			$('#jfjb-paper').hide();
			$('#jfjb-overview').hide();
			$('#jfjb-weixin').hide();
			$('#jfjb-readfooter').hide();
			$('#jfjb-readnewspaper').hide();

			//显示首页模块 其他模块隐藏
			$('#index').on('click',function(){
				jfjb.jfjb_audioReset();
				$('#video-read')[0].pause();
				jfjb.index_one();
				$('#video-index')[0].pause();
				jfjb.jfjb_host_scroll();
				$('#current-1').text('00:00');
				var v_img1 = $('#video-index').attr('poster');
				$('#video-index').attr('poster',v_img1)
		       	$('#but-1').removeClass(jfjb.end_style)
		       	$('#but-1').addClass(jfjb.begin_style)
		       	$('#video-play-1').show();
		       	$('#timeBar-1').css('width', 0+'%');
				$('#video-index').load();
				$('#jfjb-overview').hide();
				$('.weibo-popbox').hide();
				return false;
			})
			//显示军报每天读模块 其他模块隐藏
			$('#video').on('click',function(){
				jfjb.jfjb_audioReset();
				$('#video-index')[0].pause();
				$('.weibo-popbox').hide();
				$('#jfjb-video').show();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').hide();
				$('#jfjb-readfooter').hide();
				$('#jfjb-readnewspaper').hide();
				$('#jfjb-footer').show();
				$('#jfjb-readfooter').hide();
				$('#current-2').text('00:00');
				$('#video-read')["src"] = $('#video-read').attr('src');
				$('#video-read').load();
				var v_img = $('#video-pic').attr('src');
				$('#video-pic').attr('src',v_img)
		       	$('#but-2').removeClass(jfjb.end_style)
		       	$('#but-2').addClass(jfjb.begin_style)
		       	$('#video-play-2').show();
		       	$('#video-pic').show()
		       	$('#timeBar-2').css('width', 0+'%');
		       	jfjb.videolist.scrollTop(0);
            	jfjb.video_scroll_list();
				// $(".video-ul").niceScroll({horizrailenabled:true,cursorcolor:"#000",cursoropacitymax:0,touchbehavior:true,nativeparentscrolling:false});
				$('#video-read')[0].pause();
				jfjb.video_jfjb_ppt();
				return false;
			})
			//显示微博模块 其他模块隐藏
			$('[id=weibo]').on('click',function(){
				// jfjb.weibo_star();
				jfjb.jfjb_audioReset();
				$('.weibo-popbox').hide();
				$('#video-index')[0].pause();
				$('#video-read')[0].pause();
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').show();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').hide();
				$('#jfjb-readfooter').hide();
				$('#jfjb-readnewspaper').hide();
				$('#jfjb-footer').show();
				$('#jfjb-readfooter').hide();
		       	jfjb.weibolist.scrollTop(0);
            	jfjb.weibo_scroll_list();

				// $(".weibo-list").niceScroll({horizrailenabled:true,cursorcolor:"#000",cursoropacitymax:0,touchbehavior:true,nativeparentscrolling:false});
				return false;
			})
			//显示微信模块 其他模块隐藏
			$('[id=weixin]').on('click',function(){
            	// jfjb.weixin_star();
                $('.trun i').removeClass('musicPlay')
                $('#weixin-old li').removeClass('weixin-move')
				jfjb.jfjb_audioReset();
				$('.weibo-popbox').hide();
				$('#video-index')[0].pause();
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').hide();
				$('#jfjb-weixin').show();
				$('#jfjb-readfooter').hide();
				$('#jfjb-readnewspaper').hide();
				$('#jfjb-footer').show();
				$('#jfjb-readfooter').hide();
		       	$(".opt-img").scrollTop(0);
				$('#video-read')[0].pause();
                jfjb.myscroll_list();
				return false;
			})
			//显示解放军报模块 其他模块隐藏
			$('[id=newspaper]').on('click',function(){
				jfjb.jfjb_audioReset();
				$('.weibo-popbox').hide();
				$('#video-index')[0].pause();
				$('#video-read')[0].pause();
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').show();
				$('#jfjb-overview').hide();
				$('#jfjb-readfooter').hide();
				$('#jfjb-readnewspaper').hide();
				$('#jfjb-footer').show();
				$('#jfjb-readfooter').hide();
				jfjb.newspaper_star();
				return false;
			})
			//显示发布概况模块 其他模块隐藏
			$('#overview').on('click',function(){
				jfjb.jfjb_audioReset();
				$('#video-index')[0].pause();
				$('#video-read')[0].pause();
				$('#jfjb-video').hide();
				$('#jfjb-index').hide();
				$('#jfjb-weibo').hide();
				$('#jfjb-weixin').hide();
				$('#jfjb-paper').hide();
				$('#jfjb-overview').show();
				$('#jfjb-readfooter').hide();
				$('#jfjb-readnewspaper').hide();
				$('#jfjb-footer').show();
				$('#jfjb-readfooter').hide();
				jfjb.overview_show();
				//jfjb.jfjb_weibo_ppt();
				return false;
			})
			jfjb.index_show();
		},
		myscroll_list : function(){
			if(weixinscroll!=null)
			{
				weixinscroll.destroy();
			}
			weixinscroll = new IScroll('#weixin-bigimg', {mouseWheel: true});
				// myscroll.refresh();
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		//首页最新数据加载集合
		index_show : function(){
			jfjb.newspaper_show();
			jfjb.weixin_show();
			jfjb.weibo_show();
			//启动视频
			jfjb.video_index_show();
			jfjb.video_play();
		},
		index_update : function(){
			// 回到首页
			// jfjb.index_one();
			jfjb.newspaper_show();
			jfjb.weixin_show();
			jfjb.weibo_show();
			//启动视频
			jfjb.video_index_update();
			jfjb.video_play_update();
		},
/**************************************************************************************************************/
/*  10分钟定时刷新功能
***************************************************************************************************************/
		jfjb_clock : function(){
			//触发事件将时间重置10分钟
			$('body').click(function(){
				jfjb.time_number = jfjb.time_break;
			});
			$('.weibo-list').on('touchstart',function(){
				jfjb.jfjb_audioReset();
			});
			$('.opt-img').on('touchstart',function(){
				jfjb.jfjb_audioReset();
			});
			$('.video-ul').on('touchstart',function(){
				jfjb.jfjb_audioReset();
			});
			$('#jfjb-daynewspaper').on('touchstart',function(){
				jfjb.jfjb_audioReset();
			});
			$('#jfjb-oldnewspaper').on('touchstart',function(){
				jfjb.jfjb_audioReset();
			});
			//10分钟后刷新数据函数
			function clock(){
				//时间变量启动
		    	jfjb.time_number--;
				//console.log(jfjb.time_number);
				// 如果时间等于0的话将刷新首页数据，回到首页模块
				if(jfjb.time_number==0){
					clearInterval(clock);
					//时间重新设置10分钟
					jfjb.time_number = jfjb.time_break;
					
					//视频重新初始化
					jfjb.video_number = 0;
					var v_time = $('.video-ul li').eq(0).attr('title');
					$('.video-begin h3').text(v_time)
					$('#video-read')[0].pause();
					$('#video-index')[0].pause();

					//隐藏微博弹出层
					$('.weibo-popbox').hide();
            		//10分钟刷新军报微博文章、粉丝数
            		jfjb.weibo_sum();
            		//10分钟更新最火微博
            		//jfjb.weibohot_update();
					//10分钟后返回首页
					jfjb.index_one();
				}
			}
			function updateClock(){
				jfjb.weixin_delay_update();
				jfjb.weibo_delay_update();
				jfjb.video_delay_update();
				jfjb.newspaper_delay_update();
				clearInterval(updateClock);
			}
			setInterval(updateClock,120000)
			setInterval(clock,200)
		},

/**************************************************************************************************************/
/*  JSON数据更新延时加载微博、微信、报纸、视频数据，等待文件FTP同步
***************************************************************************************************************/
		//微信及时加载
		weixin_delay_update : function(){
			var weixin = $('#weixin-day li').eq(0).attr('name');
            $.ajax({  
                type: 'get',
                dataType: 'json',
                url: jfjb.weixin_url,
                success: function(json){
                    if(weixin!=json.code){
                    	jfjb.weixin_star();
                    	jfjb.weixin_show();
                    }else{
                    	return false
                    }
                },error: function(){} 
            })
		},
		//微博及时加载
		weibo_delay_update : function(){
        	var weibo = $('#weibo-list dt').eq(0).attr('name');
            $.ajax({  
                type: 'get',
                dataType: 'json',
                url: jfjb.weibo_url,
                success: function(json){
                    if(weibo!=json.code){
                    	jfjb.weibo_list();
                    	jfjb.weibo_show();
                    }else{
                    	return false
                    }
                },error: function(){} 
            })
		},
		//视频及时加载
		video_delay_update : function(){
			var vindex1 = $('#video-show1 video').attr('name')
        	$.ajax({  
                type: 'get',
                dataType: 'json',
                url: jfjb.video_url,
                success: function(json){
                    $.each(json.data, function(i, item) {
                    	if (i==0){
	                    	if(vindex1!=json.code){
			                    if($("#jfjb-index").is(":hidden"))
			                    {
									return false;
			                    }
			                    else
			                    {
			                    	location.reload(true);
			                    	return true;
			                    }
	                        	jfjb.video_list();
	                        	jfjb.video_index_update();
	                        	jfjb.video_play();
	                        }else{
	                        	return false
	                        }
	                        return false
	                    }
                    });
                },error: function(){} 
            })
		},
		//报纸及时加载
		newspaper_delay_update : function(){
			var paper = $('.jfjb-newspaper-show p').eq(0).attr('name');
            $.ajax({  
                type: 'get',
                dataType: 'json',
                url: jfjb.jfjb_url,
                success: function(json){
                    if(paper!=json.code){
                    	jfjb.newspaper_star();
                    	jfjb.newspaper_show();
                    }else{
                    	return false
                    }
                },error: function(){} 
            })
		},
/**************************************************************************************************************/
/*  点击后有响声，在将刷新时间重置关联处理函数
***************************************************************************************************************/
		jfjb_audioReset : function(){
			jfjb.time_number = jfjb.time_break;
			// $('audio')[0].play();
		},
/**************************************************************************************************************/
/*  初始化关联处理函数
***************************************************************************************************************/
		init : function(){
			jfjb.selectmodule();
			jfjb.weibo_star();
			jfjb.weixin_star();
			jfjb.video_list();
			jfjb.newspaper_star();
			jfjb.jfjb_host_scroll();
			jfjb.jfjb_clock();
		}
	};
	jfjb.init();
});