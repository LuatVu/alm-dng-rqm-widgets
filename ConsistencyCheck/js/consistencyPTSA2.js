function storeUnderlinedTextPtsa2(content,typename,id){ 
	if(typename == "SC_FUNC_REQ" || typename == "BC-FC_FUNC_REQ"){
		fetchUnderlinedText(content,sfReqArray,sfId,id);
	}
	if(typename == "SC_INTERFACE_REQ" || typename == "BC-FC_INTERFACE_REQ"){
		fetchUnderlinedText(content,interReqArray,interId,id);
	}
}
		
function fetchModuleDetails(){ 
	var xhttp = new window.top.XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			showResponseForModuleURL(this.responseText); 
		}else if(this.readyState == 4 && this.status == 404){							
			
		}else if(this.readyState == 4 && this.status == 503){							
			//document.getElementById("percentCompleteBar").style.display = "none";
			//document.getElementById("updateInfo").innerHTML = "Performing PTSA2.x interface check: "+percentStatus+" % Complete";
		}
	};
	xhttp.open('GET',moduleUrl, false);
	xhttp.setRequestHeader('OSLC-Core-Version', '2.0');
	xhttp.setRequestHeader('Accept', 'application/rdf+xml');
	/* if(configUrl != null){
		xhttp.setRequestHeader(configKey,configUrl);
	} */	localConfigUrl
	if(configUrl != null && changeSetUrl == undefined){
		xhttp.setRequestHeader('vvc.configuration',localConfigUrl);
	}else if(changeSetUrl!=undefined){
		xhttp.setRequestHeader('vvc.configuration',changeSetUrl);
	}
	xhttp.send();
}

function showResponseForModuleURL(response){
	moduleUrlArray = [];
	var moduleResponse = response.toString();
	parser = new DOMParser();
	var moduleDoc = parser.parseFromString(moduleResponse,"text/xml");
	var countModuleUrl = moduleDoc.getElementsByTagName("rdf:Description")[0].childElementCount;
	for(var i = 0; i < countModuleUrl; i++){
		var artifactUrl = moduleDoc.getElementsByTagName("oslc_rm:RequirementCollection")[i].attributes[0].nodeValue;
		if(artifactUrl != moduleRef.uri && artifactUrl.includes("/rm/resources/")){
			moduleUrlArray.push(artifactUrl);
		}
	} 
	countRows = 0;
	var tempMyObj = Object.create(moduleRef);
	if(moduleUrlArray.length!=0){
		fetchArtDetails(moduleUrlArray,0,tempMyObj);
	}else if(moduleUrlArray.length == 0){
		interfaceReqCheck();
		createNewHTMLPage();
	}
}

function fetchArtDetails(moduleUrlArray,countRows,tempMyObj){
	try {		
		tempMyObj['uri'] = moduleUrlArray[countRows];
		var attributesToFetch = [
		RM.Data.Attributes.IDENTIFIER,
		RM.Data.Attributes.PRIMARY_TEXT,
		RM.Data.Attributes.ARTIFACT_TYPE];
		attributesToFetch.push("Status");
		RM.Data.getContentsStructure(tempMyObj, attributesToFetch, function (artResult) {
			if (artResult.code === RM.OperationResult.OPERATION_OK) {
				var i = 0;
				var rows = artResult.data;
				if(rows.length!=0){
					fetchArtifactDetailsOfModule(i,rows);
				}
			}
			if(countRows == moduleUrlArray.length-1){
				interfaceReqCheckPtsa2ForOuterModule();
			}else{	
				if(moduleUrlArray.length != 0){
				var percentStatus = Math.round((countRows/moduleUrlArray.length)*100);
				//console.log("percentStatus="+percentStatus);
				document.getElementById("percentCompleteBar").value = percentStatus;
				document.getElementById("updateInfo").innerHTML = "Performing PTSA2.x interface check: "+percentStatus+" % Complete";  	  
				}	  
				countRows = countRows + 1;
				fetchArtDetails(moduleUrlArray,countRows,tempMyObj);	
			}	
		});
	}
	catch(err){
		console.log("Error"+err);
		countRows = countRows + 1;
		fetchArtDetails(moduleUrlArray,countRows,tempMyObj);
	}			
}
	
function fetchArtifactDetailsOfModule(i,rows){
	var content = rows[i].values[RM.Data.Attributes.PRIMARY_TEXT],
	id = rows[i].values[RM.Data.Attributes.IDENTIFIER],
	type = rows[i].values[RM.Data.Attributes.ARTIFACT_TYPE],
	mandatoryValue = rows[i].values["Status"];
	if(statusValueArray.includes(mandatoryValue)){
		if(type.name == "SC_FUNC_REQ" || type.name == "BC-FC_FUNC_REQ"){
			fetchUnderlinedText(content,funcOut,funcOutId,id);
		}else if(type.name == "SC_INTERFACE_REQ" || type.name == "BC-FC_INTERFACE_REQ"){
			fetchUnderlinedText(content,interOut,interOutId,id);
		}
	}
	if(i < rows.length-1){
		i = i + 1;
		fetchArtifactDetailsOfModule(i,rows);
	}
}
				
function interfaceReqCheckPtsa2ForOuterModule(){
	newReqArray = [],newReqArrayId = [],dubsfReqArray = [],dubsfId = [],newestReqArray =[],newestReqArrayId =[],newSfArray = [],dublicateArrayId33 = [];
	newReqArray = [...interReqArray, ...interOut],newReqArrayId = [...interId, ...interOutId],newSfArray = [...sfReqArray],newfuncOuterArray = [...funcOut];
	//Code for fetching duplicate elements in SOFTWARE_REQ / SOFTWARE_NONFUNC_REQ
	for(var i=0;i<newReqArray.length;i++){
		for(var j=0;j<newReqArray.length;j++){
			if(i!=j){
				if(newReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === newReqArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
					newestReqArray.push(newReqArray[j]);
					newestReqArrayId.push(newReqArrayId[j]);
				}
			}
		}	
	}
		
	//Code for first case 
	for(var i=0;i<sfReqArray.length;i++){
		var count = 0;
		for(var j=0;j<newReqArray.length;j++){
			if(sfReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === newReqArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				count = count + 1;
				if(count > 1){
					dubsfReqArray.push(sfReqArray[i]);
					dubsfId.push(sfId[i]);
					break;
				}
			}
		}
	}
	
	//Code for first case inorder to delete underlined text which found in both SOFTWARE_REQ / SOFTWARE_NONFUNC_REQ and SOFTWARE_INTERFACE_REQ 
	for(var i=sfReqArray.length-1;i>=0;i--){
		for(var j=interReqArray.length-1;j>=0;j--){
			if(sfReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === interReqArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				sfReqArray.splice(i,1);
				sfId.splice(i,1);
				break;
			}
		}
	}
	for(var i=sfReqArray.length-1;i>=0;i--){
		for(var j=interOut.length-1;j>=0;j--){
			if(sfReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === interOut[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				sfReqArray.splice(i,1);
				sfId.splice(i,1);
				break;
			}
		}
	}
	
	//Code for finding the underlined text which found multiple times in SOFTWARE_INTERFACE_REQ
	for(var i=0;i<dubsfReqArray.length;i++){
		dublicateArrayId33.push([])
		for(var j=0;j<newestReqArray.length;j++){
			if(dubsfReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === newestReqArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				if(!dublicateArrayId33[i].includes(newestReqArrayId[j])){
					dublicateArrayId33[i][j] = newestReqArrayId[j];
				}
			}
		}
	}
	//Code for last case or 3rd case and it will delete the underlined text in SOFTWARE_INTERFACE_REQ if it matches with SOFTWARE_REQ / SOFTWARE_NONFUNC_REQ
	for(var i=interReqArray.length-1;i>=0;i--){
		for(var j=newSfArray.length-1;j>=0;j--){
			if(interReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === newSfArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				interReqArray.splice(i,1);
				interId.splice(i,1);
				break;
			}
		}
	}
	
	for(var i=interReqArray.length-1;i>=0;i--){
		for(var j=newfuncOuterArray.length-1;j>=0;j--){
			if(interReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === newfuncOuterArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
				interReqArray.splice(i,1);
				interId.splice(i,1);
				break;
			}
		}
	}
	createNewHTMLPage(); 
}
