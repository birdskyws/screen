<?php
namespace App\Wsn;

class Path {
	public static function publik()
	{
		$think = THINK_PATH;
    	$ops = strrpos($think, "\\");
    	$str = substr($think,0,$ops);
    	$public  = $str.DIRECTORY_SEPARATOR."Public";
    	if(!is_dir($public)) mkdir($public);
  		return $public;
	}
	public static function cache()
	{
		$cache = \App\Wsn\Path::publik().DIRECTORY_SEPARATOR."cache";
		if(!is_dir($cache)) mkdir($cache);
		return $cache;
	}
	public static function url()
	{
		return "/app/Public/cache";
	}
}