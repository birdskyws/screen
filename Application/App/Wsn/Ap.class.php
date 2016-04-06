<?php
namespace App\Wsn;
/*
解压app.zip到指定目录
*/
// require_once('Delete.php');
class Ap{
    
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
        
        // $app_path =$this ->h_php."/app.zip";
        // $old_app =$this ->h_php."/oldapp";
        $code_path ="http://screen.jfjb.com.cn/jfjb/Public/zip2/Ap/Ap.json";
        $ds_path ="http://screen.jfjb.com.cn/jfjb/Public/zip2/Ap/Ap.ds";

        $code =file_get_contents($code_path);
        echo $code."<br>";
        $local_code_path =$this ->publik."\\zip\\Ap";
        if(!is_dir($local_code_path))mkdir($local_code_path,0777,true);
        if(!is_file($local_code_path."/Ap.json")){
            file_put_contents($local_code_path."/Ap.json", $code);
        }else{
        	$local_code =file_get_contents($local_code_path."/Ap.json");
        	echo $local_code;
        	if($local_code>=$code){
        		return array('code'=>0,'info'=>'Ap是最新的');
        	}
        }
        for($i=0;$i<3;$i++){

	        $content =file_get_contents($ds_path);
	        echo strlen($content);
	        if(strlen($content)==0){
	        	
                continue;
	        }else{
                
		        file_put_contents($local_code_path."/Ap.ds", $content);
		        break;
	        }
        }
        if(file_exists($local_code_path."/Ap.ds")){
            $ret =$this ->ddes($local_code_path."/Ap.ds",$local_code_path."/Ap.zip");
            if($ret['code']==0){
                $App_path =str_replace("\\Public", "", $this ->publik);
			   	$App_path =$App_path."\\Application\\App";
			   	if(!is_dir($App_path))mkdir($App_path,0777,true);
	        	if($this ->unzip($local_code_path."/Ap.zip",$App_path)){
		            file_put_contents($local_code_path."/Ap.json", $code);
	        		
	        		return array('code'=>0,'info'=>'Ap更新成功');
	        	}else{
		        	unlink($local_code_path."/app.json");

	        		return array('code'=>-1,'info'=>'Ap更新失败');
	        	}
            }else{
        	    unlink($local_code_path."/app.json");

            	return array('code'=>-1,'info'=>$ret['info']);
            }
        }else{
        	unlink($local_code_path."/app.json");

            return array('code'=>-1,'info'=>'zip包下载失败');    
        }
    }
    //zip包解密
     public function ddes($ds,$src)
    {   
    	
        //口令
        $key = "jfjbjfjb";
        
        //解密
        if(file_put_contents($src, \Think\Crypt\Driver\Des::decrypt(file_get_contents($ds),$key))){
        	return array('code'=>0,'info'=>'解密成功');
        }else{
        	return array('code'=>-1,'info'=>'解密失败');
        }
        
    }
}

?>
