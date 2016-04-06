<?php
namespace App\wsn;
class curl{
    public function curlpost($data){

		$uri = "http://screen.jfjb.com.cn/jfjb/admin/list/curl";

		// post参数数组

		
		$filename=substr($data['screenimg'], strrpos( $data['screenimg'],"/")+1);
		
        $cfile = curl_file_create($data['screenimg'],'image/jpeg',$filename);
        
		$post_data = array('pic' => $cfile,'data' =>json_encode($data));
		// $post_data =array_merge($post_data,$data);
		// echo "<pre>";
		// print_r($post_data);
		// echo "</pre>";
		// exit;
		//初始化 
		$ch = curl_init ();

		//各种项设置，网上参考而来，可以查看php手册，自己设置
		curl_setopt ( $ch, CURLOPT_URL, $uri );
		curl_setopt ( $ch, CURLOPT_POST, 1 );//post方式
		curl_setopt ( $ch, CURLOPT_HEADER, 0 );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 0 );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );

		//执行
		$return = curl_exec ( $ch );

		//容错机制
		if($return === false){
			var_dump(curl_error($ch));
			}

		//curl_getinfo()获取各种运行中信息，便于调试	
		$info = curl_getinfo($ch);

		//释放
		curl_close ( $ch );
		 
		$info= "执行时间".$info['total_time'].PHP_EOL;
		return array('code'=>0,'info'=>$info);

		
    }	
}
?>