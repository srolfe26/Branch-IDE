<?php

class webide {
	public function open_file ($path) {
	 /**   
      * open specified file for edit
      *
      * @return returns string
	  * 
      * @author Stuart Roskelley (runfaj@gmail.com)
      * @creation-date 2013-2-2
	  */
    
	    if (!empty($path)) {
	        if (file_exists($path)) {
	            $file_content = file_get_contents($path);
	        }
	    } else {
	        /// error?	
	        return "Must Specify a file path.";
	    }
        return $file_content;
	}
	
	public function save_file ($path, $contents) {
		/**
	     * creates/saves new or existing file with the specified name at the specified location, and content as specified
	     *   
	     * @return returns success status
	     *
	     * @author Stuart Roskelley
	     * @creation-date 2013-2-2
		 */
    
    	if (empty($contents)) { $contents = ""; }
		if (!empty($path)) {
			$success = file_put_contents($path, $contents);
			if ($success === false) {
				$status = false;
			} else {
				
			}
   		} else {
   			$status = false;
   		}
   		return $status;
	}
	
	public function get_dir_list ($path) {
		/**
		 * lists the directories and files in a specified path
		 * 
         * @param path - directory path to provide a listing
         * @return returns list of lists
		 *
    	 * @author Stuart Roskelley (runfaj@gmail.com)
    	 * @creation-date 2013-2-2
		 */
		
		$recordsArr = array();
		if (empty($path)) {
			/// handle getting proper path
		}
		if($handle = opendir($path)) {
			
			while (($entry = readdir($handle)) != false) {
				if (is_dir($entry)) {
					$filetype = "";
					$type = "dir";
					$itemcnt = count(glob($entry . "*"));;
				} else if (is_file($entry)) {
					$filetype = pathinfo($entry, PATHINFO_EXTENSION);
					$type = "file";
					$itemcnt = 0;
				}
				$name = basename($entry);
				$modified = date('Y/m/d h:i:s a', time());
				$rec = array(
					"path" 		=> $entry,
					"name" 		=> $name,
					"type"  	=> $type,
					"items" 	=> $itemcnt,
					"modified"	=> $modified,
					"filetype" 	=> $filetype
				);
				array_push($recordsArr, $rec);
			}
			closedir($path);
		}
		
		$result = util::response($recordsArr);
		return $result;
	}

}

class util {
	public function response($recs,$errorText) {
		/**
		 * takes an array of recs and wraps in a response object and json encodes.
		 * each record MUST be an associative array
		 * 
		 * @param recs - an array of associative arrays
		 * @param errorText - if given, will return false success and the given errorText 
		 * 
		 * @author Stuart Roskelley (runfaj@gmail.com)
		 * @creation-date 2013-2-2
		 */
		
		$result = array();
		$success = true;
		if (!empty($errorText)) {
			$success = false;
			$result['error'] 	= $errorText;
		} else {
			$result['total'] 	= count($recs);
			$result['payload']	= $recs;
		}
		$result = json_encode($result);
		
		return $result;
	}
}

?>