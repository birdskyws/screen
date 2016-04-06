<?php
namespace App\Controller;
use Think\Controller;
class TestController extends Controller {
    /*
    public function index(){
        $this->show('<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} body{ background: #fff; font-family: "微软雅黑"; color: #333;font-size:24px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.8em; font-size: 36px } a,a:hover,{color:blue;}</style><div style="padding: 24px 48px;"> <h1>:)</h1><p>欢迎使用 <b>ThinkPHP</b>！</p><br/>版本 V{$Think.version}</div><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_55e75dfae343f5a1"></thinkad><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script>','utf-8');
    }
    */
    public function gsc()
    {
        file_get_contents("http://localhost/jfjb/app/test/sc");
    }
    public function sc()
    {
        $im = imagegrabscreen();
        var_dump($im);
        $path ="d:\\1.png";
        imagepng($im, $path);
    
    }
    public function jfjb()
    {   
        

        $jfjb = M('jfjb');
        $result = $jfjb->order('pubdate desc')->limit(7)->select();
        //$w      =  new \App\Wsn\Wendao;
        $fixurl = "/app/public/cache/jfjb";
        foreach ($result as &$r) {
            unset($jpgs);
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
    public function size()
    {
        function thumb($source,$desc,$width=200,$height=200){
            //获取原图像$filename的宽度$width_orig和高度$height_orig
            list($width_orig,$height_orig) = getimagesize($source);
            //根据参数$width和$height值，换算出等比例缩放的高度和宽度
            if ($width && ($width_orig<$height_orig)){
                $width = ($height/$height_orig)*$width_orig;
            }else{
                $height = ($width / $width_orig)*$height_orig;
            }
     
            //将原图缩放到这个新创建的图片资源中
            $image_p = imagecreatetruecolor($width, $height);
            //获取原图的图像资源
            $image = imagecreatefromjpeg($source);
     
            //使用imagecopyresampled()函数进行缩放设置
            imagecopyresampled($image_p,$image,0,0,0,0,$width,$height,$width_orig,$height_orig);
     
            //将缩放后的图片$image_p保存，100(质量最佳，文件最大)
            imagejpeg($image_p,$desc);
     
            imagedestroy($image_p);
            imagedestroy($image);
        }
        $source = "d:\\xampp\\htdocs\\app\\public\\cache\\jfjb\\20150820\\1.jpg";
        if(file_exists($source))
        {
            echo "file exist";
        }
        $desc = "d:\\xampp\\htdocs\\app\\public\\cache\\jfjb\\20150820\\100.jpg";
        thumb($source,$desc,1000,1600);

    }
    //check类测试
    public function weixin(){
        $check =new \App\Wsn\check;
        $check ->weixin();
    }
    public function weibo(){
        $check =new \App\Wsn\check;
        $check ->weibo();
    }
    public function test(){
        $check =new \App\Wsn\check;
        $check ->db();
    }
}