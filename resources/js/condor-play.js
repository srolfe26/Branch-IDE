$(document).ready(function(){
    //viewport
	Condor.vp = new Condor.Viewport({
		vp:				$('#content'),
		DOMNodeAdded:	function(){},
		forceMatchWin:	true,
		vObjects:		[Math.round(parseFloat($('#wrapper').css('padding-top')))]
		
	});
});