//Dependent on usurf-style/www/resources/js/condor-core.js to operate
/* One Click Upload - jQuery Plugin Copyright (c) 2008 Michael Mitchell - Modified 2012 Stephen Nielsen */
(function(e){e.fn.upload=function(t){t=e.extend({name:"file",enctype:"multipart/form-data",action:"",autoSubmit:true,onSubmit:function(){},onComplete:function(){},onSelect:function(){},params:{}},t);return new e.ocupload(this,t)},e.ocupload=function(t,n){var r=this;var i=(new Date).getTime().toString().substr(8);var s=e('<iframe id="iframe'+i+'" name="iframe'+i+'"></iframe>').css({display:"none"});var o=e('<form method="post" enctype="'+n.enctype+'" action="'+n.action+'" target="iframe'+i+'"></form>').css({margin:0,padding:0});var u=e('<input name="'+n.name+'" type="file" />').css({position:"relative",display:"block",marginLeft:-175+"px",opacity:0});t.wrap("<div></div>");o.append(u);t.after(o);t.after(s);var f=t.parent().addClass("condor-browse-btn");u.change(function(){r.onSelect();if(r.autoSubmit){r.submit()}});e.extend(this,{autoSubmit:n.autoSubmit,onSubmit:n.onSubmit,onComplete:n.onComplete,onSelect:n.onSelect,filename:function(){return u.attr("value")},params:function(t){var t=t?t:false;if(t){n.params=e.extend(n.params,t)}else{return n.params}},name:function(e){var e=e?e:false;if(e){u.attr("name",value)}else{return u.attr("name")}},action:function(e){var e=e?e:false;if(e){o.attr("action",e)}else{return o.attr("action")}},enctype:function(e){var e=e?e:false;if(e){o.attr("enctype",e)}else{return o.attr("enctype")}},set:function(t,n){function i(e,t){switch(e){default:throw new Error("[jQuery.ocupload.set] '"+e+"' is an invalid option.");break;case"name":r.name(t);break;case"action":r.action(t);break;case"enctype":r.enctype(t);break;case"params":r.params(t);break;case"autoSubmit":r.autoSubmit=t;break;case"onSubmit":r.onSubmit=t;break;case"onComplete":r.onComplete=t;break;case"onSelect":r.onSelect=t;break}}var n=n?n:false;if(n){i(t,n)}else{e.each(t,function(e,t){i(e,t)})}},submit:function(){this.onSubmit();e.each(n.params,function(t,n){if(o.children("input[name="+t+"]").length==0){o.append(e('<input type="hidden" name="'+t+'" value="'+n+'" />'))}else{o.children("input[name="+t+"]").remove();o.append(e('<input type="hidden" name="'+t+'" value="'+n+'" />'))}});o.submit();s.unbind().load(function(){var t=document.getElementById(s.attr("name"));var n=e(t.contentWindow.document.body).text();r.onComplete(n)})}})}})(jQuery);
/*jHtmlArea - http://jhtmlarea.codeplex.com - (c)2012 Chris Pietschmann - Modified 2013 Stephen Nielsen */
(function(e){e.fn.htmlarea=function(e){if(e&&typeof e==="string"){var n=[];for(var r=1;r<arguments.length;r++){n.push(arguments[r])}var i=t(this[0]);var s=i[e];if(s){return s.apply(i,n)}}return this.each(function(){t(this,e)})};var t=window.jHtmlArea=function(e,n){if(e.jquery){return t(e[0])}if(e.jhtmlareaObject){return e.jhtmlareaObject}else{return new t.fn.init(e,n)}};t.fn=t.prototype={jhtmlarea:"0.7.5",init:function(r,i){if(r.nodeName.toLowerCase()==="textarea"){var s=e.extend({},t.defaultOptions,i);r.jhtmlareaObject=this;var o=this.textarea=e(r);var u=this.container=e("<div/>").addClass("jHtmlArea").insertAfter(o);var a=this.toolbar=e("<div/>").addClass("ToolBar").appendTo(u);n.initToolBar.call(this,s);var f=this.iframe=e("<iframe/>").height(o.height()-20);var l=this.htmlarea=e("<div/>").append(f);u.append(l).append(o.hide());n.initEditor.call(this,s);n.attachEditorEvents.call(this);f.height(f.height()-a.height());a.width(o.width()-2);if(s.loaded){s.loaded.call(this)}}},dispose:function(){this.textarea.show().insertAfter(this.container);this.container.remove();this.textarea[0].jhtmlareaObject=null},execCommand:function(e,t,n){this.iframe[0].contentWindow.focus();this.editor.execCommand(e,t||false,n||null);this.updateTextArea()},ec:function(e,t,n){this.execCommand(e,t,n)},queryCommandValue:function(e){this.iframe[0].contentWindow.focus();return this.editor.queryCommandValue(e)},qc:function(e){return this.queryCommandValue(e)},getSelectedHTML:function(){if(e.browser.msie){return this.getRange().htmlText}else{var t=this.getRange().cloneContents();return e("<p/>").append(e(t)).html()}},getSelection:function(){if(e.browser.msie){return this.editor.selection}else{return this.iframe[0].contentDocument.defaultView.getSelection()}},getRange:function(){var e=this.getSelection();if(!e){return null}return e.getRangeAt?e.getRangeAt(0):e.createRange()},html:function(e){if(e){this.textarea.val(e);this.updateHtmlArea()}else{return this.toHtmlString()}},pasteHTML:function(t){this.iframe[0].contentWindow.focus();var n=this.getRange();if(e.browser.msie){n.pasteHTML(t)}else if(e.browser.mozilla){n.deleteContents();n.insertNode(e(t.indexOf("<")!=0?e("<span/>").append(t):t)[0])}else{n.deleteContents();n.insertNode(e(this.iframe[0].contentWindow.document.createElement("span")).append(e(t.indexOf("<")!=0?"<span>"+t+"</span>":t))[0])}n.collapse(false);n.select()},bold:function(){this.ec("bold")},italic:function(){this.ec("italic")},underline:function(){this.ec("underline")},strikeThrough:function(){this.ec("strikethrough")},removeFormat:function(){this.ec("removeFormat",false,[]);this.unlink()},link:function(){if(e.browser.msie){this.ec("createLink",true)}else{this.ec("createLink",false,prompt("Link URL:","http://"))}},unlink:function(){this.ec("unlink",false,[])},unorderedList:function(){this.ec("insertunorderedlist")},justifyLeft:function(){this.ec("justifyLeft")},justifyCenter:function(){this.ec("justifyCenter")},justifyRight:function(){this.ec("justifyRight")},formatBlock:function(e){this.ec("formatblock",false,e||null)},showHTMLView:function(){this.updateTextArea();this.textarea.show();this.htmlarea.hide();e("ul li:not(li:has(a.html))",this.toolbar).hide();e("ul:not(:has(:visible))",this.toolbar).hide();e("ul li a.html",this.toolbar).addClass("highlighted")},hideHTMLView:function(){this.updateHtmlArea();this.textarea.hide();this.htmlarea.show();e("ul",this.toolbar).show();e("ul li",this.toolbar).show().find("a.html").removeClass("highlighted")},toggleHTMLView:function(){this.textarea.is(":hidden")?this.showHTMLView():this.hideHTMLView()},toHtmlString:function(){return $.trim(this.editor.body.innerHTML.replace(/MsoNormal/gi,"").replace(/<\/?link[^>]*>/gi,"").replace(/<\/?meta[^>]*>/gi,"").replace(/<\/?xml[^>]*>/gi,"").replace(/<\?xml[^>]*\/>/gi,"").replace(/<!--(.*)-->/gi,"").replace(/<!--(.*)>/gi,"").replace(/<!(.*)-->/gi,"").replace(/<w:[^>]*>(.*)<\/w:[^>]*>/gi,"").replace(/<w:[^>]*\/>/gi,"").replace(/<\/?w:[^>]*>/gi,"").replace(/<m:[^>]*\/>/gi,"").replace(/<m:[^>]>(.*)<\/m:[^>]*>/gi,"").replace(/<o:[^>]*>([.|\s]*)<\/o:[^>]*>/gi,"").replace(/<o:[^>]*>/gi,"").replace(/<o:[^>]*\/>/gi,"").replace(/<\/o:[^>]*>/gi,"").replace(/<\/?m:[^>]*>/gi,"").replace(/style=\"([^>]*)\"/gi,"").replace(/style=\'([^>]*)\'/gi,"").replace(/class=\"(.*)\"/gi,"").replace(/class=\'(.*)\'/gi,"").replace(/<p[^>]*>/gi,"<p>").replace(/<\/p[^>]*>/gi,"</p>").replace(/<span[^>]*>/gi,"").replace(/<\/span[^>]*>/gi,"").replace(/<st1:[^>]*>/gi,"").replace(/<\/st1:[^>]*>/gi,"").replace(/<font[^>]*>/gi,"").replace(/<\/font[^>]*>/gi,"").replace(/[\r\n]/g," ").replace(/<wordPasteong><\/wordPasteong>/gi,"").replace(/<p><\/p>/gi,"").replace(/\/\*(.*)\*\//gi,"").replace(/<!--/gi,"").replace(/-->/gi,"").replace(/<style[^>]*>[^<]*<\/style[^>]*>/gi,"").replace(/<hr>/gi,""))},toString:function(){return this.editor.body.innerText},updateTextArea:function(){this.textarea.val(this.toHtmlString())},updateHtmlArea:function(){this.editor.body.innerHTML=this.textarea.val()}};t.fn.init.prototype=t.fn;t.defaultOptions={toolbar:[["html"],["bold","italic","underline","strikethrough","|","subscript","superscript"],["increasefontsize","decreasefontsize"],["orderedlist","unorderedlist"],["indent","outdent"],["justifyleft","justifycenter","justifyright"],["link","unlink","image","horizontalrule"],["p","h1","h2","h3","h4","h5","h6"],["cut","copy","paste"]],css:null,toolbarText:{bold:"Bold",italic:"Italic",underline:"Underline",strikethrough:"Strike-Through",pasteWord:"Paste From MS Word",justifyleft:"Left Justify",justifycenter:"Center Justify",justifyright:"Right Justify",link:"Insert Link",unlink:"Remove Link",unorderedlist:"Insert Unordered List",html:"Show/Hide HTML Source View"}};var n={toolbarButtons:{strikethrough:"strikeThrough",unorderedlist:"unorderedList",justifyleft:"justifyLeft",justifycenter:"justifyCenter",justifyright:"justifyRight",html:function(e){this.toggleHTMLView()}},initEditor:function(e){var t=this.editor=this.iframe[0].contentWindow.document;t.designMode="on";t.open();t.write(this.textarea.val());t.close();if(e.css){var n=t.createElement("link");n.rel="stylesheet";n.type="text/css";n.href=e.css;t.getElementsByTagName("head")[0].appendChild(n)}},initToolBar:function(t){function r(r){var o=e("<ul/>").appendTo(i.toolbar);for(var u=0;u<r.length;u++){var a=r[u];if((typeof a).toLowerCase()==="string"){if(a==="|"){o.append(e('<li class="separator"/>'))}else{var f=function(e){var t=n.toolbarButtons[e]||e;if((typeof t).toLowerCase()==="function"){return function(e){t.call(this,e)}}else{return function(){this[t]();this.editor.body.focus()}}}(a.toLowerCase());var l=t.toolbarText[a.toLowerCase()];o.append(s(a.toLowerCase(),l||a,f))}}else{o.append(s(a.css,a.text,a.action))}}}var i=this;var s=function(t,n,r){return e("<li/>").append(e("<a href='javascript:void(0);'/>").addClass(t).attr("title",n).click(function(){r.call(i,e(this))}))};if(t.toolbar.length!==0&&n.isArray(t.toolbar[0])){for(var o=0;o<t.toolbar.length;o++){r(t.toolbar[o])}}else{r(t.toolbar)}},attachEditorEvents:function(){var t=this;var n=function(){t.updateHtmlArea()};this.textarea.click(n).keyup(n).keydown(n).mousedown(n).blur(n);var r=function(){t.updateTextArea()};e(this.editor.body).click(r).keyup(r).keydown(r).mousedown(r).blur(r);e("form").submit(function(){t.toggleHTMLView();t.toggleHTMLView()});if(window.__doPostBack){var i=__doPostBack;window.__doPostBack=function(){if(t){if(t.toggleHTMLView){t.toggleHTMLView();t.toggleHTMLView()}}return i.apply(window,arguments)}}},isArray:function(e){return e&&typeof e==="object"&&typeof e.length==="number"&&typeof e.splice==="function"&&!e.propertyIsEnumerable("length")}}})(jQuery)

/************************* FORM LABEL ****************************/
Condor.formLabel = function(args){
    var me = this;
    var params = $.extend({
        el:         $('<label>'),
        text:       '',
        attrFor:    '',
        lblClass:   'condor-modal-form-label',
        init:       function(initVal){ me.el.attr('for',me.attrFor).text(me.text).addClass(me.lblClass); }
    },args);
    
    $.extend(me,params);
    me.init();
};

/************************* GENERIC FORM ITEM ****************************/
Condor.cmuFrmObj = function(args){
    var me = this;
    $.extend(me,{
        value:      0,
        dataColId:  null,
        visColId:   null,
        elId:       null,
        el:         {},
        passedCls:  '',
        errCls:     'condor-required-field',
        parentFrm:  null,
        updateRel:  function(val){
                        //compensate for weird scope TODO: figure out scope and remove val requirement
                        me.value = val;
                        
                        //add info to related meta
                        if(me.dataColId != 0 && me.parentFrm !== null)
                            for(var i in me.parentFrm.content)
                                if(me.parentFrm.content[i].dataColId == me.dataColId && me.parentFrm.content[i].useData == 0)
                                    me.parentFrm.content[i].val(me.value);
                        return true;
                    },
        init:       function(){}
    });
    $.extend(me,args);
}


/********************************** CONDOR SEARCH COMBO BOX ************************************/
Condor.searchCombo = function(args){
	var me = this;
	$.extend(me,{
		valueField:	$('<input type="text">'),
		rsltTarget:	$('<ul>'),
		dfltTxt:	'Type something',
		etDfltTxt:	function(val){
						if(val !== undefined)	me.dfltTxt = val;
						else					return me.dfltTxt;
					},
		noRsltTxt:	'Your search returned no results.',
		tplEngine:	null,
		template:	'<li><a href="{uri}">{item_title}</a></li>',
		rsltCount:	0,
		currSearch: '',
		selectItm:	null,
		rsltHover:	function(itmTarget){
						if(itmTarget.addClass === undefined) {var itmTarget = $(itmTarget.currentTarget);}
						me.rsltTarget.children().removeClass('selected');
						me.selectItm = itmTarget;
						me.selectItm.addClass('selected');
					},
		selectHovr:	false,
		etSlctHvr:	function(val){
						if(val !== undefined)	me.selectHovr = val;
						else					return me.selectHovr;
					},
		rsltClick:	function(){},
			
		init:		function(){
						me.valueField.val(me.dfltTxt)
						.focus(function(){ 
							if(me.valueField.val() == me.dfltTxt) me.valueField.val(''); 
						})
						.blur(function(){ 
							if(me.valueField.val().length == 0) me.valueField.val(me.dfltTxt); 
							me.onBlur(me);
						})
						.keyup(function(evnt){
							var currVal = me.valueField.val();
							
							if(currVal.length <= 2) { me.clrSearch(); me.currSearch = me.dfltTxt; }
							if(currVal.length > 2 && currVal != me.currSearch){
								me.currSearch = currVal;
								me.doSearch(currVal);
							}
							if(me.rsltCount > 0){
								switch(evnt.keyCode){
								case 40:	//down arrow
									if(me.selectItm === null){
										me.rsltHover(me.rsltTarget.children('li:eq(' + 0 + ')'));
									}else{
										var idx = me.selectItm.index();
											idx = ((idx + 1) < me.rsltTarget.children().length) ? idx + 1 : idx;
											me.rsltHover(me.rsltTarget.children('li:eq(' + idx + ')'));
									}
									
									//scroll the list to the currently selected item
                                    if(me.selectItm !== null){
                                        var beforeHeight = 0;
                                        me.selectItm.siblings(':lt(' +me.selectItm.index()+ ')').each(function(){ beforeHeight+= $(this).outerHeight(); });
                                        me.selectItm.parent().animate({scrollTop:beforeHeight}, 300);
                                    }
									break;
								case 38:	//up arrow
									if(me.selectItm !== null){
										var idx = me.selectItm.index() - 1;
										
										if(idx < 0){
											me.valueField.focus();
											me.rsltTarget.children().removeClass('selected');
											me.selectItm = null;
										}else{
											me.rsltHover(me.rsltTarget.children('li:eq(' + idx + ')'));
										} 
									}

                                    //scroll the list to the currently selected item
									if(me.selectItm !== null){
									    var beforeHeight = 0;
	                                    me.selectItm.siblings(':lt(' +me.selectItm.index()+ ')').each(function(){ beforeHeight+= $(this).outerHeight(); });
	                                    me.selectItm.parent().animate({scrollTop:beforeHeight}, 100);
									}
									break;
								case 13:	//enter key
									if(me.selectItm !== null)	me.selectItm.click();
									break;
								}
							}
						});
					},
					
		doSearch:	function(){},
					
		clrSearch:	function(){ 
						me.rsltTarget.html('');
						me.rsltCount = 0;
						me.selectItm = null;
					},
		onBlur:		function(){},	
		makeRslt:	function(dataSet){
						me.rsltCount++;
						me.tplEngine.data = dataSet;
						me.rsltTarget.append(me.tplEngine.make()
								.mouseenter(function(evnt){ me.rsltHover(evnt); me.etSlctHvr(true); })
								.mouseleave(function(){ me.etSlctHvr(false); })
								.click(me.rsltClick));
						return true;
					}
	});
	
	//override default parameters with passed parameters
	$.extend(me,args);
	me.tplEngine = new Condor.tplt({tplt:me.template});
	me.init();
}



/************************* TEXT FORM OBJECT ****************************/
Condor.textFrmObj = function(args,initVal){
    var me = this;
    var params = $.extend({
        el:         $("<input>"),
        blankText:  '',
        setBlankText:function(val){
                        me.blankText = val;
                        me.el.val(me.blankText);
                        me.el.addClass(me.blankCls);
                    },
        blankCls:   'empty',
        init:       function(initVal) {
                        me.el.attr({
                            type : 'text',
                            vcid : me.visColId,
                            dcid : me.dataColId,
                            id : me.elId
                        })
                        .addClass(me.passedCls)
                        .focusin(function() { if(me.el.val() == me.blankText) me.el.val(''); me.el.removeClass(me.blankCls); })
                        .blur(function()    { if(me.val().length == 0) me.val(); });
            
                        me.val(initVal);
                    },
        val:        function(setVal) {
                        var v = me.el.val();
                        if(v === me.blankText || v == '' || v === null){
                            me.el.val(me.blankText);
                            me.el.addClass(me.blankCls);
                        }
                        
                        if (setVal === undefined)   return ((v == me.blankText) ? '' : v);
                        else                        me.el.val((setVal == '') ? me.blankText : setVal);
                    },
        tclVal:     function() {
                        return me.dataColId + ' {' + me.val() + ' }';
                    }
    },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}

/************************* TEXT AREA FORM OBJECT ****************************/
Condor.textAreaFrmObj = function(args,initVal){
    var me = this;
    var params = $.extend({
            init:   function(initVal){
                        me.el = $("<textarea>").attr({
                            //type: 'text',
                            vcid:   me.visColId,
                            dcid:   me.dataColId,
                            id:     me.elId
                        }).addClass(me.passedCls);
                        
                        me.val(initVal);
                    },
            val:    function(setVal){
                        if(setVal === undefined){
                            return me.el.val();
                        }else{
                            if(setVal !== null) me.el.val(setVal);
                        }
                    },
            tclVal: function(){ return me.dataColId + ' {' + me.el.val() + ' }'; }
        },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}


/************************* WYSIWYG AREA FORM OBJECT ****************************/
Condor.WYSIWYG = function(args,initVal){
    var me = this;
    var params = $.extend({
            onRender:function(){
                        me.el.htmlarea({
                            css: '/resources/usurf-cmu/css/condor-wysiwyg.css',
                            toolbar: [["bold","italic","underline","strikethrough"],
                                      ["link","unlink","unorderedlist"],
                                      ["justifyleft","justifycenter","justifyright"]], //["html"]
                            loaded: function(){}
                        });
                        
                        var iframe = me.el.parent('.jHtmlArea').find('iframe');
                        
                        me.el.parent('.jHtmlArea').resizable({
                            animateEasing: 'linear',
                            minWidth:   me.el.outerWidth(),
                            minHeight:  me.el.outerHeight(),
                            start:      function(evnt, ui){ me.iFrameOrigHeight = iframe.height(); },
                            resize:     function(evnt, ui){ iframe.height(ui.size.height - (ui.originalSize.height - me.iFrameOrigHeight)); }
                        });
                    }
            },args);
    $.extend(me,new Condor.textAreaFrmObj(params,initVal));
}


/************************* DATETIME PICKER OBJECT ****************************/
Condor.dateTimePicker = function(args,initVal){
    var me = this;
    var params = $.extend({
        passedCls:		'',
		blankText:		'',
		blankCls:		'empty',
		second:         1e3,
        minute:         6e4,
        hour:           36e5,
        day:            864e5,
        days:           ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],
        shortDays:      ["sun","mon","tue","wed","thu","fri","sat"],
        months:         ["january","february","march","april","may","june","july","august","september","october","november","december"],
        shortMonths:    ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
        sarcasmArray:   ["Not quite.","Huh?","Nope","Arg..","Sorry","What?","Bleck.","Nuh-uh.","Keep Trying.","No Entiendo."],
        value:          null,
        minDate:        null,
        setMinDate:     function(minDt){ 
                            me.minDate = me.translateDate(minDt.toString());
                            me.txtInput.el.datepicker( "option", "minDate", new Date(me.minDate.valueOf() + me.minute));
                        },
        prevText:       null,
        txtInput:       '',
        displayDiv:     $("<div>").addClass('condor-date-feedback'),
        init:           function(initVal){
                            me.txtInput = new Condor.textFrmObj({
								blankText:	me.blankText,
								blankCls:	me.blankCls,
								passedCls:	me.passedCls,
								visColId:	me.visColId,
								dataColId:	me.dataColId,
								elId:		me.elId
							});
							me.el = $("<div>").addClass('condor-date');
                    
                            /* add Text & Display To The Form */
                            me.txtInput.el.appendTo(me.el).keyup(function(evnt){ 
                                var txtVal = $.trim($(this).val());
                                if(me.prevText != txtVal) 
                                    me.processDate(txtVal); 
                                me.prevText = $.trim(txtVal);
                            });
                            if(me.elId == 0){ me.txtInput.el.removeAttr('id'); }
                                
                            me.txtInput.el.datepicker({
                                autoSize:       true,
                                buttonText:     '',
                                showOn:         'button',
                                minDate:        me.minDate,
                                constrainInput: false,
                                beforeShow:     function(txtElem, pickerObj){
                                                    if(me.validDate(me.value))  me.txtInput.el.datepicker('setDate',me.value);
                                                    else                        me.txtInput.val('');
                                                },
                                onSelect:       function(dateString, pickerObj){
                                                    if(me.value !== null){
                                                        me.value.setDate(pickerObj.selectedDay);
                                                        me.value.setMonth(pickerObj.selectedMonth);
                                                        me.value.setYear(pickerObj.selectedYear);
                                                    }else{
                                                        me.value = me.txtInput.el.datepicker('getDate');
                                                    }
                                                    me.txtInput.val(me.displayDate());
                                                }
                            });
                            me.el.append(me.displayDiv);
                            
                        me.val(initVal);   //clear validation requirement class if present
                        /*me.valueField.removeClass(me.errCls);*/
                        },
        validDate:       function(dt){
                            if(dt != null && dt.toString() == 'Invalid Date')   return false;
                            else if (dt == null)                                return false;
                            else                                                return true;
                        },
        translateDate:  function(ds){
                            var now         = new Date(), 
                                orig        = ds,
                                dateReg     = /\d{1,2}\/\d{1,2}\/\d{2,4}/,
                                ifDateReg   = /([a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|and,\d,\s,-]+)\s((millisecond|second|minute|hour|day|week|month|year)+[s]*)\s(from|after|before|previous to)+\s(.+)$/,
                                intvF       = ifDateReg.exec(ds.toLowerCase());
                            
                            //for interval specifications
                            if(intvF !== null){
                                var n        = me.num2Dec(intvF[1]),
                                    interval = {millisecond: 1,second:me.second,minute: me.minute,hour:me.hour,day:me.day,week:me.day * 7,year:(365 * me.day),
                                                month:(365 * me.day)/12},    //definition of month needs improvement
                                    intv    = interval[intvF[3]],
                                    directn = {from:1, after:1, before:-1, 'previous to':-1},
                                    dir     = directn[intvF[4]],
                                    dt      = me.translateDate(intvF[5]);
                                   
                                    return new Date(dt.valueOf() + (n * dir * intv));      
                            }
                           
                            //returns a match for "now"
                            if(ds.toLowerCase().match(/now/) !== null){ return now; }
                            
                            
                            if(ds.toLowerCase().match(/[stephen|steve] nielsen/) !== null){var e=now.getFullYear(),t="5/26/"+e,n=new Date(t);t=n>now?t:"5/26/"+(new Date(now.valueOf()+me.day*365)).getFullYear()+" ";me.value=new Date(t);var r=me.value.getMonth()+1+"/"+me.value.getDate()+"/"+me.value.getFullYear()+" "+" - "+parseInt((me.value.valueOf()-now.valueOf())/me.day)+" days left to buy a present.";me.displayDate(r);return}
                            ds = ds.toLowerCase()
                            .replace('noon','12')
                            .replace('midnight','00:00')
                            .replace(/o.clock/,'')
                            .replace(/(\d+)[st|nd|rd|th]+/,function(m,dt){ return dt; })                        // Strip 'nd', 'th', 'rd', 'st'
                            .replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,function(m,yr,mm,dd){                       // Change UTC dates to ISO
                                return mm + '/' + dd + '/' + yr;
                            })
                            .replace(/(\d{1,2})-(\d{1,2})-(\d{2,4})/g,function(m,mm,dd,yr){                     // Change other UTC dates to ISO
                                return mm + '/' + dd + '/' + yr;
                            })
                            .replace(/^(\d{1,2})-(\d{1,2})[\s]*/,function(m,mm,dd){ return mm + '/' + dd + ' '; }) // Change other UTC dates to ISO
                            .replace('at','@')                                                                  // Replace at with the @ symbol
                            .replace(/(today|tomorrow|yesterday)/,function(m,f){                                // Translate today, tomorrow & yesterday into dates
                                     var replaceDays = {'today':0, 'tomorrow':1, 'yesterday':-1}
                                         newDt = new Date(now.valueOf() + (me.day * replaceDays[f]));
                                     return  (newDt.getMonth() + 1) + '/' + newDt.getDate() + '/' 
                                     + newDt.getFullYear();
                                 })
                            .replace(/(next|last) ([a-z]{3,10})[ ]*([0-9]+)*/,function(n, dir, word, day){      // Translate days of week & months into dates
                                 var dayVal = me.day * ((dir == 'next') ? 1 : -1),
                                     dy = ($.inArray(word,me.days) > -1) ? $.inArray(word,me.days) 
                                     : $.inArray(word,me.shortDays),
                                     month = ($.inArray(word,me.months) > -1) ? $.inArray(word,me.months) 
                                     : $.inArray(word,me.shortMonths),
                                     useNum = (dy > -1) ? dy : (month > -1) ? month : -1,
                                     useFunc = (dy > -1) ? 'getDay' : (month > -1) ? 'getMonth' : '';
                                     
                                 if(useNum > -1){
                                     var nxt = now.valueOf(), inc = new Date(nxt += dayVal);
                                     while(inc[useFunc]() != useNum){
                                         nxt += dayVal;
                                         inc = new Date(nxt);
                                     }
                                     if(month != undefined && month != -1 && day.length != 0){
                                         inc.setDate(parseInt(day));
                                     }
                                     return (inc.getMonth() + 1) + '/' + inc.getDate() + '/' 
                                       + inc.getFullYear() + ' ';
                                 }else{
                                     return '';
                                 }
                             })
                             .replace(/(\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|-)+\b)/g,function(m,f){
                                 return me.num2Dec(f);                                                            // Converts number text to decimals
                             })
                             .replace(/([a-z]{3,10}) (\d{1,2})[,]*/, function(m,f,s){                             // Translate 'Month DD' to 'MM/DD'
                                 return ((($.inArray(f,me.months) > -1) ? $.inArray(f,me.months) : 
                                     $.inArray(f,me.shortMonths)) + 1) + '/' + s;
                             })
                            .replace(/^(\d{1,2}\/\d{1,2}(?![\d]))([\s|\/]*)(\d{0,4})/, function(m,dt,s,yr){      // Add century to dates with ambiguous years
                                if(yr.length == 2){
                                    var thisYear = parseInt(now.getFullYear().toString().substr(2,4)),
                                        thisCentury = parseInt(now.getFullYear().toString().substr(0,2)) * 100,
                                        inputYear = parseInt(yr),
                                        yearDiff = 100 - inputYear,
                                        centuryDiff = (thisYear < 50)    ? -100 * ((yearDiff >= 50) ? 0 : 1) 
                                         : 100 * ((yearDiff < 50) ? 0 : 1),
                                        retYear = thisCentury + inputYear + centuryDiff;
                                    return dt + '/' + retYear;    
                                }else if(yr.length == 4){
                                    return dt + '/' + yr;
                                }else{
                                    retDt = dt + '/' + now.getFullYear().toString();
                                    withDt = new Date(retDt);
                                    return (withDt.valueOf() > now.valueOf()) ? retDt : dt + '/' + new Date(now.valueOf() 
                                      + (me.day * 365)).getFullYear() + ' ';
                                }
                            })
                            .replace(/(\d{1,2}\/\d{1,2})\s(\d{4})/,function(m,dt,yr){return dt + '/' + yr; })   // Remove space in instances of '3/21 2012'
                            
                            //Adds today's date to strings that have no date information specified
                            ds = (dateReg.test(ds) == true) ? ds : (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() +' '+ ds;
                          
                            /* Adds an @ symbol for time strings that aren't UTC spec so that they can be modified later */
                            ds = ds.replace(/(\d{1,2}\/\d{1,2}\/\d{4})\s(.+)/,function(m,dt,ts){
                             if(ts.indexOf('@') == -1)   ts = '@ ' + ts;
                             return dt + ' ' + ts;
                            })
                            
                            /* Translate colloquial times */
                            .replace(/\d[ ]*[a|p]$/,function(m){ return m + 'm'; })
                            .replace(/[a|p][.][m]*[.]*/,function(m){ return m.replace(/[.]/g,'') })
                            .replace(/\d.m/,function(m){ return m.substring(0, m.length - 2) + ' ' + m.substring(m.length - 2, 3) })
                            .replace(/@ (\d+[ ]\d+)/,function(m,f){ return f.replace(' ',':'); })
                            .replace(/@ (\d+)/,function(m,f,p,o){ 
                                if(o.indexOf(':') != -1) return m;
                                else                     return m.trim() + ':00 ';
                            })
                            .replace(/@/g,''); // Firefox & IE don't like the @ symbol being used

                            return new Date(ds);
                        },                
        processDate:    function(){
                            var dateString = me.txtInput.val();
                            if (dateString.length > 0) {
                                var genDate = me.translateDate(dateString);
                                
                                //Returns a message to the user that the program doesn't understand them
                                if(genDate.toString() == 'Invalid Date'){
                                    me.displayDate(me.sarcasmArray[Condor.randNum(0,(me.sarcasmArray.length -1))]); return;
                                }
                                
                                me.value = genDate;
                                me.displayDate();
                                return genDate;
                            }else{
                                me.displayDate(' ');
                            }
                        },
        num2Dec:        function (words){
                            var numberRepl = {  a:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,
                                    thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,
                                    thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,thousand:1e3,
                                    million:1e6,billion:1e9,trillion:1e12,quadrillion:1e15,quintillion:1e18
                                 };
                
                            //replace the written words with numbers
                            words = words.toString().replace(/ and /g,' ').replace(/-/g,' ');
                            for(var itm in numberRepl)
                                words = words.replace(new RegExp('(^|[ ]|-)' + itm + '(-|[ ]|$)','g'),' ' + numberRepl[itm] + ' ');
                            
                            var wArray = $.trim(words).split(/[ ]+/); 
                                partsArry = [],
                                finalNum = 0,
                                pos = 0;
   
                            //separate by numbers larger than 100
                            while(wArray[pos]){
                                if(me.getM(wArray[pos]) > 2){
                                    partsArry.push(wArray.splice(0,pos + 1));
                                    pos = 0;
                                }
                                pos++;
                            }
                            partsArry.push(wArray);
                           
                            for(nums in partsArry){
                                var tmp = me.txt2Num(partsArry[nums]);
                                if(parseInt(tmp))
                                    finalNum += parseInt(tmp);
                            }
                           
                            return finalNum;
                        },
        txt2Num:        function(wArray){
                            //split into an array and combine them according to magnitude
                            var pos = 0, theNum = 0;
                           
                            if(wArray.length == 1){
                                return wArray[0];
                            }else{
                                while(wArray[pos + 1] !== undefined){
                                    var currNum = parseInt(wArray[pos]),
                                        nextNum = parseInt(wArray[pos + 1]),
                                        lastNum = parseInt(wArray[wArray.length - 1]),
                                        smallerThanNext = me.getM(currNum) <= me.getM(nextNum);
                                       
                                    if(pos == 0){
                                        theNum = (smallerThanNext) ? currNum * nextNum : currNum + nextNum;
                                    }else{
                                        if(smallerThanNext) theNum *= nextNum;
                                        else                theNum += nextNum;
                                    }
                                    pos++;
                                }
                            }
                           
                            if(lastNum != nextNum)  return (me.getM(lastNum) > 2) ? theNum *= lastNum : theNum += lastNum;
                            else                    return theNum;
                        },
       getM:            function(num){
                            var magnitude = 0;
                            while((num = num / 10) >= 1)    magnitude++
                            return magnitude;
                        },
       displayDate:    function(a){
                            if(a != undefined){ me.displayDiv.html(a); return; }
                            if(me.value == "") { return; }
                            
                            var hours = me.value.getHours(),
                                minutes = me.value.getMinutes(),
                                time = ((hours < 13) ? (hours > 9) ? hours : '0' + hours : (hours - 12)) + ':' + 
                                ((minutes > 9) ? minutes : '0' + minutes) + ' ' + 
                                ((hours < 12) ? 'AM' : 'PM'),
                                formatted = (me.days[me.value.getDay()]) + ' ' + 
                                            (me.months[me.value.getMonth()]) + ' ' + me.value.getDate() + ' ' + 
                                            me.value.getFullYear() + ' ' + time;
                            
                            //validation for min-date
                            if(!(me.minDate != null && me.value < me.minDate)){
                                me.displayDiv.html(formatted);
                            }else{
                                me.displayDiv.html('Less than minimum required date of ' + 
                                                    (me.minDate.getMonth() + 1) + '-' + me.minDate.getDate() + '-' + me.minDate.getFullYear());
                            }
                            
                            return  (me.value.getMonth() + 1) + '/' + me.value.getDate() + '/' + me.value.getFullYear() + ' ' + time;
                        },   
                        
        val:            function(setVal){
                            if(setVal === undefined){ return me.value; }
                            else{
                                if(setVal !== null){ me.txtInput.val(setVal); me.processDate(); }
                                else{ me.txtInput.val(''); me.displayDiv.html(''); me.value = null; }
                                me.valChange(me.value);
                            }
                        },
        tclVal:         function(){
                            return me.valCol + ' {' + ((me.value !== null) ? me.retDBString() : '') + '}';
                        },
        retDBString:    function(){
                            var hours = me.value.getHours(),
                            minutes = me.value.getMinutes(),
                            seconds = me.value.getSeconds(),
                            time = ((hours > 9) ? hours : '0' + hours) + ':' + ((minutes > 9) ? minutes : '0' + minutes) + ':' + 
                                   ((seconds > 9) ? seconds : '0' + seconds);
            
                            return me.value.getFullYear() + '-' + (me.value.getMonth() + 1) + '-' + me.value.getDate() + ' ' + time;
                        },                
        valChange:      function(val){}  
                        
    },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}



/************************* YES/NO FORM OBJECT ****************************/
Condor.ynFrmObj = function(args,initVal){
    var me = this;
    var params = $.extend({
        chkBox: $("<input>").attr({
                    type:   'checkbox',
                    vcid:   me.visColId,
                    dcid:   me.dataColId,
                    id:     me.elId
                })
                .addClass(me.passedCls)
                .click(function(){
                    me.valChange($(this).is(':checked'));
                }),
        init:   function(initVal){
                    me.el = $("<div/>").addClass('condor-checkbox').append(me.chkBox);
                    if(me.elId == 0){ me.chkBox.removeAttr('id'); }
                    me.val(initVal);
                },
        val:    function(setVal){
                    if(setVal === undefined){
                        return ((me.chkBox.attr('checked')) ? 1 : 0);
                    }else{
                        if(setVal === 1)    me.chkBox.attr('checked',true);
                        else                me.chkBox.removeAttr('checked');
                        me.valChange(setVal);
                    }
                },
        tclVal: function(){
                    return me.dataColId + ' ' + ((me.chkBox.attr('checked')) ? 1 : 0);
                },
        valChange: function(val){}
    },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}


/************************* FILE UPLOAD FORM OBJECT ***************************/
Condor.fileFrmObj = function(args,initVal){
    var me = this;
    var params = $.extend({
        el:         $('<div/>').addClass('condor-file-upload'),
        docNum:     '', // maps to title
        title:      '', // maps to filename
        recStorage: 1,
        fileId:     0,
        extension:  '',
        parent:     {},
        xaction:    'upload_attachment',
        titleTxt:   new Condor.textFrmObj({blankText:'File title (optional)', passedCls:'condor-modal-form-item'}),
        upBtn:      new Condor.btn({text:'Browse'}),
        changeBtn:  new Condor.btn({
                        click:function(){
                            //reset input field
                            me.titleTxt.val('');
                            me.titleTxt.el.removeAttr('disabled').removeClass().addClass('condor-modal-form-item empty');
                            
                            me.changeClick();                           
                        },
                        text:'X',
                        cls: 'file-change'
                    }),
        init:       function(initVal){
                        me.el.attr({
                            vcid:   me.visColId,
                            dcid:   me.dataColId,
                            id:     me.elId
                        })
                        .addClass(me.passedCls)
                        .append(me.titleTxt.el)
                        .append(me.upBtn.el)
                        .append(me.changeBtn.el.hide());
                        
                        me.changeBtn.parent = me;
                        
                        //add upload functionality via jquery.ocupload-1.1.2
                        $(me.upBtn.el).upload({
                            name:       'doc_file',
                            action:     '/usurf-cmu/data/cmu-list-forms',
                            autoSubmit: false,
                            onSubmit:   function() { 
                                            me.titleTxt.el.addClass('has-file uploading').attr('disabled', true); 
                                            me.titleTxt.val('uploading...');
                                        },
                            onComplete: function(response){ me.upComplete(response); },
                            onSelect:   function() { me.onSelect(this); }
                        });
                        
                        me.val(initVal);
                    },
        changeClick: function(){
                       //swap buttons
                        me.changeBtn.el.fadeOut('fast');
                        me.upBtn.el.parents('div:first').fadeIn('slow'); 
                        me.titleTxt.el.focus();
                    },
        beforSelect:function(){ me.oldFileId = me.fileId; },
        onSelect:   function(fileControl){
                        me.beforSelect(fileControl, me);
                        uploadOkay = me.fileSelect(); //expects a boolean (success) and a msg (text)
                        if(uploadOkay.success){
                            if(!me.parent.hasOwnProperty('attachments')){
                                fileControl.params({xaction:me.xaction, doc_title: uploadOkay.doc_title});
                            }else if(me.value !==0 && me.value !== undefined && me.value !== null){
                                fileControl.params({ xaction:me.xaction, doc_title: uploadOkay.doc_title, att_id:me.value });
                            }else{
                                fileControl.params({ xaction:me.xaction, doc_title: uploadOkay.doc_title, att_id:me.parent.attachments[0].value });
                            }                                  
                            fileControl.submit();
                        }else{
                            Condor.errRpt(uploadOkay.msg, function(){}, 'Upload Validation');
                        }
                    },
        upComplete: function(response){
                        try{
                            var response = $.parseJSON(response);
                            if(response.success == true){
                                me.val({
                                    value:      response.payload.cmu_list_attachment_id, 
                                    docNum:     response.payload.title, 
                                    title:      response.payload.filename, 
                                    extension:  response.payload.extension.replace('.',''),
                                    fileId:     response.payload.cmu_file_id
                                });
                                me.upSuccess(response);
                            }else{
                                me.titleTxt.val('Upload Failure :-(');
                            }
                        }catch(err){
                            me.titleTxt.val('Upload Failure :-(');
                        }
                    },
        upSuccess:  function(response){
                        if(me.oldFileId !== undefined && me.oldFileId !== 0){
                            $.getJSON("/usurf-cmu/data/cmu-list-forms", {xaction:'delete_file', file_id:me.oldFileId});
                        }
                    },
        fileSelect: function(){ return {success:true, msg:'', doc_title:me.titleTxt.val()}; },
        valIsValid: function(){
                        return !(me.value == undefined || me.value == null || me.value == 0);
                    },
        val:        function(setVal){
                        if(setVal === undefined){
                            return me.value;
                        }else{
                            $.extend(me,setVal);
                            me.valChange();
                        }
                    },
        tclVal:     function(){
                        return me.dataColId + ' {' + me.value + '}';
                    }, 
        valChange:  function(){
                        //show/hide elements
                        me.titleTxt.el.addClass('has-file').attr('disabled', true);
                        me.upBtn.el.parents('div:first').hide();
                        me.changeBtn.el.show();
                        
                        //changed to a 'file-selected' view and display a nicely formatted file
                        me.titleTxt.val(((me.docNum == '') ? me.title : me.docNum + ' - ' + me.title));
                        me.titleTxt.el.removeClass('uploading').addClass('icon-' + me.extension);
                        
                        me.onChange(me);
                        me.updateRel(me.value);
                    },
        onChange:   function(){}
    },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}


/**************************** DOC CONTROL SEARCH OBJECT ***************************/
Condor.docSearchCombo = function(args,initVal){
    var me = this;
    var params = $.extend({
        docNum:     '',
        recStorage: 0,
        title:      '',
        extension:  '',
        dfltTxt:    'Search By Document # or Title',
        template:   '<li doc_id="{document_id}">' +
                        '<span class="condor-doc-srch-icon icon-{extension}" extension="{extension}"></span>'+
                        '<span class="condor-doc-num">{doc_num}</span>' +
                        '<span class="condor-doc-title">{title}</span>' +
                    '</li>',
        doSearch:   function(srchTerm){
                        $.getJSON("/usurf-cmu/data/cmu-list-forms", { xaction:'doc_search', srch_term:srchTerm }, function(d){
                            me.clrSearch();
                            if( d.total !== undefined && d.total > 0){ 
                                for(var i = 0; i < d.total; i++)
                                    me.makeRslt(d.payload[i]); 
                            }else{  me.rsltTarget.html(me.noRsltTxt); }
                        });
                    },
        onBlur:     function(myself){
                        if(myself.selectItm !== null){
                            myself.selectItm.click(); 
                        }else{
                            if(me.etSlctHvr() == false){
                                me.valueField.val(me.etDfltTxt());
                                me.clrSearch();
                            }
                        }
                    },
        rsltClick:  function(evnt){
                        me.value     = $(evnt.currentTarget).attr('doc_id');
                        me.extension = $(evnt.currentTarget).children('span:eq(0)').attr('extension');
                        me.docNum    = $(evnt.currentTarget).children('span:eq(1)').text();
                        me.title     = $(evnt.currentTarget).children('span:eq(2)').text();
                        me.val(me.value);
                    },
        val:        function(setVal){
                        //clear validation requirement class if present
                        me.valueField.removeClass(me.errCls);
                        
                        //validate field
                        if(setVal === undefined){
                            if(!me.isValid()) return false;
                            return me.value;
                        }else{
                            //loads the info for the id value passed 
                            if(setVal !== null){
                                if(setVal != me.value){
                                    $.getJSON("/usurf-cmu/data/cmu-list-forms", { xaction:'doc_by_id', form_values:setVal }, function(d){
                                        if(d.total !== undefined && d.total > 0){
                                            me.value     = setVal;
                                            me.extension = (d.payload[0].doc_extension);
                                            me.docNum    = (d.payload[0].doc_num);
                                            me.title     = (d.payload[0].title);
                                            me.valChange();
                                        }
                                    });
                                } else { me.valChange(); }
                            }//end if the setVal is not null
                        }//end if setVal is defined
                    },
        tclVal:     function(){
                        if(!me.isValid()) return false;
                        return me.dataColId + ' ' + me.value;
                    },
        isValid:    function(){
                        return !(me.value === null || $.trim(me.value).length == 0 || me.value == 0);
                    },
        valChange:  function(){
                        //takes care of common tasks for when a value is selected
                        me.etDfltTxt(me.docNum + ' [' + me.extension + ']');
                        me.valueField.val(me.etDfltTxt());
                        me.valueField.removeClass(me.errCls);
                        me.clrSearch();
                        
                        me.onChange(me);
                        me.updateRel(me.value);
                    },
        onChange:   function(){},    
        kidInit:    function(setVal){
                        me.el = $('<div class="condor-modal-combox-cont">').append(me.valueField).append(me.rsltTarget);
                        me.rsltTarget.addClass("condor-modal-combobox");
                        me.valueField.attr({
                            vcid:   me.visColId,
                            dcid:   me.dataColId,
                            id:     me.elId
                        }).addClass(me.passedCls);
                        if(me.elId == 0){ me.valueField.removeAttr('id'); }
                        
                        me.val(setVal);
                    }
    },args);
    $.extend(me,new Condor.cmuFrmObj(new Condor.searchCombo(params)));
    
    me.kidInit(initVal);
}


/**************************** PERSON SEARCH OBJECT ***************************/
Condor.personSearchCombo = function(args,initVal){
    var me = this;
    var params = $.extend({
        dfltTxt:    'Type a name to search',
        template:   '<li emp_id="{hr_work_id}">{full_name}</li>',
        doSearch:   function(srchTerm){
                        $.getJSON("/usurf-cmu/data/cmu-list-forms", { xaction:'person_search', srch_term:srchTerm }, function(d){
                            me.clrSearch();
                            if( d.total !== undefined && d.total > 0){ 
                                for(var i = 0; i < d.total; i++)
                                    me.makeRslt(d.payload[i]); 
                            }else{ 
                                me.rsltTarget.html(me.noRsltTxt); }
                        });
                    },
        onBlur:     function(myself){
                        if(myself.selectItm !== null){
                            myself.selectItm.click(); 
                        }else{
                            if(me.etSlctHvr() == false){
                                me.valueField.val(me.etDfltTxt());
                                me.clrSearch();
                            }
                        }
                    },
        rsltClick:  function(evnt){
                        me.val($(evnt.currentTarget).attr('emp_id'));
                    },
        val:        function(setVal){
                        //clear validation requirement class if present
                        me.valueField.removeClass(me.errCls);
                        
                        //validate field
                        if(setVal === undefined){
                            if(me.value === null){
                                return false;
                            }else if($.trim(me.value).length == 0 || me.value == 0){
                                var lbl = $("label[for='"+ me.elId + "']").text();
                                Condor.errRpt('A value for \'' + lbl + '\' is required.',function(){},'Required Field');
                                me.valueField.addClass(me.errCls);
                                return false;
                            }
                            
                            return me.value;
                        }else{
                            //loads the info for the id value passed 
                            if(setVal !== null){
                                $.getJSON("/usurf-cmu/data/cmu-list-forms", { xaction:'person_by_id', form_values:setVal }, function(d){
                                    if(d.total !== undefined && d.total > 0){
                                        me.value = setVal;
                                        me.etDfltTxt(d.payload.full_name);
                                        me.valueField.val(me.etDfltTxt());
                                        me.valueField.removeClass(me.errCls);
                                        me.clrSearch();
                                        me.updateRel(me.value);
                                    }
                                });
                            }
                        }
                    },
        tclVal:     function(){
                        if(me.value === null){
                            return false;
                        }else if($.trim(me.value).length == 0 || me.value == 0){
                            var lbl = $("label[for='"+ me.elId + "']").text();
                            Condor.errRpt('A value for \'' + lbl + '\' is required.',function(){},'Required Field');
                            me.valueField.addClass(me.errCls);
                            return false;
                        }
                        
                        return me.dataColId + ' ' + me.value;
                    },
        kidInit:    function(setVal){
                        me.el = $('<div class="condor-modal-combox-cont">').append(me.valueField).append(me.rsltTarget);
                        me.rsltTarget.addClass("condor-modal-combobox");
                        me.valueField.attr({
                            vcid:   me.visColId,
                            dcid:   me.dataColId,
                            id:     me.elId
                        }).addClass(me.passedCls);
                        if(me.elId == 0){ me.valueField.removeAttr('id'); }
                        
                        //call the super init again
                        me.val(setVal);
                    }
    },args);
    $.extend(me,new Condor.cmuFrmObj(new Condor.searchCombo(params)));
    me.kidInit(initVal);
}


/**************************** RADIO GROUP OBJECT ***************************/
Condor.radioFrmObj = function(args,initVal){
    var me = this;
    var params = $.extend({
        options:    [{val:'5', title:'x'}],
        name:       'condor-radio',
        required:   false,
        init:       function(initVal){
                        var tplEngine = new Condor.tplt({
                            tplt:   '<li><input type="radio" id="{id}" value="{val}" name="{name}" />' +
                                    '<label for="{id}">{title}</label></li>'
                        });
                        me.el = me.el = $('<ul>').addClass('condor-radio-input');
                        for(itm in me.options){
                            me.options[itm].name = me.name;
                            me.options[itm].id = me.name + '-radio-' + itm;
                            tplEngine.data = me.options[itm];
                            me.el.append(tplEngine.make().children('input').change(function(){
                                me.value = $(this).val();
                                me.onChange(me);
                            }).end());
                        }
                        
                        me.val(initVal);
                    },
        val:        function(setVal){
                        me.el.removeClass(me.errCls);
            
                        if(setVal === undefined){
                            if($("input[name='" + me.name + "']:checked").length == 0 && me.required){
                                Condor.errRpt('A value for \'' + $("label[for='"+ me.elId + "']").text() + '\' is required.',function(){},'Required Field');
                                me.el.addClass(me.errCls);
                                return false;
                            }else{
                                return me.value;
                            }
                        }else{
                            me.value = setVal;
                            me.el.children('li').children("input[value='" + setVal + "']").attr('checked',true);
                        }
                        
                        me.onChange(me);
                    },
        tclVal:     function(){
                        if($("input[name='" + me.name + "']:checked").length == 0 && me.required){
                            Condor.errRpt('A value for \'' + $("label[for='"+ me.elId + "']").text() + '\' is required.',function(){},'Required Field');
                            me.el.addClass(me.errCls);
                            return false;
                        }else{
                            return me.name + ' {' + me.value + '}';
                        }
                    },
        onChange:   function(){}
    },args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}