//Dependent on usurf-style/www/resources/js/condor-core.js to operate
//Dependent on usurf-style/www/resources/js/condor-forms.js to operate
Condor.pageLists = [];

//get all of the lists on the page
$(document).ready(function() {	
	$(".usurf-list-wrapper").each(function(){
		Condor.pageLists.push(new Condor.pageList({
			listId:		$(this).children('table').attr('summary').split('_')[1],
			listEl:		$(this).children('table'),
			addBtnEl:	$(this).find(".usurf-add-item")
		}));
	});
});


/************************* GENERIC LIST OBJECT ****************************/
Condor.pageList = function(args){
	var me = this;
	$.extend(me,{
		listId:	0,
		listEl:		{},
		addBtnEl:	{},
		sorters:	[],
		listDesc:	{},
		sortStates: [{disp:'Ascending',cls:'condor-list-up'},{disp:'Descending',cls:'condor-list-dn'},{disp:'Click to sort.',cls:''}],
		frmOpen:	false,
		dispAddFrm:	function() {
						if(me.frmOpen == false)  me.frmOpen = new Condor.addRecForm({ 
							listObj:	me,
							onSaveFrm:	function(response, formContents) { me.refresh(response); }
						});
					},
		
		buildRec:	function(rec){
						var recEl = $("<tr>");
						for(i in me.listDesc){
							var col = $("<td>").addClass('list-table')
							.attr('headers','list_' + me.listId + '_' + me.listDesc[i].cmu_viewable_column_id)
							.text(rec[me.listDesc[i].cmu_viewable_column_id])
							.appendTo(recEl);
						}
						var classToAdd = (me.listEl.children('tbody').children().length % 2 == 0) ? 'odd' : 'even';
						recEl.addClass(classToAdd).appendTo(me.listEl.children('tbody'));
					},
		
		refresh:	function(response) {
						var recId = response.payload.record_id;
						$.ajax('/usurf-cmu/data/cmu-list-forms', {
							data:	{ xaction: 'get_record', list_id:me.listId, record_id: recId},
							success:function(d){ 
								if(d.success == true){
								    if(d.total > 0){
	                                    for(itm in d.payload) me.buildRec(d.payload[itm]); 
	                                    
	                                    //sort items if a sort already applies
	                                    if(me.sorters.length != 0)  me.sortList();
	                                    
	                                    //hook for events
	                                    me.onRefresh();
	                                }else{
	                                    Condor.errRpt( 'Your item has been submitted and will ' +
                                                       'appear in the list pending approval.',function(){}, 'Success. Item Saved.' );
	                                }
								}else{
								    Condor.errRpt('There was an error retrieving record:' + recId);
								}
							}
				 		});
					},
		onRefresh:	function() {},
		sortList:	function() {
						var mylist = me.listEl.children('tbody');
						var listitems = mylist.children('tr').get();
						listitems.sort(function(a, b) {
							var compA = $(a).children('td:eq(' + $("#" + me.sorters[0]).index() + ')').text().toUpperCase(),
								compB = $(b).children('td:eq(' + $("#" + me.sorters[0]).index() + ')').text().toUpperCase();
								
							
							//get the direction of the sort
							var srtDir = $("#" + me.sorters[0]).attr('title');
							var srtVal = (srtDir == 'Ascending') ? 1 : -1;
							
							compare = compA.localeCompare(compB) * srtVal;
							if(compare != 0){ 
								return compare;
							}else{
								if(me.sorters[1] === undefined){
									return compare;
								}else{
									var compC = $(a).children('td:eq(' + $("#" + me.sorters[1]).index() + ')').text().toUpperCase(),
										compD = $(b).children('td:eq(' + $("#" + me.sorters[1]).index() + ')').text().toUpperCase();
										
									//get the direction of the second sort
									var srtDir = $("#" + me.sorters[1]).attr('title');
									var srtVal = (srtDir == 'Ascending') ? 1 : -1;
									
									return	compC.localeCompare(compD) * srtVal;
								}
							}
						});
						$.each(listitems, function(idx, itm) { mylist.append(itm); });
						
						//reset alternate coloring
						var mylist = me.listEl.children('tbody').children('tr').each(function(){
							var row		= $(this);
							var addCls	= (row.index() % 2 == 0) ? 'even' : 'odd'; 
							row.removeClass('odd').removeClass('even').addClass(addCls);
						});
					},
		init:		function() {
						//event on add button
						me.addBtnEl.click(function(){ me.dispAddFrm() });
						
						//sorters on the list
						me.listEl.find('th').click(function(){
							//state machine for column sorters
							var sListLen = (me.sortStates.length - 1);
							var th = $(this);
							var ss = th.attr('sortState');
							
							//deal with state not being set
							if(ss === undefined) {ss = sListLen; pss = 0;}
							
							//increment sort
							pss = ss;
							ss = (parseInt(ss) + 1 > sListLen) ? 0 : parseInt(ss) + 1;
							
							//modify element
							th.attr({
								'sortState':	ss,
								title:			me.sortStates[ss].disp
							}).addClass(me.sortStates[ss].cls).removeClass(me.sortStates[pss].cls);
							
							//keep the number of sort-by elements to 2
							inSrts = $.inArray(th.attr('id'), me.sorters);
							if(ss == sListLen){ if(inSrts > -1) me.sorters.splice(inSrts,1); }
							else{
								if(inSrts == -1){
									me.sorters.push(th.attr('id'));
									if(me.sorters.length > 2){
										oldSrt = $("#" + me.sorters[0]);
										oldSrt.addClass(me.sortStates[sListLen].cls).removeClass(me.sortStates[oldSrt.attr('sortState')].cls)
										.attr({
											'sortState':	sListLen,
											title:			me.sortStates[sListLen].disp
										});
										me.sorters.splice(0,1);
									}
								}
							}
							
							//DO SORTING
							me.sortList();
						});
					}
	});
	$.extend(me,args);
	
	me.init();
}


/************************* ADD RECORD FORM ****************************/
Condor.addRecForm = function(args){
	var me = this;
	$.extend(me,{
		title:		'Add Item to List', 
		listObj:	{},
		recordId:	0,
		content:	[],
		windowEl:	null,
		getColInfo:	function(){
						var formInfoData = { xaction: 'form_info', list_id: me.listObj.listId};
						if(me.recordId != 0)	formInfoData.record_id = me.recordId;
						
						$.ajax('/usurf-cmu/data/cmu-list-forms', { data: formInfoData, success:function(d){ 
								if(d.total > 0){
									me.listObj.listDesc = d.payload;
									me.constrctFrm(d);
                                    // get dates and manually set them
                                    if (me.recordId != 0) {
                                        $.ajax('/usurf-cmu/data/cmu-list-forms',{
                                            data: {
                                                record_id:me.recordId,
                                                xaction:'form_date_info'
                                            },
                                            success:function(r){
                                                resp = r.payload[0];
                                                for (key in me.content) {
                                                    var item = me.content[key];
                                                    if (item.elId == 'condor-list-add-start-date') {
                                                        var date = $.datepicker.parseDate('yy-mm-dd',resp.start_date.split(' ')[0])
                                                        item.input.datepicker("setDate",date);
                                                        item.input.trigger('change');
                                                    } else if (item.elId == 'condor-list-add-exp-date') {
                                                        var date = $.datepicker.parseDate('yy-mm-dd',resp.exp_date.split(' ')[0])
                                                        item.input.datepicker("setDate",date);
                                                        item.input.trigger('change');
                                                    }
                                                }
                                            }
                                        });
                                    }
								}else{
									Condor.errRpt(
										'This list cannot have data added to it because it has no columns. '
										,function(){me.listObj.frmOpen = false;}
										,'No Columns in List'
									);
								}
							}
						});
					},
		markLeftys:	function(d){
						/*set the left-most column of a particular data type as the one to 
						add the control for (all others are meta*/
						var checkDataClasses = {};
						for (i in d.payload) {
							var itm = d.payload[i];
							
							if(!checkDataClasses.hasOwnProperty(itm.cmu_data_class_id)){
								checkDataClasses[itm.cmu_data_class_id] = [];
								me.markToUse(itm, checkDataClasses);
							}else{
								if($.inArray(itm.cmu_data_column_id, checkDataClasses[itm.cmu_data_class_id]) < 0){
								    me.markToUse(itm, checkDataClasses);
								}else{
									itm.dataColSelector = false;
								}
							}
						}
						
						return d;
					},
		markToUse:  function(itm, arry){
		                //hack to deal with the document class meta possibly being left of the title
		                var use_itm = (itm.class_name != "Document" || (itm.class_name == "Document" && itm.value_column == 'title'));
                        
		                if(use_itm){
                            itm.dataColSelector = true;
                            arry[itm.cmu_data_class_id].push(itm.cmu_data_column_id);
                        }else{
                            itm.dataColSelector = false;
                        }   
            		},
		render:		function() {
						me.getColInfo();
					},
		parseVal:	function(tclString){
						//this method takes a value string intended for tcl, and makes it into a JS object
						var retVar = {};
						var tclSArry = tclString.split(' ');
						
						retVar.dataCol	= tclSArry[0];
						retVar.value	= tclString.replace(tclSArry[0] + ' ','');
						retVar.value	= retVar.value.substring(1,retVar.value.length - 1);
						
						return retVar;
					},
		constrctFrm:function(colData){
						var colData = me.markLeftys(colData);
						
						//create the actual objects
						for (i in colData.payload) {
							var item	= colData.payload[i];
							var elId	= 'condor-list-add-' + item.cmu_viewable_column_id;
							var objVal	= (me.recordId == 0) ? null : item.data_value;
							var passD	= {
											dataClassName:	(item.dataColSelector) ? item.class_name : 'Meta',
											dcName:			item.class_name,
											visColId:		item.cmu_viewable_column_id,
											dataColId:		item.cmu_data_column_id,
											elId:			elId,
											passedCls:		'condor-modal-form-item',
											useData:		item.dataColSelector,
											keyCol:			item.key_column,
											valCol:			item.value_column,
											visibleP:		item.list_visible_p,
											parentFrm:		me
										  };
							var obj		= me.getFrmDC(passD,objVal);
							
							//hack for document weirdness [see me.markToUse()]
							if(item.class_name != 'Document' || (item.class_name == passD.dataClassName)){
							   var formLabel = {};
    							formLabel.el = $('<label>').attr('for',elId).text(item.header).addClass('condor-modal-form-label');
    							me.content.push(formLabel);
    							me.content.push(obj); 
							}
						}
                        
                        /******** add start and exp date objects ****************/
                        var simpleDateObj = function(args,initVal) {
                            var obj = this;
                            var extraParams = {
                                useData: true,
                                errCls: 'condor-required-field'
                            };
                            $.extend(obj,args);
                            $.extend(obj,extraParams);
                            $.extend(obj,{
                                val: function() {
                                    var value = obj.input.val();
                                    obj.input.removeClass(obj.errCls);
                                    
                                    if((value === null || !value) && obj.required){
                                        Condor.errRpt(obj.reqText,function(){},'Required Field');
                                        obj.input.addClass(obj.errCls);
                                        return false;
                                    }
                                    
                                    return obj.valCol + ' ' + value;
                                },
                                
                                input: $("<input>").attr({
                                    type:   'text',
                                    id:     obj.elId,
                                    readonly: 'readonly'
                                }).addClass(obj.passedCls).datepicker({
                                    dateFormat: 'yy-mm-dd',
                                    defaultDate: initVal,
                                    minDate: obj.minDate
                                })
                            });
                            
                            obj.el = $("<div>").css({
                                width: '100%',
                                position:'relative'
                            }).append(obj.input);
                            
                            if (initVal) obj.input.attr('value',$.datepicker.formatDate('yy-mm-dd',initVal));
                            if (obj.allowClear) {
                                var clearX = $('<div>').css({
                                    position:'absolute',
                                    width:'16px',
                                    height:'16px',
                                    'font-size':'18px',
                                    'font-weight':'bold',
                                    'line-height':'9px',
                                    top:'5px',
                                    right:'5px',
                                    visibility:'hidden',
                                    color:'#7F7F7F',
                                    cursor:'pointer'
                                }).html('x');
                                obj.el.append(clearX);
                                
                                if (obj.input.val() != "") {
                                    clearX.css('visibility','visible');
                                }
                                
                                obj.input.change(function(){
                                    if (obj.input.val() == "") {
                                        clearX.css('visibility','hidden');
                                    } else {
                                        clearX.css('visibility','visible');
                                    }
                                });
                                
                                clearX.mousedown(function(){
                                    clearX.css('visibility','hidden');
                                    obj.input.val('');
                                });
                            }
                        };
                        
                        /// start date
                        var startElId = 'condor-list-add-start-date';
                        var startDateObj = new simpleDateObj({
                            elId: startElId,
                            passedCls: 'condor-modal-form-item',
                            required: true,
                            reqText: 'Start date is required.',
                            valCol: 'start_date',
                            minDate: new Date()
                        }, new Date());
                        formLabel = {};
                        formLabel.el = $('<label>').attr('for',startElId).text('Start Date').addClass('condor-modal-form-label');
                        me.content.push(formLabel);
                        me.content.push(startDateObj);
                        
                        /// exp date
                        var expElId = 'condor-list-add-exp-date';
                        var expDateObj = new simpleDateObj({
                            elId: expElId,
                            passedCls: 'condor-modal-form-item',
                            required: false,
                            valCol: 'exp_date',
                            minDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                            allowClear: true
                        }, null);
                        
                        formLabel = {};
                        formLabel.el = $('<label>').attr('for',expElId).text('Expiration Date').addClass('condor-modal-form-label');
                        me.content.push(formLabel);
                        me.content.push(expDateObj);
                        /*********************************************************/
						
						var closeBtn = new Condor.btn({
                            text:  'Cancel',
                            click: function(){ me.windowEl.close(); }
                        });
						
						var savBtn = new Condor.btn({
                            text:  (me.recordId == 0) ? 'Add/Save' : 'Edit',
                            click: function(){ me.saveFrm(me.content); }
                        });
						
						me.windowEl = new Condor.modalWindow({
							title:		me.title, 
							content:	me.content,
							bbar:		[closeBtn, savBtn],
							width:		400, 
							height:		400,
							onWinClose:	function(theWindow){ me.listObj.frmOpen = false; }
						});
					},
		getFrmDC:	function(params, val){ return new Condor[me.dcTrnslate[params.dataClassName]](params, val); },
		dcTrnslate:	{
						'Person'	 : 'personSearchCombo',	'Text'		  : 'textAreaFrmObj', 'Hyperlink'  : 'linkFrmObj',
						'Attachment' : 'attachmentFrmObj',	'Simple Text' : 'textFrmObj',     'Meta'       : 'metaFrmObj',
						'Document'	 : 'docFrmObj',		    'Yes/No'	  : 'ynFrmObj',		  'Date Range' : 'dateTimePicker'
					},
		saveFrm:	function(frmContents) {
						//build the string to save the record (validation is built into the objects)
				 		var formOk = true;
				 		var savString = "";
                        var start_date = null;
                        var exp_date = null;
				 		for(itm in frmContents){
                            if(frmContents[itm].useData === true){
				 				var item = frmContents[itm],
                                       strResult = item.val();
				 				
                                if(strResult === false)	formOk = false;
				 				else					savString += strResult + ' ';
                                
                                // see if end date is later than start
                                if (item.valCol && item.valCol == "start_date") start_date = strResult.split(' ')[1];
                                if (item.valCol && item.valCol == "exp_date") exp_date = strResult.split(' ')[1];
                                if (start_date != null && exp_date != null) {
                                    s = Date.parse(start_date);
                                    e = Date.parse(exp_date);
                                    if (e<s) {
                                        formOk = false;
                                        Condor.errRpt('Expiration date must be later than the start date.',function(){},'Required Field');
                                        item.input.addClass(item.errCls);
                                    }
                                }
                                
				 			}
				 		}
				 		
				 		//post it to the server
				 		if(formOk){
					 		var saveData = 			{ xaction: 'form_save', list_id:me.listObj.listId, form_values: savString};
					 		if(me.recordId != 0)	saveData.record_id = me.recordId;
				 			
				 			$.ajax('/usurf-cmu/data/cmu-list-forms', {
								data:	saveData,
								success:function(d){ me.onSaveFrm(d, frmContents);  me.windowEl.close(); }
					 		});
				 		}
					},
		onSaveFrm:	function(response, formContents) {},
		init:		function() { me.render(); }
	});
	$.extend(me,args);
	
	me.init();
}


/************************* META FORM OBJECT ****************************/
Condor.metaFrmObj = function(args,initVal){
	var me = this;
	var params = $.extend({
        init:   function(initVal){
                    me.el = $("<input>").attr({
                        type:   'text',
                        vcid:   me.visColId,
                        dcid:   me.dataColId,
                        disabled:'disabled',
                        id:      me.elId
                    }).addClass(me.passedCls);
                    
                    me.val(initVal);
                },
        val:    function(setVal){
                    if(setVal === undefined){
                        return 0;
                    }else{
                        if(setVal !== null){
                            getData = { 
                                xaction:    'get_cell',
                                key_col:    me.keyCol,
                                val_col:    me.valCol,
                                dc_name:    me.dcName,
                                form_values:setVal
                            }
                            $.getJSON("/usurf-cmu/data/cmu-list-forms", getData, function(d){
                                if(d.total !== undefined && d.total > 0){ me.el.val(d.payload.cell_val); }
                            });
                        }
                    }
                }
        },args);
	$.extend(me,new Condor.cmuFrmObj(params));
	me.init(initVal);
}


/************************* LINK FORM OBJECT ****************************/
Condor.linkFrmObj = function(args,initVal){
	var me = this;
	 var params = $.extend({
	        title:      $("<label>").text("Link Title: ").append($("<input>").attr('type','text')),
	        uri:        $("<label>").text("URL: ").append($("<input>").attr('type','text')),
	        target:     $("<label>").text("Target: ").append(
	                            $("<select>")
	                            .append("<option value='_self'>Opens In Same Window</option>")
	                            .append("<option value='_blank'>Opens In New Window/Tab</option>")
	                    ),
	        init:       function(initVal){
	                        me.title.children('input').addClass(me.passedCls);
	                        me.uri.children('input').addClass(me.passedCls);
	                        me.target.children('select').addClass(me.passedCls);
	                        
	                        me.el = $("<div>").attr({
	                            vcid:   me.visColId,
	                            dcid:   me.dataColId,
	                            id:     me.elId
	                        }).addClass('condor-multipart-input').append(me.title).append(me.uri).append(me.target);
	                        
	                        me.val(initVal);
	                    },
	        testLink:   function isUrl(s) {
	                        var fullPath = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	                        var relativePath = /(\/|\/([\w#!:.?+=&%@!\-\/]))/
	                        return (fullPath.test(s) || relativePath.test(s));
	                    },
	        val:        function(setVal){
	                        var uriField = me.uri.children('input');
	                        var titleField = me.title.children('input');
	            
	                        if(setVal === undefined){
	                            //clear validation requirement class if present
	                            uriField.removeClass(me.errCls);
	                            titleField.removeClass(me.errCls);
	                            
	                            //validate Title of Link
	                            if($.trim(titleField.val()).length == 0){
	                                Condor.errRpt('The link title value for \'' + $("label[for='"+ me.elId + "']").text() + '\' must not be blank.',function(){},'Invalid Entry');
	                                titleField.addClass(me.errCls);
	                                return false;
	                            }
	                            
	                            //validate URI
	                            if(me.testLink(uriField.val()) == false){
	                                Condor.errRpt('The URL value for \'' + $("label[for='"+ me.elId + "']").text() + '\' is invalid.',
	                                              function(){},'Invalid Entry');
	                                uriField.addClass(me.errCls);
	                                return false;
	                            }
	                            
	                            return me.dataColId + ' {url {' + uriField.val() + '}' 
	                                                + ' title {' + titleField.val() + '}' 
	                                                + ' target ' + me.target.children('select').val() + '}';
	                        }else{
	                            if(setVal !== null){
	                                $.getJSON("/usurf-cmu/data/cmu-list-forms", { xaction:'link_by_id', form_values:setVal }, function(d){
	                                    if(d.total !== undefined && d.total > 0){
	                                        uriField.val(d.payload[0].uri);
	                                        titleField.val(d.payload[0].title);
	                                        me.target.children('select').val(d.payload[0].target);
	                                    }
	                                });
	                            }
	                        }
	                    }
	        
	    },args);
	$.extend(me,new Condor.cmuFrmObj(params));	
	me.init(initVal);
}


/**************************** DOCUMENT OBJECT ***************************/
Condor.docFrmObj = function(args,initVal) {
	var me = this;
	me.fileOptions = [{val:'srch', title:'From Doc Control'}, {val:'upload', title:'File Upload'}];
	var params = $.extend({
        docNum:     '',
        recStorage: 0,
        title:      '',
        extension:  '',
        setFacade:  $('<div/>').addClass('doc-val-set-facade').append($('<div/>')).css('display','none'),
        inputFacade:$('<div/>').addClass('doc-val-input-facade').css('position','relative'),
        changeBtn:  new Condor.btn({
                        click:  function(){ 
                                    me.setFacade.hide();
                                    //add cancel button to inputFacade if a value is set
                                    if(me.value !== 0) me.inputFacade.append(me.cancelChange.el.addClass('cancel-change'));
                                    me.inputFacade.fadeIn(); 
                                },
                        text:   'Change'
                    }),
       cancelChange:new Condor.btn({
                        click:  function(){  me.setFacade.show(); me.inputFacade.hide(); },
                        text:   'Cancel'
                    }),
        fileUpload: new Condor.fileFrmObj({
                        parent:       me,
                        xaction:      'upload_document',
                        onChange:     function(srchControl){ me.val(srchControl); }
                    }),
        docSearch:  new Condor.docSearchCombo({
                            parent:       me,
                            onChange:     function(srchControl){ me.val(srchControl); }
                        }),
        docType:    null,
        init:       function(initVal){
                        //add items to the upload and search controls
                        var docUpload = $("<div>").addClass('upload').addClass('condor-multipart-input').append(me.fileUpload.el);
                        var docSearch = $("<div>").addClass('srch').addClass('condor-multipart-input').append(me.docSearch.el);
                        
                        //append it all to the el
                        me.el = $('<div/>').addClass('condor-doc-input').addClass(me.passedCls)
                        .attr({
                            vcid:   me.visColId,
                            dcid:   me.dataColId,
                            id:     me.elId
                        })
                        .append(me.inputFacade
                                .append($('<div>').addClass('clear'))   //makes the floated elements in the document selection not overflow
                                .append(docSearch)
                                .append(docUpload)
                         )
                        .append(me.setFacade.prepend(me.changeBtn.el));
                        
                        //Add document type selector (uploaded or doc-control)
                        me.docType = new Condor.radioFrmObj({
                            name:       me.dataColId,
                            options:    me.fileOptions,
                            onChange:   function(radioFld){
                                            me.inputFacade.children("div:not('.clear')").hide();
                                            me.inputFacade.children('.' + radioFld.value).show();
                                        }  
                        }, 'upload');
                        me.inputFacade.prepend(me.docType.el);
                        
                        me.val(initVal);
                    },
        val:        function(setVal){
                        if(setVal !== undefined){
                            if(setVal === null){
                                return false;
                            }else if(setVal.value !== undefined){   //gets the item from a child form object
                                me.valChange({
                                    value:      setVal.value, 
                                    docNum:     setVal.docNum, 
                                    title:      setVal.title, 
                                    extension:  setVal.extension,
                                    recStorage: setVal.recStorage
                                });
                            }else{
                                $.getJSON("/usurf-cmu/data/cmu-list-forms", {xaction:'doc_by_id', form_values:setVal},function(r){
                                    if(r.success == true){
                                        try{
                                          //switch the view between upload/doc-search
                                            me.docType.val(me.fileOptions[r.payload[0].rec_storage_p].val);
                                            
                                            //updates the value of the control
                                            if(r.payload[0].rec_storage_p == 0) me.docSearch.val(setVal);
                                            else                                me.fileUpload.val({
                                                                                    value:      r.payload[0].cmu_list_document_id, 
                                                                                    docNum:     r.payload[0].doc_num, 
                                                                                    title:      r.payload[0].title, 
                                                                                    extension:  r.payload[0].doc_extension
                                                                                });
                                        }catch(e){
                                            Condor.errRpt('The value for \'' + $("label[for='"+ me.elId + "']").text() + '\' was not properly set.');
                                        }
                                    }else{
                                        Condor.errRpt("There was a problem retrieving the document.");
                                    }
                                });
                            }
                        }else{
                            if(me.value != 0){
                                if(me.recStorage == 0){
                                    return me.dataColId + ' {'
                                                        + ' document_id {' + me.value + '}'
                                                        + ' doc_extension {' + me.extension + '}'
                                                        + ' }';
                                }else{
                                    return me.dataColId + ' {'
                                                        + ' cmu_list_attachment_id {' + me.value + '}'
                                                        + ' }';
                                }
                            }else{
                                Condor.errRpt('A value for \'' + $("label[for='"+ me.elId + "']").text() + '\' is required.',function(){},'Required Field');
                                return false;
                            }
                        }
                    },
        valChange:  function(data){
                        $.extend(me,data);
                        var tplEngine = new Condor.tplt({
                            tplt:  '<span class="condor-doc-srch-icon icon-{extension}"></span>'+
                                   '<span class="condor-doc-num">{docNum}</span>' +
                                   '<span class="condor-doc-title">{title}</span>',
                            data:  data
                        });
                        me.setFacade.children('div').html(tplEngine.make());
                        me.inputFacade.hide();
                        me.setFacade.fadeIn();
                        me.updateRel(me.value);
                    }
    },args);
	$.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}


/************************* ATTACHMENTS FORM OBJECT ****************************/
Condor.attachmentFrmObj = function(args,initVal){
    var me = this;
    params = {
        el:         $("<div/>").addClass('condor-file-attachment').addClass('condor-multipart-input'),
        addBtn:     new Condor.btn({
                        click:  function(){ 
                                    if(!me.attachments[0].valIsValid()) Condor.errRpt('Choose a file before adding more.');
                                    else                                me.addAtt();
                                },
                        text:   '+ [add another file]'
                    }),
        addAtt:     function(initVal){
                        //add another file upload
                        me.attachments.push(new Condor.fileFrmObj({
                            parent:       me,
                            beforSelect:  function(fileControl, frmUpload){
                                              frmUpload.oldFileId = frmUpload.fileId;
                                          },
                            upSuccess:    function(response){ me.val(me.attachments[0].value) },
                            changeBtn:    new Condor.btn({
                                              click:    function(){ me.removeAtt(this.parent.fileId); },
                                              text:     'X'
                                          })
                        },initVal));
                        me.addBtn.el.before(me.attachments[me.attachments.length - 1].el);
                    },
        removeAtt:  function(fileid){
                        $.getJSON("/usurf-cmu/data/cmu-list-forms", {xaction:'delete_file', file_id:fileid}, function(d){
                            if(d.success == true) me.val(me.attachments[0].value);
                        });
                    },
        attachments:[new Condor.fileFrmObj({parent:me})],
        init:       function(initVal){
                        me.el.append(me.attachments[0].el);
                        me.el.append(me.addBtn.el.addClass('add-attachment'));
                        me.el.append($("<div />").addClass('clear'));
                        me.val(initVal);
                    },
        val:        function(setVal){
                        if(setVal === null || setVal == ''){
                            return false;
                        }else if(setVal === undefined){
                            return me.dataColId + ' ' + me.attachments[0].value;
                        }else{
                            console.log(setVal);
                            $.ajax("/usurf-cmu/data/cmu-list-forms", {
                                data:       {xaction:'attachment_by_id', form_values:setVal}, 
                                success:    function(d){
                                                if(d.success == true){
                                                    //clear out existing files if any
                                                    var temp = me.attachments[0];
                                                    for(var att in me.attachments) if(att != 0) me.attachments[att].el.remove();
                                                    me.attachments = [];
                                                    me.attachments.push(temp);
                                                    
                                                    //add file-upload utilites for uploads
                                                    for(var itm in d.payload){
                                                        var val = {
                                                            value:      d.payload[itm].cmu_list_attachment_id, 
                                                            docNum:     d.payload[itm].title, 
                                                            title:      d.payload[itm].title + '.' + d.payload[itm].extension, 
                                                            extension:  d.payload[itm].extension,
                                                            fileId:     d.payload[itm].cmu_file_id
                                                        };
                                                        
                                                        if(itm == 0)    me.attachments[0].val(val);
                                                        else            me.addAtt(val);
                                                    }
                                                }else{
                                                    Condor.errRpt("There was a problem retrieving the attachment.");
                                                }
                                            },
                                 dataType:  'json'
                            });
                        }
                    }
    };
    $.extend(params,args);
    $.extend(me,new Condor.cmuFrmObj(params));
    me.init(initVal);
}
