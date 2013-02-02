ad_page_contract -form [wt::get_ext_req -model_var model] {

} {
    xaction
    path:optional
}
auth::require_login

switch -exact -- $xaction {
    "read" {
        if {[exists_and_not_null path]} {
            wt::ext::respond -recs [webide::get_dir_list -path $path]
        } else {
            wt::ext::respond -recs [webide::get_dir_list]
        }
        
    }
}
