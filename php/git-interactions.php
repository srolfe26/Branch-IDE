<?php

	function get_data($url) {
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
	function send_data($url, $content) {
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($ch, CURLOPT_USERPWD, 'runfaj:Fajita551');
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($content));
		$a = array();
		$a['d'] = curl_exec($ch);
		$a['i'] = curl_getinfo($ch);
		curl_close($ch);
		return $a;
	}
	
	$fields_string = "";
	$blobArr = array(
		"content" => "just a blob test",
		"encoding" => "utf-8"
	);
	foreach($blobArr as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
	rtrim($fields_string, '&');
	
	$treeArr = array(
		"base_tree" => "d7126bd6c559ab461e851e96ef2c33675d851c5e",
		"tree" => array(
			"path" => "blahTest.pl",
			"mode" => "100755",
			"type" => "blob",
			"sha" => "38d15319d3ee8a7292be0ec0da65fe111660a94d"
		)
	);
	
	$comArr = array(
		"message" => "test",
		"tree" => "38d15319d3ee8a7292be0ec0da65fe111660a94d",
		"parents" => array()
	);
	$x = send_data("https://api.github.com/repos/srolfe26/Branch-IDE/git/trees",$treeArr);
	print_r($x);
	//echo $fields_string;
	//echo get_data("https://api.github.com/repos/srolfe26/Branch-IDE/git/commits/1b395d0306c9bfbfc53940f96c7464f6d5920a59");
?>