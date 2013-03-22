/*!
 *  Branch JS
 *  Stephen Nielsen
 *  Created June 2012 for Utah State University Research Foundation
 */
searchNode = function(data, parent){
	var me = this; 
	$.extend(me,new bjsNode(data, parent));
	$.extend(me,{
		addChild:		function(dataForNode){
							var newNode = new searchNode(dataForNode, me);
							me.children.push(newNode);
						},
		
		addChildren:	function(){
							me.rt.beforeAddSearch(me);
							
							//Add each child element based on data passed in
							for(var item in me.data){ me.addChild(me.data[item]); }
							
							//adjust height of container dependent on depth and lock parent to keep it from scrolling
							me.el.children("." + me.childClass)
								.height(me.rt.height - me.depth * (me.rt.nodeHeight + me.rt.nodeMargin))
								.css('overflow','auto');
							me.parent.el.children("." + me.childClass).css('overflow','hidden');
							
							me.rt.afterAddSearch(me);
						},
						
		getSiblings:	function(){
							var retSiblings = [];
							if(me.parent instanceof searchNode){
								var parentsKids = me.parent.children;
								for(var aNode in parentsKids) if(parentsKids[aNode] !== me) retSiblings.push(parentsKids[aNode]);
							}
							return retSiblings;
						},
		
		render:			function(){
							//Render my link according to the properties of the root or branch general object
							var nodelink = me.el.children('a');
							
							if(me.data.name == undefined){	nodelink.remove();
							}else{
								nodelink.text(me.data.name).css({height:0, padding:0, left:'-' + (me.rt.width + me.rt.padding * 2) + 'px'})
								.click(function(){ me.rt.resultSelect(me); });
							}
							//add to my parent
							if(me.parent.el.children("." + me.childClass).length > 0)	me.el.appendTo(me.parent.el.children("." + me.childClass));
							else														me.el.appendTo(me.parent.el);
							
							//animate according to parameters for branch
							nodelink.animate({
								height:		me.rt.nodeHeight, 
								padding:	me.rt.padding,
								marginTop:	me.rt.nodeMargin,
								left:		0
							}, me.rt.trnSpeed);
						}
	});
}


bjsNode = function(data, parent){
	var me = this;
		me.ndClass		= 'branchjs-node';
		me.childClass	= 'branchjs-children';
	 
	$.extend(me,{
		parent:			parent,
		children:		[],
		data:			data || {},
		selected:		false,
		rt:				null,
		depth:			0,
		el:				$('<div class="' +me.ndClass+ '"><div class="' +me.childClass+ '"></div></div>'),
		
		addChild:		function(dataForNode){
							var newNode = new bjsNode(dataForNode, me);
							me.children.push(newNode);
						},
						
		processKids:	function(data){
							me.rt.beforeAddKids(me);
							
							//Add each child element
							for(var item in data){ me.addChild(data[item]); }
							
							if(me.getDepth() == 0)	me.rt.init();
							else					me.renderChildren();
							
							me.adjChildrenHt();
							me.rt.afterAddKids(me);
							me.rt.followPathToNode();
						},
		adjChildrenHt:  function(){
		    if(me.children.length > 0){
		                       var srchMux     = (me.rt.searchable) ? 1 : 0,
                                   childHeight = me.rt.height - me.depth * (me.rt.nodeHeight + me.rt.nodeMargin) - me.rt.srchHt * srchMux;
                                
                                //adjust height of container dependent on depth and lock parent to keep it from scrolling
                                me.el.children("." + me.childClass).height(childHeight).css('overflow','auto');
                                me.parent.el.children("." + me.childClass).css('overflow','hidden'); 
                                
                                for(var i in me.children){
                                    if(me.children[i].selected) me.children[i].adjChildrenHt();
                                }
    		                }
                		}, 				
		addChildren:	function(){ me.rt.addChildren(me); },
						
		getDepth:		function(){
							if(me.parent.getDepth === undefined)	return 0;
							else									return 1 + me.parent.getDepth();
						},
						
		getSiblings:	function(){
							var retSiblings = [];
							if(me.parent instanceof bjsNode){
								var parentsKids = me.parent.children;
								for(var aNode in parentsKids) if(parentsKids[aNode] !== me) retSiblings.push(parentsKids[aNode]);
							}
							return retSiblings;
						},				
						
		getBranch:		function(){
							if(me.parent.getBranch === undefined)	return me.parent;
							else									return me.parent.getBranch();
						},
		
		lowestSelected:	function(){
							if(me.selected || (me.parent instanceof bjsBranch)){
								var selectedChild = false;
								
								for(var aNode in me.children){
									var isSelected = me.children[aNode].selected;
									if(isSelected !== false){
										selectedChild = me.children[aNode];
										return selectedChild.lowestSelected();
									}
								}
								return me;
							}else{
								return false;
							}
						},
						
		elSelection:	function(){
							if(me.selected)	me.el.children('a').addClass('selected');
							else			me.el.children('a').removeClass('selected');
						},
		
		hide:			function(removeToo){
							var hideSpeed = (removeToo === true) ?  (me.rt.trnSpeed / 2) : me.rt.trnSpeed;
							
							me.el.children('a').animate({
								height:		0, 
								padding:	0,
								marginTop:	0,
								left:		'-=' + (me.rt.width + me.rt.padding * 2) + 'px'
							}, hideSpeed, function(){
								if(removeToo === true)	me.remove();
							});
							if(removeToo === true)
								me.el.children('.' + me.childClass).animate({
									height:		0, 
									padding:	0,
									marginTop:	0,
									left:		'-=' + (me.rt.width + me.rt.padding * 2) + 'px'
								});
						},
		
		show:			function(){
							me.el.children('a').animate({
								height:		me.rt.nodeHeight, 
								padding:	me.rt.padding,
								marginTop:	me.rt.nodeMargin,
								left:		0
							}, me.rt.trnSpeed);
						},
						
		showSiblings:	function(){
							//show siblings
							var sibs = me.getSiblings();
							for (sib in sibs) { sibs[sib].show(); }
							me.remChildren();
							
							return false;	//indicates the selected status for me.selected (because siblings only show on non-selected items)
						},
						
		showChildren:	function(){
							me.addChildren();
							me.renderChildren();
							
							//hide siblings
							var sibs = me.getSiblings();
							for (sib in sibs) { sibs[sib].hide(); }
							
							return true;	//indicates the selected status for me.selected (because children only show on selected items)
						},
						
		
		remChildren:	function(){
							me.rt.beforeRemKids(me);
							
							//remove the children elements
							for(var i = me.children.length - 1; i >= 0; i--)	me.children[i].remove();
							
							//adjust the container height
							me.el.children("." + me.childClass).animate({height:0}, me.rt.trnSpeed);
							me.parent.el.children("." + me.childClass).css('overflow','auto');
							
							me.rt.afterRemKids(me);
						},
		
		render:			function(){
							//Render my link according to the properties of the root or branch general object
                		    var count = 0;
                		    for (k in me.data) if (me.data.hasOwnProperty(k)) count++;
		                    
		                    if(count != 0){
		                        var renderer = new me.rt.templateEngine({tplt:me.rt.tplt, data:me.data}),
                                    nodelink = renderer.make().click(function(){
                                        me.selected = me.selected ? me.showSiblings() : me.showChildren();
                                        me.elSelection();
                                        me.rt.nodeClick(me);    //fire event hook functions
                                    });
                                
                                me.el.prepend(nodelink);
                                
                                //animate according to parameters for branch
                                nodelink.animate({
                                    height:     me.rt.nodeHeight, 
                                    padding:    me.rt.padding,
                                    marginTop:  me.rt.nodeMargin,
                                    left:       0
                                }, me.rt.trnSpeed);
		                    }
                		    
							//add to my parent
							if(me.parent.el.children("." + me.childClass).length > 0){
								me.el.appendTo(me.parent.el.children("." + me.childClass));
							}else{
								me.el.appendTo(me.parent.el);
							}
														
							me.renderChildren();
						},
						
		remove:		function(){
							me.el.remove();
							for(var child in me.parent.children){
								if(me.parent.children[child] == me){
									me.parent.children.splice(child,1);
									break;
								}
							}
						},
						
		renderChildren: function(){
							for(var theNode in me.children) me.children[theNode].render();
						}
	});
	
	//initialize node
	me.rt		= me.getBranch();
	me.depth	= me.getDepth();
}


bjsBranch = function(args){
	var me = this;
	$.extend(me,{
		el:					$('body'),
		height: 			'100%',
		width:				'100%',
		trnSpeed:			350,
		srchHt:				32,
		searchMargin:		0,
		searchable:			true,
		minSearchLength:	3,
		okToSearch:         true,
		dfltSrchTxt:		'Search',
		searchField:        $("<input>").attr({
                                name:   'bjs-search-text',
                                type:   'text',
                                value:  me.dfltSrchTxt
                            }),
		gotoNodePath:		[],
		nodePathHolder:		null,
		nodeHeight:			45,
		nodeMargin:			2,
		padding:			10,
		root:				null,
		searchBox:			null,
		tplt:               '<a href="javascript:void(0);">{name}</a>',
		templateEngine:       function(args){
                    		    var me = this;
                    		    $.extend(me,{
                    		        tplt:   '<li>{itm}</li>',
                    		        data:   {itm:"srn"},
                    		        make:   function(){
                    		                    var tplCopy = me.tplt;
                    		                    return $(tplCopy.replace(/\{(\w*)\}/g,function(m,key){return me.data.hasOwnProperty(key) ? me.data[key] : "";}));
                    		                }
                    		    }); 
                    		    $.extend(me,args);
                    		},
		getSelected:		function(){ return me.root.lowestSelected(); },
		
		setHeight:          function(val){
                    		    var padding = me.el.outerHeight() - me.el.height();
		                        var origHeight = me.height;
		                        me.height = val - padding;
                    		    if(origHeight != me.height)   me.root.adjChildrenHt();
                    		},					
		
		clearTreeNodes:		function(){ for(var child in me.root.children) me.root.children[child].hide(true); },
		
		delayForAnimation:	function(fn){ setTimeout(fn, me.trnSpeed + 100); },
		
		doSearch:			function(){
		                        /*OVERRIDE ME LIKE THIS:
		                        var srchTerm = me.getSearchVal();
								if(srchTerm !== false){
									me.cancelSearchBtn();
								}else{
									alert('Your search was either too short or empty. (Minimum of ' +me.minSearchLength+ 'characters required)');
								}*/
							},
							
		addChildren:		function(node){
								/*OVERRIDE ME LIKE THIS:
								if(nd.depth == 0){
									$.getJSON("../../assets/cfcs/survey.cfc",{method:'getListJSON'},function(list){nd.processKids(list)});
								}else if(nd.depth == 1){
									$.getJSON("../../assets/cfcs/survey.cfc",{method:'getListJSON', survey_id:nd.data.id},function(list){nd.processKids(list)});
								}*/
							},
		
		passEl:				function(fromEl,toEl){ toEl.el = fromEl.el; },
		
		showSearchResults:	function(results){
								var srch = new searchNode(results, me);
								
								me.clearTreeNodes();
								me.passEl(me.root,srch);
								
								me.root = srch;
								me.root.addChildren();
								me.root.renderChildren();
							},
							
		resultSelect:		function(nd){
								var nodeData	= nd.data;
								
								me.cancelSearch();
								
								//make up a bogus pathway since I don't have server data coming back
								var bogusPath = [getMeANumberBetween(65,80),getMeANumberBetween(165,180),getMeANumberBetween(265,280)];
								var nodeLevel = parseInt(nodeData.id / 100);
								if(bogusPath.length > nodeLevel)	bogusPath.splice(nodeLevel,bogusPath.length - nodeLevel);
								
								bogusPath.push(nodeData.id);
								me.gotoNodePath = bogusPath;
								
								//tell the root to navigate to this pathway
								me.nodePathHolder = me.root;
								me.followPathToNode();
							},
		
		cancelSearch:		function(){
								var newRt = new bjsNode({}, me);
								
								//clear search results
								me.searchBox.children('input').val(me.dfltSrchTxt);
								me.clearTreeNodes();
								me.addSearchBtn();
								
								//reinstate normal tree
								me.passEl(me.root,newRt);
								me.root = newRt;
								me.root.addChildren();
								me.root.render();	
							},							
		
		addSearchBtn:		function(){
								me.searchBox.children('a').remove();
								me.searchBox.append(
									$("<a>").attr({class:'bjs-srch-btn', href: 'javascript:void(0);'}).click(function(){me.doSearch();})
								);
							},
		
		
		cancelSearchBtn:	function(){
								me.searchBox.children('a').remove();
								me.searchBox.append(
									$("<a>").attr({class:'bjs-cancel-btn', href:'javascript:void(0);'}).click(function(){me.cancelSearch();})
								);
							},
							
		followPathToNode:	function(){
								if(me.gotoNodePath.length > 0){
									var nph				= me.nodePathHolder;
									var nodeToSelect	= false;
									
									//check for a node having an id matching the first element of the path
									for(var aNode in nph.children){
										if(nph.children[aNode].data.id == me.gotoNodePath[0]){
											nodeToSelect = nph.children[aNode];
											break;
										}
									}
									
									if(nodeToSelect !== false){
										me.gotoNodePath.splice(0,1);
										me.nodePathHolder = nodeToSelect;
										me.delayForAnimation(me.clickNodeOnPath);
									}
								}
							},
							
		clickNodeOnPath:	function(){ me.nodePathHolder.el.children('a:first').click(); },
		init:				function(){
								me.root.render();
								
								//adjust margin to account for the margin-top on the nodes
								me.root.children[0].el.css('margin-top','-' + me.nodeMargin + 'px');
							},
		nodeClick:			function(){},
		beforeRemKids:		function(){},
		beforeAddKids:		function(){},
		beforeAddSearch:	function(){},
		afterAddSearch:		function(){},
		searchClick:		function(){},
		afterRemKids:		function(){},
		afterAddKids:		function(){}
	});
	
	//override default parameters with passed parameters
	$.extend(me,args);
	
	//calculate width-based percentages
	if((me.width).indexOf && (me.width).indexOf('%') > -1){
		var percentage		= ((parseFloat(me.width) / 100) > 1) ? 1 : (parseFloat(me.width) / 100); //stops values greater than 100%
		me.width			= Math.floor(percentage * me.el.width());
	}
	
	//calculate height-based percentages
	if((me.height).indexOf && (me.height).indexOf('%') > -1){
		var percentage		= ((parseFloat(me.height) / 100) > 1) ? 1 : (parseFloat(me.height) / 100); //stops values greater than 100%
		me.height			= Math.floor(percentage * me.el.height());
	}
	
	
	//Build Branch Search Box And Add Functionality
	if(me.searchable){
		me.searchBox = $("<div>")
		.addClass('branchjs-search')
		.height(me.srchHt)
		.append(
			me.searchField.css({
				width:	Math.round(me.width - me.searchMargin * 2) + 'px',
				height:	Math.round(me.srchHt - (me.searchMargin * 2)) + 'px',
				margin:	me.searchMargin
			})
			.focus(function(){ if($(this).val() == me.dfltSrchTxt) $(this).val(''); })
			.blur(function(){ if($(this).val().length == 0) $(this).val(me.dfltSrchTxt); })
			.keypress(function(evnt){if($(this).val().length >= me.minSearchLength && me.okToSearch){me.doSearch();}})
		);
		me.addSearchBtn();
		me.searchBox.appendTo(me.el);
	}
	
	//start branch
	me.root = new bjsNode({}, me);
	me.root.addChildren();
	console.log(me);
}