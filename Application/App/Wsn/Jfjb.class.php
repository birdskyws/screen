<?php
	namespace App\Wsn;

	class Jfjb {
		public $name="jfjb";
		public function __construct()
		{
			$cache = \App\Wsn\Path::cache();
			if(!is_dir($cache))mkdir($cache);
			$this->cache = $cache.DIRECTORY_SEPARATOR.$this->name;
			if(!is_dir($this->cache))mkdir($this->cache);
			$this->url = \App\Wsn\Path::url()."/".$this->name;
		}
		public function update()
		{
			function thumb($source,$desc,$width=200,$height=200){
			    //获取原图像$filename的宽度$width_orig和高度$height_orig
			    list($width_orig,$height_orig) = getimagesize($source);
			    //根据参数$width和$height值，换算出等比例缩放的高度和宽度
			    if ($width && ($width_orig<$height_orig)){
			        $width = ($height/$height_orig)*$width_orig;
			    }else{
			        $height = ($width / $width_orig)*$height_orig;
			    }
			
			    //将原图缩放到这个新创建的图片资源中
			    $image_p = imagecreatetruecolor($width, $height);
			    //获取原图的图像资源
			    $image = imagecreatefromjpeg($source);
			
			    //使用imagecopyresampled()函数进行缩放设置
			    imagecopyresampled($image_p,$image,0,0,0,0,$width,$height,$width_orig,$height_orig);
			
			    //将缩放后的图片$image_p保存，100(质量最佳，文件最大)
			    imagejpeg($image_p,$desc);
			
			    imagedestroy($image_p);
			    imagedestroy($image);
			}
			$jfjb =  M('Jfjb');			
			$apihost = C('API_HOST');
			$api = "http://".C('API_HOST')."/jfjb/App/bigscreen/jfjb";
			$ret = \App\Wsn\Http::request($api);
			if(!$ret)return;
			$array = json_decode($ret,true);
	
			foreach ($array as $a) {
				unset($data);
				$pubdate = $a['pubdate'];
				$result = $jfjb->where('pubdate="'.$pubdate.'"')->limit(1)->select();
				if($result)continue;
				//创建日期目录
				$dir = str_replace("-", "", $a['pubdate']);
				$url = $this->url."/".$dir;
				$fold = $this->cache.DIRECTORY_SEPARATOR.$dir;
				if(!is_dir($fold))mkdir($fold);
				
				unset($pics);
				for($i=1;$i<=$a['pagenum'];$i++)
				{
					
					$imgPath = $fold.DIRECTORY_SEPARATOR.$i.".jpg";
					$min     = $fold.DIRECTORY_SEPARATOR.$i."_min.jpg";
					$content = file_get_contents($a['pics'][$i-1]);
					file_put_contents($imgPath, $content);
					unset($content);
					$pics[] = $url."/".$i.".jpg";
					//缩小
					thumb($imgPath,$min,500,705);
				}

				$data['pubdate'] = $a['pubdate'];
				$data['pagenum'] = $a['pagenum'];
				$data['pics'] = json_encode($pics);
				$jfjb->data($data)->add();
			}
			echo "finished";
          	
		}
	}
?>