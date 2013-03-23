<cfoutput>
	#Replace(LCase(GetCurrentTemplatePath()),LCase(CGI.script_name),'')#<br>
	#GetDirectoryFromPath(Replace(LCase(GetCurrentTemplatePath()),LCase(CGI.script_name),'/'))#<br>
	#GetBaseTemplatePath()#
	<cfdump var="#CGI#">
</cfoutput>