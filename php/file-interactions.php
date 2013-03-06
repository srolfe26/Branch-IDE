<?php

	define('DEFAULT_PATH', $_SERVER['DOCUMENT_ROOT'] . '/');
	
	include 'procs/ide-procs.php';
	//$include('procs/ide-procs.php');
	$xaction 	= $_GET['xaction'];
	if (!isset($_GET['path'])) {
		$path = DEFAULT_PATH;
	} else {
		$path = $_GET['path'];
	}
	
	switch ($xaction) {
		case 'read':
			$result = webide::get_dir_list($path);
			util::response($result,null);
			break;
	}

?>
