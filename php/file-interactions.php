<?php

	$include('procs/ide-procs.php');
	$xaction 	= $_GET['xaction'];
	$path 		= $_GET['path'];
	
	switch ($xaction) {
		case 'read':
			return webide::get_dir_list($path);
			break;
	}

?>
