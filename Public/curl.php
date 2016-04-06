<?php
	class getinfo{
		public $name="curl";
		public function __construct()
			{
				//$this ->cache = \App\Wsn\Path::cache();
				$this->cache=  "d:/xampp/htdocs/jfjb/Public/cache";
				if(!is_dir($this ->cache))mkdir($this ->cache);
				$this ->fold = $this ->cache.DIRECTORY_SEPARATOR.$this->name;
				if(!is_dir($this ->fold))mkdir($this ->fold);
				
			}
		public function allinfo(){
			$info =array();
			$path =$this->getscreenimg();
			$ret =$this ->getmemoryinfo();
			$info['innerip'] =$this ->getinnerip();
			$info['outerip'] =$this ->getouterip();
			$info['memory'] =$ret['memory'];
			$info['productid'] =$ret['productid'];
			$info['process'] =$this ->getprocessarray();
			$info['screenimg'] =$path;
			$info['weixininfo'] =$this ->weixininfo();
			$info['weiboinfo'] =$this ->weiboinfo();
			$info['jfjbinfo'] =$this ->jfjbinfo();
			$info['videoinfo'] =$this ->videoinfo();

	        return $info;

		}
	    public function getinnerip(){
			$host= gethostname();
			$ip = gethostbyname($host);
			// echo "内部ip:".$ip;
	  //   	echo "<br>";
			return $ip;
	    }
	    public function getouterip(){
			$ex_ip = file_get_contents("http://ipecho.net/plain");
			// echo "外部ip：".$ex_ip;
			// echo "<br>";
			return $ex_ip;
	    	
	    }
	    public function getmemoryinfo(){
			exec('systeminfo', $output);

			//内存使用率
			$ret =array();
			foreach ($output as $key => $value) {
				
			    $value=iconv("GBK", "UTF-8",$value);
	            
				if (strstr($value, "Available Physical Memory")) {
					$ret['memory']= trim(substr($value, strrpos($value, ":")+1));
					// return $value;
				}
				if (strstr($value, "可用的物理内存")) {
					$ret['memory']= trim(substr($value, strrpos($value, ":")+1));
					// return $value;
				}
				if (strstr($value, "Product ID")) {
					$ret['productid']= trim(substr($value, strrpos($value, ":")+1));
					// return $value;
				}
				if (strstr($value, "产品 ID")) {
					$ret['productid']= trim(substr($value, strrpos($value, ":")+1));
					// return $value;
				}

			}
			return $ret;
	    }
	   
	   
	    public function getprocessarray(){
			//获得进程列表，代表cpu使用率
			exec("wmic process list brief",$process);
			if(!is_null($process)){

				return $process;
			}
	    	
	    }
	    public function getscreenimg(){
			//系统截屏
			$fold =$this ->fold.DIRECTORY_SEPARATOR.date("Ymd");
			if(!is_dir($fold))mkdir($fold,0777,true);
			$picname =date("His");
			$path =$fold."/".$picname.".jpg";
			$im = imagegrabscreen();
			imagejpeg($im, $path);
			if($this ->thumb($path,$path)){

		    	return $path;
			}else{
				return false;
			}
	    }
	    public function thumb($source,$desc,$width=200,$height=150){
	       //获取原图像$filename的宽度$width_orig和高度$height_orig
	        list($width_orig,$height_orig) = getimagesize($source);
		    //根据参数$width和$height值，换算出等比例缩放的高度和宽度
		    if ($width && ($width_orig<$height_orig)){
		        $width = ($height/$height_orig)*$width_orig;
		    }else{
		        $height = ($width / $width_orig)*$height_orig;
		    }
			// echo $width."<br>";
			// echo $height."<br>";
			//exit();
		    //将原图缩放到这个新创建的图片资源中
		    $image_p = imagecreatetruecolor($width, $height);
		    
		    //获取原图的图像资源
		    $image = imagecreatefromjpeg($source);
		   
	        
		    //使用imagecopyresampled()函数进行缩放设置
		    imagecopyresampled($image_p,$image,0,0,0,0,$width,$height,$width_orig,$height_orig);
		    

		    //将缩放后的图片$image_p保存，100(质量最佳，文件最大)
		    $return_var =imagejpeg($image_p,$desc,100);
		    

		    unset($image_p);
		    unset($image);
		    if($return_var){
		    	imagedestroy($image_p);
		        imagedestroy($image);
		    return true; 
		    }else{
		    	return false;
		    }
	    }
	    public function weixininfo(){
	    	$path =$this->cache."/zson/weixin.json";
	        $content =file_get_contents($path);
	        
	        $json_arr =json_decode($content,true);
	        $last_time =$json_arr['data'][0]['pubdate'];
	        return $last_time;
	    }
	    public function weiboinfo(){
	    	$path =$this->cache."/zson/weibo.json";
	        $content =file_get_contents($path);
	        // echo "<pre>";
	        $json_arr =json_decode($content,true);
	        // print_r($json_arr);
	        // echo "</pre>";
	        $last_time =$json_arr['data'][0]['pubtime'];
	        return $last_time;
	    }
	    public function jfjbinfo(){
	    	$path =$this->cache."/zson/jfjb.json";
	        $content =file_get_contents($path);
	        // echo "<pre>";
	        $json_arr =json_decode($content,true);
	        // print_r($json_arr);
	        // echo "</pre>";
	        // exit;
	        $last_time =$json_arr['data'][0]['pubdate'];
	        return $last_time;
	    }
	    public function videoinfo(){
	    	$path =$this->cache."/zson/video.json";
	        $content =file_get_contents($path);
	        // echo "<pre>";
	        $json_arr =json_decode($content,true);
	        // print_r($json_arr);
	        // echo "</pre>";
	        // exit;
	        $last_time =$json_arr['data'][0]['pubdate'];
	        return $last_time;
	    }
	}
	class curl{
	    public function curlpost($data){

			$uri = "http://screen.jfjb.com.cn/jfjb/admin/list/curl";

			// post参数数组

			
			$filename=substr($data['screenimg'], strrpos( $data['screenimg'],"/")+1);
			
	        $cfile = curl_file_create($data['screenimg'],'image/jpeg',$filename);
	        
			$post_data = array('pic' => $cfile,'data' =>json_encode($data));
			// $post_data =array_merge($post_data,$data);
			// echo "<pre>";
			// print_r($post_data);
			// echo "</pre>";
			// exit;
			//初始化 
			$ch = curl_init ();

			//各种项设置，网上参考而来，可以查看php手册，自己设置
			curl_setopt ( $ch, CURLOPT_URL, $uri );
			curl_setopt ( $ch, CURLOPT_POST, 1 );//post方式
			curl_setopt ( $ch, CURLOPT_HEADER, 0 );
			curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 0 );
			curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );

			//执行
			$return = curl_exec ( $ch );

			//容错机制
			if($return === false){
				var_dump(curl_error($ch));
			}

			//curl_getinfo()获取各种运行中信息，便于调试	
			$info = curl_getinfo($ch);

			//释放
			curl_close ( $ch );
			 
			$info= "执行时间".$info['total_time'].PHP_EOL;
			return array('code'=>0,'info'=>$info);
			
	    }	
	}
	ini_set('date.timezone','Asia/Shanghai');
	$getinfo = new getinfo();
	$data = $getinfo->allinfo();
	$curl =new curl();
	$info = $curl ->curlpost($data);
	echo "<pre>";print_r($info);echo "</pre>";
	// d:/xampp/php/php.exe d:/xampp/htdocs/jfjb/Public/curl.php
?>