<?php
namespace App\Wsn;
/*
打包app目录，生成zip文件。
同步zip文件，覆盖发布目录。
按时间增量（2天内发生修改的文件）打包
by 王森 20151009
*/

class deletezip{
    
	public function __construct()
	{
		$this ->cache =\App\Wsn\Path::cache();
		$this ->publik =\App\Wsn\Path::publik();
        $this ->h_php ="E:";
        
        
	}
	
	function  movefold($path){
	    $handler=opendir($path); //打开当前文件夹由$path指定。
	    while(($filename=readdir($handler))!==false){
	        if(substr($filename,0,1)!="."){ 
	            $year =substr($filename,0,4);
	            $month =substr($filename,4,2);
	            $day =substr($filename,6,2);
	            $date =$year."/".$month."/".$day;
	            $two_days_ago =date("Y/m/d",strtotime("-2 day"));
	            if($date<$two_days_ago){
	            	\App\Wsn\Delete::delfile($path."/".$filename);
	            	echo "删除成功";
	            }
	            

	        }
	    }
	    @closedir($path);
	}
	
   function getzip(){
        
        $zip_path =$this ->h_php."/oldzip";
        if(file_exists($zip_path)){
        	$this ->movefold($zip_path);
        }
    } 
}

?>
