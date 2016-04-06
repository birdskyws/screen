<?php
namespace App\Wsn;
/*
解压app.zip到指定目录
*/
// require_once('Delete.php');
class app{
    
	public function __construct()
	{
		$this ->cache =\App\Wsn\Path::cache();
		$this ->publik =\App\Wsn\Path::publik();
        // $this ->h_php ="E:";
        
	}
	
	function  unzip($zipfile,$appDes)
	{
		is_dir($appDes)?null:mkdir($appDes,"0777",true);
		$zip=new \ZipArchive();
		$tmp    = dirname($zipfile)."/tmp";
		if(!is_dir($zip))mkdir($zip,0777,true);
		//解压临时文件夹
		if($zip->open($zipfile)===TRUE){
			$zip->extractTo($tmp);
			$zip->close();
			if($this ->movefold($tmp,$tmp,$appDes)){
				\App\Wsn\Delete::deldir($tmp);	
				return true;
			}else{
				\App\Wsn\Delete::deldir($tmp);	
				
				return false;
			}
		}else {
			return true;
		}
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
	                if(!rename($name_s, $name_d))//移动覆盖文件
	                {
	                	return false;
	                }
	            }
	        }
	    }
	    @closedir($path);
	    return true;
	}
	
   function getappzip(){
        
        $app_path =$this ->h_php."/app.zip";
        $old_app =$this ->h_php."/oldapp";
        $code_path ="http://screen.jfjb.com.cn/jfjb/Public/zip2/app/app.json";
        $zip_path ="http://screen.jfjb.com.cn/jfjb/Public/zip2/app/app.zip";

        $code =file_get_contents($code_path);
        $local_code_path =$this ->publik."\\zip\\app";
        if(!is_dir($local_code_path))mkdir($local_code_path,0777,true);
        if(!is_file($local_code_path."/app.json")){
            file_put_contents($local_code_path."/app.json", $code);
        }else{
        	$local_code =file_get_contents($local_code_path."/app.json");
        	if($local_code>=$code){
        		return array('code'=>0,'info'=>'app是最新的');
        	}
        }
        for($i=0;$i<3;$i++){

	        $content =file_get_contents($zip_path);
	        if(strlen($content) ==0){
	        	usleep(2000);
                continue;
	        }else{

		        file_put_contents($local_code_path."/app.zip", $content);
		        break;
	        }
        }
        if(file_exists($local_code_path."/app.zip")){
        	if($this ->unzip($local_code_path."/app.zip",$this ->publik."/app")){
        		file_put_contents($local_code_path."/app.json", $code);
        		return array('code'=>0,'info'=>'app更新成功');
        	}else{
        	    unlink($local_code_path."/app.json");

        		return array('code'=>-1,'info'=>'app更新失败');
        	}
        }else{
        	unlink($local_code_path."/app.json");
            return array('code'=>-1,'info'=>'zip包下载失败');    
        }
    } 
}

?>
