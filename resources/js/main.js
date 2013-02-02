var mainEdit = null;
var branch = null;

$(document).ready(function(){
    //viewport
	Condor.vp = new Condor.Viewport({
		vp:				$('#content'),
		DOMNodeAdded:	function(){},
		forceMatchWin:	true,
		afterResize:	function(){
					        $('#app-container').height(this.matchWindow);
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
                                $.getJSON("data/file-interactions",{xaction:'read'},function(list){ nd.processKids(list.payload); });
                            }else if(nd.depth > 0){
                                $.getJSON("data/file-interactions",{xaction:'read', path:nd.data.path},function(list){ nd.processKids(list.payload); });
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
                                           txt:    'ace/mode/text',
                                           xml:     'ace/mode/xml',
                                           xsl:     'ace/mode/xml',
                                           info:    'ace/mode/xml',
                                           adp:     'ace/mode/rhtml',
                                           tcl:     'ace/mode/tcl',
                                           vuh:     'ace/mode/tcl',
                                           sh:      'ace/mode/sh'
                                       };
                                       
                                   $.get("data/editor-interactions",{xaction:'read', path:nd.data.path}, function(d){
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
    
    $('ul li#save').on('click',mainEdit.saveFunc());
    
    $('ul li#newfile').on('click',function(){
        var newFile = new Condor.textFrmObj({id:'ide_filename', passedCls: 'condor-modal-form-item'}); 
        var steve = new Condor.modalWindow({
            title: "Create a New File",
            content: [
                new Condor.formLabel({
                    text:'File Name:'
                }),
                newFile],
            bbar: [
                new Condor.btn({ text: 'Create New File' }),
                new Condor.btn({ text: 'Cancel' })
            ],
            width: 600,
            height: 200
        });
        
        steve.bbar[0].click = function(){
            var newFilePath = mainEdit.currentPath + newFile.val();
            $.post("data/editor-interactions",{xaction:'create',path:newFilePath});
            steve.close();
        };
        
        steve.bbar[1].click = function(){
            steve.close();
        };
        
    });
    
    var TabControl = function(args){
        var me = this;
        var params = $.extend({
            el:         $("<div/>").attr({id:'tab-control'}),
            target:     $("#content"),
            init:       function(){
                            me.target.css('position','relative').append(me.el);
                            $(document).keydown(function(e){
                                if(e.keyCode == 18) me.el.css('display','block').focus();   //18 = alt
                            }).keyup(function(e){
                                if(e.keyCode == 18) me.el.css('display','none');
                            });
                        }
        },args);
        $.extend(me,params);
        me.init();
    }
    
    new TabControl();
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
        saveFunc:function(editor,editorArr){
            try{
                var fileContent = editor.getValue();
                var activePath = editor._parent.activeSession.path;
                $.post("data/editor-interactions",{xaction:'update',path:activePath,content:base64_encode(fileContent)});
            }catch(e){
                Condor.errRpt("There is no file to save. Fool.");
            }
        },
        getSession:function(id){
            if (typeof this.sessions[id] !== 'undefined') {
                var sess = this.activeSession = this.sessions[id];
                this.currentPath = this.activeSession.branchPathl
                this.editor.setValue(sess.session.getValue());
                editor.gotoLine(0);
                return sess.session;
            } else{
                throw new Error("No such session!");
            }
        },
        newSession:function(args){
            
            var sess = new EditSession(args.documentText||'');
            sess.setMode(args.ftype ||'ace/javascript');
            //load the item into the editor
            this.editor.setValue(sess.getValue());
            this.editor.gotoLine(0);
                        
            var index = this.sessions.length;
            var newSess = $.extend({
                session:sess,
                sessionId:index
            },args);
            this.activeSession = newSess;
            this.sessions.push(newSess);
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
