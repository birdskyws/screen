<?php
namespace App\Controller;
use Think\Controller;
class UpdateController extends Controller {
    
    //联网更新
    public function jfjb()
    {
        $wendao = new \App\Wsn\Wendao;
        $wendao->update();
        
    }
    
    public function video()
    {
        $video = new \App\Wsn\Video;
        print_r($video->update());
    }
    public function weixin()
    {
        $weixin = new \App\Wsn\Weixin;
        print_r($weixin->update());
    }
    public function tj()
    {
        $tj = new \App\Wsn\Tj;
        $tj->update();
    }
    public function hot()
    {
        $hot = new \App\Wsn\Hot;
        print_r($hot->update());
    }
     public function fans()
    {
        $fans = new \App\Wsn\Fans;
        print_r($fans->update());
    }

    public function weibo()
    {
        set_time_limit(0);
        $weibo =  new \App\Wsn\Weibo;
        $weibo->update();
    }
    //zip解压更新
    public function appunzip(){
        $app =new \App\Wsn\app;
        print_r($app ->getappzip());
    }
    public function Apunzip(){
        $Ap =new \App\Wsn\Ap;
        print_r($Ap ->getappzip());
    }
    public function cacheunzip(){
        $app =new \App\Wsn\cache;
        $app ->getappzip();
        $check =new \App\Wsn\check;
        $check ->delete();
    }
    public function inccacheunzip(){
        $app =new \App\Wsn\inccache;
        print_r($app ->getappzip());
        $check =new \App\Wsn\check;
        $check ->delete();
    }
    public function checkcache()
    {
        $check =new \App\Wsn\check;
        $check ->delete();
    }
}