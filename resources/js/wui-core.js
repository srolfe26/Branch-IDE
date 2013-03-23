var Wui = Wui || {};

//prevent AJAX caching in IE
$.ajaxSetup({ 
	cache: false,
	error: function(response){
				var err = $.parseJSON( response.responseText ) || {fatalError:'Aw Snap! There was a problem talking to the server.'};
				Wui.errRpt(err.fatalError);
			}
});

//Avoid 'console' errors in browsers that lack a console.
(function() {
    var method;
    var n = function(){};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];
        if (!console[method]) { console[method] = n; }    // Only stub undefined methods.
    }
}());

Wui.viewport = function(args){
    var me = this,
        params = $.extend({
        vp:				$('body'),
        offset:			null,
        vPadding:		null,
        calcVPadding:	function(){ for(var i in me.vObjects)    me.vPadding += (me.vObjects[i] || 0); },
        vObjects:		[],		// Objects or expressions that will affect the vertical height of the viewport
        matchWindow:	null,
        contentHeight:	null,
        height:			null,
        forceMatchWin:  false,  // Can be set to always match the window size (useful for ext apps)
        
        				/* Calculates the maximum size of the viewport versus the size of the size of the viewport contents and chooses the smaller */
        resize:			function(){
				        	me.beforeResize();
				        	
				        	me.contentHeight = me.vp.children('div:first').outerHeight(true);
							me.matchWindow = Math.round($.viewportH() - me.offset.top - me.vPadding);
							me.height = (me.matchWindow < me.contentHeight || me.forceMatchWin) ? me.matchWindow : me.contentHeight;
							me.vp.height(me.height);

				        	me.afterResize();
			        	},
        beforeResize:	function(){},
        afterResize:	function(){},
        onInit:			function(){},
        DOMNodeAdded:	function(){ me.resize(); },
        init:       	function(){
                            //set the object for appending stuff
                            this.elAlias = this.vp;
            
                            //calculate initial values of items on page
				    	    me.offset = me.vp.offset();
				    	    me.calcVPadding();
				    	    
				    	    //initial resizing of viewport
				    	    me.resize();
				    	    
				    	    //tie viewport to the window
				    	    $(window).resize(me.resize);
				    	    
				    	    //give focus to the viewport
				    	    me.vp.focus();
				    	    
				    	    //resize viewport when DOM elements are added
				    	    me.vp.bind('DOMNodeInserted', me.DOMNodeAdded);
				    	    
				    	    //allow for further extension
				    	    me.onInit();
				    	}
    },args);
    $.extend(me,new Wui.o(params));
    me.init();
}


//displays error and executes a function on window close if any
Wui.errRpt = function(errMsg, msgTitle, buttons, callback){
	var newErr = new Wui.window({
		isModal:    true,
	    title:		msgTitle || 'Error', 
		items:    	[{el: $('<p class="err">' + errMsg + '</p>')}], 
		width:		350, 
		height:		200,
		bbar:		buttons || [],
		onWinClose:	callback || function(){}
	});
}


//displays a message and executes a function on window close if defined
Wui.Msg = function(msg, msgTitle, callback, content){
    var cntnt   = (content !== undefined) ? [{el: $('<p>' + msg + '</p>')}, content] : [{el: $('<p>' + msg + '</p>')}],
        Msv  = new Wui.window({
        title:      msgTitle || 'Message', 
        isModal:    true,
        items:      cntnt, 
        width:      400, 
        height:     300,
        onWinClose: callback || function(){}
    });
}


//displays an iframe and executes a function on window close if specified
Wui.HelpWindow = function(msgTitle, src, width, height, callback){
    var cntnt = [{el: $('<iframe>').attr({src:src}).css({height:'100%',width:'100%', border:'none'})}],
    newErr  = new Wui.window({
        title:      msgTitle || 'Message', 
        items:      cntnt, 
        width:      width || 600, 
        height:     height || 400,
        onWinClose: callback || function(){}
    });
}

/********************************** WUI RANDOM NUMBER GENERATOR ************************************/
Wui.randNum = function(lower,upper) {
    upper = upper - lower + 1 ;
    return ( lower + Math.floor(Math.random() * upper) );
}

/********************************** WUI GET LARGEST Z-INDEX ************************************/
Wui.maxZ = function(){
    return Math.max.apply(null, 
            $.map($('body > *'), function(e,n) {
                if ($(e).css('position') != 'static')
                  return parseInt($(e).css('z-index')) || 1;
            })
        );
};

/********************************** WUI TEMPLATE ENGINE ************************************/
Wui.tplt = function(args){
	var me = this;
	$.extend(me,{
		tplt:	'<li>{itm}</li>',
		data:	{itm:"srn"},
		make:	function(){
					if(me.data !== null && me.data !== undefined){
					    var tplCopy = me.tplt;
	                    return $(tplCopy.replace(/\{(\w*)\}/g,function(m,key){return me.data.hasOwnProperty(key) ? me.data[key] : "";}));
					}
					throw new Error('There was no data passed into the template engine.');
				}
	});	
	$.extend(me,args);
}

/********************************** WUI DETERMINES IF A CLICK OR 2 OBJECTS OVERLAP ************************************/
Wui.overlap = function() {
    if(arguments[0].hasOwnProperty('pageX')){
        var x = arguments[0].pageX,
            y = arguments[0].pageY,
            o = arguments[1],
            d = [o.offset(), o.outerHeight(), o.outerWidth()];
        return !(o.length === 1 && !((x >= d[0].left && x <= (d[0].left + d[2])) && (y >= d[0].top && y <= (d[0].top + d[1]))));  
    }else{
        try{
            var intersectors = [],
                $target = $(arguments[0]),
                tAxis   = $target.offset(),
                t_x     = [tAxis.left, tAxis.left + $target.outerWidth()],
                t_y     = [tAxis.top, tAxis.top + $target.outerHeight()];
    
            $(arguments[1]).each(function(){
                  var $this     = $(this),
                      thisPos   = $this.offset(),
                      i_x       = [thisPos.left, thisPos.left + $this.outerWidth()],
                      i_y       = [thisPos.top, thisPos.top + $this.outerHeight()];
    
                  if ( t_x[0] < i_x[1] && t_x[1] > i_x[0] &&
                       t_y[0] < i_y[1] && t_y[1] > i_y[0]) {
                      intersectors.push($this);
                  }
            });
            return (intersectors.length > 0);
        }catch(e){
            return false;   //console.log(e);
        }
    }
}

/********************* WUI OBJECT *************************/
Wui.o = function(args){
    var me = this;
    $.extend(me,{
        el:         $('<span>'),
        elAlias:    null,
        appendTo:   null,
        cls:        null,
        prependTo:  null,
        width:      null,
        height:     null,
        items:      [],
        remove:     function(){
                        this.el.remove();
                        delete this;
                    },
        push:       function(){
                        var el = this.elAlias || this.el;
                        for(var itm in arguments)
                            el.append(me.cssByParam(arguments[itm]));
                        return Array.prototype.push.apply(this.items,arguments);
                    },
        splice:     function(idx, howMany){
                        var el = this.elAlias || this.el;
                        
                        //remove specified elements
                        for(var i = idx; i < (idx + howMany); i++)
                            if(this.items[i]) this.items[i].el.remove();
                        
                        //standard splice functionality on array and calcs
                        var retVal = Array.prototype.splice.apply(this.items, arguments),
                            numAdded    = arguments.length - 2;
            
                        //append any additional el's in proper order
                        if(this.items.length == numAdded){                      //items ended up replacing the array
                            for(var i = 0; i < this.items.length; i++)          el.append(me.cssByParam(this.items[i]));
                        }else if(this.items[(idx + numAdded)] == undefined){    //meaning the new items were inserted at the end of the array
                            for(var i = idx; i < this.items.length; i++)        me.cssByParam(this.items[i]).insertAfter(this.items[i-1].el);
                        }else{                                                  //items at the beginning/middle of the array
                            for(var i = (idx + numAdded); i > 0; i--)           me.cssByParam(this.items[i-1]).insertBefore(this.items[i].el);
                        }
                        
                        return retVal;
                    },
        cssByParam: function(m) { return m.el.addClass(m.cls).width(m.width).height(m.height); },
        place:      function(){
                        //add class width and height
                        me.cssByParam(this);
                        
                        //adds the objects items if any
                        var el = this.elAlias || this.el;

                        for(var itm in this.items){
                            if(this.items[itm]){
                                if(this.items[itm].el !== undefined){
                                    if(this.items[itm].el.appendTo)
                                        this.items[itm].el.appendTo(el);
                                }else{
                                    console.log(this.items[itm]);
                                    throw new Error('The object passed into placed doesn\'t have a required \'el\' property.');
                                }
                            }
                                
                        }
                            
                            
                        //adds the object to the DOM
                        var target = null;
                        if(target = this.appendTo || this.prependTo){
                            this.el[((this.appendTo !== null) ? 'appendTo' : 'prependTo')](target);
                            if(this.hasOwnProperty('onRender'))  this.onRender();
                        }
                    }
    },args);
}

/********************* WUI BUTTON ************************************/
Wui.button = function(args){
	var me = this,
	params = $.extend({
        el:         $("<a>").attr({href:'javascript:void(0);', unselectable:'on'}),
        iconCls:    null,
        init:       function(){ 
                        me.el.click(function(e){me.click(arguments); e.stopPropagation();}).html(me.text).attr({title:me.toolTip});
                        me.place();
                    },
        click:      function(){},
        text:       'Button',
        setText:    function(txt){ me.el.text(txt); },
        toolTip:    null
	},args);
	$.extend(params,{cls: 'wui-btn ' + (params.cls || '')});
    $.extend(me,new Wui.o(params));
	me.init();
}

/********************* WUI WINDOW *************************/
Wui.window = function(args){
	var me = this,
	params = $.extend({
		modalEl:	$("<div>").addClass('wui-overlay'),
		windowEl:	$("<div>").addClass('wui-window'),
		appendTo:   $('body'),
		title:		'Window',
		tbar:       [],     
		bbar:       [],
		container:  $("<div>").addClass('wui-window-content'),
		width:		600,
		height:		400,
		onWinOpen:	function(){},
		onWinClose:	function(){},
		isModal:	false,            		
	    init:       function(){
            	        me.header    = new Wui.o({el:$('<div/>'), cls:'wui-window-header', items:me.tbar}),
                        me.footer    = new Wui.o({el:$('<div/>'), cls:'wui-window-footer', items:me.bbar});
	                    me.header.el.append($("<h1>")),
	                    me.setTitle(me.title);
	                    
	                    //actually add everything to the DOM
                        me.header.place();
                        me.footer.place();
                        me.windowEl.append(
                            me.header.el,
                            $("<div>").addClass('wui-win-wrap').append(me.container),
                            me.footer.el
                        )
                        .height(me.height)
                        .width(me.width)
                        .resizable({
                            minWidth:    me.width,
                            minHeight:   me.height,
                        })
                        .draggable({handle: ".wui-window-header", start:bringToFront});
                           
                        //add window close buttons and a close button to the footer if there are no other options
                        me.header.push(new Wui.button({click:function(){me.close()}, text:'X'}));
                        if(me.footer.items.length == 0) me.footer.push(new Wui.button({click:function(){me.close()}, text:'Close'}));
                           
                        //Render the window on the document
                        me.elAlias = me.container;
                        me.place();
                        me.el
                        .css('z-index',Wui.maxZ() + 1)
                        .click(bringToFront);
                        
                        //runs on-render for the window items
                        for(var itm in this.items)
                            if(this.items[itm].hasOwnProperty('onRender'))
                                this.items[itm].onRender();
                        
                        me.resize(me.center);
                        me.onWinOpen(me);
                        
                        function bringToFront(){
                            if(parseInt((me.el.css('z-index')) || 1) < Wui.maxZ()){
                                me.el.css('z-index',Wui.maxZ() + 1);
                            }
                        }
                    },
        setTitle:   function(t){ me.header.el.children('h1:first').text(t); },
        resize:		function(callback, resizeWidth, resizeHeight){
				        if(arguments.length <= 1){
					        //size the window to fit its contents if possible
	            		    var pad = parseInt(me.container.css('padding-top')) + 1,
	                        	totalHeight = me.header.el.outerHeight() + me.footer.el.outerHeight() + (pad * 2);
	                        
	                        for(var j in me.items){
	                            if(typeof(me.items[j]) == 'object'){
	                                if(me.items[j].el.outerHeight)  totalHeight += Math.ceil(me.items[j].el.outerHeight(true));
	                                else                            totalHeight += Math.ceil($(me.items[j].el[0]).outerHeight(true));  
	                            }
	                        }
	                        
	                        //increase window size as large as is needed to fit window content without going over the height of the window
	                        me.windowEl.height(((totalHeight > ($.viewportH() - pad)) ? ($.viewportH() - pad) : (totalHeight < me.height) ? me.height : totalHeight))
				        }else{
					        me.windowEl.height(me.height = resizeHeight);
					        me.windowEl.width(me.width = resizeWidth);
				        }
				        
				        if(callback !== undefined && typeof callback == 'function')	callback();
			        },
        center:		function(){
				        me.windowEl.css('top',Math.floor(($.viewportH() / 2) - (me.windowEl.height() / 2)) + 'px');
                        if(!me.isModal && !$.browser.msie)
                        	me.windowEl.css('left',Math.floor(($.viewportW() / 2) - (me.windowEl.width() / 2)) + 'px');
			        },		
		close:		function(){
						me.onWinClose(me);
						me.el.remove();
						delete me;
					}
	},args);
	$.extend(params,{el: (params.isModal ? params.modalEl.append(params.windowEl) : params.windowEl)});
	$.extend(me,new Wui.o(params));
	me.init();
}
