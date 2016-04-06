<?php
	namespace App\Wsn;
	class Download
	{
		public static function download($url,$des)
		{
			//echo "download";
			if(!is_dir(dirname($des)))mkdir(dirname($des),0777,true);
			// echo dirname($des);
			if(!file_exists($des) || filesize($des)==0)
			{
				
				for($i=0;$i<3;$i++)
				{
					$contents = file_get_contents($url);
					//echo strlen($contents);exit();
					if(strlen($contents)>0)
					{
						file_put_contents($des, $contents);
						return true;
					}
					usleep(2000); 
				}
				return false;
			}
			return true;
		}

		public static function downurl($url,$des)
		{
			ini_set('memory_limit', '80M');
			if(!is_dir(dirname($des)))mkdir(dirname($des),0777,true);
			for($i=0;$i<=3;$i++){

				$header_array = get_headers($url, true);
				$urlsize = intval($header_array['Content-Length']);
				if($urlsize!=0){
	                break;
				}
			}
			if($urlsize==0){
				return array("code"=>-1,"info"=>"下载失败");
	                
			}
			var_dump($urlsize);echo "<br>";
			import('ORG.Net.Http');
			for($i=0;$i<=3;$i++)
			{
				if(!file_exists($des) || filesize($des)!=$urlsize ||filesize($des)==0)
				{		
					//$str = \Org\Net\Http::curlDownload($url, array("timeout"=>480));
					//file_put_contents($des, $str);
					\Org\Net\Http::curlDownload($url, $des);
					usleep(20000);
				}
			}

			if(!file_exists($des) || filesize($des)!=$urlsize ||filesize($des)==0)
			{		
				echo $urlsize."<br>";
				echo filesize($des)."<br>";
				return array("code"=>-1,"info"=>"下载失败");
			}
			else
			{
				return array("code"=>0,"info"=>"下载成功");
			}
		}
	}
?>