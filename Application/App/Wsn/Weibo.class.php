<?php
	namespace App\Wsn;

	class Weibo {
		public $name="weibo";
		public $code ="weibocode";
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
 				$pics =json_decode($w['pics'],true);
 				$date =str_replace("-", "", substr($w['pubtime'], 0,10));
 				
				foreach ($pics as $p) {
					$normal_source = $this ->ap."/jfjb/Public/cache1/weibo/big/".$date."/".$p;
					$min_source = $this ->ap."/jfjb/Public/cache1/weibo/min/".$date."/".$p;
					
					$normal_desc = $this ->fold.DIRECTORY_SEPARATOR."big".DIRECTORY_SEPARATOR.$date.DIRECTORY_SEPARATOR.$p;
					$min_desc = $this ->fold.DIRECTORY_SEPARATOR."min".DIRECTORY_SEPARATOR.$date.DIRECTORY_SEPARATOR.$p;
       				if(!is_dir(dirname($min_desc)))mkdir(dirname($min_desc));
       				if(!is_dir(dirname($normal_desc)))mkdir(dirname($normal_desc));
                    if(!file_exists($normal_desc)){
                        $ret=\App\Wsn\Download::downurl($normal_source,$normal_desc);
						if($ret['code']!=0){
							$new_json['code']--;
	                        continue 2;
						}
                    }
					if(!file_exists($min_desc)){
                        $ret=\App\Wsn\Download::downurl($min_source,$min_desc);
						if($ret['code']!=0){
							$new_json['code']--;
	                        continue 2;
						}
                    }
				}
				$new_json['data'][] =$w;
			}
			// echo "<pre>";
			// print_r($new_json);
			// echo "</pre>";
			
			file_put_contents($this->cache_json_path, json_encode($new_json));
			$check =new \App\Wsn\check;
			$check ->weibo();
			return  array('code' =>0,'info'=>'成功');
		}
		public function checkCode(){

			$ret = \App\Wsn\Http::request($this->codeApi);
			if(!$ret){return array('code' =>-1,"info"=>"error");}
			
			if(file_exists($this ->cache_json_path)){

				$content_json =file_get_contents($this ->cache_json_path);
				$content_array =json_decode($content_json,true);
                // echo $ret;
                // echo "<br>";
                // echo $content_array['code'];
                // exit;
				if($ret ==$content_array['code']){
					return array('code' =>-1,'info' =>'不用更新');
				}else{
					return array('code'=>0,'info'=>$ret);
				}
			}else{
				return array('code'=>0,'info'=>$ret);
			}
		}
	}
?>