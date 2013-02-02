//Dependent on usurf-style/www/resources/js/condor-core.js

$(document).ready(function() {	
	$(window).resize(function(){
		Condor.resizeDevElems();
		Condor.resizeMenu();
	});
	
	//OPEN/CLOSE MENUS
	$("#nav-menu li:not('.my-menu') a.menu-key, #user-menu a, #user-notifications a").click(function(evnt){
		evnt.stopPropagation();
		$cont = $(this).parent('li');
		Condor.closeDDMenus($cont.siblings('li'));
		$cont.toggleClass('open');
	});
	
	//APPLICATION MENUS
	$('.condor-app-menu-container ul li').hover(
        function() { $('ul:first', this).stop().slideDown(50); },
        function() { $('ul:first', this).stop().slideUp(200); }
    );
	
	//CLOSE MENUS WHEN CLICKING "OFF" OF A MENU
	$('#wrapper').click(function(evnt){
		var openMenu = $("#nav-menu .open ul:first, #condor-app-menu-container .open ul:first");
		var mnu = [openMenu.offset(), openMenu.outerHeight(), openMenu.outerWidth()];
		
		//detect a collision if one exists
		if(openMenu.length === 1){
			var insideX = (evnt.pageX >= mnu[0].left && evnt.pageX <= (mnu[0].left + mnu[2]));
			var insideY = (evnt.pageY >= mnu[0].top && evnt.pageY <= (mnu[0].top + mnu[1]));
			if(!(insideX && insideY))	Condor.closeDDMenus(openMenu.parent('li'));
		}
		
		//close personal menu
		Condor.closeMyMenu();
	});
	
	
	//OPEN/CLOSE PERSONAL MENU
	$("#nav-menu li.my-menu a.menu-key").click(function(evnt){
		evnt.stopPropagation();
		$cont = $(this).parent('li');
		Condor.closeDDMenus($cont.siblings('li'));
		if($cont.hasClass('open') == true)	Condor.closeMyMenu();
		else								Condor.openMyMenu();
	});
	
	
	//enable menu searching
	Condor.menuSearch = function(args){
		var me = this;
		$.extend(me,{
			domid:	'empdir',
			el:		$("#widget-empdir"),
			srch:	$("<ul id='empdir-search'>"),
		
			render:	function(){
						var mnuSearch = new Condor.searchCombo({
							dfltTxt:	'Menu Search',
							valueField:	$("#intra-search"),
							rsltTarget:	$('<ul id="condor-menu-srch-rslt">'),
							template:	'<li>' +
							                '<a target="{target}" href="{uri}"><span class="widget-icon condor-menu-{icon}">&nbsp;</span>' +
							                '<span class="srch-title">{item_title}</span>' +
							                '<span class="condor-menu-desc">{meta_desc}</span></a>' +
							            '</li>',
							clrSearch:	function(){ 
            								mnuSearch.rsltTarget.html('');
            								mnuSearch.rsltCount = 0;
            								mnuSearch.selectItm = null;
            								mnuSearch.rsltTarget.hide();
            							},
							rsltClick:	function(evnt){
								            var re = /^javascript:/,
								                href = $(evnt.target).find('a').attr('href');
								                target = $(evnt.target).find('a').attr('target');
							                
							                //A click event will give a different event target
							                href = href || $(evnt.target).parent('a').attr('href');
							                target = target || $(evnt.target).parent('a').attr('target');
							                
								            if(href.match(re) === null){
								                if(target === undefined || target.length == 0)  window.location = href;
								                else                                            window.open(href);
								            }else{
								                eval(href.replace(re,''));
								            }
							},               
							onBlur:		function(){
											if(mnuSearch.selectHovr == false){
												mnuSearch.valueField.val(mnuSearch.dfltTxt);
												mnuSearch.clrSearch();
											}
										},
							doSearch:	function(srchTerm){
											$.ajax('/usurf-cmu/data/personal-menu', {
												data:		{ xaction: 'search', mid: 0, srch: srchTerm},
												success:	function(d){
																mnuSearch.clrSearch();
																if( d.total !== undefined && d.total > 0){ 
																	for(var i = 0; i < d.total; i++)
																		mnuSearch.makeRslt(d.payload[i]); 
																}else{ mnuSearch.rsltTarget.html(mnuSearch.noRsltTxt); }
																mnuSearch.valueField.after(
																        mnuSearch.rsltTarget.show()
																);
																var menuHeight = (Condor.contentHeight < $("#content").outerHeight()) ? $("#content").outerHeight() : Condor.contentHeight;
																mnuSearch.rsltTarget.css('max-height', menuHeight);
															},
												error:		function(d){ mnuSearch.rsltTarget.html(mnuSearch.noRsltTxt); }
											});

										}
						});
					}
		});
		
		//override default parameters with passed parameters
		$.extend(me,args);
		me.render();
	}
	
	//Handle notifications
	Condor.initNotify();
	
	//Put the developer support footer inside the wrapper
	$(".developer-support-footer").appendTo("#spacing");
	
	//enable search
	Condor.menuSearch();
	
	//resize elements on page load
	Condor.resizeDevElems();
	Condor.resizeMenu();
	
	//viewport
	Condor.vp = new Condor.Viewport({
		vp:			$('#content'),
		vObjects:	[ $(".developer-support-footer").outerHeight(), Math.round(parseFloat($("#spacing").css('padding-left'))) * 2 ]
	});
	
	//Easter Egg
	Condor.condorEE();
});

Condor.condorEE=function(){function e(h){var k=[$(document).width(),$(document).height()];var g=[10,10],l=[10,k[1]-70],i=[k[0]-130,k[1]-70],j=[k[0]-130,10];var f=$("#theBird");if(h==4){h=0}switch(h){case 0:pos=g;break;case 1:pos=l;break;case 2:pos=j;break;case 3:pos=i;break}f.animate({top:pos[1],left:pos[0]},1200,function(){e(h+1)})}function c(){var f=$("#theBird");if(f.length>0){f.remove()}else{f=$('<div id="theBird">').css({"background-image":'url("/resources/usurf-style/img/condor_small.png")',height:53,left:10,position:"absolute",top:10,width:120});$("body").append(f);e(1)}}var b=$("#wrapper"),d=$("body"),a=$('<div id="condor-ee">').css({position:"absolute",right:10,bottom:5,width:15,height:15,cursor:"default",color:"lightblue"}).html(".").click(c);b.append(a)};

Condor.themer = function() {
    var me = {};
    $.extend(me,{
        changer: function (w1, w2, w3, h1, liA, liB, td, th) {
            $('#wrapper').css({ background: 'linear-gradient(to bottom,'+w1+' 0%, '+w2+' 62%, '+w3+' 100%) repeat scroll 0 0 transparent' });
            $('#usurf-content-wrapper h1').css({ color: h1 });
            $('#my-favorites-intra li').css({ background: liA });
            $('#my-favorites-intra li.widget-li div.widget, #my-favorites-intra li a').css({ background: liB });
            $('table.usurf-list tr.odd td').css({ background: td });
            $('table.usurf-list tr th').css({ background: th });
        },
        //                                      w1         w2        w3          h1        liA        liB        td         th
        blue:       function() { me.changer('#163854', '#678EC0', '#678EC0', '#99AA00', '#555555', '#CCCCCC', '#DDDDDD', '#777777'); },
        black:      function() { me.changer('#343434', '#000000', '#343434', '#99AA00', '#555555', '#CCCCCC', '#DDDDDD', '#777777'); },
        brown:      function() { me.changer('#633500', '#000000', '#633500', '#563600', '#603300', '#E0D8CC', '#E0D8CC', '#603300'); },
        red:        function() { me.changer('#770001', '#000000', '#770001', '#770001', '#770001', '#f7dedf', '#f7dedf', '#770001'); },
        yellow:     function() { me.changer('#e0ca00', '#000000', '#e0ca00', '#b8a500', '#b8a500', '#f6f2cb', '#f6f2cb', '#b8a500'); },
        white:      function() { me.changer('#CCCCCC', '#444444', '#CCCCCC', '#444444', '#555555', '#CCCCCC', '#DDDDDD', '#777777'); },
        green:      function() { me.changer('#0a3d0c', '#000000', '#0a3d0c', '#0a3d0c', '#0a3d0c', '#d3e9d4', '#d3e9d4', '#0a3d0c'); },
        halloween:  function() { me.changer('#d67300', '#000000', '#000000', '#222222', '#222222', '#ffd5a3', '#ffd5a3', '#222222'); },
        custom:     function() {
                        var args = arguments;
                        var a = args[0] || '#163854',
                            b = args[1] || '#678EC0',
                            c = args[2] || '#678EC0',
                            d = args[3] || '#99AA00',
                            e = args[4] || '#555555',
                            f = args[5] || '#CCCCCC',
                            g = args[6] || '#DDDDDD',
                            h = args[7] || '#777777';
                        console.log('8 color changing options available as arguments in the following order. Leave as null or false to skip changing a color:');
                        console.log('1) background gradient top');
                        console.log('2) background gradient middle');
                        console.log('3) background gradient bottom');
                        console.log('4) main h1 tag');
                        console.log('5) "my intra items" icon background box');
                        console.log('6) "my intra items" item');
                        console.log('7) list item background');
                        console.log('8) list header');
                        console.log('Example: Condor.themer().custom(\'#000000\', false, false, \'blue\', ......);');
                        me.changer(a,b,c,d,e,f,g,h);
                    }
    });
    
    return me;
};

//RESIZE MENU HEIGHTS
Condor.resizeMenu = function(){
    if($("#wrapper").css('overflow') == 'hidden'){
        $("#nav-menu").children("li:not('.my-menu, #user-menu, #user-notifications, #user-info')").each(function(){
            var $submenu = $(this).children('ul').children('li');
            var totalWidth = 0;
            var maxHeight = 0;
            
            $submenu.children('ul').each(function(){
                totalWidth += $(this).outerWidth();
                if($(this).outerHeight() > maxHeight)   maxHeight = $(this).outerHeight();
            });
            
            //for IE8
            if($.browser.msie && $.browser.version == 8) totalWidth += 2;
            
            $submenu.width(totalWidth);
            $submenu.height(maxHeight);
       });
    }else{
        //This is the case for mobile
        $("#nav-menu li:not('.my-menu, #user-menu, #user-notifications, #user-info') ul").css('max-height', $("#content").height() + 'px');
    }
}

//RESIZE DEV-MENU IF NEEDED
Condor.resizeDevElems = function(){
    if($(window).width() <= 1024 && $("#developer-toolbar ul").length > 0) $("#developer-toolbar ul").css('font-size','0.75em').css('line-height','4em');
    else                                                                   $("#developer-toolbar ul").removeAttr('style');  
}

Condor.openMyMenu = function() {
	$("#personal-menu").css('display','block');
    $("#nav-menu li.my-menu").addClass('open');
    $("#wrapper").animate({left:"-250px"},150);
}//end openMyMenu


Condor.closeMyMenu = function() {
    $("#nav-menu li.my-menu").removeClass('open');
	$("#wrapper").animate({left:"0px"},150,function(){
	    $("#personal-menu").css('display','none');
	});
}//end closeMyMenu

Condor.closeDDMenus = function($menus) {
	$menus.each(function(){
		if(!$(this).hasClass('my-menu'))	$(this).removeClass('open');
	});
}//end closeDDMenus

//Draggable and Sortable Menu Items
$(function() {
	$( "#my-links").sortable({
		revert: false,
		tolerance: 'pointer',
		handle: '.widget-icon',
		placeholder: 'sortable-paceholder',
		receive: function(e, ui) {sortableIn = 1;},
		over: function(e, ui) {sortableIn = 1;},
		out: function(e, ui) {sortableIn = 0;},
		update: function(event,ui) {
			var itm 		= ui.item;
			var targetList	= itm.parent();
			var pmId		= itm.attr('pmid');
			var miId		= itm.attr('miid');
			
			if(pmId === undefined){
				var addItem = true;
				itm.siblings().each(function(){
					var $me = $(this);
					if($me.attr('miid') == miId) addItem = false;
				});
				
				//ADDS AN ITEM TO THE PERSONAL MENU AND MAKES THE DB CALL
				if(addItem){
					$.ajax('/usurf-cmu/data/personal-menu', {
						data:		{ xaction: 'add', mid: miId, idx: itm.index()},
						success:	function(d){
										Condor.saveMenuOrder(targetList);
										itm.attr('pmid',d.payload[0].personal_menu_id);
										
										//adds js, css, and placeholder for a widget
										if(itm.attr('iswid') == 1){
											var widPlace = $("<div>").addClass('widget-' + d.payload[0].dom_id).addClass('widget');
											itm.children('a').replaceWith(widPlace);
											itm.append($("<div>").addClass('clear').text('&nbsp;'));
											
											if(Condor.isIndexHomePage === true) itm.clone(true).addClass('widget-li').appendTo("#my-favorites-intra");
											
											//add css
											if(d.payload[0].widget_css.length > 0)
												$('head').append($('<link type="text/css" media="all" rel="stylesheet">').attr({href:d.payload[0].widget_css}));

											//add js
											$('head').append($("<script>").attr({type:"text/javascript", src:d.payload[0].widget}));
										}else{
										    if(Condor.isIndexHomePage === true) itm.clone(true).appendTo("#my-favorites-intra");
										}
									}, 
						error:		function(d){
										Condor.errRpt('There was an error adding this item to your personal menu.', function(){ itm.remove(); });
									}
					});
				}else{
					Condor.errRpt('You already have this item/widget in your personal menu.', function(){ itm.remove(); });
				}
			}else{ Condor.saveMenuOrder(targetList); }
			
			//remove any sub-menu-items and residual from dragging
			itm.children('ul').remove();
			itm.removeClass('ui-draggable');
		},
		zIndex: 10055,
		beforeStop: function(event,ui) {
			//DELETE AN ITEM FROM THE PERSONAL MENU
			if (sortableIn == 0) { 
				var $itm		= ui.item;
				var pos			= ui.offset;
				var deletedItem	= $itm.clone().addClass('ba-leted').css({
					position: 	'absolute',
					top:		pos.top + 'px',
					left:		pos.left + 'px'
				});
				
				//temporarily hide the item and replace it with a decoy
				$itm.css('opacity',0);
				deletedItem.appendTo('body');
				
				var pmId = deletedItem.attr('pmid');
				$.ajax('/usurf-cmu/data/personal-menu', {
					data: {xaction:'delete', mid:pmId},
					success: function(){
								$itm.remove();
								$("[pmid="+ pmId +"]").fadeOut(800,function(){ $(this).remove(); });
								deletedItem.fadeOut(650,function(){ $(this).remove(); });
							},
					error: function (){
								$itm.css('opacity',100);
								Condor.errRpt('There was an error and your menu item was not deleted.', function(){
									deletedItem.fadeOut(150,function(){ $(this).remove(); });
								});
							}
				});
			}
		}
	});
	
	$( "#nav-menu li:not('#user-menu, #user-notifications') ul li ul li:not('.header')" ).draggable({
		connectToSortable: "#my-links",
		containment:'document',
		helper: function(evnt){
			var obj = $(evnt.currentTarget.outerHTML)
			obj.addClass('dragging-obj').appendTo('body').children('ul').remove();
			return obj;
		},
		revert: "invalid",
		delay: 50
	});
});


Condor.saveMenuOrder = function(targetList){
	targetList.children().each(function(){
		var me = $(this);
		var pmId = me.attr('pmid');
		if(pmId !== undefined){
			var sendData = { xaction: 'update', mid: pmId, idx: me.index()};
			$.get("/usurf-cmu/data/personal-menu",sendData,function(data){});
		}
	});
}

Condor.initNotify = function(){
	//add class for urgent notifications
	if($("#user-notifications ul li a.urgent").length > 0)	$("#sdl-alert-btn").addClass('urgent');
	
	//sets notification count
    var notificationCount = $("#user-notifications ul li a").length;
    $("#sdl-alert-btn").text(notificationCount);
	if(notificationCount == 0)	$("<li>").addClass('notify-empty').text('No Notifications').appendTo("#user-notifications ul");
}//end initNotify


Condor.reportJiraErr = function(type,descText){
    Condor.jiraWindowOpen = (Condor.jiraWindowOpen !== undefined) ? Condor.jiraWindowOpen : false;
    if(Condor.jiraWindowOpen == false){
	    var me = { content: [] },
            descText = (descText !== undefined && descText.length > 0) ? descText : "",
            projName = Condor.jira_project_name || "",
            projId = Condor.jira_project_id || 10040,
            type = type || 0;
        
        switch (type) {
            case 1:
                me.titleText = "Reporting a Bug for " + projName;
                typeId = 1;
                break;
            case 2:
                me.titleText = "Requesting a Feature for " + projName;
                typeId = 2;
                break;
            case 3:
                me.titleText = "Giving Feedback for " + projName;
                typeId = 7;
                break;
            default:
                me.titleText = "Report a Bug";
                typeId = 1;
        }
        
        // summary field
        me.content.push(new Condor.formLabel({text:'Summary'}));
        me.summary = new Condor.textFrmObj({passedCls:'condor-modal-form-item'});
        me.content.push(me.summary);
        
        // description field
        me.content.push(new Condor.formLabel({text:(type !== 3) ? "Description" : "Praises of Gratitude / Moans of Despair"}));
        me.desc = new Condor.textAreaFrmObj({passedCls:'condor-modal-form-item'},descText);
        me.content.push(me.desc);
        
        // buttons
        var closeBtn =  new Condor.btn({
                            text:  'Cancel',
                            click: function(){ me.window.close(); }
                        });
        
        var saveBtn =   new Condor.btn({
                            text:  'Submit',
                            click: function(){ me.saveForm(); }
                        });
                            
        // save function
        me.saveForm = function() {
            valid = false;
            sumVal = me.summary.el.val();
            if (sumVal != "") {
                valid = true;
            } else {
                Condor.errRpt('You must have a summary to submit.',function(){},'Required Field');
                me.summary.el.addClass('condor-required-field');
            }
            
            var meta = 'Platform: ' + navigator.platform +
                                '\nBrowser: ' + navigator.appName + ' ' + jQuery.browser.version +
                                '\nuserAgent String: ' + navigator.userAgent;
            
            if (valid) {
                $.ajax('/wt-jira-helper/bug-submit', {
                    dataType: 'json',
                    data: {
                        summary: sumVal,
                        description: me.desc.val(),
                        pid: projId,
                        type_id: typeId,
                        meta: meta
                    },
                    success:    function(resp){
                                    var a = $('<a>').prop('href', resp.self),
                                        hostname = a.prop('hostname'),
                                        protocol = a.prop('protocol'),
                                        url = protocol+"//"+hostname+"/browse/"+resp.key,
                                        location = "<a target='_blank' href='"+url+"'>View in Apptrack ("+resp.key+")</a>";
                                    Condor.errRpt('Your request has been submitted. You may track progress here:<br><br>'+location,function(){},'Submitted!');
                                    me.window.close();
                                },
                    error:      function(d){ Condor.errRpt('There was an error on the server. Please try again.',function(){},'Server Error'); }
                });
            }
    
        };
        
        // init window
        me.window = new Condor.modalWindow({
            title:      me.titleText,
            content:    me.content,
            width:      500,
            height:     300,
            bbar:       [closeBtn, saveBtn],
            onWinOpen:  function(){Condor.jiraWindowOpen = true;},
            onWinClose: function(){Condor.jiraWindowOpen = false;}
        });
	}
}