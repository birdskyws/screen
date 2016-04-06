<?php
	namespace App\Wsn;
	class Tj {
		public $name="tj";
		
		public function __construct()
		{
			$this ->cache = \App\Wsn\Path::cache();
			if(!is_dir($this ->cache))mkdir($this ->cache);
			$this ->fold = $this ->cache.DIRECTORY_SEPARATOR.$this->name;
			if(!is_dir($this ->fold))mkdir($this ->fold);
			$apihost = C('API_HOST');
			
			$this ->ap ="http://".$apihost;
		}

		public function update()
		{
			 
	        $url =$this ->ap."/jfjb/Public/cache1/tj/tj.jpg?t=".time();
	        // echo $url."<br>";
	        $tjPath = $this ->fold.DIRECTORY_SEPARATOR."tj.jpg";
	        // echo $tjPath."<br>";
	        $content = file_get_contents($url);
	        if(strlen($content)>0)
	        {
	            if(file_put_contents($tjPath, $content)){
	            	echo "success";
	            }else{
	            	echo "error";
	            }
	        }  
		}
		
	} 
?>