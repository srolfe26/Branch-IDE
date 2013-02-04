<?php

	include('procs/ide-procs.php');
	$xaction 	= $_GET['xaction'];
	if (!isset($_GET['path'])) {
		$path = null;
	} else {
		$path = $_GET['path'];
	}
	if (!isset($_GET['content'])) {
		$content = null;
	} else {
		$content = $_GET['content'];
	}
	
	switch ($xaction) {
		case 'create':
			if (!empty($path) && empty($content)) {
				if (webide::save_file($path, $content)) {
					util::respond(array("path"=>$path),null);
				} else {
					util::respond(null,"Saving of '".$path."' failed.");
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
					util::respond(array("path"=>$path),null);
				} else {
					util::respond(null,"Saving of '".$path."' failed.");
				}
			}
			break;
	}

?>