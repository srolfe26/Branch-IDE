//Dependent on usurf-style/www/resources/js/wui-core.js

//Override jquery ':contains' selector to be case insensitive
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    arg = arg || '';
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/*
 * One Click Upload - jQuery Plugin
 * Copyright (c) 2008 Michael Mitchell - http://www.michaelmitchell.co.nz
 *
 * Modified 2012 Stephen Nielsen
 */
(function($){
    $.fn.upload = function(options) {
        /** Merge the users options with our defaults */
        options = $.extend({
            name: 'file',
            enctype: 'multipart/form-data',
            action: '',
            autoSubmit: true,
            onSubmit: function() {},
            onComplete: function() {},
            onSelect: function() {},
            onFocus: function() {},
            onBlur: function() {},
            params: {}
        }, options);

        return new $.ocupload(this, options);
    },
    
    $.ocupload = function(element, options) {
        /** Fix scope problems */
        var self = this;
    
        /** A unique id so we can find our elements later */
        var id = new Date().getTime().toString().substr(8);
        
        /** Upload Iframe */
        var iframe = $('<iframe '+ 'id="iframe'+id+'" '+ 'name="iframe'+id+'"'+ '></iframe>').css({ display: 'none' });
        
        /** Form */
        var form = $('<form '+ 'method="post" '+ 'enctype="'+options.enctype+'" '+ 'action="'+options.action+'" '+ 'target="iframe'+id+'"'+ '></form>').css({margin: 0, padding: 0});
        
        /** File Input */
        var input = $('<input '+ 'name="'+options.name+'" '+ 'type="file" '+ '/>').css({
            position: 'relative',
            display: 'block',
            opacity: 0
        });
        
        /** Put everything together */
        element.wrap('<div></div>'); //container
            form.append(input);
            element.after(form);
            element.after(iframe);
    
        /** Find the container and make it nice and snug */
        var container = element.parent().addClass("wui-browse-btn");
        
        /** Watch for file selection */
        input.change(function() {
            /** Do something when a file is selected. */
            self.onSelect(); 
            
            /** Submit the form automaticly after selecting the file */
            if(self.autoSubmit) {
                self.submit();
            }
        })
        .focus(function(){self.onFocus();})
        .blur(function(){self.onBlur();});
        
        /** Methods */
        $.extend(this, {
            autoSubmit: options.autoSubmit,
            onSubmit: options.onSubmit,
            onComplete: options.onComplete,
            onSelect: options.onSelect,
            onBlur: options.onBlur,
            onFocus: options.onFocus,
        
            /** get filename */     
            filename: function() {
                return input.attr('value');
            },
            
            /** get/set params */
            params: function(params) {
                if(params || false)  options.params = $.extend(options.params, params);
                else                 return options.params;
            },
            
            /** get/set name */
            name: function(nam) {
                if(nam || false)  input.attr("name", value);
                else              return input.attr("name");
            },
            
            /** get/set action */
            action: function(action) {
                if(action || false)  form.attr("action", action);
                else                 return form.attr("action");
            },
            
            /** get/set enctype */
            enctype: function(enctype) {
                if(enctype || false)  form.attr("enctype", enctype);
                else            return form.attr("enctype");
            },
            
            /** set options */
            set: function(obj, value) {
                var value = value ? value : false;
                                
                function option(action, value) {
                    switch (action) {
                        default:
                            throw new Error("[jQuery.ocupload.set] '" + e + "' is an invalid option.");
                            break;
                        case "name":        self.name(value);          break;
                        case "action":      self.action(value);        break;
                        case "enctype":     self.enctype(value);       break;
                        case "params":      self.params(value);        break;
                        case "autoSubmit":  self.autoSubmit = value;   break;
                        case "onSubmit":    self.onSubmit = value;     break;
                        case "onComplete":  self.onComplete = value;   break;
                        case "onFocus":     self.onFocus = value;      break;
                        case "onBlur":      self.onBlur = value;       break;
                        case "onSelect":    self.onSelect = value;     break
                    }
                }               
                var value = value ? value : false;
                if(value) {
                    option(obj, value);
                }
                else {              
                    $.each(obj, function(key, value) {
                        option(key, value);
                    });
                }
            },
            
            /** Submit the form */
            submit: function() {
                /** Do something before we upload */
                this.onSubmit();
                
                /** add additional paramters before sending */
                $.each(options.params, function(key, value) {
                    form.children("input[name=" +key+ "]").remove();
                    form.append($('<input type="hidden" name="' +key+ '" value="' +value+ '" />'));
                });
                
                /** Submit the actual form */
                form.submit(); 
                
                /** Do something after we are finished uploading */
                iframe.unbind().load(function() {
                    /** Get a response from the server in plain text */
                    var myFrame = document.getElementById(iframe.attr('name'));
                    /** Do something on complete */
                    self.onComplete($(myFrame.contentWindow.document.body).text()); //done :D
                });
            }
        });
    }
})(jQuery);

﻿/*
* jHtmlArea 0.7.5 - WYSIWYG Html Editor jQuery Plugin
* Copyright (c) 2012 Chris Pietschmann
* http://jhtmlarea.codeplex.com
* Licensed under the Microsoft Reciprocal License (Ms-RL)
* http://jhtmlarea.codeplex.com/license
* 
* Modified 2013 Stephen Nielsen
*/
(function ($) {
    $.fn.htmlarea = function (opts) {
        if (opts && typeof (opts) === "string") {
            var args = [];
            for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
            var htmlarea = jHtmlArea(this[0]);
            var f = htmlarea[opts];
            if (f) { return f.apply(htmlarea, args); }
        }
        return this.each(function () { jHtmlArea(this, opts); });
    };
    var jHtmlArea = window.jHtmlArea = function (elem, options) {
        if (elem.jquery) {
            return jHtmlArea(elem[0]);
        }
        if (elem.jhtmlareaObject) {
            return elem.jhtmlareaObject;
        } else {
            return new jHtmlArea.fn.init(elem, options);
        }
    };
    jHtmlArea.fn = jHtmlArea.prototype = {

        // The current version of jHtmlArea being used
        jhtmlarea: "0.7.5",

        init: function (elem, options) {
            if (elem.nodeName.toLowerCase() === "textarea") {
                var opts = $.extend({}, jHtmlArea.defaultOptions, options);
                elem.jhtmlareaObject = this;

                var textarea = this.textarea = $(elem);
                var container = this.container = $("<div/>").addClass("jHtmlArea").insertAfter(textarea);

                var toolbar = this.toolbar = $("<div/>").addClass("ToolBar").appendTo(container);
                priv.initToolBar.call(this, opts);

                var iframe = this.iframe = $("<iframe/>");
                var htmlarea = this.htmlarea = $("<div/>").append(iframe);

                container.append(htmlarea).append(textarea.hide());

                priv.initEditor.call(this, opts);
                priv.attachEditorEvents.call(this);

                // Fix total height to match TextArea
                iframe.height(iframe.height() - toolbar.height());
                toolbar.width(textarea.width() - 2);

                if (opts.loaded) { opts.loaded.call(this); }
            }
        },
        dispose: function () {
            this.textarea.show().insertAfter(this.container);
            this.container.remove();
            this.textarea[0].jhtmlareaObject = null;
        },
        execCommand: function (a, b, c) {
            this.iframe[0].contentWindow.focus();
            this.editor.execCommand(a, b || false, c || null);
            this.updateTextArea();
        },
        ec: function (a, b, c) {
            this.execCommand(a, b, c);
        },
        queryCommandValue: function (a) {
            this.iframe[0].contentWindow.focus();
            return this.editor.queryCommandValue(a);
        },
        qc: function (a) {
            return this.queryCommandValue(a);
        },
        getSelectedHTML: function () {
            if ($.browser.msie) {
                return this.getRange().htmlText;
            } else {
                var elem = this.getRange().cloneContents();
                return $("<p/>").append($(elem)).html();
            }
        },
        getSelection: function () {
            if ($.browser.msie) {
                //return (this.editor.parentWindow.getSelection) ? this.editor.parentWindow.getSelection() : this.editor.selection;
                return this.editor.selection;
            } else {
                return this.iframe[0].contentDocument.defaultView.getSelection();
            }
        },
        getRange: function () {
            var s = this.getSelection();
            if (!s) { return null; }
            //return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
            return (s.getRangeAt) ? s.getRangeAt(0) : s.createRange();
        },
        html: function (v) {
            if (v) {
                this.textarea.val(v);
                this.updateHtmlArea();
            } else {
                return this.toHtmlString();
            }
        },
        pasteHTML: function (html) {
            this.iframe[0].contentWindow.focus();
            var r = this.getRange();
            if ($.browser.msie) {
                r.pasteHTML(html);
            } else if ($.browser.mozilla) {
                r.deleteContents();
                r.insertNode($((html.indexOf("<") != 0) ? $("<span/>").append(html) : html)[0]);
            } else { // Safari
                r.deleteContents();
                r.insertNode($(this.iframe[0].contentWindow.document.createElement("span")).append($((html.indexOf("<") != 0) ? "<span>" + html + "</span>" : html))[0]);
            }
            r.collapse(false);
            r.select();
        },
        bold: function () { this.ec("bold"); },
        italic: function () { this.ec("italic"); },
        underline: function () { this.ec("underline"); },
        strikeThrough: function () { this.ec("strikethrough"); },
        removeFormat: function () {
            this.ec("removeFormat", false, []);
            this.unlink();
        },
        link: function () {
            if ($.browser.msie) {
                this.ec("createLink", true);
            } else {
                this.ec("createLink", false, prompt("Link URL:", "http://"));
            }
        },
        unlink: function () { this.ec("unlink", false, []); },
        unorderedList: function () { this.ec("insertunorderedlist"); },
        justifyLeft: function () { this.ec("justifyLeft"); },
        justifyCenter: function () { this.ec("justifyCenter"); },
        justifyRight: function () { this.ec("justifyRight"); },
        formatBlock: function (v) { this.ec("formatblock", false, v || null); },
        showHTMLView: function () {
            this.updateTextArea();
            this.textarea.show();
            this.htmlarea.hide();
            $("ul li:not(li:has(a.html))", this.toolbar).hide();
            $("ul:not(:has(:visible))", this.toolbar).hide();
            $("ul li a.html", this.toolbar).addClass("highlighted");
        },
        hideHTMLView: function () {
            this.updateHtmlArea();
            this.textarea.hide();
            this.htmlarea.show();
            $("ul", this.toolbar).show();
            $("ul li", this.toolbar).show().find("a.html").removeClass("highlighted");
        },
        toggleHTMLView: function () {
            (this.textarea.is(":hidden")) ? this.showHTMLView() : this.hideHTMLView();
        },

        toHtmlString: function () {
            return $.trim(this.editor.body.innerHTML
                    .replace(/MsoNormal/gi, "")
                    .replace(/<\/?link[^>]*>/gi, "")
                    .replace(/<\/?meta[^>]*>/gi, "")
                    .replace(/<\/?xml[^>]*>/gi,"")
                    .replace(/<\?xml[^>]*\/>/gi, "")
                    .replace(/<!--(.*)-->/gi, "")
                    .replace(/<!--(.*)>/gi, "")
                    .replace(/<!(.*)-->/gi, "")
                    .replace(/<w:[^>]*>(.*)<\/w:[^>]*>/gi, "")
                    .replace(/<w:[^>]*\/>/gi, "")
                    .replace(/<\/?w:[^>]*>/gi, "")
                    .replace(/<m:[^>]*\/>/gi, "")
                    .replace(/<m:[^>]>(.*)<\/m:[^>]*>/gi, "")
                    .replace(/<o:[^>]*>([.|\s]*)<\/o:[^>]*>/gi, "")
                    .replace(/<o:[^>]*>/gi, "")
                    .replace(/<o:[^>]*\/>/gi, "")
                    .replace(/<\/o:[^>]*>/gi, "")
                    .replace(/<\/?m:[^>]*>/gi, "")
                    .replace(/style=\"([^>]*)\"/gi, "")
                    .replace(/style=\'([^>]*)\'/gi, "")
                    .replace(/class=\"(.*)\"/gi, "")
                    .replace(/class=\'(.*)\'/gi,"")
                    .replace(/<p[^>]*>/gi, "<p>")
                    .replace(/<\/p[^>]*>/gi, "</p>")
                    .replace(/<span[^>]*>/gi, "")
                    .replace(/<\/span[^>]*>/gi, "")
                    .replace(/<st1:[^>]*>/gi, "")
                    .replace(/<\/st1:[^>]*>/gi, "")
                    .replace(/<font[^>]*>/gi, "")
                    .replace(/<\/font[^>]*>/gi, "")
                    .replace(/[\r\n]/g, " ")
                    .replace(/<wordPasteong><\/wordPasteong>/gi, "")
                    .replace(/<p><\/p>/gi, "").replace(/\/\*(.*)\*\//gi, "")
                    .replace(/<!--/gi, "")
                    .replace(/-->/gi, "")
                    .replace(/<style[^>]*>[^<]*<\/style[^>]*>/gi, "")
                    .replace(/<hr>/gi, ""))
        },
        toString: function () {
            return this.editor.body.innerText;
        },

        updateTextArea: function () {
            this.textarea.val(this.toHtmlString());
        },
        updateHtmlArea: function () {
            this.editor.body.innerHTML = this.textarea.val();
        }
    };
    jHtmlArea.fn.init.prototype = jHtmlArea.fn;

    jHtmlArea.defaultOptions = {
        toolbar: [
        ["html"], ["bold", "italic", "underline", "strikethrough", "|", "subscript", "superscript"],
        ["increasefontsize", "decreasefontsize"],
        ["orderedlist", "unorderedlist"],
        ["indent", "outdent"],
        ["justifyleft", "justifycenter", "justifyright"],
        ["link", "unlink", "image", "horizontalrule"],
        ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
        ["cut", "copy", "paste"]
    ],
        css: null,
        toolbarText: {
            bold : "Bold",
            italic : "Italic",
            underline : "Underline",
            strikethrough : "Strike-Through",
            justifyleft : "Left Justify",
            justifycenter : "Center Justify",
            justifyright : "Right Justify",
            link : "Insert Link",
            unlink : "Remove Link",
            unorderedlist : "Insert Unordered List",
            html : "Show/Hide HTML Source View"
        }
    };
    var priv = {
        toolbarButtons: {
            strikethrough : "strikeThrough",
            unorderedlist : "unorderedList",
            justifyleft : "justifyLeft",
            justifycenter : "justifyCenter",
            justifyright : "justifyRight",
            html : function(btn) {
                this.toggleHTMLView()
            }
        },
        initEditor: function (options) {
            var edit = this.editor = this.iframe[0].contentWindow.document;
            edit.designMode = 'on';
            edit.open();
            edit.write(this.textarea.val());
            edit.close();
            if (options.css)  $('head',edit).append($('<style>').attr({type:'text/css'}).text(options.css));
        },
        initToolBar: function (options) {
            var that = this;

            var menuItem = function (className, altText, action) {
                return $("<li/>").append($('<a href="javascript:void(0);" tabindex="-1"/>').addClass(className).attr("title", altText).click(function () { action.call(that, $(this)); }));
            };

            function addButtons(arr) {
                var ul = $("<ul/>").appendTo(that.toolbar);
                for (var i = 0; i < arr.length; i++) {
                    var e = arr[i];
                    if ((typeof (e)).toLowerCase() === "string") {
                        if (e === "|") {
                            ul.append($('<li class="separator"/>'));
                        } else {
                            var f = (function (e) {
                                // If button name exists in priv.toolbarButtons then call the "method" defined there, otherwise call the method with the same name
                                var m = priv.toolbarButtons[e] || e;
                                if ((typeof (m)).toLowerCase() === "function") {
                                    return function (btn) { m.call(this, btn); };
                                } else {
                                    return function () { this[m](); this.editor.body.focus(); };
                                }
                            })(e.toLowerCase());
                            var t = options.toolbarText[e.toLowerCase()];
                            ul.append(menuItem(e.toLowerCase(), t || e, f));
                        }
                    } else {
                        ul.append(menuItem(e.css, e.text, e.action));
                    }
                }
            };
            if (options.toolbar.length !== 0 && priv.isArray(options.toolbar[0])) {
                for (var i = 0; i < options.toolbar.length; i++) {
                    addButtons(options.toolbar[i]);
                }
            } else {
                addButtons(options.toolbar);
            }
        },
        attachEditorEvents: function () {
            var t = this;

            var fnHA = function () {
                t.updateHtmlArea();
            };

            this.textarea.click(fnHA).
                keyup(fnHA).
                keydown(fnHA).
                mousedown(fnHA).
                blur(fnHA);

            var fnTA = function () {
                t.updateTextArea();
            };
            
            $(this.editor).focus(fnTA).
                click(fnTA).
                keyup(fnTA).
                keydown(fnTA).
                mousedown(fnTA).
                blur(fnTA);
        },
        isArray: function (v) {
            return v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !(v.propertyIsEnumerable('length'));
        }
    };
})(jQuery);

/************************* WUI FORM ****************************/
Wui.form = function(args){
    var me = this,
    params = $.extend({
        el:			$("<div>"),
    	labelPos:	'top', // or left
    	errCls:		'wui-form-err',
    	setField:   function(fieldname, d){
    	                for(var i in me.items) if(me.items[i].name == fieldname)me.items[i].val(d);
                	},
    	dataValid:  null,
    	onItems:	function(f){
    					$.each(this.items,function(idx,itm){
				    		if(itm.val && typeof itm.val == 'function')	f(itm);
			    		});
			    	},
    	validate:   function(){
    	                me.errs = [];
    	                me.onItems(function(itm){ itm.el.toggleClass(me.errCls,!itm.validate()); });
    	                return (me.errs.length == 0);
                	},
        errs:       [],
        throwErr:   function(m){me.errs.push(m); return false;},
        dispErrs:   function(){
                        var msg = '';
                        for(var e in me.errs) msg += me.errs[e] + '<br/>';
                        Wui.errRpt(msg,'Form Errors')
                    },
        setData:    function(d){
                        me.onItems(function(itm){ itm.val(d[itm.name] || null); });
                    },
        clearData:  function(d){ me.setData(); },
        getData:    function(){
                        if(me.validate()){
                            var ret = {};
                            me.onItems(function(itm){ ret[itm.name] = itm.val(); });
                            return ret;
                        }else{
                            me.dispErrs();
                            return false;
                        }
                    },
    	isReady:	function(){},
    	createForm: function(){
    	                $.each(this.items,function(idx,itm){
							objArry = itm.ftype.split('.');
    	                    itm = new window[objArry[0]][objArry[1]]($.extend(itm,{parentFrm:me}));
    	                    me.el.append(itm.el);
						});
						me.afterCreate();
				    },
        afterCreate:function(){},
        onRender:   function(){
		                for(var itm in me.items) if(me.items[itm].hasOwnProperty('onRender')) me.items[itm].onRender();
            		},
        push:       function(){
                        for(var i in arguments) arguments[i].parentFrm = me;
                        Wui.form.prototype.push.apply(this,arguments);
                    },
       splice:      function(){
                        for(var i in arguments) if(arguments[i] !== null && typeof arguments[i] == 'object') arguments[i].parentFrm = me;
                        Wui.form.prototype.splice.apply(this,arguments);
                    },
        init: 		function(){				    	
                        //create the form on the DOM
		                me.createForm();
				    	me.place();
			    	}
    },args);
    $.extend(params,{cls: 'wui-form labels-' + params.labelPos + ((params.cls !== undefined) ? ' ' + params.cls : '')});
    $.extend(me,new Wui.o(params));
    me.init();
};
Wui.form.prototype = new Wui.o();

/************************* FORM LABEL ****************************/
Wui.label = function(args){
    var me = this;
    $.extend(me,{
        el:         $('<label>'),
        text:       '',
        attrFor:    '',
        cls:   		'',
        init:       function(){ me.el.attr('for',me.attrFor).html(me.text).addClass(me.cls); return me; }
    },args);
    me.init();
};


/************************* FORM NOTE ****************************/
Wui.note = function(args){
    var me = this,
    params = $.extend({
        label:       '',
        cls:        'wui-note',
        el:         $("<p>"),
        init:       function(){ me.place.call(this); me.el.html(this.label); }
    },args);
    $.extend(me,new Wui.o(params));
    me.init();
}

/************************* GENERIC FORM FIELD ****************************/
Wui.frmField = function(args){
    var me = this,
    params = $.extend({
        label:      null,
        labelCls:	null,
        el:         $("<div>"),
        parentFrm:  null,
        required:   false,
        initField:  function(){
                        me.place.call(this);
                        this.lbl = new Wui.label({text:me.label,cls:me.labelCls});
                        me.el.prepend(this.lbl.el).addClass('wui-fe');
                    },
        validate:   function(){
                        if(me.required && $.trim(me.val()).length == 0) return me.parentFrm.throwErr('A value for \'' +me.label+ '\' is required.');
                        return true;
                    },     
        onRender:   function(){}
    },args);
    $.extend(me,new Wui.o(params));
};

/************************* HIDDEN FIELD ****************************/
Wui.hidden = function(args){
    var me = this;
    var params = $.extend({
        value:      null,
        init:       function(){ me.initField(); me.el = []; },  
        val:        function(setVal) {
                        if (setVal === undefined)   return me.value;
                        else                        me.value = setVal;
                    }
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
};


/************************* TEXT FIELD ****************************/
Wui.text = function(args){
    var me = this;
    var params = $.extend({
        field:      $("<input>").attr({type:'text'}),
        blankText:  '',
        blankCls:   'empty',
        setListenrs:function(t){
                        t.val(me.blankText).addClass(me.blankCls)
                        .focusin(function() { if(me.field.val() == me.blankText) me.field.val(''); me.field.removeClass(me.blankCls); })
                        .blur(function()    { if(me.val().length == 0) me.val(); })
                        .keydown(function() { if(me.field.val() == me.blankText) me.field.val(''); me.field.removeClass(me.blankCls); });
                        return t;
                    },
        init:       function(){
                        var me = this;
                        me.initField();
                        me.el.append($('$<div>').append(me.setListenrs(me.field)));
                    },
        setBlankText:function(val){
                        me.blankText = val;
                        me.el.val(me.blankText);
                        me.el.addClass(me.blankCls);
                    },
        val:        function(setVal) {
                        var v = me.field.val();
                            
                        if(v === me.blankText || v == '' || v === null){
                            me.field.val(me.blankText);
                            me.field.addClass(me.blankCls);
                        }
                        if (setVal === undefined){
                            return ((v == me.blankText) ? '' : v);
                        }else{
                            if(setVal == ''){
                                me.field.val(me.blankText);
                            }else{
                                me.field.removeClass(me.blankCls).val(setVal);
                            }
                        }
                    }
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
};


/************************* TEXT AREA FORM OBJECT ****************************/
Wui.textarea = function(args){
    var me = this;
    var params = $.extend({
        field:  $("<textarea>"),
        init:   function(){
                    me.initField();
                    me.el.append($('$<div>').append(me.field));
                },
        val:    function(setVal){
            console.log(setVal);        
            if(setVal === undefined)    return me.field.val();
                    else                        me.field.val(((setVal !== null) ? setVal : ''));
                }
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
}


/************************* WYSIWYG AREA FORM OBJECT ****************************/
Wui.wysiwyg = function(args){
    var me = this;
    var params = $.extend({
            onRender:function(){
                        this.field.htmlarea({
                            css: 'body { color:#333; font:90%  Arial, Verdana, Helvetica, sans-serif !important; overflow:hidden; }' +
                                 'a {color:#09c; text-decoration:none;} a:hover {color:#0c9; text-decoration:underline;}',
                            toolbar: [["bold","italic","underline","strikethrough"],
                                      ["link","unlink","unorderedlist"],
                                      ["justifyleft","justifycenter","justifyright"]], //,["html"]
                            loaded: function(){}
                        });
                        
                        var iframe = me.field.parent('.jHtmlArea').find('iframe');
                        
                        this.field.parent('.jHtmlArea').resizable({
                            animateEasing: 'linear',
                            minWidth:   me.field.outerWidth(),
                            minHeight:  me.field.outerHeight(),
                            start:      function(evnt, ui){ me.iFrameOrigHeight = iframe.height(); },
                            resize:     function(evnt, ui){ iframe.height(ui.size.height - (ui.originalSize.height - me.iFrameOrigHeight)); }
                        }); 
                    },
            val:    function(setVal){
                        if(setVal === undefined)    {return me.field.val();}
                        else                        {me.field.val(((setVal !== null) ? setVal : '')); me.field.keyup();}
                    }
            },args);
    $.extend(me,new Wui.textarea(params));
}

/**************************** RADIO GROUP OBJECT ***************************/
Wui.radio = function(args){
    var me = this;
    var params = $.extend({
        options:    [{val:'5', title:'x'}],
        buttonStyle:false,
        name:       'wui-radio',
        required:   false,
        onRender:	function(){
				        me.el.find('li').each(function(){
					       $(this).css({textIndent:-1 * ($(this).children('input').outerWidth() * (me.buttonStyle ? 1 : 0) + 3)}); 
				        });
			        },
        init:       function(){
                        var tplEngine = new Wui.tplt({
                                tplt:   '<li><input type="radio" id="{id}" value="{val}" name="{name}" />' +
                                        '<label for="{id}">{title}</label></li>'
                            }),
                            ul = $('<ul>').addClass('wui-radio');
                        
                        //make radio group look like buttons
                        if(me.buttonStyle) ul.addClass('button');
                        
                        me.initField();
                        me.el.append(ul);
                        for(itm in me.options){
                            me.options[itm].name = me.name;
                            me.options[itm].id = me.name + '-radio-' + itm;
                            tplEngine.data = me.options[itm];
                            var opt = tplEngine.make();
                            ul.append(
                                opt.children('label').attr({unselectable:'on'}).end()
                                .children('input')
                                .change(function(){
                                    me.value = $(this).val();
                                    me.onChange(me);
                                })
                                .focus(function(){ul.addClass('has-focus');})
                                .blur(function(){ul.removeClass('has-focus');})
                                .end()
                            );
                        }
                    },
        val:        function(setVal){
                        if(setVal === undefined){
                            return me.value;
                        }else{
                            me.value = setVal;
                            me.el.find("input[value='" + setVal + "']").attr('checked',true);
                        }
                        
                        me.onChange(me);
                    },
        onChange:   function(){}
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
}

/************************* CHECKBOX ****************************/
Wui.checkbox = function(args){
    var me = this;
    var params = $.extend({
        chkBox:     $("<input>").attr({type:'checkbox'})
                    .click(function(){
                        var checked = $(this).is(':checked');
                        me.valChange(checked);
                        me.lbl.el.toggleClass('checked',checked);
                    })
                    .focus(function(){me.lbl.el.addClass('has-focus');})
                    .blur(function(){me.lbl.el.removeClass('has-focus');}),
        onRender:	function(){
				        me.lbl.el.css({textIndent:-1 * (me.buttonStyle ? 1 : 0) * (me.chkBox.outerWidth() + parseInt(me.chkBox.css('margin-right')) + 1)});
			        },
        init:       function(){
                        me.initField();
                        
                        //make checkbox look like a button
                        if(me.buttonStyle) me.lbl.el.addClass('button');
                        
                        //add labels in the correct spots
                        me.el.addClass('wui-checkbox');
                        
                        //add an id and wrap the checkbox in the label
                        var Elid = me.name + '-checkbox';
                        me.lbl.el.prepend(me.chkBox.attr({id:Elid})).attr('for',Elid);
                    },
        validate:   function(){
                        if(me.required && me.val() == 0)    return me.parentFrm.throwErr('A value for \'' +me.label+ '\' is required.');
                        return true;
                    },
        val:        function(setVal){
                        if(setVal === undefined){
                            return ((me.chkBox.attr('checked')) ? 1 : 0);
                        }else{
                            if(setVal === 1)    me.chkBox.attr('checked',true);
                            else                me.chkBox.removeAttr('checked');
                            me.valChange(setVal);
                        }
                    },
        valChange:  function(val){}
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
}

/************************* LINK ****************************/
Wui.link = function(args){
    var me = this,
    params = $.extend({
        title:      null,
        uri:        null,
        target:     '_self',
        items:      [
                        me.urlField =       new Wui.text({cls:'wui-link-third wui-link-focus', blankText:'URL', linkData:'uri'}),
                        me.titleField =     new Wui.text({cls:'wui-link-third', blankText:'Display Text', linkData:'title'}),
                        me.targetField =    new Wui.combo({
                                                cls:'wui-link-third', valueItem: 'target', titleItem:'name', template: '<li>{name}</li>', blankText:'Target',
                                                data:[{target:'_self', name:'Opens In Same Window'}, {target:'_blank', name:'Opens In New Window/Tab'}], linkData:'target'
                                            })
                    ],
        init:       function(){
                        me.el.append(me.att = $('<div>').addClass('wui-hyperlink')),
                        me.elAlias = me.att;
                        me.initField();
                        
                        //additional listeners and initial value for target
                        me.setLisners(me.urlField,me.titleField,me.targetField);
                        me.targetField.val(me.target);
                        me.el.children('div:first').prepend(me.outputFld = $('<div/>').attr({tabindex:-1}).addClass('feedback'));
                        me.urlField.field.keyup(function(e){
                            //sets the title the same as the url - for laziness' sake
                            if(me.title === null) me.titleField.val($(this).val());
                        })
                        .blur(function(){me.title = me.titleField.val()});
                    },
        setLisners: function(){
                        var fields = arguments;
                        for(var itm in fields)
                            (fields[itm].field.field || fields[itm].field).on('blur click keyup keydown mousedown', null, fields[itm], function(e){
                                var wuiObjVal = (e.data.field.val) ? e.data.field.val() : e.data.val();
                                if(wuiObjVal !== null && wuiObjVal != {})
                                me[e.data.linkData] = wuiObjVal;
                                me.buildOutput();
                            })
                            .on('focus',null, fields[itm], function(e){
                                for(var i in fields)
                                    fields[i].el.removeClass('wui-link-focus');
                                e.data.el.addClass('wui-link-focus');
                            });
                    },
        buildOutput:function(){
                        if(me.testLink()){
                            me.outputFld.html('Preview: ');
                            me.outputFld.append($('<span/>').append($("<a>").attr({href:me.uri, target:'_blank'}).text(me.title)));
                            if(me.target == '_blank')    me.outputFld.append($('<span>').addClass('uri-new-win'));    
                        }else{
                            me.outputFld.html('Your link is improperly formatted.');
                        }
                            
                    },
        testLink:   function isUrl(s) {
                        var fullPath = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                        var relativePath = /(\/|\/([\w#!:.?+=&%@!\-\/]))/
                        return (fullPath.test(me.uri) || relativePath.test(me.uri));
                    },
        validate:   function(){
                        if(me.required && !me.testLink())   return me.parentFrm.throwErr('The value for \'' +me.label+ '\' is not a properly formatted link.');
                        return true;
                    },
        val:        function(setVal){
                        if(setVal === undefined){
                            return {uri:me.uri, target:me.target, title:me.title};
                        }else{
                            $.extend(me,setVal);
                            me.urlField.val(me.uri);
                            me.titleField.val(me.title);
                            me.targetField.val(me.target);
                            me.buildOutput();
                        }
                    }
    },args);
    $.extend(me,new Wui.frmField(params));  
    me.init();
}

/**************************** COMBO/SEARCH FIELD ***************************/
Wui.combo = function(args){
    var me = this;
    var params = $.extend({
        value:      null,
        field:      new Wui.text(args),
        emptyText:  '(empty)',
        inputTarget:null,
        dd:         null,
        valueItem:  null,
        titleItem:  null,
        selectItm:  null,
        data:       [],
        template:   '<li>{title}</li>',
        //for remote searching
        autoLoad:   false,
        remoteUrl:  null,
        remoteParams:{},
        minKeys:    2,
        remoteWait: false,
        ddSwitch:   new Wui.button({
                        click:function(){
                            if(!me.dd.is(':visible')){
                                me.selectCurr();
                                me.showDD();
                            }else{
                                me.hideDD();
                            }
                        },
                        text:'▼',
                        cls: 'field-btn dd-switch'
                    }),
                    
        init:       function(){
                        //setup template engine
                        me.tplEngine = new Wui.tplt({tplt:me.template});
            
                        //set additional listeners on the field
                        me.setListenrs(me.field.field);
                        
                        //put field inside a wrapper and add drop down switch if part of a form
                        if(me.inputTarget == null){
                            me.el.children('div:first').addClass('wui-combo').append(
                                me.dd = $('<ul>').addClass('wui-combo-dd'),
                                me.ddSwitch.el.attr({tabindex:-1}),
                                me.field.field.addClass('has-dd')
                            );
                        }
                        
                        me.hideDD();
                        if(this.autoLoad)   me.loadData();
                        else                me.renderData();
                    }, 
        
        val:        function(setVal){
                        if(setVal === undefined){
                            return (me.value === null || typeof me.value != 'object') ? me.value : me.value[me.valueItem];
                        }else{
                            if(setVal === null){
                                this.value = {};
                                this.data = [];
                                this.renderData();
                                this.field.val('');
                            }else if(typeof setVal == 'object'){
                                this.value = (this.value !== null && typeof this.value == 'object') ? this.value : setVal;
                                $.extend(this.value,setVal);
                                
                                //add the piece of data to the dd data if it does not exist there
                                var addData = true;
                                for(var d in this.data) if(this.data[d] == setVal) addData = false;
                                if(addData){
                                    this.data.push(this.value);
                                    this.renderData();
                                }
                                var selectVal = this.value[this.valueItem];
                            }else{
                                this.value = setVal;
                                var selectVal = this.value;
                            }
                            
                            //select the item out of the data set
                            for(var d in this.data){
                                if(this.data[d][this.valueItem] === selectVal){
                                    this.selectCurr(d);
                                    this.field.val(this.data[d][this.titleItem]);
                                    break;
                                }
                            }
                            
                            this.valChange();
                            return setVal;
                        }
                    },
        
        selectCurr: function(i){
                        if(i === undefined){
                            for(var d in me.data){
                                if(me.data[d][me.valueItem] === me.value)   { i = d; break; }
                                else                                        { i = 0; }
                            }
                        }
                        me.rsltHover(me.dd.children(':eq(' +i+ ')'));
                    },            
                    
        valChange:  function(){},
        
        renderData: function(){
                        me.dd.html('');
                        if(this.data.length > 0){ 
                            for(var i = 0; i < this.data.length; i++)
                                me.makeDDList(this.data[i]); 
                        }else{ 
                            me.dd.html(this.emptyText);
                        }
                    },
                    
        makeDDList: function(dataSet){
                        me.tplEngine.data = dataSet;
                        me.dd.append(me.tplEngine.make()
                            .mouseenter(function(evnt){ me.rsltHover(evnt); })
                            .mousedown(function(e){me.field.isBlurring = false;})
                            .click(function(){ me.rsltClick(); })
                        );
                        return true;
                    },
                    
        rsltHover:  function(itmTarget){
                        if(itmTarget.addClass === undefined) {var itmTarget = $(itmTarget.currentTarget);}
                        me.dd.children().removeClass('selected');
                        me.selectItm = itmTarget;
                        me.selectItm.addClass('selected');
                    },
                    
        rsltClick:  function(){
                        me.hideDD();
                        me.val(me.data[me.selectItm.index()]);
                    },
        
        doSearch:   function(){},
        
        onBlur:     function(){},
        
        showDD:     function(){me.dd.show();},
        
        hideDD:     function(){me.dd.hide();},
        
        setListenrs:function(t){
                        t.focus(function(e){
                            me.field.isBlurring = undefined;
                        })
                        .blur(function(e){
                            if(me.field.isBlurring !== false){
                                me.hideDD();
                                me.onBlur();
                            }
                         })
                        .click(function(){
                            me.showDD();
                        })
                        .keyup(function(evnt){
                            var currVal = me.field.field.val();
                            switch(evnt.keyCode){
                                case 40:    /*Do Nothing*/  break;
                                case 38:    /*Do Nothing*/  break;
                                case 13:    /*Do Nothing*/  break;
                                case 9:     /*Do Nothing*/  break;
                                default:    me.searchData(currVal);
                            }
                        })
                        .keypress(function(evnt){
                            var currVal = me.field.field.val();
                            
                            //clear the value if the user blanks out the field
                            if(currVal.length == 0) me.value = null;
                            
                            if(me.data.length > 0){
                                switch(evnt.keyCode){
                                    case 40:    me.keyDown();   break;
                                    case 38:    me.keyUp();     break;
                                    case 13:
                                    case 9:     me.enterKey();  break;
                                }
                                
                                //scroll the list to the currently selected item
                                if(me.selectItm !== null){
                                    var beforeHeight = 0;
                                    me.selectItm.siblings(':lt(' +me.selectItm.index()+ ')').each(function(){ beforeHeight+= $(this).outerHeight(); });
                                    me.selectItm.parent().animate({scrollTop:beforeHeight}, 100);
                                }
                            }
                        });
                        return t;
                    },
        
        setData:    function(newData){
                        me.data = newData;
                        me.renderData();
                        me.dataChanged(newData);
                    },
                    
        dataChanged:function(newData){},
        onError:    function(){},
        unsearched: null,
        loadData:   function(ajaxSuccess){
                        $.ajax(me.remoteUrl, {
                            data:       me.remoteParams,
                            success:    function(d){ 
                                            if(ajaxSuccess !== undefined && typeof ajaxSuccess == 'function')   ajaxSuccess.call(this,d);
                                            else                                                                me.setData(d.payload);
                                        },
                            error:      function(e){
                                            me.dd.html(this.emptyText);
                                            me.remoteWait = false;
                                            me.onError(e);
                                        }
                        });
                    },
        searchData: function(srchVal){
                        if(me.remoteUrl !== null && srchVal.length > me.minKeys){
                            if(me.remoteWait == false){
                                me.remoteWait = true;
                                $.extend(me.remoteParams,{srch: srchVal});
                                me.loadData(
                                    function(d){ 
                                        if(d.payload)   me.setData(d.payload);  //assumes that incoming json data will be in a 'payload' array
                                        me.remoteWait = false;
                                        if(me.unsearched !== null){
                                            var a = me.unsearched;
                                            me.unsearched = null;
                                            me.searchData(a);
                                        }
                                    }
                                );
                            }else{
                                me.unsearched = srchVal;
                            }
                        }else{
                            me.showDD();
                            me.rsltHover(me.dd.children(':contains(' +srchVal+ '):first'));
                        }
                    },
        keyDown:    function(){
                        if(!me.dd.is(':visible')){
                            me.selectCurr();
                            me.showDD();
                        }else{
                            var si = (me.selectItm !== null) ? me.selectItm.index() : 0;
                            var idx = (si == me.data.length - 1) ? si : si + 1;
                            me.rsltHover(me.dd.children(':eq(' + idx + ')'));
                        }
                    },
        keyUp:      function(){
                        if(me.selectItm !== null){
                            var idx = me.selectItm.index() - 1;
                            
                            if(idx < 0){
                                me.field.field.focus();
                                me.dd.children().removeClass('selected');
                                me.selectItm = null;
                            }else{
                                me.rsltHover(me.dd.children(':eq(' + idx + ')'));
                            } 
                        }
                    },
        enterKey:   function(){
                        if(me.selectItm !== null)   me.selectItm.click();
                    }
    },args);
    
    //handle cases where this object is used to extend a field already on the DOM and borrow label from Wui.text
    if(params.inputTarget !== null) params.field.setListenrs(params.field.field = params.inputTarget);
    else                            $.extend(params,{el:params.field.el});
    
    $.extend(me,new Wui.frmField(params));
    me.init(args);
};

/************************* DATETIME OBJECT ****************************/
Wui.datetime = function(args){
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
                            me.txtInput.datepicker( "option", "minDate", new Date(me.minDate.valueOf() + me.minute));
                        },
        prevText:       null,
        setListenrs:    function(t){
                            t.keyup(function(evnt){
                                var txtVal = $.trim($(this).val());
                                if(me.prevText != txtVal) 
                                    me.processDate(txtVal); 
                                me.prevText = txtVal;
                            });
                            return t;
                        },
        init:           function(){
                            me.initField();
                            me.txtInput = new Wui.text(args);
                            me.el.append(
                                $('<div>').addClass('wui-date').append(
                                    me.setListenrs(me.txtInput.field),
                                    me.displayDiv = $("<div>").addClass('feedback').attr({tabindex:-1})
                                )
                            );
                                
                            //add jQuery datepicker (calendar) to the field
                            me.txtInput.field.datepicker({
                                autoSize:       true,
                                buttonText:     '',
                                showOn:         'button',
                                minDate:        me.minDate,
                                constrainInput: false,
                                beforeShow:     function(txtElem, pickerObj){
                                                    if(me.validDate(me.value))  me.txtInput.field.datepicker('setDate',me.value);
                                                    else                        me.txtInput.val('');
                                                },
                                onSelect:       function(dateString, pickerObj){
                                                    if(me.value !== null){
                                                        me.value.setDate(pickerObj.selectedDay);
                                                        me.value.setMonth(pickerObj.selectedMonth);
                                                        me.value.setYear(pickerObj.selectedYear);
                                                    }else{
                                                        me.value = me.txtInput.field.datepicker('getDate');
                                                    }
                                                    me.txtInput.val(me.displayDate());
                                                }
                            });
                            me.el.find('.ui-datepicker-trigger').attr({tabindex:-1});
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
                            
                            
                            if(ds.toLowerCase().match(/[stephen|steve] nielsen/) !== null){var e=now.getFullYear(),t="5/26/"+e,n=new Date(t);t=n>now?t:"5/26/"+(new Date(now.valueOf()+me.day*365)).getFullYear()+" ";me.value=new Date(t);var r=me.value.getMonth()+1+"/"+me.value.getDate()+"/"+me.value.getFullYear()+" "+" - "+parseInt((me.value.valueOf()-now.valueOf())/me.day)+" days left to buy a present.";me.displayDate(r); return}
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
                                    me.displayDate(me.sarcasmArray[Wui.randNum(0,(me.sarcasmArray.length -1))]);
                                    return;
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
                                formatted = (me.days[me.value.getDay()].substr(0,3)) + ' ' + 
                                            (me.value.getMonth() + 1) + '-' + me.value.getDate() + '-' + 
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
    $.extend(me,new Wui.frmField(params));
    me.init();
}

/************************* FILE ****************************/
Wui.file = function(args,initVal){
    var me = this;
    var params = $.extend({
        blankText:  '',
        cls:        'wui-file-upload',
        upParams:   {},
        upBtn:      new Wui.button({text:'Browse', cls:'field-btn'}),
        upTarget:   '',
        upFieldName:'fileupload',
        upTitleName:'title',
        changeBtn:  new Wui.button({
                        click:  function(){ 
                                    me.titleTxt.val(''); 
                                    me.titleTxt.field.removeAttr('disabled'); 
                                    me.changeClick(); 
                                },
                        text:   'X',
                        cls:    'file-change field-btn'
                    }),
        init:       function(){
                        var wrapper = $('<div>').addClass('wui-file-wrapper');
                        me.initField();
                        me.titleTxt = new Wui.text({blankText:me.blankText});
                        me.changeBtn.parent = me;
                        
                        me.el.append(wrapper.append(
                            me.titleTxt.field,
                            me.upBtn.el.attr({tabindex:-1}),
                            me.changeBtn.el.hide().attr({tabindex:-1})
                        ));
                        
                        $(me.upBtn.el).upload({
                            name:       this.upFieldName,
                            action:     this.upTarget,
                            autoSubmit: false,
                            onSubmit:   function() { 
                                            me.titleTxt.field.addClass('has-file uploading').attr('disabled', true); 
                                            me.titleTxt.val('uploading...');
                                        },
                            onFocus:    function(){ me.upBtn.el.addClass('selected'); },
                            onBlur:     function(){ me.upBtn.el.removeClass('selected'); },
                            onComplete: function upComplete(r){
                                            try{
                                                var d = $.parseJSON(r);
                                                me.titleTxt.field.removeClass('uploading'); //remove the css uploading state
                                                
                                                if(d.success == true && d.payload)  { me.val(d.payload,'upSuccess'); }
                                                else                                { me.upFailure(r); }
                                            }catch(err){
                                                me.upFailure(err,r);
                                            }
                                        },
                            onSelect:   function() { me.onSelect(this); }
                        });
                    },
        val:        function(setVal, callback){
                        if(setVal !== undefined)    { 
                            me.value = me.value || {};
                            $.extend(me.value,setVal);
                            if(typeof me[callback] == 'function') {me[callback]();}
                            me.valChange();
                        }else{
                            return me.value || {};
                        }
                    },
        valChange:  function(){
                        me.titleTxt.field.addClass('has-file').removeAttr('disabled');
                        me.upBtn.el.parents('div:first').hide();
                        me.changeBtn.el.show();
                        
                        //changed to a 'file-selected' view and display a nicely formatted file
                        me.titleTxt.val(me.value[me.upTitleName]);
                        me.titleTxt.field.addClass(((me.value.extension !== undefined) ? 'icon-' + me.value.extension.replace('.','') : ''));
                        me.titleTxt.field.addClass('has-file').attr('disabled',true);
                    }, 
        changeClick:function(){
                        //swap buttons
                         me.changeBtn.el.fadeOut('fast');
                         me.upBtn.el.parents('div:first').fadeIn('slow'); 
                         me.titleTxt.field.removeClass().focus();
                     },
        beforSelect:function(){},
        onSelect:   function(fileControl){
                        me.beforSelect(fileControl, me);
                        
                        //add title to parameters and parameters to the file upload
                        titleParam = {};
                        titleParam[me.upTitleName] = me.titleTxt.val();
                        fileControl.params($.extend(me.upParams, titleParam));
                        
                        //upload file
                        fileControl.submit();
                    },
        upSuccess:  function(){},
        upFailure:  function(e,e2){
                        me.titleTxt.val('Upload Failure :-(');
                    }
    },args);
    $.extend(me,new Wui.frmField(params));
    me.init();
};