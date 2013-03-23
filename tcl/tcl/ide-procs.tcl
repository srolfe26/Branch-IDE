ad_library {

    @author Stephen Nielsen (stephen.nielsen@usurf.usu.edu)
    @author Joshua Barton (josh.barton@usurf.usu.edu)
    @creation-date 2013-1-10 
}

namespace eval webide {}

#Open file
ad_proc -public webide::open_file {
    path
} {
    open specified file for edit
    
    @return returns string
    @author Stephen Nielsen (stephen.nielsen@usurf.usu.edu)
    @author Joshua Barton (josh.barton@usurf.usu.edu)
    @creation-date 2013-1-10
} {
    
    if {[exists_and_not_null path]} {
        if {[file exists $path]} {
            set file_hdl [open $path "r"]
            set file_content [read $file_hdl]
            close $file_hdl
        }
    } else {
        error "Must Specify a file path." "var path not specified" 
    }
        return $file_content
}


#Save file
ad_proc -public webide::save_file {
    -path:required
    -content
} {
    creates/saves new or existing file with the specified name at the specified location, and content as specified
    
    @return returns file path

    @author Joshua Barton (josh.barton@usurf.usu.edu)
    @creation-date 2013-1-10
} {

   if {[exists_and_not_null path] && [file exists $path]} {
       set fileId [open $path "w+"]
       if {[exists_and_not_null content]} {
           puts $fileId $content
           close $fileId
           set status true
       } else {
           set status false
       }

       
   } else {
       set status false
       if {[exists_and_not_null path] && ![file exists $path]} {
           set fileId [open $path "w+"]
           puts $fileId ""
           close $fileId
           set status true
       }
   }    
   return $status
}

ad_proc -public webide::get_dir_list {
    -path
    -json_encode
} {
    lists the directories and files in a specified path
    @param path - directory path to provide a listing
    @param json_encode provide any non null/falsy value in order to output the file list in json format
    @return returns list of lists

    @author Joshua Barton (josh.barton@usurf.usu.edu)
    @creation-date 2013-1-10
} {
    set result [list]
    if {![exists_and_not_null path]} {
        set path [file join "/" [acs_root_dir] "packages"] 
    }
    set files [lsort [glob -nocomplain -directory $path packages *]]
        foreach item $files {
            if { [file isdirectory $item] } {
                set filetype ""
                set type "dir"  
                set itemcnt [llength [glob -nocomplain -directory $item *]]
            } elseif { [file isfile $item]} {
                set itemcnt 0
                set filetype [file extension $item]
                set type "file"
            }
            
            set modified [clock format [file mtime $path] -format "%Y-%m-%d %H:%M:%S %Z"]
            lappend result [list "path" $item "name" [file tail $item] "type" $type "items" $itemcnt "modified" $modified "filetype" $filetype]
        }
        if {[exists_and_not_null json_encode]} {
         set $result [ wt::ext::respond -recs [webide::get_dir_list]]
        }
    return $result
}
