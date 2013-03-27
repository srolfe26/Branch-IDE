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
                            $('#main-content').height(this.matchWindow - 8);
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
    
    
    TabMgr = new TabControl();
    
    
});


/*********************************** IDE TABS & ASSOCIATED OBJECTS ***********************************/
function TabControl (args){
    var me = this;
    var params = $.extend({
        el:         $("#tab-control"),
        init:       function(){ },
        getSelected:function(){ },
        setActive: function(t) {
        				$.each(me.items, function(i,itm){ itm.el.removeClass('selected'); });
						t.el.addClass('selected');
						return t;
					},
		remove:		function(t){
						$.each(me.items, function(i,itm){ 
							console.log(itm,t,itm===t);
							if(itm === t){ me.splice(i,1); }
						});
					},
        addTab:     function (sessionItem){
        				var newTab = new TabItm({session:sessionItem, parent:me});
        				me.push(me.setActive(newTab));
        			}
    },args);
    $.extend(me,params);
    me.init();
}
TabControl.prototype = new Wui.o();

function TabItm (args){
    var me = this;
    var params = $.extend({
        session:	null,		//this property will be extended
        el:         $("<div/>"),
        cls:		'tab-item',
        init:       function(){
			            $.extend(me.session,{tab:me});
			            me.push(me.label = new Wui.o({el:$('<span>'), cls:'tab-label'}));
			            me.push(me.closeBtn = new Wui.button(
			            			{
			            				text:	'X', 
			            				cls:	'tab-close', 
			            				click:	function(){
								            		me.session.owner.closeSession(me.session.sessionId);
								            		me.parent.remove(me);
							            		}
					            	}
					            )
			            );
			            me.label.el.html(me.session.name);
			            me.setListners();
		            },
        setListners:function(t) {
                        me.el.click(function(){
                            me.session.updateChangeStatus(me.session);
                            me.session.owner.getSession(me.session.sessionId);
                            me.parent.setActive(me);
                        });
                    }
    },args);
    $.extend(me,params);
    me.init();
}
TabItm.prototype = new Wui.o();


/*********************************** IDE SESSION MANAGER ***********************************/
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
            	this.activeSession.session.setValue(this.editor.getValue());
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
                this.getSession(this.sessions[id-1]);
                editor.gotoLine(0);
            } else{
            	 this.editor.setValue('');
                 delete this.sessions[id];
                 this.currentPath = "";
                 this.activeSession = null;
            }
        },
        newSession:function(args){
            // Set up new session 
            var sess = new EditSession(args.documentText||'');
            	sess.setMode((typeof args.ftype !== undefined) ? args.ftype : 'ace/javascript');
            	sess.setUseSoftTabs(true); //use spaces instead of tabs

            //load the item into the editor
            this.editor.setValue(sess.getValue());
            this.editor.gotoLine(0);
            var index = this.sessions.length;
            var newSess = $.extend({
                session:sess,
                owner:this,
                origHash:CryptoJS.MD5(sess.getValue()).toString(),
                changeHash:CryptoJS.MD5(sess.getValue()).toString(),
                updateChangeStatus: function(evt){
                	if(this.owner.activeSession === evt.data){	//evt.data is the newSess variable that got passed to the editor listener
	                	this.changeHash=CryptoJS.MD5(this.owner.editor.getValue()).toString();

					    if (this.origHash !== this.changeHash) {
	                        $('#save').addClass('changed').css("opacity","1").attr('disabled','false');
	                        if(this.tab){ this.tab.el.addClass('changed'); }
												    } else {
							$('#save').removeClass('changed');
						} 	
                	}
				},
                sessionId:index
            },args);
            
            $('#editor').on('keyup change',null,newSess,$.proxy(newSess.updateChangeStatus,newSess));
            
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