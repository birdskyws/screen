<?php
	namespace App\Wsn;

	class Weixin {

		public $name="weixin";
		public $code ="weixincode";
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
		public function update()
		{
			
			set_time_limit(0);
			//code获取地址
			
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
            
	
			foreach ($arr as $w) {
				    //微信图片的保存地址
					$picPath = $this ->fold."\\".$w['screen'].'.jpg';
					//中心服务器上微信图片的地址
				    $jpgUrl =$this ->ap."/jfjb/Public/cache1/weixin/".$w['screen'].".jpg";


					//如果图片下载成功
					if($this ->download($jpgUrl,$picPath,$w['md'])){
						$new_json['data'][] =$w;

						
					}else{
						$new_json['code']--;
					}
					
				
			}
			
			file_put_contents($this->cache_json_path, json_encode($new_json));
			$check =new \App\Wsn\check;
			$check ->weixin();
			return  array('code' =>0,'info'=>'成功');
		}
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
		public  function download($url,$des,$md)
		{

			if(!is_dir(dirname($des)))
			{
				mkdir(dirname($des));
			}
			if(!file_exists($des) || md5_file($des)!=$md)
			{
				for($i=0;$i<3;$i++)
				{
					$contents = file_get_contents($url);
					
					if(strlen($contents)>0)
					{
						file_put_contents($des, $contents);
						
						if(md5_file($des)==$md){
							
							return true;
								
							
						}
					}
					usleep(2000); 
				}
				
				return false;
			}else{
                
				return true;
			}
		}
	}
?>
