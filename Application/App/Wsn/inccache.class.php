<?php
namespace App\Wsn;
/*
解压app.zip到指定目录
*/
// require_once('Delete.php');
class inccache{
    
	public function __construct()
	{
		$this ->cache =\App\Wsn\Path::cache();
		$this ->publik =\App\Wsn\Path::publik();
        $this ->h_php ="E:";
        $this ->oldzip =$this ->h_php."/oldzip";
        if(!is_dir($this ->oldzip))mkdir($this ->oldzip);
        
	}
	
	function  unzip($zipfile,$appDes)
	{
		is_dir($appDes)?null:mkdir($appDes,"0777",true);
		$zip=new \ZipArchive();
		$tmp    = dirname($zipfile)."/tmp";
		if(!is_dir($tmp))mkdir($tmp,0777,true);
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
			return false;
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
	                if(!rename($name_s, $name_d)){
	                	return false;
	                }
	            }
	        }
	    }
	    @closedir($path);
	    return true;

	}
	function  toarray($path){
	    $handler=opendir($path); //打开当前文件夹由$path指定。
	    $file_array =array();
	    while(($filename=readdir($handler))!==false){
	        if(substr($filename,0,1)!="."){ 
	            
	                // $file_path =$path."/".$filename;
	                // $file_array[] =filemtime($file_path);
	        	$file_array[] =$path."/".$filename;
	                
	            
	        }
	    }
	    @closedir($path);
	    return $file_array;
	}
	function  ziptofile($path,$zip_array){
	    foreach($zip_array as $zip_path){
        	
      //       $handler=opendir($path); //打开当前文件夹由$path指定。
		    // $file_array =array();
		    // while(($filename=readdir($handler))!==false){
		    //     if(substr($filename,0,1)!="."){ 
		            
		    //             $file_path =$path."/".$filename;
		    //             if(filemtime($file_path)==$time){
                            
      //                       $this ->unzip($file_path,$this ->cache);
                            
      //                       $content =file_get_contents($file_path);
      //                       if(file_put_contents($this ->oldzip."/".$filename, $content)){

	     //                        \App\Wsn\Delete::delfile($file_path);
      //                       }
      //                       echo $file_path ."<br>";
		    //             }
		                
		            
		    //     }
		    // }
            if($this ->unzip($zip_path,$this ->cache)){
	             \App\Wsn\Delete::delfile($zip_path);
			    return true;
            }else{

            	return false;
            }
        }
	}
   function getappzip(){
   	    
        $zip_path =$this ->h_php."/zip";
        if(!is_dir($zip_path)){
        	return array('code'=>0,'info'=>'没有需要解压的zip包');

        }
        $file_array =$this ->toarray($zip_path);
        if(empty($file_array)){return;}
        asort($file_array);
       	echo "<pre>";print_r($file_array);echo "</pre>";
        if($this ->ziptofile($zip_path,$file_array)){
        	
        	return array('code'=>0,'info'=>'zip包解压成功');
        }   else{
        	return array('code'=>-1,'info'=>'zip包解压失败');

        }
        
    } 
}

?>
