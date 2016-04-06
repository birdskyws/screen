<?php
namespace App\Wsn;
/*
解压app.zip到指定目录
*/
// require_once('Delete.php');
class cache{
    
	public function __construct()
	{
		$this ->cache =\App\Wsn\Path::cache();
		$this ->publik =\App\Wsn\Path::publik();
        $this ->h_php ="E:";
        
	}
	
	function  unzip($zipfile,$appDes)
	{
		is_dir($appDes)?null:mkdir($appDes,"0777",true);
		$zip=new \ZipArchive();
		$tmp    = dirname(__FILE__)."/tmp";
		//解压临时文件夹
		if($zip->open($zipfile)===TRUE){
			$zip->extractTo($tmp);
			$zip->close();
			$this ->movefold($tmp,$tmp,$appDes);
		}else {
			echo "unzip error";
		}
		 \App\Wsn\Delete::deldir($tmp);	
	}
	function  movefold($path,$s,$d){
	    $handler=opendir($path); //打开当前文件夹由$path指定。
	    while(($filename=readdir($handler))!==false){
	        if(substr($filename,0,1)!="."){ 
	            if(is_dir($path."/".$filename)){// 如果读取的某个对象是文件夹，则递归
	                $fold_s = $path."/".$filename;
	                $fold_d = str_replace($s, $d, $fold_s);
	                is_dir($fold_d)?null:mkdir($fold_d);
	                $this ->movefold($path."/".$filename,$s,$d);
	            }else{ 
	                $name_s = $path."/".$filename;
	                $name_d = str_replace($s, $d, $name_s);
	                // echo $name_d."<br>";
	                rename($name_s, $name_d);//移动覆盖文件
	            }
	        }
	    }
	    @closedir($path);
	}
	
	
   function getappzip(){
        $cache_path =$this ->cache;
        $cache_zip =$this ->h_php."/cache.zip";
        if(!is_file($cache_zip)){return;}
        $old_cache =$this ->h_php."/oldcache";
        
        if(file_exists($cache_zip)){

            $this ->unzip($cache_zip,$cache_path);
            if(!is_dir($old_cache)){
            	mkdir($old_cache);
            }
            rename($cache_zip,$old_cache."/cache.zip");
        }
    } 
}

?>
