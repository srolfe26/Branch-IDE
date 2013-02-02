var Condor = Condor || {};

//prevent AJAX caching in IE
$.ajaxSetup({ 
	cache: false,
	error: function(response){
				var err         = $.parseJSON( response.responseText ) || {fatalError:'Aw Snap! There was a problem talking to the server.'};
				var errCont     = $("<div>").html(err.fatalError);
				var reportBtn   = new Condor.btn({
                                    text:  'Report This Error',
                                    click: function(){ Condor.jiraWindow({ type: 'Bug', serverSpew: err.fatalError }); }
                                });
				var newErr      = new Condor.modalWindow({
                					title:		'Error On Server', 
                					content:	[{el: errCont}],
                					bbar:		[reportBtn],
                					width:		350, 
                					height:		350
                				});
			}
});


Condor.Viewport = function(args){
    var me = this;
    $.extend(me,{
        vp:				$('body'),
        offset:			null,
        vPadding:		null,
        calcVPadding:	function(){ for(var i in me.vObjects)    me.vPadding += (me.vObjects[i] || 0); },
        vObjects:		[],		// Objects or expressions that will affect the vertical height of the viewport
        matchWindow:	null,
        contentHeight:	null,
        height:			null,
        forceMatchWin:  false,  // Can be set to always match the window size (useful for ext apps)
        				/*
        					Calculates the maximum size of the viewport versus the size of
        					the size of the viewport contents and chooses the smaller
        				*/
        resize:			function(){
				        	me.beforeResize();
				        	
				        	me.contentHeight = me.vp.children('div:first').outerHeight(true);
							me.matchWindow = Math.round($(window).height() - me.offset.top - me.vPadding);
							me.height = (me.matchWindow < me.contentHeight || me.forceMatchWin) ? me.matchWindow : me.contentHeight;
							me.vp.height(me.height);

				        	me.afterResize();
			        	},
        beforeResize:	function(){},
        afterResize:	function(){},
        DOMNodeAdded:	function(){ me.resize(); },
        init:       	function(){
				    	    //calculate initial values of items on page
				    	    me.offset = me.vp.offset();
				    	    me.calcVPadding();
				    	    
				    	    //initial resizing of viewport
				    	    me.resize();
				    	    
				    	    //tie viewport to the window
				    	    $(window).resize(function(){ me.resize(); });
				    	    
				    	    //give focus to the viewport
				    	    me.vp.focus();
				    	    
				    	    //resize viewport when DOM elements are added
				    	    me.vp.bind('DOMNodeInserted', me.DOMNodeAdded);
				    	}
    });
    $.extend(me,args);
    me.init();
}



//opens a window to report a JIRA Issue
Condor.jiraWindow = function(params){
	Condor.reportJiraErr(1, params.serverSpew);
}


//displays error and executes a function on window close if any
Condor.errRpt = function(errMsg, callback, msgTitle){
	var newErr = new Condor.modalWindow({
		title:		msgTitle || 'Error', 
		content:	[{el: $('<p class="condor-err-p">' + errMsg + '</p>')}], 
		width:		350, 
		height:		200,
		onWinClose:	callback || function(){}
	});
}


//displays a message and executes a function on window close if defined
Condor.Msg = function(msg, msgTitle, callback, content){
    var cntnt   = (content !== undefined) ? [{el: $('<p>' + msg + '</p>')}, content] : [{el: $('<p>' + msg + '</p>')}],
        newErr  = new Condor.modalWindow({
        title:      msgTitle || 'Message', 
        content:    cntnt, 
        width:      600, 
        height:     200,
        onWinClose: callback || function(){}
    });
}


//displays an iframe and executes a function on window close if specified
Condor.HelpWindow = function(msgTitle, src, width, height, callback){
    var cntnt = [{el: $('<iframe>').attr({src:src}).css({height:'100%',width:'100%', border:'none'})}],
    newErr  = new Condor.modalWindow({
        title:      msgTitle || 'Message', 
        content:    cntnt, 
        width:      width || 600, 
        height:     height || 400,
        onWinClose: callback || function(){}
    });
}

/********************************** CONDOR RANDOM NUMBER GENERATOR ************************************/
Condor.randNum = function(lower,upper) {
    upper = upper - lower + 1 ;
    return ( lower + Math.floor(Math.random() * upper) );
}

/********************************** CONDOR TEMPLATE ENGINE ************************************/
Condor.tplt = function(args){
	var me = this;
	$.extend(me,{
		tplt:	'<li>{itm}</li>',
		data:	{itm:"srn"},
		make:	function(){
					var tplCopy = me.tplt;
					return $(tplCopy.replace(/\{(\w*)\}/g,function(m,key){return me.data.hasOwnProperty(key) ? me.data[key] : "";}));
				}
	});	
	$.extend(me,args);
}



/********************* CONDOR FLAT BUTTON ************************************/
Condor.btn = function(args){
	var me = this;
	$.extend(me,{
        el:         $("<a>").attr({href:'javascript:void(0);'}).addClass('condor-modal-flat-btn'),
        iconCls:    null,
        cls:        null,
        init:       function(){ 
                        me.el.click(me.click); 
                        me.el.text(me.text);
                        
                        if(me.toolTip != null) me.el.attr({title:me.toolTip});
                        
                        //add class if it is defined as a string or an array of classes
                        if(me.cls !== null && me.cls.substr)   me.el.addClass(me.cls);
                        if(me.cls !== null && me.cls.forEach)  me.cls.forEach(function(element){me.addClass(element)});
                    },
        click:      function(){},
        text:       'Button',
        toolTip:    null
	});
	
	$.extend(me,args);
	me.init();
}


/********************* CONDOR MODAL WINDOW ************************************/
Condor.modalWindow = function(args){
	var me = this;
	$.extend(me,{
		el:			$("<div>").addClass('condor-overlay'),
		title:		'This is a Window!',
		tbar:		[],
		bbar:		[],
		content:	[],
		header:		$("<div>").addClass('condor-window-header'),
		footer:		$("<div>").addClass('condor-window-footer'),
		innerCntnt: $("<div>").addClass('condor-window-content'),	
		windowEl:	{},
		width:		400,
		height:		300,
		onWinOpen:	function(){},
		onWinClose:	function(){},
		
		render:		function(){
						//add items to the header			
						me.header.append($("<h1>").text(me.title));
						me.tbar.push(new Condor.btn({click:function(){me.close()}, text:'X'}));
						for(var itm in me.tbar){ me.header.append(me.tbar[itm].el); }
										
						//add items to the content
						for(itm in me.content){ me.innerCntnt.append(me.content[itm].el); }
						var cntnt = $("<div>").addClass('condor-window-content-wrapper').append(me.innerCntnt);
						
						//add a close button to the footer if there is no other options
						if(me.bbar.length == 0)
							me.bbar.push(new Condor.btn({click:function(){me.close()}, text:'Close'}));
						for(var itm in me.bbar){ me.footer.append(me.bbar[itm].el); }
						
						//actually add everything to the DOM
						me.windowEl = $("<div>").addClass('condor-modal-window')
							.append(me.header)
							.append(cntnt)
							.append(me.footer)
							.draggable({ handle: ".condor-window-header" })
							.resizable({
							    minWidth:    me.width,
							    minHeight:   me.height,
							})
							.height(me.height).width(me.width);
						me.windowEl.appendTo(me.el);
						me.el.appendTo('body');
						
						//fire onRender events for items in tbar, content, and bbar
						for(var itm in me.tbar) if(me.tbar[itm].onRender) me.tbar[itm].onRender();
						for(var itm in me.content) if(me.content[itm].onRender) me.content[itm].onRender();
						for(var itm in me.bbar) if(me.bbar[itm].onRender) me.bbar[itm].onRender();
						me.sizeNCenter();
						me.onWinOpen(me);
					},
		sizeNCenter:function(){
            		    //size the window to fit its contents if possible
                        var totHeight = me.header.outerHeight() + me.footer.outerHeight()
                                        + ((me.innerCntnt.outerHeight() - me.innerCntnt.height()) * 2);
                        
                        for(var j in me.content){
                            //a bunch of nosense because extJS can't mind its own business
                            if(typeof(me.content[j]) == 'object'){
                                if(me.content[j].el.outerHeight)     totHeight += Math.floor(me.content[j].el.outerHeight(true));
                                else                                 totHeight += Math.floor($(me.content[j].el[0]).outerHeight(true));  
                            }
                        }   
                        
                        totHeight = (totHeight > ($(window).height() - 40)) ? ($(window).height() - 40) : totHeight;
                        totHeight = (totHeight < me.height) ? me.height : totHeight;
                        me.windowEl.height(totHeight);
                        
                        //vertically center window
                        me.windowEl.css('top',($(window).height() / 2) - (me.windowEl.height() / 2) + 'px');  
            		},			
		close:		function(){
						me.onWinClose(me);
						me.el.remove();
						delete me;
					}
	});
	//override default parameters with passed parameters and render
	$.extend(me,args);
	me.render();
	return me;
}