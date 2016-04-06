<?php
namespace App\wsn;
class check{
    public $ret;
	public function __construct()
	{
		$this ->cache =\App\Wsn\Path::cache();
		$this ->publik =\App\Wsn\Path::publik();
        
        
	}
	public function delete(){
         $this ->weibo();
         $this ->jfjb();
         $this ->weixin();
         $this ->video();

	}
	public function video(){
		$json =$this ->getvideoJsonArray();
		$json_array =$this ->twotoone($json);
		$path_array =$this ->getarray($this ->cache."/video");
        $file_array =$this ->twotoone($path_array);
        foreach($file_array as &$arr){
            $arr =str_replace("\\", "/", $arr);
        }
        $diff_array =array_diff($file_array, $json_array);
        foreach($diff_array as $array){
            if((time()-filemtime($array))<24*60*60*10){
                continue;
            }
        	if(unlink($array)){
        		echo $array."文件删除成功";
        	}else{
        		echo $array."文件删除失败";

        	}
        }
		// echo "<pre>";
		// print_r($json_array);
		// print_r($file_array);
		// print_r($diff_array);

		// echo "</pre>";
	}
    public function weixin(){
        $json =$this ->getweixinJsonArray();
        $json_array =$this ->twotoone($json);
        $path_array =$this ->getarray($this ->cache."/weixin");
        $file_array =$this ->twotoone($path_array);
        foreach($file_array as &$arr){
            $arr =str_replace("\\", "/", $arr);
        }
        $diff_array =array_diff($file_array, $json_array);
        foreach($diff_array as $array){
            if((time()-filemtime($array))<24*60*60*10){
                continue;
            }
            if(unlink($array)){
                echo $array."文件删除成功";
            }else{
                echo $array."文件删除失败";

            }
        }
        // echo "<pre>";
        // print_r($json_array);
        // print_r($file_array);
        // print_r($diff_array);

        // echo "</pre>";
    }
	public function getweixinJsonArray(){
        
        
        $jfjb_json =$this ->cache."/zson/weixin.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        foreach ($content as &$r) {
            unset($r['dotime']);
            unset($r['content']);
            unset($r['md']);
            unset($r['url']);
            unset($r['title']);
            unset($r['pubdate']);
            $name =$r['screen'];
            unset($r['screen']);
            if(isset($r['id'])){
                unset($r['id']);
            }
           
            
            $r[] ="D:/xampp/htdocs/jfjb/Public/cache/weixin/".$name.".jpg";
        }
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
		
		return $content;

    }
    public function weibo(){
        $json =$this ->getweiboJsonArray();
        $json_array =$this ->twotoone($json);
        $path_array =$this ->getarray($this ->cache."/weibo");
        $file_array =$this ->twotoone($path_array);
        foreach($file_array as &$arr){
            $arr =str_replace("\\", "/", $arr);
        }
        $diff_array =array_diff($file_array, $json_array);
        foreach($diff_array as $array){
            if((time()-filemtime($array))<24*60*60*10){
                continue;
            }
            if(unlink($array)){
                echo $array."文件删除成功";
            }else{
                echo $array."文件删除失败";

            }
        }
        // echo "<pre>";
        // print_r($json_array);
        // print_r($file_array);
        // print_r($diff_array);

        // echo "</pre>";
    }
	public function getweiboJsonArray(){
        
        
        $jfjb_json =$this ->cache."/zson/weibo.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        foreach ($content as &$r) {
            unset($r['dotime']);
            unset($r['id']);
            unset($r['sinaid']);
            unset($r['text']);
            unset($r['title']);
            unset($r['repost']);
            unset($r['comment']);
            unset($r['likes']);

            $r['pics'] =json_decode($r['pics'],true);
            $date =substr($r['pubtime'], 0,10);
            unset($r['pubtime']);
            $date =str_replace("-", "", $date);
            foreach($r['pics'] as &$pics){
                $normal ="D:/xampp/htdocs/jfjb/Public/cache/weibo/big/".$date."/".$pics;
                $min ="D:/xampp/htdocs/jfjb/Public/cache/weibo/min/".$date."/".$pics;
                
                
                $pics =array($normal,$min);
            }
            
            
        }
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
		
		return $content;

	}
    public function jfjb(){
        $json =$this ->getJfjbJsonArray();
        $json_array =$this ->twotoone($json);
        $path_array =$this ->getarray($this ->cache."/jfjb");
        $file_array =$this ->twotoone($path_array);
        foreach($file_array as &$arr){
            $arr =str_replace("\\", "/", $arr);
        }
        $diff_array =array_diff($file_array, $json_array);
        foreach($diff_array as $array){
            if((time()-filemtime($array))<24*60*60*10){
                continue;
            }
            if(unlink($array)){
                echo $array."文件删除成功";
            }else{
                echo $array."文件删除失败";

            }
        }
        

    }
    public function getJfjbJsonArray(){
        $path =$this ->cache."/zson/jfjb.json";
        $content =file_get_contents($path);
        $content =json_decode($content,true);
        $content =$content["data"];
        $path =array();
        foreach($content as &$con){
            $con['pics'] =json_decode($con['pics'],true);
            $min =array();
            foreach($con['pics'] as &$pics){
                $pics =str_replace("http://screen.jfjb.com.cn/jfjb/public/cache1", "D:/xampp/htdocs/jfjb/Public/cache", $pics);
                $min[] =str_replace(".", "_sm.", $pics);
                
            }
            $con['pics'] =array_merge($con['pics'],$min);
            $path[] =$con['pics'];
        }
        return $path;

    }
    public function getvideoJsonArray(){
        $path =$this ->cache."/zson/video.json";
        $content =file_get_contents($path);
        $content =json_decode($content,true);
        $content =$content["data"];
        foreach ($content as &$r) {
            unset($r['dotime']);
            unset($r['id']);
            unset($r['pagenum']);
            unset($r['url']);
            unset($r['pics']);
            unset($r['md']);

            $date =str_replace("-", "", $r['pubdate']);
            unset($r['pubdate']);
           
            $r[] ="D:/xampp/htdocs/jfjb/Public/cache/video/".$date."/1.mp4";
            $r[] ="D:/xampp/htdocs/jfjb/Public/cache/video/".$date."/1.jpg";
        }
        
        return $content;

    }
    //二维数组转换成一维数组
	public function twotoone($array){
		$a =array();
        foreach($array as $arr){
        	if(is_array($arr)){
                 $new_arr =$this ->twotoone($arr);
                 $a =array_merge($a,$new_arr);
        	}else{
        		$a[] =$arr;
        	}
        }
        return $a;
	}
	//获取文件夹中文件目录数组
	public function  getarray($path){
	    $handler=opendir($path); //打开当前文件夹由$path指定。
	    $file_path =array();
	    while(($filename=readdir($handler))!==false){
	        if(substr($filename,0,1)!="."){ 
	            if(is_dir($path."/".$filename)){// 如果读取的某个对象是文件夹，则递归
	                
	                $file_path[] =$this ->getarray($path."/".$filename);
	            }else{ 
	                $name_s = $path."/".$filename;
	                $file_path[] =$name_s;
	                
	            }
	        }
	    }
	    @closedir($path);
	    return $file_path;

	}
    public function  getarray2($path,&$ret){
        
        $handler=opendir($path); //打开当前文件夹由$path指定。
        $file_path =array();
        while(($filename=readdir($handler))!==false){
            if(substr($filename,0,1)!="."){ 
                if(is_dir($path."/".$filename)){// 如果读取的某个对象是文件夹，则递归
                    
                    $this ->getarray2($path."/".$filename,$ret);
                }else{ 
                    $name_s = $path."/".$filename;
                    $ret[] =$name_s;

                    
                }
            }
        }
        @closedir($path);
        return $file_path;

    }
    public function db()
    {
        $ret = array();
        $path = "d:\\xampp\\htdocs\\jfjb\\Public\\cache";
        $this->getarray2($path,$ret);
        echo "<pre>";
        print_r($ret);
        echo "</pre>";
    }
	
}