<?php
namespace App\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this ->display();
    }
    public function sysinfo(){
        $getinfo =new \App\Wsn\getinfo;
        // $getinfo ->getinnerip();
        // $getinfo ->getouterip();
         // $getinfo ->getmemoryinfo();
        // $getinfo ->getprocessarray();
        // $getinfo ->getscreenimg("D:/2.jpg");
        // $getinfo ->weixininfo();
        // echo $getinfo ->weiboinfo();
        $data =$getinfo ->allinfo();
       
        $curl =new \App\Wsn\curl;
        $curl ->curlpost($data);
       



    }
    public function startscreen(){
        $screenimg =new \App\Wsn\getinfo;
        echo $screenimg ->getscreenimg();
    }
    /*
    public function index(){
        $this->show('<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} body{ background: #fff; font-family: "微软雅黑"; color: #333;font-size:24px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.8em; font-size: 36px } a,a:hover,{color:blue;}</style><div style="padding: 24px 48px;"> <h1>:)</h1><p>欢迎使用 <b>ThinkPHP</b>！</p><br/>版本 V{$Think.version}</div><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_55e75dfae343f5a1"></thinkad><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script>','utf-8');
    }
    
    
    public function jfjb()
    {   
        $jfjb = M('jfjb');
        $result = $jfjb->order('pubdate desc')->limit(7)->select();
        //$w      =  new \App\Wsn\Wendao;
        
        foreach ($result as &$r) {
            unset($jpgs);
            $fixurl = "/jfjb/public/cache/jfjb";
            $fixurl = $fixurl."/".str_replace("-","", $r['pubdate'])."/";
            for($i=1;$i<=$r['pagenum'];$i++) {
                
                $jpg['min'] = $fixurl.$i."_min.jpg";
                $jpg['big'] = $fixurl.$i.".jpg";
                $jpgs[] = $jpg;
            }
            $r['pics']=$jpgs;
        }
        echo json_encode($result);
    }
    
    // public function __jfjb()
    // {   
    //     /*
    // 	$jfjb = M('Jfjb');
    // 	$result = $jfjb->order('pubdate desc')->limit(20)->select();
    // 	foreach ($result as &$j) {
    // 		$j['pics']  = json_decode($j['pics'],true);
    // 	}
    // 	echo json_encode($result);
    //     */
        
    //     $wendao = M('Wendao');
    //     $result = $wendao->order('pubdate desc')->limit(7)->select();
    //     $w      =  new \App\Wsn\Wendao;
    //     foreach ($result as &$r) {
    //         unset($jpgs);
    //         $fixurl = $w->url."/".str_replace("-","", $r['pubdate'])."/";
    //         for($i=1;$i<=$r['pagenum'];$i++) {
                
    //             $jpg['min'] = $fixurl.sprintf("%02d",$i)."_min.jpg";
    //             $jpg['big'] = $fixurl.sprintf("%02d",$i).".jpg";
    //             $jpgs[] = $jpg;
    //         }
    //         $r['pics']=$jpgs;
    //     }
    //     echo json_encode($result);
    // }
        public function jfjb(){
            $cache = \App\Wsn\Path::cache();
            
            $jfjb_json =$cache."/zson/jfjb.json";
            $content =file_get_contents($jfjb_json);
            $content =json_decode($content,true);
            $content =$content['data'];
            foreach($content as &$con){
                $con['pics'] =json_decode($con['pics'],true);
                $con['pics'] =str_replace("cache1", "cache", $con['pics']);
                
                foreach($con['pics'] as &$pics){
                    $pics =str_replace("http://screen.jfjb.com.cn/jfjb/public/cache", "/jfjb/Public/cache", $pics);
                    $big =$pics;
                    $min =str_replace(".jpg", "_sm.jpg", $pics);
                    

                    $pics =array("big" =>$big,"min" =>$min);
                 
                } 
            }
            // echo "<pre>";
            // print_r($content);
            // echo "</pre>";
            echo json_encode($content);

        }
        public function cjfjb(){
            $cache = \App\Wsn\Path::cache();
            
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
            }
            // echo "<pre>";
            // print_r($content);
            // print_r($code);
            // echo "</pre>";
            echo json_encode(array('code'=>$code,'data'=>$content));

        }
    // public function jfjb(){
        
    //      $wendao = M('Wendao');
    //     $result = $wendao->order('pubdate desc')->limit(7)->select();
    //     $w      =  new \App\Wsn\Wendao;
        
    //     foreach ($result as &$r) {
    //         unset($jpgs);
    //         $fixurl = $w->url."/".str_replace("-","", $r['pubdate'])."/";
    //         $fixurl =str_replace("wendao", "jfjb", $fixurl);
    //         for($i=1;$i<=$r['pagenum'];$i++) {
                
    //             $jpg['min'] = $fixurl.sprintf("%02d",$i)."_db_bg.jpg";
    //             $jpg['big'] = $fixurl.sprintf("%02d",$i)."_db_sm.jpg";
    //             $jpgs[] = $jpg;
    //         }
    //         $r['pics']=$jpgs;
    //     }
    //     // echo "<pre>";
    //     // print_r($result);
    //     // echo "</pre>";
    //     echo json_encode($result);

    // }
     public function video(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/video.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        foreach ($content as &$r) {
            unset($r['dotime']);
            $date =str_replace("-", "", $r['pubdate']);
           
            $r['video'] ="/jfjb/Public/cache/video/".$date."/1.mp4";
            $r['pic'] ="/jfjb/Public/cache/video/".$date."/1.jpg";
        }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode($content);

    }
     public function cvideo(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/video.json";
        $cont =file_get_contents($jfjb_json);
        $cont =json_decode($cont,true);
        $content =$cont['data'];
        $code =$cont['code'];

        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        foreach ($content as &$r) {
            unset($r['dotime']);
            $date =str_replace("-", "", $r['pubdate']);
           
            $r['video'] ="/jfjb/Public/cache/video/".$date."/1.mp4";
            $r['pic'] ="/jfjb/Public/cache/video/".$date."/1.jpg";
        }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode(array('code'=>$code,'data'=>$content));
        

    }
    // public function video1()
    // {
    // 	$video = M('Ttdvideo');
    // 	$result = $video->order('pubdate desc')->limit(10)->select();
    //      echo "<pre>";
    //     print_r($result);
    //     echo "</pre>";
    // 	// echo json_encode($result);
    // }
    public function weixin(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/weixin.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        foreach ($content as &$r) {
            unset($r['dotime']);
            //unset($r['content']);
            unset($r['md']);
            unset($r['url']);
           
            
            $r['pic'] ="/jfjb/Public/cache/weixin/".$r['screen'].".jpg";
        }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode($content);

    }
    public function cweixin(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/weixin.json";
        $cont =file_get_contents($jfjb_json);
        $cont =json_decode($cont,true);
        $content =$cont['data'];
        $code=$cont['code'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        foreach ($content as &$r) {
            unset($r['dotime']);
            //unset($r['content']);
            unset($r['md']);
            unset($r['url']);
           
            
            $r['pic'] ="/jfjb/Public/cache/weixin/".$r['screen'].".jpg";
        }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode(array('code'=>$code,'data'=>$content));

    }
    // public function weixin1()
    // {
    // 	$weixin = M('PreWeixin');
    // 	//$result = $weixin->order('pubdate desc')->limit(80)->select();
    //     $result = $weixin->order('pubdate desc')->limit(80)->select();
    //     //echo count($result);return;
    //     foreach($result as &$res){
    //           $date =str_replace("-", "", $res['pubdate']);
    //           $res['pic'] =str_replace($date."/", "", $res['pic']);
    //     }
    //      echo "<pre>";
    //     print_r($result);
    //     echo "</pre>"; 
    // 	// echo json_encode($result);
    // }
    //  public function weixin()
    // {
    //     $weixin = M('PreWeixin');
    //     //$result = $weixin->order('pubdate desc')->limit(80)->select();
    //     $result = $weixin->order('pubdate desc')->limit(80)->select();
    //     //echo count($result);return;
    //     echo json_encode($result);
    // }
    public function weibo(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/weibo.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
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
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        // exit;
        echo json_encode($content);

    }
     public function cweibo(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/weibo.json";
        $cont =file_get_contents($jfjb_json);
        $cont =json_decode($cont,true);
        $content =$cont['data'];
        $code=$cont['code'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
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
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        // exit;
        echo json_encode(array('code'=>$code,'data'=>$content));

    }
    // public function weibo1()
    // {
    // 	$weibo = M('PreWeibo');
    // 	$result = $weibo->order('pubtime desc')->limit(40)->select();
    // 	//echo count($result);return;
    //     //echo "<pre>";print_r($result);echo "</pre>";
    //     foreach($result as &$w)
    // 	{
    // 		//$w['pics'] = json_decode($w['pics'],true);
    //         $pics = array();
    //         $array = json_decode($w['pics'],true);
            
    //         foreach($array as $a)
    //         {
    //             $pics[] = $a['min'];
    //         }
    //         if(count($array)==1) $pics[0] = $a['normal'];
            
    //         $w['pics'] = $array;
    //         foreach($w['pics'] as &$pics){
    //             $pics['normal'] =str_replace("normal", "big",$pics['normal']);
    //         }
    // 	}
    // 	//echo "<pre>";print_r($result);echo "</pre>";return;
    //       echo "<pre>";
    //     print_r($result);
    //     echo "</pre>"; 
    //     // echo json_encode($result);
    // }
     /*public function weibo()
    {
        $weibo = M('PreWeibo');
        $result = $weibo->order('pubtime desc')->limit(40)->select();
        //echo count($result);return;
        //echo "<pre>";print_r($result);echo "</pre>";
        foreach($result as &$w)
        {
            //$w['pics'] = json_decode($w['pics'],true);
            $pics = array();
            $array = json_decode($w['pics'],true);
            
            // foreach($array as $a)
            // {
            //     $pics[] = $a['min'];
            // }
            // if(count($array)==1) $pics[0] = $a['normal'];
            

            $w['pics'] = $array;
        }
        //echo "<pre>";print_r($result);echo "</pre>";return;
         
         echo json_encode($result);
    }*/
    public function weibohot(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/hot.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        // foreach ($content as &$r) {
        //     unset($r['dotime']);
        //     $r['pics'] =json_decode($r['pics'],true);
        //     foreach($r['pics'] as &$pics){
        //         $normal ="/jfjb/Public/cache/weibo/big/20151217/".$pics;
        //         $min ="/jfjb/Public/cache/weibo/min/20151217/".$pics;
                

        //         $pics =array("normal" =>$normal,"min" =>$min);
        //     }
            
            
        // }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode($content);

    }

    // public function weibohot1()
    // {
    //     $weibo = M('PreWeibo');
    //     $time = time()-8*24*60*60;

    //     $result = $weibo->where('pubtime >'.$time)->order('repost desc')->limit(5)->select();
    //     //echo "<pre>";print_r($result);echo "</pre>";
    //      echo "<pre>";
    //     print_r($result);
    //     echo "</pre>"; 
    //     // echo json_encode($result);
    // }
     public function cover(){
        $cache = \App\Wsn\Path::cache();
        
        $jfjb_json =$cache."/zson/fans.json";
        $content =file_get_contents($jfjb_json);
        $content =json_decode($content,true);
        $content =$content['data'][0];
        // echo "<pre>";
        // print_r($content);  
        // echo "</pre>";
        // exit;
        // foreach ($content as &$r) {
        //     unset($r['dotime']);
        //     $r['pics'] =json_decode($r['pics'],true);
        //     foreach($r['pics'] as &$pics){
        //         $normal ="/jfjb/Public/cache/weibo/big/20151217/".$pics;
        //         $min ="/jfjb/Public/cache/weibo/min/20151217/".$pics;
                

        //         $pics =array("normal" =>$normal,"min" =>$min);
        //     }
            
            
        // }
        // echo "<pre>";
        // print_r($content);
        // echo "</pre>";
        echo json_encode($content);

    }
    // public function cover1()
    // {
    //     $result = M('Cover')->limit(1)->select();
    //      echo "<pre>";
    //     print_r($result);
    //     echo "</pre>"; 
    //     // echo json_encode($result[0]);
    // }

}