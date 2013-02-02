ad_page_contract {

} {
    xaction
    path:optional
    content:optional
}
package require base64
auth::require_login
set response ""
switch -exact -- $xaction {
    "create" {
        if {[exists_and_not_null path] && ~[exists_and_not_null content]} {
            if {[webide::save_file -path $path ]} {
                wt::ext::respond -rec [list path $path]
             } else {
                wt::ext::respond -error [list "msg" [concat "Saving of " $path "failed"]]
             }
            
        } 
    }
    "read" {
        if {[exists_and_not_null path]} {
            ns_respond -status 200 -type "text/html" -string [webide::open_file $path]
        } 
        
    }
    "update" {
        if {[exists_and_not_null path] && [exists_and_not_null content]} {
             if {[webide::save_file -path $path -content [base64::decode $content]]} {
                wt::ext::respond -rec [list path $path]
             } else {
                wt::ext::respond -error [list "msg" [concat "Saving of " $path "failed"]]
             }
             
        }
    }
}
