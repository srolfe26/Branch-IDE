<?php

	include('procs/ide-procs.php');
	$xaction 	= $_GET['xaction'];
	$path 		= $_GET['path'];
	$content	= $_GET['content'];
	
	switch ($xaction) {
		case 'read':
			if (!empty($path) && empty($content)) {
				if (webide::save_file($path, $content)) {
					util::respond(array("path"=>$path));
				} else {
					util::respond(null,"Saving of '".$path."' failed.");
				}
			}
			break;
		case 'create':
			return webide::open_file($path);
			break;
		case 'update':
			if (!empty($path) && !empty($content)) {
				$content = base64_decode($content);
				if (webide::save_file($path, $content)) {
					util::respond(array("path"=>$path));
				} else {
					util::respond(null,"Saving of '".$path."' failed.");
				}
			}
			break;
	}

?>