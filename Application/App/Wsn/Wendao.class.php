<?php
	namespace App\Wsn;

	class Wendao {
		public $name="jfjb";
		public $code ="jfjbcode";

		public function __construct()
		{
			$this ->cache = \App\Wsn\Path::cache();
			if(!is_dir($this ->cache))mkdir($this ->cache);
			$this ->fold = $this ->cache.DIRECTORY_SEPARATOR.$this->name;
			if(!is_dir($this ->fold))mkdir($this ->fold);
			$this->url = \App\Wsn\Path::url()."/".$this->name;
			$apihost = C('API_HOST');
			$this->codeApi = "http://".$apihost."/jfjb/Home/json/".$this->code;
			$this->api ="http://".$apihost."/jfjb/Home/json/".$this->name;
			$this->cache_json_path =$this ->cache."/zson/".$this ->name.".json";
			if(!is_dir($this ->cache."/zson/"))mkdir($this ->cache."/zson/",0777,true);
			
			$this ->ap ="http://".$apihost;
		}
		//更新函数
		public function update()
		{
			set_time_limit(0);
			$ret =$this ->checkCode();
			if($ret['code']==-1){
				return array('code'=>-1,"info" =>$ret['info']);
			}
				$new_json =array();
				$new_json['code'] =$ret['info'];
			

			
			$ret =\App\Wsn\Http::request($this->api);
			if(!$ret) return array('code'=>-1,"info" =>'api没有值');
			$array = json_decode($ret,true);
			$arr =$array['data'];
			
			
			foreach($arr as $a){
				$pics =json_decode($a['pics'],true);
				$mds = json_decode($a['md'],true);
				//foreach($pics as $p){
				for($i= 0 ;$i<count($pics);$i++){
					$p= $pics[$i];
					$md= $mds[$i];	
					$picPath =str_replace($this ->ap, "D:/xampp/htdocs", $p);
					$picPath =str_replace("cache1", "cache", $picPath);
				    
					
					if(!($this->download($p,$picPath,$md))){
						$new_json['code']--;
						continue 2;
					}
					

				}
				$new_json['data'][] =$a;
			}
			file_put_contents($this->cache_json_path, json_encode($new_json));
			$check =new \App\Wsn\check;
			$check ->jfjb();
			return  array('code' =>0,'info'=>'成功');
		}
		//验证code函数
		public function checkCode(){

			$ret = \App\Wsn\Http::request($this->codeApi);
			if(!$ret){return array('code' =>-1,"info"=>"error");}
			
			if(file_exists($this ->cache_json_path)){

				$content_json =file_get_contents($this ->cache_json_path);
				$content_array =json_decode($content_json,true);
				
				if($ret ==$content_array['code']){
					return array('code' =>-1,'info' =>'不用更新');
				}else{
					return array('code'=>0,'info'=>$ret);
				}
			}else{
				return array('code'=>0,'info'=>$ret);
			}
		}
		//下载文件函数
		public  function download($url,$des,$md)
		{

			if(!is_dir(dirname($des)))mkdir(dirname($des));
			if(!file_exists($des) || md5_file($des)!=$md)
			{
				for($i=0;$i<3;$i++)
				{
					$contents = file_get_contents($url);
					
					if(strlen($contents)>0)
					{
						file_put_contents($des, $contents);
						if(md5_file($des)==$md){
							$desMin =str_replace(".jpg", "_sm.jpg", $des);
							if($this ->thumb($des,$desMin)){
								return array("code"=>0,$info=>"下载成功");
								
							}
						}
					}
					usleep(2000); 
				}
				return false;
			}
			return true;
		}
		// 修改图片大小
        public function thumb($source,$desc,$width=428,$height=705){
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
	}
?>