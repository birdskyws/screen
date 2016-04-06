<?php
	$cache ="d:/xampp/htdocs/jfjb/public/cache";
	$jfjb_json =$cache."/zson/jfjb.json";
	$cont =file_get_contents($jfjb_json);
	$cont =json_decode($cont,true);
	$content =$cont['data'];
	$code =$cont['code'];

	foreach($content as &$con){
	    $con['pics'] =json_decode($con['pics'],true);
	    $con['pics'] =str_replace("cache1", "cache", $con['pics']);
	    
	    foreach($con['pics'] as &$pics){
	        $pics =str_replace("http://screen.jfjb.com.cn/jfjb/public/cache", "/jfjb/Public/cache", $pics);
	        $big =$pics;
	        $min =str_replace(".jpg", "_sm.jpg", $pics);	       
	        $pics =array("big" =>$big,"min" =>$min);
	        	     
	    } 
	    unset($con['md']);
	}
	//echo "<pre>";print_r($content);echo "</pre>";exit();
	echo "var pjfjb =JSON.parse('".json_encode(array('code'=>$code,'data'=>$content))."');\n";
	$jfjb_json =$cache."/zson/video.json";
	$cont =file_get_contents($jfjb_json);
	$cont =json_decode($cont,true);
	$content =$cont['data'];
	$code =$cont['code'];
	foreach ($content as &$r) {
	    unset($r['dotime']);
	    $date =str_replace("-", "", $r['pubdate']);
	   
	    $r['video'] ="/jfjb/Public/cache/video/".$date."/1.mp4";
	    $r['pic'] ="/jfjb/Public/cache/video/".$date."/1.jpg";
	}
	echo "var pvideo = JSON.parse('".json_encode(array('code'=>$code,'data'=>$content))."');\n";
	
	$jfjb_json =$cache."/zson/weixin.json";
	$cont =file_get_contents($jfjb_json);
	$cont =json_decode($cont,true);
	$content =$cont['data'];
	$code=$cont['code'];
	foreach ($content as &$r) {
	    unset($r['dotime']);
	    unset($r['md']);
	    unset($r['url']);    
	    $r['pic'] ="/jfjb/Public/cache/weixin/".$r['screen'].".jpg";
	}
	//echo "var pweixin = JSON.parse('".json_encode(array('code'=>$code,'data'=>$content))."');\n";
echo "var pweixin = ".json_encode(array('code'=>$code,'data'=>$content)).";\n";
	$jfjb_json =$cache."/zson/weibo.json";
	$cont =file_get_contents($jfjb_json);
	$cont =json_decode($cont,true);
	$content =$cont['data'];
	$code=$cont['code'];
	foreach ($content as &$r) {
	    unset($r['dotime']);
	    $r['pics'] =json_decode($r['pics'],true);
	    foreach($r['pics'] as &$pics){
	        $date =substr($r['pubtime'], 0,10);
	        $date =str_replace("-", "", $date);
	        $normal ="/jfjb/Public/cache/weibo/big/".$date."/".$pics;
	        $min ="/jfjb/Public/cache/weibo/min/".$date."/".$pics;
	        $pics =array("normal" =>$normal,"min" =>$min);
	    }    
	}
	//echo "var pweibo = JSON.parse('".json_encode(array('code'=>$code,'data'=>$content))."');\n";
echo "var pweibo = ".json_encode(array('code'=>$code,'data'=>$content)).";\n";
	$jfjb_json =$cache."/zson/hot.json";
	$content =file_get_contents($jfjb_json);
	$content =json_decode($content,true);
	$content =$content['data'];
	foreach($content as &$c)
	{
		unset($c['pics']);
	}
	echo "var phot = JSON.parse('".json_encode($content)."');\n";

	$jfjb_json =$cache."/zson/fans.json";
	$content =file_get_contents($jfjb_json);
	$content =json_decode($content,true);
	$content =$content['data'][0];
	echo "var pfans = JSON.parse('".json_encode($content)."');\n";exit();
?>