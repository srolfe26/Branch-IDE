var mainEdit = null;
var branch = null;

$(document).ready(function(){
    //viewport
	var vp = new Wui.viewport({
		vp:				$('#content'),
		DOMNodeAdded:	function(){},
		forceMatchWin:	true,
		afterResize:	function(){
					        $('#app-container').height(this.matchWindow);
                            $('#main-content').height(this.matchWindow);
					        if(branch) branch.setHeight(this.matchWindow);			
					    }
	});
    
    mainEdit = new IDEMgr('editor');
    editor = mainEdit.editor;
	
    branch = new bjsBranch({
       el:              $("#branch-wrapper"),
       searchMargin:    4,
       nodeMargin:      4,
       dfltSrchTxt:     'Filter Branch...',
       addChildren:     function(nd){
                            if(nd.depth == 0){
                                //$.getJSON("data/file-interactions",{xaction:'read'},function(list){ nd.processKids(list.payload); });
                                $.getJSON("php/file-interactions.php",{xaction:'read'},function(list){ nd.processKids(list.payload); });
                            }else if(nd.depth > 0){
                                //$.getJSON("data/file-interactions",{xaction:'read', path:nd.data.path},function(list){ nd.processKids(list.payload); });
                                $.getJSON("php/file-interactions.php",{xaction:'read', path:nd.data.path},function(list){ nd.processKids(list.payload); });
                            }
                        },
       tplt:            '<a href="javascript:void(0);" class="dir-item ftype-{type}">' +
                           '<span class="icon"></span>' +
                           '{name}<span class="count">({items})</span>' +
                         '</a>',
       nodeClick:       function(nd){
                           if(nd.selected){
                               if (nd.data.type == 'file'){
                                   var ftype = nd.data.filetype.replace('.','').replace('~','');
                                       editorModes = {
                                           sql:     'ace/mode/pgsql',
                                           out:     'ace/mode/pgsql',
                                           js:      'ace/mode/javascript',
                                           htm:     'ace/mode/rhtml',
                                           html:    'ace/mode/rhtml',
                                           css:     'ace/mode/css',
                                           php:     'ace/mode/php',
                                           cfm:     'ace/mode/coldfusion',
                                           cfml:    'ace/mode/coldfusion',
                                           txt:     'ace/mode/text',
                                           xml:     'ace/mode/xml',
                                           xsl:     'ace/mode/xml',
                                           info:    'ace/mode/xml',
                                           adp:     'ace/mode/rhtml',
                                           tcl:     'ace/mode/tcl',
                                           vuh:     'ace/mode/tcl',
                                           sh:      'ace/mode/sh'
                                       };
                                       
                                   // p = "data/editor-interactions";
                                   p = "php/editor-interactions.php";
                                   $.get(p,{xaction:'read', path:nd.data.path}, function(d){
                                       //assign the editor mode, or default to text if nothing else exists
                                       if(!editorModes.hasOwnProperty(ftype)) ftype = 'text';
                                       var path = nd.data.path.replace(new RegExp(nd.data.name,'g'),'');
                                       mainEdit.newSession({
                                            ftype:editorModes[ftype],
                                            documentText:d,
                                            branchPath:path,
                                            path:nd.data.path,
                                            name:nd.data.name
                                       });
                                   });
                               }
                           }else{
                               //TODO: Node gets deselected make sure of the save and close session
                           }
                        },
       minSearchLength: 1,
       doSearch:        function(){
                            var me = this,
                            srchTerm = me.searchField.val(),
                            selectedNode = me.getSelected(); 
                            
                            me.cancelSearchBtn();   //show cancel search btn
                            me.okToSearch = false;
                            for(var c in selectedNode.children){
                                var name = selectedNode.children[c].data.name.toLowerCase();
                                if(name.indexOf(srchTerm.toLowerCase()) < 0)    selectedNode.children[c].hide();
                                else                                            selectedNode.children[c].show();
                            }
                            //if additional stuff was typed while last search was happening
                            if(srchTerm != me.searchField.val())    me.doSearch();
                            me.okToSearch = true;
                        },
        cancelSearch:   function(){
                            var me = this,
                                selectedNode = me.getSelected();
                            
                            me.addSearchBtn();
                            
                            for(var c in selectedNode.children){
                                selectedNode.children[c].show();
                            }
                        }
    });
    
    $('ul li#save').on('click',mainEdit.saveFunc);
    
    $('ul li#github').on('click',function(){
    	var d = $(this),
    		s = $('ul li#save'),
    		n = $('ul li#newfile'),
    		c = $('ul li#commit-all'),
    		u = $('ul li#update-all');
    	d.toggleClass('selected');
    	if (d.hasClass('selected')){
    		n.hide();
    		s.hide();
    		c.show();
    		u.show();
    	} else {
    		n.show();
    		s.show();
    		c.hide();
    		u.hide();
    	}
    });
    
    $('ul li#newfile').on('click',function(){
        var win = new Wui.window({
	        title:	'Create a New File',
	        height:	200,
	        items:	[
			        	new Wui.form({
				        	labelPos:'left',
				        	items:	[
						        		{ftype:'Wui.text', label:'File Name:', required:true, name:'newFile'}
						        	]
			        	})
			        ],
	        bbar:	[
			        	new Wui.button({ text: 'Cancel', click:function(){win.close();} }),
			        	new Wui.button({
			        		text:	'Create New File',
			        		click:	function(){
				        				var frmData = win.items[0].getData();
				        				if(frmData !== false){
					        				var newFilePath = mainEdit.currentPath + frmData.newFile;
								            // tcl data/editor-interactions
								            $.ajax('php/editor-interactions.php', {
					                            type:		'post',
					                            data:       {xaction:'create',path:newFilePath},
					                            success:    function(d){ 
					                            				Wui.Msg(frmData.newFile + ' Created');
					                            				
					                            			},
					                            error:      function(e){ Wui.errRpt('The file could not be created.'); }
					                        });
								            win.close();
				        				}
			        				}
			        	})
			        ]
        });
    });
    
    var TabControl = function(args){
        var me = this;
        var params = $.extend({
            el:         $("#tab-control"),
            //target:     $("#content"),
            init:       function(){
                            //me.target.css('position','relative').append(me.el);
                            // cant do alt in firefox
                            $(document).keydown(function(e){
                                //if(e.keyCode == 18) me.el.css('display','block').focus();   //18 = alt
                            }).keyup(function(e){
                                //if(e.keyCode == 18) me.el.css('display','none');
                            });
                        },
            setActiveColor: function(tab) {
                            var sessions = $('.session');
                            $.each(sessions,function(){
                                $(this).removeClass('selected');
                            });
                            tab.addClass('selected');
                        },
            addTab:     function (sessionItem){
                            var tab = $("<div/>").attr({id:'session-'+sessionItem.sessionId, class:
                            'session'}).html('<div class="tab-label">'+sessionItem.name+'</div').appendTo(me.el);
                            me.setActiveColor(tab);
                            tab.bind('click',$.proxy(function(){this.owner.getSession(sessionItem.sessionId); me.setActiveColor(tab);},sessionItem));
                            var tabx = $("<div/>").attr({class:'tab-close'}).appendTo(tab);
                            tabx.bind('click',$.proxy(function(event){console.log(arguments);this.owner.closeSession(sessionItem.sessionId)},sessionItem));
                            // this tabx still needs to delete tab div from dom and goto the next closest file
                        }
        },args);
        $.extend(me,params);
        me.init();
    }
    
    TabMgr = new TabControl();
	
	//editor.on('change',statusIcon.setState("changed"));
});

function IDEMgr (editorEl,ftype){
    editor = ace.edit(editorEl || "editor");
    editor.getSession().setMode(ftype || "ace/mode/javascript");
    EditSession = ace.require('ace/edit_session').EditSession;
    session = new EditSession('');
    mainEdit = {
        editor:editor,
        sessions:[],
        branch:branch,
        currentPath:'',
        activeSession:null,
        saveFunc:function(){
            try{
                var fileContent = editor.getValue();
                var activePath = editor._parent.activeSession.path;
                //$.post("data/editor-interactions",{xaction:'update',path:activePath,content:base64_encode(fileContent)});
                $.post("php/editor-interactions.php",{xaction:'update',path:activePath,content:base64_encode(fileContent)});
            }catch(e){
                // commented out because it's super annoying to start the page with that popping up
                //Condor.errRpt("There is no file to save. Fool.");
                console.log(e);
				console.log('There is no file to save. Fool.');
            }
        },
        getSession:function(id){
            if (typeof this.sessions[id] !== 'undefined') {
                var sess = this.activeSession = this.sessions[id];
                this.currentPath = this.activeSession.branchPath;
                this.editor.setValue(sess.session.getValue());
                editor.gotoLine(0);
                return sess.session;
            } else{
            	 this.editor.setValue();
            }
        },
        closeSession:function(id){
            if ((this.sessions.length-1) >= 0) {
                delete this.sessions[id];
                this.activeSession = this.sessions[id-1] ;
                if (typeof this.activeSession.branchPath != 'null'){
                	this.currentPath = this.activeSession.branchPath;
                }
                console.log(id, id-1);
                this.editor.setValue(this.sessions[id-1]);
                editor.gotoLine(0);
            } else{
            	 this.editor.setValue('');
                 delete this.sessions[id];
                 this.currentPath = "";
                 this.activeSession = null;
                
            }	        
	        
        },
        newSession:function(args){
            
            var sess = new EditSession(args.documentText||'');
            var ftype = (typeof args.ftype !== undefined) ? args.ftype : 'ace/javascript';
            sess.setMode(ftype);
            //load the item into the editor
            this.editor.setValue(sess.getValue());
            this.editor.gotoLine(0);
            var index = this.sessions.length;
            var newSess = $.extend({
                session:sess,
                owner:this,
                changeHash:CryptoJS.MD5(sess.getValue()).toString(),
                updateChangeStatus: function(){
                	function changedIcon() {
                        var me = {
                            currState: 	"saved",
                            el:			$("ul li#status"),
                            setState: 	function(newState) {
                                            // options are saved, changed, or loading
                                            me.currState = newState;
                                            me.setClass(newState);
                                        },
                            getState: 	function() {
                                            return me.currState;
                                        },
                            setClass:	function(newClass) {
                                            me.el.attr('class',newClass);
                                        }
                        }
                        return me;
                    };
                    var statusIcon = new changedIcon();
                    
				    var hash = CryptoJS.MD5(this.owner.editor.getValue()).toString();
				    console.log(this,this.changeHash,hash);
				    if (this.changeHash !== hash) {
						//this.tab.html('*');  Mark as dirty
						//$('#hash').val(hash);
                        statusIcon.setState("changed");
						$('li#save').css("opacity","1")
						$('li#save').attr('disabled','false');
						this.changeHash=CryptoJS.MD5(this.session.getValue()).toString();
				    } else {
						//$('#changed').html(''); clear the dirty indicator
						$('li#save').css("opacity","0.3");
						$('li#save').attr('disabled','true');
						statusIcon.setState("saved");
					}
					    
				},
                sessionId:index
            },args);
            newSess.updateChangeStatus();
            $('#editor').bind('keyup',$.proxy(newSess.updateChangeStatus,newSess)).bind('change',$.proxy(newSess.updateChangeStatus,newSess));
            this.activeSession = newSess;
            this.sessions.push(newSess);
            TabMgr.addTab(newSess);
            return sess;
        }
    };
    mainEdit.editor._parent = mainEdit;
    mainEdit.editor.commands.addCommand({
        name: 'save',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: mainEdit.saveFunc,
        readOnly: false // false if this command should not apply in readOnly mode
    });
    return mainEdit;
}
