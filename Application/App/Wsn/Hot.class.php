<?php
namespace App\Wsn;
	class Hot{
		public $name="hot";
		public $code ="hotcode";
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
			
			
			file_put_contents($this->cache_json_path, $ret);
			return  array('code' =>0,'info'=>'成功');
		}
		public function checkCode(){

			$ret = \App\Wsn\Http::request($this->codeApi);
			if(!$ret){return array('code' =>-1,"info"=>"error");}

			if(file_exists($this ->cache_json_path)){

				$content_json =file_get_contents($this ->cache_json_path);
				$content_array =json_decode($content_json,true);
				// echo "<pre>";
				// print_r($content_array['code']);
				// echo $ret;
				// echo "</pre>";
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