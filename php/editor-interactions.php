<?php

	include('procs/ide-procs.php');
	$xaction = $_REQUEST['xaction'];
	
	if (!isset($_REQUEST['path'])) {
		$path = null;
	} else {
		$path = $_REQUEST['path'];
	}
	if (!isset($_POST['content'])) {
		$content = null;
	} else {
		$content = $_POST['content'];
	}
	
	switch ($xaction) {
		case 'create':
			if (!empty($path) && empty($content)) {
				if (webide::save_file($path, $content)) {
					util::response(array("path"=>$path),null);
				} else {
					util::response(null,"Saving of '".$path."' failed.");
				}
			}
			break;
		case 'read':
			echo webide::open_file($path);
			break;
		case 'update':
			if (!empty($path) && !empty($content)) {
				$content = base64_decode($content);
				if (webide::save_file($path, $content)) {
					util::response(array("path"=>$path),null);
				} else {
					util::response(null,"Saving of '".$path."' failed.");
				}
			}
			break;
	}

?>