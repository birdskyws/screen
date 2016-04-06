<?php
namespace App\Wsn;
class Delete{
    public static function deldir($dir) {
			  //先删除目录下的文件：
	    if(is_dir($dir)){

		    $dh=opendir($dir);
		    while ($file=readdir($dh)) {
			    if($file!="." && $file!="..") {
			        $fullpath=$dir."/".$file;
			        if(!is_dir($fullpath)) {
			            unlink($fullpath);
			         } else {
			             Delete::deldir($fullpath);
			         }
			    }
		    }
		 
			closedir($dh);
			//删除当前文件夹：
			if(rmdir($dir)) {
			    return true;
			} else {
			    return false;
			}
		}else{
			return true;
		}
	}
	public static function delfile($file){
		if(file_exists($file)){
			if(unlink($file)){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
}