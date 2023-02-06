//**************Starting Point*******************//
var RM = window.parent.RM || RM ;
var localConfigUrl = "";
$(function () {
	gadgets.window.adjustHeight(100);
	document.getElementById("loadExplorerDiv").style.display = "none";
	document.getElementById("button-chk").style.display = "none";		
	document.getElementById("ptsa-chk").style.display = "none";		
	document.getElementById("ptsa1-chk").style.display = "none";	
	document.getElementById("heading").style.display = "none";	
	document.getElementById("dngError").innerHTML= "<B> The widget works only in RM server, and only when module is open </B>";
	// if(opened != null)
	// 		opened.close();
	$loadingImage = $("<img class='loadingImg' src='css/ajax-loader.gif'/>");
	parentWindow = gadgets.window;
	//gadgets.window.adjustHeight(0);
	var runSearch = function () {
		var value = this.value;
		$(".searchNoMatch").removeClass("searchNoMatch");
		if (value !== "") {
			$(".row").not(":contains('" + value + "')").addClass("searchNoMatch");
		}
	};

	$("#search").on("focus", function () {
		if (firstSearch) {
			this.value = "";
			firstSearch = false;
		}
	});
	$("#search").keyup(runSearch);
	$("#search").change(runSearch);

	// look up the element with the id "wrap"
	$("#wrap").on("click", function () {
		$("#explorer").toggleClass("nowrap");
		if ($(".searchNoMatch").length === 0) {
			gadgets.window.adjustHeight();
		}
	});

	// look up the element with the id "onlyShowHeadings"
	$("#onlyShowHeadings").on("click", function () {
		$("#explorer").toggleClass("headingsOnly");
		if ($(".searchNoMatch").length === 0) {
			gadgets.window.adjustHeight();
		}
	});

	$("#colourByStatus").on("click", function () {
		$("#explorer").toggleClass("colourByStatus");
	});

	$("#levelSelect").on("change", function () {

		$(".row")
			.removeClass("collapsed")
			.filter(".depth" + this.value)
			.addClass("collapsed");

		gadgets.window.adjustHeight();
	});

	getRootFolder();
});
//****************************************************************************//
// Subscribe to the ARTIFACT_OPENED event 
RM.Event.subscribe(RM.Event.ARTIFACT_OPENED, function (ref) {
	document.getElementById("button-chk").style.display = "block";		
	document.getElementById("ptsa-chk").style.display = "block";	
	document.getElementById("ptsa1-chk").style.display = "block";	
	document.getElementById("heading").style.display = "block";	
	document.getElementById("dngError").innerHTML= "";
	RM.Data.getAttributes(ref, [RM.Data.Attributes.FORMAT, RM.Data.Attributes.ARTIFACT_TYPE, RM.Data.Attributes.NAME], function (opResult) {
		if (opResult.code === RM.OperationResult.OPERATION_OK) {
			var attrs = opResult.data[0];
			if (attrs.values[RM.Data.Attributes.FORMAT] === RM.Data.Formats.MODULE) {

				moduleType = attrs.values[RM.Data.Attributes.ARTIFACT_TYPE];


				moduleRef = ref;
				if(document.getElementById('iframeId') == undefined){
					document.getElementById('loadExplorerDiv').style.display = "";
					document.getElementById('loadExplorer').checked = false;
				}

				if(moduleTypeAllow.length > 0){
					var isRightModuleType = false;
					moduleTypeAllow.forEach(function(element){
						if(moduleType.name == element){
							isRightModuleType = true;
						}
					});
					if(isRightModuleType == false){
						var alertMessage = "<B> The widget works only in Module type: ";
						for(var i = 0; i < moduleTypeAllow.length; i++){
							alertMessage = alertMessage.concat(moduleTypeAllow[i]);
							if(i == moduleTypeAllow.length - 1){
								alertMessage = alertMessage.concat("</B>");
								continue;
							}
							alertMessage = alertMessage.concat(", ");
						}
						document.getElementById("loadExplorerDiv").style.display = "none";
						document.getElementById("button-chk").style.display = "none";		
						document.getElementById("ptsa-chk").style.display = "none";		
						document.getElementById("ptsa1-chk").style.display = "none";	
						document.getElementById("heading").style.display = "none";	
						document.getElementById("dngError").innerHTML= alertMessage;
						document.getElementById("dngError").style.color = "red";
					}
				}
				
				// moduleType.name = "PS_EC_System_Software_RS"; // vlc1hc add 20220518				

				
				moduleTypeFlag();
				featureAuthentication(); 
				moduleName1 = attrs.values[RM.Data.Attributes.ARTIFACT_TYPE];
				moduleName = attrs.values[RM.Data.Attributes.NAME];
				var domElement = document.getElementById("Error");
				domElement.style.display = "none";
			} else {
				// it's not a module so empty the explorer.
				gadgets.window.adjustHeight(0);
			}
		}
	});
});
//****************************************************************************//
//
var moduleFlag = 0;
var ptsa2Flag = false;
function moduleTypeFlag(){
rowsFlag = "";
	document.getElementById("ptsa-chk").style.display = "none";
	document.getElementById("ptsa1-chk").style.display = "none";
	if(moduleType.name=="DESIGN_Module" || moduleType.name=="PS_EC_EXCHANGE_RS" || moduleType.name=="PS_EC_IS_RS" || moduleType.name=="PS_EC_SF_RS" || moduleType.name=="PS_EC_Software_RS" || moduleType.name=="PS_EC_Stakeholder_RS" || moduleType.name=="PS_EC_System_RS" || moduleType.name=="PS_EC_System_Software_RS" || moduleType.name=="PS_EC_System_Arch_RS"){

		moduleFlag = 1;
		rowsFlag = "<th>Interface Requirement Check</th>";
	}else if(moduleType.name == "SC_RS"){
		document.getElementById("ptsa-chk").style.display = "";
		gadgets.window.adjustHeight();
		if($('#ptsa-chk-click').is(':checked')){
			moduleFlag = 2;
			ptsa2Flag = true;
			rowsFlag = "<th>Interface Requirement Check</th>";
		}
	} else if (moduleType.name == "BC-FC_RS") {
		document.getElementById("ptsa-chk").style.display = "";
		document.getElementById("ptsa1-chk").style.display = "";
		gadgets.window.adjustHeight();
		if($('#ptsa-chk-click').is(':checked')){
			moduleFlag = 2;
			ptsa2Flag = true;
			rowsFlag = "<th>Interface Requirement Check</th>";
		}
		if($('#ptsa1-chk-click').is(':checked')){
			moduleFlag = 1;
			rowsFlag = "<th>Interface Requirement Check</th>";
		}	
	} else{
		moduleFlag = 0;
	}
}

//****************************************************************************//
//Check box to load the module explorer
$("#loadExplorer").click(function(){
	document.getElementById('explorerHeading').innerHTML = '<label><h2>Module Details</h2></label>'
	document.getElementById('loadExplorerDiv').style.display = "none";
	var iframe = document.createElement('iframe');
	var repo = moduleRef.uri.split('/')
	var server = 'https://'+repo[2]+"/"+repo[3];
	var serverURL = 'https://'+repo[2]+"/";
	iframe.id="iframeId"
	iframe.src=`${server}/gadgetRender?container=default&parent=${serverURL}&url=https://www.intranet.bosch.com/doku/bbm_alm_opensocialgadgets/DNG/ps-ec/moduleexplorer/Latest_Release/moduleexplorer.xml&lang=default&country=default&view=default&nocache=true&st=HHM1HC%3Anull`
	iframe.frameBorder="0"
	iframe.width='100%'
	document.getElementById('explorer').appendChild(iframe)
	gadgets.window.adjustHeight();
});
//****************************************************************************//
//To increase the height of the module explorer
window.addEventListener("message", function (e) {
	var adjustHeight = e.data.adjustHeight;
	if (adjustHeight) {
	  document.getElementById("iframeId").height = adjustHeight;
	  gadgets.window.adjustHeight();
	}
  });

//****************************************************************************////On close of a module
RM.Event.subscribe(RM.Event.ARTIFACT_CLOSED, function (ref) {
	moduleRef=null;
	$("#explorer").empty();
	$("#explorerHeading").empty();
	document.getElementById('loadExplorerDiv').style.display = "none";
	document.getElementById("button-chk").style.display = "none";		
	document.getElementById("ptsa-chk").style.display = "none";	
	document.getElementById("ptsa1-chk").style.display = "none";		
	document.getElementById("heading").style.display = "none";	
	document.getElementById("dngError").innerHTML= "<B> The widget works only in RM server, and only when module is open </B>";
	gadgets.window.adjustHeight(100);
});

//*********************************//
//To get the module details 
function getEnvDetails(ref) {
	metadataInfo.push(moduleName);
	RM.Data.getCurrentUser(function (result) {
		if (result.data) {
			metadataInfo.push(result.data.userId);
			RM.Client.getCurrentConfigurationContext(function (result) {
				if (result.code === RM.OperationResult.OPERATION_OK) {
					var context = result.data;
					changeSetUrl =context.changeSetUri;
					localConfigUrl = context.localConfigurationUri;
					var url = new URL(localConfigUrl);
					if (localConfigUrl !== null && localConfigUrl !== undefined) {
						if (url.origin != null && url.origin != undefined) {
							metadataInfo.push(url.origin);
						} 
					}
					var gcStreamName;
					if (context.globalConfigurationUri !== undefined) {
						$.ajax({
							url: context.globalConfigurationUri,
							type: 'GET',
							accepts: { text: 'application/json;charset=utf-8' },
							dataType: "json",
							success: function (data) {
								var globalconfig = data[context.globalConfigurationUri];
								var titleInfo = globalconfig["http://purl.org/dc/terms/title"];
								if ((titleInfo !== null || titleInfo !== undefined) && (titleInfo[0] !== null || titleInfo[0] !== undefined)) {
									gcStreamName = titleInfo[0].value;
									metadataInfo.push(gcStreamName);
								}
							},
							error: function (request, status, error) {
								metadataInfo.push(errorGCFetch);
							}
						});
					} else {
						metadataInfo.push(noGCConfig);
					}
				}
			});


		} else {
			metadataInfo.push(error);
		}
	});


}
//****************************************************************************//
//Perform consistency check after click on button
$("#button-chk").click(function () {
		var req = new XMLHttpRequest();
		req.open('GET',fileUrl, false);
		req.overrideMimeType('text\/plain; charset=x-user-defined');
		req.send(null);
		if (req.readyState == 4 && req.status == 200){
			if(moduleType.name == "PS_EC_Stakeholder_RS" || moduleType.name == "Stakeholder_RS"){
				userCRQValue = prompt("Please enter the CRQ");
				userCRQValueArray = userCRQValue.split(',');
				if(userCRQValue != null){
					ProcessExcel(req.responseText);
					console.log(userCRQValue);
				}
			}else{
				ProcessExcel(req.responseText);
			}
		}else{
			alert(fileError);
		}
});
//****************************************************************************//
//Perform check for PTSA2.x after check on 
$("#ptsa-chk-click").click(function(){
        if($(this).is(":checked")){
			document.getElementById("ptsa1-chk-click").disabled = true;
            moduleFlag = 2;
			ptsa2Flag = true;
			rowsFlag = "<th>Interface Requirement Check</th>";
        }
        else if($(this).is(":not(:checked)")){
			document.getElementById("ptsa1-chk-click").disabled = false;
            moduleFlag = 0;
			ptsa2Flag = false;
			rowsFlag = "";
        }
});

//Perform check for PTSA1.x after check on 
$("#ptsa1-chk-click").click(function(){
	if($(this).is(":checked")){
		document.getElementById("ptsa-chk-click").disabled = true;
		moduleFlag = 1;
		rowsFlag = "<th>Interface Requirement Check</th>";
	}
	else if($(this).is(":not(:checked)")){
		document.getElementById("ptsa-chk-click").disabled = false;
		moduleFlag = 0;
		rowsFlag = "";
	}
});
//****************************************************************************//
//Function to read excel data from uploaded binary data
function ProcessExcel(data) {
	// init attribute related checking section - 20220607
	relatedAtt = [];
	relatedRulesMap = new Map();
	valNumRow = 0;

	// init attribute related to attribute link checking - 20220702
	missingAttributesTempt = [];
 	missingRelatedAttTempt = [];

	//Read the Excel File data.
	var workbook = XLSX.read(data, {
		type: 'binary'
	});
	var attributeMap = new Map();var headers=[];
	var moduleDetailsMap = new Map();
	//Fetch the name of First Sheet.
	var firstSheet = workbook.SheetNames[0];
	var secondSheet= workbook.SheetNames[1];
	var thirdSheet = workbook.SheetNames[2];
	var fourthSheet= workbook.SheetNames[3];
	var fifthSheet = workbook.SheetNames[4];
	//Read all rows from First Sheet into an JSON array.
	var firstSheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]); 
	var secondSheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[secondSheet]);
	var thirdSheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[thirdSheet]);
	var fourthSheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[fourthSheet]);
	var fifthSheetData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[fifthSheet]);
	storeDataFromSheetToMap(secondSheetData,attributeMap,secondSheet);
	storeDataFromSheetToMap(thirdSheetData,moduleDetailsMap,thirdSheet);
	storeMandatoryAttributesToArrays(fourthSheetData,fourthSheet);
	var attributeList =[];
	var levelValues = Array.from(moduleDetailsMap.values());
	levelValues.forEach(function(element){
		rulesMap.set(element,[]); 	
	});	
	
	var doorsLevels = Array.from(moduleDetailsMap.keys());
	firstSheetData.forEach(function(element){	
	  checkRulesBeforeStoring(element,attributeMap,moduleDetailsMap,doorsLevels);
	});
	 var levelDNG = Array.from(rulesMap.keys());
	 var attributeListDNG = [];
	 levelDNG.forEach(function(element){
		 attributeListDNG = rulesMap.get(element);
	 }); 
	// vlc1hc 20220531
	valNumRow = fifthSheetData.length;
	if(relatedAtt.length > 0){
		var numRow = 1;
		fifthSheetData.forEach(function(rowData){
			storeDataFromRelatedAttributesRuleToMap(rowData, relatedAtt, numRow);
			numRow++;
		});
	}
	// console.log("[331 - valNumRow]: "+ valNumRow);
	// end
	getRootFolderSynchronous();
	getMetaDataSubFolder();
	getSubFolder();
	getTXLink();
	checkLinkTypeAtt();
  initiateConsistencyOperations();					
}
//************************************************************* */
// vlc1hc - 20220531
function storeDataFromRelatedAttributesRuleToMap(fifthSheetRow, relatedAtt, numRow){
	relatedAtt.forEach(function(element){
		if(fifthSheetRow[element] != undefined){
			relatedRulesMap.set(element + "" + numRow, fifthSheetRow[element]);
		}
	});
}


//****************************************************************************//
//to reorganize data in map
function reorganizeRulesmap(mapData){
var alternateMap = new Map();
var keysMap = Array.from(mapData.keys());
keysMap.forEach(function(element){
	    var keyValues = mapData.get(element);		
		if(element.lastIndexOf("+") != -1){
		  var splitBasedOnSeperator = element.split("+");
		  for(var i=0;i< splitBasedOnSeperator.length;i++){
			alternateMap.set( splitBasedOnSeperator[i],keyValues);   
		  }	  
		}else{
           alternateMap.set( element,keyValues); 
        } 			
	}); 
      mapData = {};
	  //hardcoding needed as PS_EC_IS_RS & PS_EC_SF_RS also have SOFTWARE_REQ & SOFTWARE_NONFUNC_REQ present in spec sheet but the same is absent in DOORS rule sheet. 
	  var softwareFuncL3 = alternateMap.get("PS_EC_System_Software_RS:SOFTWARE_REQ");
	  var softwareNonFuncL3 = alternateMap.get("PS_EC_System_Software_RS:SOFTWARE_NONFUNC_REQ");
	  if(softwareFuncL3 != null){
		alternateMap.set(PS_EC_IS_RSSOFTWARE_REQ,softwareFuncL3);
		alternateMap.set(PS_EC_SF_RSSOFTWARE_REQ,softwareFuncL3);
	  }	
	  //Harcoding for PS_EC_IS_RS_SOFTWARE_NONFUNC_REQ as it is an optional in the spec.
      if(softwareNonFuncL3 != null){
        alternateMap.set(PS_EC_IS_RSSOFTWARE_NONFUNC_REQ,softwareNonFuncL3);
		alternateMap.set(PS_EC_SF_RSSOFTWARE_NONFUNC_REQ,softwareNonFuncL3);
		alternateMap.set(PS_EC_System_RSSOFTWARE_NONFUNC_REQ,softwareNonFuncL3);
	  }		  
      mapData =	alternateMap;
	  return mapData;
}	
//****************************************************************************//
//To store excel data into map structure in js	
function storeDataFromSheetToMap(sheetData,mapToPut,sheetName){
	if(!dngModuleArray.includes(PS_EC_System_Software_RS)){
		 dngModuleArray.push(PS_EC_System_Software_RS);
	 }	
	sheetData.forEach(function(element){
		if(sheetName === "AttributeMapping"){
			mapToPut.set(element.AttributeNameDOORS,element.AttributeNameDNG);
			dngAttributesArray.push(element.AttributeNameDNG);
		}else if(sheetName === "LevelsMapping"){
			mapToPut.set(element.Levels,element.DNGModules);
			var dngModule = element.DNGModules;
			if(dngModule.lastIndexOf("+") != -1){
				var splitbyPlus = dngModule.split("+");var splitbyColon="";
				for(var i=0;i< splitbyPlus.length;i++){
				    splitbyColon =  splitbyPlus[i].split(":");
					if(splitbyColon.length > 0){
					 if(!dngModuleArray.includes(splitbyColon[0]))
							dngModuleArray.push(splitbyColon[0]);		  
					}		
				}
                					
			}else if(dngModule.lastIndexOf(":") != -1){
			  var moduleName = 	dngModule.split(":");
			  if(!dngModuleArray.includes(moduleName[0]))
					dngModuleArray.push(moduleName[0]);	
			}	
        }else{
			//Error condition
		}  					
	});		
}
//****************************************************************************//
//Validation and structure formation to store data in map
function checkRulesBeforeStoring(firstSheetRow,attributeMap,moduleDetailsMap,headers){
var dngAttribute = attributeMap.get(firstSheetRow["Attribute_Name"]);
var attributeListmArch = [];
if(dngAttribute != undefined){
	headers.forEach(function(element){
		var dngValueLevel =	moduleDetailsMap.get(element);
		if(dngValueLevel != undefined){
			//check if attributes corrosponding to this key already exists
			//if yes then pop out and add this attribute to list and
			var ruleValue = firstSheetRow[element];
			if(ruleValue != undefined && (ruleValue == mandatorySymbol || ruleValue == interfaceSymbol)){
				var attributeList=[];var mAttributes=[];
			  attributeList = rulesMap.get(dngValueLevel);
			  mAttributes = attributeList;
			  if(!mAttributes.includes(dngAttribute)){
				mAttributes.push(dngAttribute);
				  rulesMap.set(dngValueLevel,mAttributes);
			  }  	
			}else if(ruleValue != undefined && ruleValue == mArchSymbol){
			  var mArchAttributes=[],mArchFetchAttributes=[];
			  mArchFetchAttributes = rulesMapMarch.get(dngValueLevel);
			  if(mArchFetchAttributes != undefined){
				  mArchAttributes = mArchFetchAttributes;
				  mArchAttributes.push(dngAttribute);
				  relatedAtt.push(dngAttribute); // vlc1hc 20220531
				  rulesMapMarch.set(dngValueLevel,mArchAttributes);
			  }else{
                  if(!mArchAttributes.includes(dngAttribute)){
					  mArchAttributes.push(dngAttribute);
					  relatedAtt.push(dngAttribute); // vlc1hc 20220531
					  rulesMapMarch.set(dngValueLevel,mArchAttributes);
			      }	
			  }   				  
			  		  
            }else if(ruleValue != undefined && ruleValue == mArchL1Symbol){  // check rule mArch_L1
				// using for mArch rule
				var mArchL1Attributes=[],mArchL1FetchAttributes=[];
				mArchL1FetchAttributes = rulesMapMarchL1.get(dngValueLevel);
				if(mArchL1FetchAttributes != undefined){
					mArchL1Attributes = mArchL1FetchAttributes;
					mArchL1Attributes.push(dngAttribute);
					relatedAtt.push(dngAttribute);        // vlc1hc 20220602
					
					rulesMapMarchL1.set(dngValueLevel,mArchL1Attributes);
				}else{
					if(!mArchL1Attributes.includes(dngAttribute)){
						mArchL1Attributes.push(dngAttribute);
						relatedAtt.push(dngAttribute);			// vlc1hc 20220602
						rulesMapMarchL1.set(dngValueLevel,mArchL1Attributes);
					}	
				}
				
				// using for m rule
				var attributeList=[];var mAttributes=[];
			  	attributeList = rulesMap.get(dngValueLevel);
			 	 mAttributes = attributeList;
			  	if(!mAttributes.includes(dngAttribute)){
					mAttributes.push(dngAttribute);
				 	 rulesMap.set(dngValueLevel,mAttributes);
			  	}  

           }else if(ruleValue != undefined && ruleValue == mReviewSymbol){
				var mReviewAttributes=[],mReviewFetchAttributes=[];
			  mReviewFetchAttributes = rulesMapmReview.get(dngValueLevel);
			  if(mReviewFetchAttributes != undefined){
				  mReviewAttributes = mReviewFetchAttributes;
				  mReviewAttributes.push(dngAttribute);
				  rulesMapmReview.set(dngValueLevel,mReviewAttributes);
			  }else{
                  if(!mReviewAttributes.includes(dngAttribute)){
					  mReviewAttributes.push(dngAttribute);
					  rulesMapmReview.set(dngValueLevel,mReviewAttributes);
			      }	
			  }   		
            }else if(ruleValue != undefined && ruleValue == mVarFuncSymbol){
				var mVarFuncAttributes=[],mVarFuncFetchAttributes=[];
			  mVarFuncFetchAttributes = rulesMapmVarFunc.get(dngValueLevel);
			  if(mVarFuncFetchAttributes != undefined){
				  mVarFuncAttributes = mVarFuncFetchAttributes;
				  mVarFuncAttributes.push(dngAttribute);
				  rulesMapmVarFunc.set(dngValueLevel,mVarFuncAttributes);
			  }else{
                  if(!mVarFuncAttributes.includes(dngAttribute)){
					  mVarFuncAttributes.push(dngAttribute);
					  rulesMapmVarFunc.set(dngValueLevel,mVarFuncAttributes);
			      }	
			  }   		
            }else if(ruleValue != undefined && ruleValue == mTestSymbol){
				var mTestAttributes=[],mTestFetchAttributes=[];
				mTestFetchAttributes = rulesMapmTest.get(dngValueLevel);
				if(mTestFetchAttributes != undefined){
					mTestAttributes = mTestFetchAttributes;
					mTestAttributes.push(dngAttribute);
					rulesMapmTest.set(dngValueLevel,mTestAttributes);
				}else{
					if(!mTestAttributes.includes(dngAttribute)){
						mTestAttributes.push(dngAttribute);
						rulesMapmTest.set(dngValueLevel,mTestAttributes);
					}
				}
            }						
		}		
	 });	 
   }	
}
//****************************************************************************//
//Read mandatory data
function storeMandatoryAttributesToArrays(fourthSheetData,fourthSheet){
mandatoryAttributesArray=[];	
fourthSheetData.forEach(function(element){
 mandatoryAttributesArray.push([element["MandatoryAttributes"], element["Values"]]);
 });		
}
//****************************************************************************//
//Initialization & reseting of variables 	
function initiateConsistencyOperations(){
artifactData =[],alreadyPushed=[], linkError=[];
	gadgets.window.name = "parent";
	document.getElementById("button-chk").disabled = true;
	document.getElementById("hideable").style.display = "";
		if(oslcStatus == false)
		  document.getElementById("updateInfo").innerHTML = infoFetching ;
	ERRORMSG = "";
	var domNode = document.getElementById('Error');
	domNode.style.display = "none";
	getEnvDetails(moduleRef);
		setGlobalrowss(moduleRef);
}  
//****************************************************************************//
//To fetch module attributes
function setGlobalrowss(ref) {
	var attributesToFetch = [       //Mandatory attributes being pushed.
		RM.Data.Attributes.NAME,
		RM.Data.Attributes.IDENTIFIER,
		RM.Data.Attributes.IS_HEADING,
		RM.Data.Attributes.SECTION_NUMBER,
		RM.Data.Attributes.DEPTH,
		RM.Data.Attributes.PRIMARY_TEXT,
		RM.Data.Attributes.ARTIFACT_TYPE,
		RM.Data.Attributes.DESCRIPTION,
		RM.Data.Attributes.MODIFIED_BY,
	];
		
	if(dngAttributesArray.length > 0){     //Other attributes being pushed.
		dngAttributesArray.forEach(function(element){
			attributesToFetch.push(element); 	
		});			
	}	
	RM.Data.getContentsStructure(ref, attributesToFetch, function (opResult) {

		// this function is invoked when the call to fetch the structure
		// along with the attributes we asked for has completed.
		if (opResult.code === RM.OperationResult.OPERATION_OK) {
			var rows = opResult.data;
			rowssglobal = rows;
			missingAttributesPresent = false;
			noOfArtifacts = rows.length;
			originalNoOFArtifacts = noOfArtifacts;
			if(originalNoOFArtifacts <=0){
			 alert("No Artifacts present in the module.");
			 document.getElementById("hideable").style.display = "none";
			document.getElementById("button-chk").disabled = false;
			document.getElementById("percentCompleteBar").value = 0;
			 return; 
			}	
			//var windowUrl = window.parent.location;
			var windowUrl = 	window.top.location;
			var decodedUrl =  decodeURIComponent(windowUrl);
			var stringUrl = decodedUrl.toString();
			
			if(stringUrl.lastIndexOf("oslc.configuration") != -1){
				var searchParam = new URLSearchParams(stringUrl); 
				configUrl = searchParam.get('oslc.configuration');
				configKey = "oslc.configuration";
			}else if (stringUrl.lastIndexOf("oslc_config.context") != -1){
				var searchParam = new URLSearchParams(stringUrl); 
				configUrl = searchParam.get('oslc_config.context');
				configKey = "oslc.configuration";
			}else if (stringUrl.lastIndexOf("vvc.configuration") != -1){
				var searchParam = new URLSearchParams(stringUrl); 
				configUrl = searchParam.get('vvc.configuration');
				configKey = "vvc.configuration";
			}formModuleUrl(stringUrl);
			
			//reorganize rules map
			if(rulesMap.size >0)
				rulesMap =reorganizeRulesmap(rulesMap);
			if(rulesMapMarch.size >0)
				rulesMapMarch = reorganizeRulesmap(rulesMapMarch);
			if(rulesMapmReview.size > 0)
				rulesMapmReview = reorganizeRulesmap(rulesMapmReview);
			if(rulesMapmVarFunc.size > 0)
				rulesMapmVarFunc = reorganizeRulesmap(rulesMapmVarFunc);
			if(rulesMapmTest.size > 0)
				rulesMapmTest = reorganizeRulesmap(rulesMapmTest);
			if(rulesMapMarchL1.size >0)
				rulesMapMarchL1 = reorganizeRulesmap(rulesMapMarchL1);
			//in progress
			sfReqArray = [],interReqArray = [],sfId = [],interId = [],funcOut = [],interOut = [],funcOutId = [],interOutId = [],varientData = [], varientWarn = [], varientFlag = 0;
			consistencyCheck(rowssglobal,0); 
		} else {
			errorMessage(errorModuleDetails);
			
		}
	});
}

//****************************************************************************//
//Function to form module URL
 function formModuleUrl(stringUrl){
	var searchParam = new URLSearchParams(stringUrl); 
	var compUrl = searchParam.get('componentURI');
	var count = compUrl.indexOf("/rm-projects/");
	var serverUrl = compUrl.substring(0,count);
	var projectUrl = serverUrl + "/process/project-areas";
	var startIndex = compUrl.indexOf("/rm-projects/");
	var endIndex = compUrl.indexOf("/components/");
	projectUrl = projectUrl + compUrl.substring(startIndex + 12,endIndex);
	projectUrl = encodeURIComponent(projectUrl);
	moduleUrl = serverUrl+"/views?oslc.query=true&amp;projectURL="+projectUrl+"&oslc.where=rdf%3Atype%3D%3Chttp%3A%2F%2Fopen-services.net%2Fns%2Frm%23RequirementCollection%3E&oslc.prefix=rdf%3D%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E";
 }
	 
//****************************************************************************//
//Main logic written inside this function to check the consistency of each artifact from module
async function consistencyCheck(rows,counter) {
			globalRows = rows;var idValue,titleValue,artifactTypeValue,linkDetails={},counterValue,errorValue,mandatoryMissing,statusVal,mArchDetails={};
			var attributesWithValuesPresent=[];
			noOfArtifacts = noOfArtifacts -1; 
			//Fetch attribute values for each artifact using RM apis.
		    var id = rows[counter].values[RM.Data.Attributes.IDENTIFIER],
			title = rows[counter].values[RM.Data.Attributes.NAME],
			description = rows[counter].values[RM.Data.Attributes.DESCRIPTION],
			mandatoryValue = "",mandatoryAttribute= "",
			type = rows[counter].values[RM.Data.Attributes.ARTIFACT_TYPE],
			typename = type.name,
			isHeading = rows[counter].values[RM.Data.Attributes.IS_HEADING],
			varient = rows[counter].values.VAR_FUNC_SYS;
			var lastModifiedByUrlObj = rows[counter].values[RM.Data.Attributes.MODIFIED_BY]
			var lastModifiedByUrl = lastModifiedByUrlObj.uri
			lastModifiedByUrl = lastModifiedByUrl.replace('jts','rm')
			fetchLastModifiedBy(lastModifiedByUrl)
			if(title == null){
				title = ""
			}
			
		var acceptedValid = true;
		
		if(acceptedValid === true){
			if(moduleFlag == 1){
				var content = rows[counter].values[RM.Data.Attributes.PRIMARY_TEXT]
				storeUnderlinedTextPtsa1(content,typename,id); 
			}else if(moduleFlag == 2){
				var content = rows[counter].values[RM.Data.Attributes.PRIMARY_TEXT]
				storeUnderlinedTextPtsa2(content,typename,id);
			}
		}
		if(acceptedValid === true){
			if(varient !== undefined){
				varientFlag = 1;
				if(varient != null && varientFlag == 1){
					if(Boolean(varient.match(regExpr2))){
						varientWarn.push(id);
					}
					
					var varientArray1 = varient.split(regExpr1);
					for(var i = 0; i < varientArray1.length; i++){
						var varientArray2 = varientArray1[i].split(regExpr2);
						try {
							if(varientArray2[0] != ""){
								await checkInRPEDb(varientArray2[0].trim(),id);
							}
						}
						catch(err) {
						  console.log(err);
						}
					}
				}
			}
		}
		var mtype = moduleType;
		var attrToCheck = [],
		missingAttributes = [],mArchAttributes = [],mArchAttributesToCheck = []
		,premArchElements = [],mReviewAttributes=[],mTestAttributes=[],premReviewElements=[]
		,mVarFuncAttributes = [],mArchL1Attributes = []
		, relatedMissingAtt = [];
		artifactDetails.idValue = id;
		artifactDetails.titleValue = title;
		artifactDetails.artifactTypeValue = type;
		artifactDetails.counterValue = counter;
		artifactDetails.mandatoryMissing = "false";
		artifactDetails.statusVal="";

		// vlc1hc add 20220518
		// typename = "SOFTWARE_REQ"
		artifactDetails.typename = typename;
		artifactDetails.mTypeName = mtype.name;

       if(acceptedValid === true){ 		
			//Push artifact details here
			if(mandatoryValue == "ACCEPTED" && mandatoryValue != null){
			  	artifactDetails.statusVal = "ERROR";
			} else {
				artifactDetails.statusVal = "INFO";
			}
            var key="";
			key = mtype.name+":"+typename; // luatvc add 20220519
			// console.log("line 704 - Key: "+ key);

			mArchAttributes = rulesMapMarch.get(key);
			if(mArchAttributes != undefined){
					var mArchInfoAttributes = [];
					mArchAttributes.forEach(function(element){
				      var value = rows[counter].values[element]	;
					   if(value == null){
						   if(artifactDetails.statusVal === "INFO"){
							mArchInfoAttributes.push(element); 
						   }else{
						    premArchElements.push(element);
						   }							   
					   }   
					});
					if(artifactDetails.statusVal === "INFO"){
						artifactDetails.mArchDetails = mArchInfoAttributes;
					}
			}else{
				artifactDetails.mArchDetails = null;
            } 

			mArchL1Attributes = rulesMapMarchL1.get(key)
			if(mArchL1Attributes != undefined){
				var mArchL1InfoAttributes = [];
				mArchL1Attributes.forEach(function(element){
					var value = rows[counter].values[element];
					if(value == null){
						if(artifactDetails.statusVal === "INFO"){
							mArchL1InfoAttributes.push(element); 
						}else{
							premArchElements.push(element);
						}							   
					}   
				});
				if(artifactDetails.statusVal === "INFO"){
					artifactDetails.mArchL1Details = mArchL1InfoAttributes;
				}
			}else{
				artifactDetails.mArchL1Details = null;
            }
             
			mReviewAttributes = rulesMapmReview.get(key);
			 if(mReviewAttributes != undefined){
					var mReviewInfoAttributes = [];
					mReviewAttributes.forEach(function(element){
				      var value = rows[counter].values[element]	;
					   if(value == null && (mandatoryValue == "REVIEW_FINDING" || mandatoryValue == "REVIEW_END")){
						    mReviewInfoAttributes.push(element);
						}   
					});
					if(mReviewInfoAttributes.length >0){
						artifactDetails.mReviewAttributes = mReviewInfoAttributes;
					}						
			 }else{
				artifactDetails.mReviewAttributes = null;
            } 
			
			attrToCheck = rulesMap.get(key);

			if(attrToCheck != undefined){
				//Check for title.
				// if (title === null || title == "") {
				// 	missingAttributes.push("Name");
					// missingAttributes.push("Contents");
				// }
				attrToCheck = attrToCheck.concat(premArchElements);
			}else{
                //For artifacts with no rules defined inside a module.
				attrToCheck=[];
				artifactDetails.errorValue = "true";
            }	

			mVarFuncAttributes = rulesMapmVarFunc.get(key);

			mTestAttributes = rulesMapmTest.get(key)
			var mTestInfoAttributes = false
			if(mTestAttributes != undefined){
				mTestAttributes.forEach(function(element){
					var value = rows[counter].values[element];
					if(value == null){
						mTestInfoAttributes = true;
						artifactDetails.mTestAttributes = mTestInfoAttributes;
					} else {
						mTestInfoAttributes = false;
						artifactDetails.mTestAttributes = mTestInfoAttributes;
					}
				});
			}
						
			fetchArtifactDetails(attrToCheck,missingAttributes,rows,counter);
			processRelatedAttRule(rows,relatedMissingAtt,counter);
			stepForwardAndGenContent(rows, counter, attrToCheck);
	    }else{
			artifactDetails.mArchDetails = null;
			artifactDetails.mArchL1Details = null;
			artifactDetails.findings = [];
			artifactDetails.relatedMissingAtt = [];
			artifactDetails.mReviewAttributes = null;
			var linkDetailsStructure={};
			linkDetailsStructure.linkToDetails = [];
			linkDetailsStructure.satisfiesDetails = [];
			artifactDetails.linkDetailsStructure = linkDetailsStructure ;
			artifactDetails.mTestAttributes = null
		
			recallConsistecnyCheck(rows,counter);
		}
		
}

//****************************************************************************//
//For storing the underlined text
function checkInRPEDb(varient,id){
	return new Promise(function (resolve, reject) { 
		var idValue,varientValue;
		var finalReqUrl = reqUrl + varient;
		var req = new window.top.XMLHttpRequest();
		req.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				resolve("Done"); 
			}else if(this.readyState == 4 && this.status == 404){							
				var varientDetails = {};
				varientDetails.idValue = id;
				varientDetails.varientValue = varient;
				varientData.push(varientDetails);
				resolve("Done"); 
			}else if(this.status == 400){							
				reject("Error"); 
			}
		};
		req.open('GET',finalReqUrl, true);
		req.setRequestHeader('Accept','application/json');
		req.setRequestHeader('Content-Type','application/json');
		req.setRequestHeader('Authorization','Bearer '+idToken.id_token);
		req.send();
	}); 
}
//****************************************************************************//
//For storing the underlined text
function storeUnderlinedTextPtsa1(content,typename,id){ 
	if(typename == "SOFTWARE_REQ" || typename == "SUBSYSTEM_REQ" || typename == "BC-FC_FUNC_REQ"){	
		fetchUnderlinedText(content,sfReqArray,sfId,id);
	}
	if(typename == "SOFTWARE_INTERFACE_REQ" || typename == "SYSTEM_INTERFACE_REQ" || typename == "BC-FC_INTERFACE_REQ"){	
		fetchUnderlinedText(content,interReqArray,interId,id);
	}
}
function fetchUnderlinedText(content,array,arrayId,id){
	content = content.replace("<b>","");
	content = content.replace("</b>","");
	content = content.replace("<u> </u>","&nbsp;");
	content = content.replace("</u><span><u>","");
	content = content.replace("</u></span><u>","");
	content = content.replace("</u><u>","");
	content = content.replace(/<u \/?[^>]+(>|$)/g,"<u>");
	var startIndex = content.indexOf("<u>");
	var endIndex = content.indexOf("</u>");
	while(startIndex > -1 && startIndex < endIndex){
		startIndex = startIndex+3;
		var str = content.substring(startIndex,endIndex).trim();
		if(str.includes("<br>")){
			var splitArray = [];
			splitArray = str.split("<br>");
			for(var i = 0; i < splitArray.length; i++){
				pushIntoArray(array,arrayId,splitArray[i],id);
			}
			startIndex = content.indexOf("<u>",endIndex);
			endIndex = content.indexOf("</u>",startIndex+1);
			continue;
		}
		var index = endIndex+4;
		findDelimeter(index);
		function findDelimeter(index){
			if(content.charAt(index) == "<" && content.charAt(index+1) == "u"){
				index = index+2;
				while(content.charAt(index) != ">"){
					index = index +1;
				}
				if(content.charAt(index+1) == "<"){
					findDelimeter(index+1);
				}else{
					str = str + content.charAt(index+1);
					findDelimeter(index+2);
				}
			}else if(content.charAt(index) == "<" && content.charAt(index+1) == "/" && content.charAt(index+2) == "u"){
				findDelimeter(index+4);
			}
			else if(content.charAt(index) != "<"){
				var firstIndex = content.indexOf("</u>",index);
				var lastIndex = content.indexOf("<u>",index);
				if(firstIndex < lastIndex && firstIndex > -1){
					str = str + content.substring(index,firstIndex);
					pushIntoArray(array,arrayId,str,id);
					startIndex = content.indexOf("<u>",firstIndex+4);
					endIndex = content.indexOf("</u>",startIndex+1);
				}else if(lastIndex == -1 && firstIndex > -1){
					str = str + content.substring(index,firstIndex);
					pushIntoArray(array,arrayId,str,id);
					startIndex = content.indexOf("<u>",firstIndex+4);
					endIndex = content.indexOf("</u>",startIndex+1);
				}
				else{
					pushIntoArray(array,arrayId,str,id);
					startIndex = content.indexOf("<u>",index);
					endIndex = content.indexOf("</u>",startIndex+1);
				}
			}else{
				pushIntoArray(array,arrayId,str,id);
				startIndex = content.indexOf("<u>",index);
				endIndex = content.indexOf("</u>",startIndex+1);
			}
		}
	}	
}
//****************************************************************************//
//For pushing the underlined text into the array
function pushIntoArray(array,arrayId,str,id){
	str = str.replace(/&amp;/g, '&'); //for replacing &amp;
	str = str.replace(/\&nb\s*sp;/g, ' '); //for replacing &nbsp;
	str = str.replace(/<\/?[^>]+(>|$)/g, "");
	str = str.trim();
	if(str!="" && str!="." && str!=","){
		array.push(str);
		arrayId.push(id);
	} 
}
//****************************************************************************//
//For autenticating RPE database
function featureAuthentication(){
	var authUrl = "https://si0vmc0854.de.bosch.com/swap-prod/api/authenticate";
	var req = new window.top.XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			idToken = JSON.parse(this.responseText);
		}else if(this.readyState == 4 && this.status == 404){							
			
		}			
	};
	req.open('POST',authUrl, true);
	req.setRequestHeader('Accept','application/json');
	req.setRequestHeader('Content-Type','application/json');
	req.send(JSON.stringify({"username":"swap1tech","password":"pwt4e#123"}));
}

//****************************************************************************//
//For recurrsive call
function recallConsistecnyCheck(rows,counter){
     // counter = originalNoOFArtifacts-1; //remove it later	
	if(counter == (originalNoOFArtifacts-1)){
		document.getElementById("hideable").style.display = "none";
		counter =0;
		if(!alreadyPushed.includes(artifactDetails.idValue)){
				artifactData.push(artifactDetails);	
				alreadyPushed.push(artifactDetails.idValue);
				artifactDetails={};
				if(moduleFlag == 1){
					interfaceReqCheck(); 
					createNewHTMLPage(); 
				}else if(moduleFlag == 2){
					document.getElementById("percentCompleteBar").value = 20;
					document.getElementById("updateInfo").innerHTML = "Performing PTSA2.x interface check: fetching module and artefact details.";
					document.getElementById("hideable").style.display = "";
					fetchModuleDetails(); 
				}else{
					createNewHTMLPage(); 
				}
				
		}
    }
	else{    
		if(!alreadyPushed.includes(artifactDetails.idValue)){
			artifactData.push(artifactDetails);
			alreadyPushed.push(artifactDetails.idValue);
			artifactDetails={};
			counter= counter+1;
			consistencyCheck(rows,counter); 
		}else{
			counter++;  
			consistencyCheck(rows,counter);  
		}  					
	}		
}

//************************************************************************* */
// vlc1hc function to finding the related missing attributes
function processRelatedAttRule(rows, relatedMissingAtt,counter){
	if(valNumRow > 0 && relatedAtt.length > 0 && relatedRulesMap.size > 0){
		for(var i = 1; i <= valNumRow; i++){
			var num = 0;
			var temptArr = [];
			relatedAtt.forEach(function(element){
				if(relatedRulesMap.get(element+i) != undefined){
					num++;
				}	
				if(element.match(patternAtt) != null){
					// do nothing
				}			
				else if( (relatedRulesMap.get(element+i) != undefined)
					&& ( (relatedRulesMap.get(element+i) == rows[counter].values[convertAttNameToURIXML(element)] ) 
						|| (relatedRulesMap.get(element+i) == "null" 
							&& (
								rows[counter].values[convertAttNameToURIXML(element)] == "null"
								|| rows[counter].values[convertAttNameToURIXML(element)] === null
								|| rows[counter].values[convertAttNameToURIXML(element)] == ""
								|| rows[counter].values[convertAttNameToURIXML(element)] == undefined
								)
							)  
						) 
				){
					temptArr.push(element);
				}
			});
			if(num != temptArr.length){
				temptArr.length = 0;
			}
			if(temptArr.length > 0){
				relatedMissingAtt.push(temptArr); // relatedMissingAtt is multi-dementional array
			}
		}
		if(relatedMissingAtt.length > 0){
			artifactDetails.relatedMissingAtt = generateRelatedMissingAtt(relatedMissingAtt);
		}else{
			artifactDetails.relatedMissingAtt = [];
		}
	}else {
		artifactDetails.relatedMissingAtt = [];
	}
}

// gen 
function generateRelatedMissingAtt(relatedMissingAtt){
	var msg = "";
	for (var i = 0; i < relatedMissingAtt.length; i++){
		msg = msg + "[";
		for (var j= 0; j < relatedMissingAtt[i].length; j++){
			msg = msg + relatedMissingAtt[i][j];
			if(j == relatedMissingAtt[i].length -1) {
				break;
			}
			msg = msg + ", ";
		}
		msg = msg + "]";
		if(i == relatedMissingAtt.length -1){
			break;
		}
		msg = msg + ", ";
	}
	return msg;
}

function generateRelatedMissingLinkTypeAtt(relatedMissingAtt){
	var msg = "[";
	for (var i = 0; i < relatedMissingAtt.length; i++){
		msg = msg + relatedMissingAtt[i];
		if(i == relatedMissingAtt.length - 1){
			break;
		}
		msg = msg + ", ";
	}
	msg = msg + "]";
	return msg;
}


//****************************************************************************//
//Function to finding the missing attriubtes from RM API.
function fetchArtifactDetails(attrToCheck,missingAttributes,rows,counter){  
var crq = rows[counter].values['CRQ'] || rows[counter].values['_CRQ_'];
if (moduleType.name == "PS_EC_Stakeholder_RS" || moduleType.name == "Stakeholder_RS") {
	if (crq != null) {
		if (userCRQValueArray.includes(crq)) {
			artifactDetails.isCRQMatching = true
		}else{
			artifactDetails.isCRQMatching = false
		}
	}else{
		artifactDetails.isCRQMatching = false
	}	
}

//Identify all the attributes from response along with its values and check for its consistency.
var mandatoryMissing;
for(var i=0;i<attrToCheck.length;i++){
	 var valueIndex = attrToCheck[i];
	//  var rmValue = valueIndex == "Contents" ? rows[counter].values["http://purl.org/dc/terms/title"] : rows[counter].values[valueIndex];
	 var isMandatory = false;
	 for(var j=0;j< mandatoryAttributesArray.length;j++){
		if(attrToCheck[i].match(patternAtt) != null){
			// Do nothing
		}
		else if(attrToCheck[i] === mandatoryAttributesArray[j][0] ){
			isMandatory = true;
			if(rows[counter].values[convertAttNameToURIXML(attrToCheck[i])] == mandatoryAttributesArray[j][1]){
				missingAttributes.push(attrToCheck[i]);
			}
		}
	 }	
	if(isMandatory == false){
		if(attrToCheck[i].match(patternAtt) != null){
			// Do nothing
		}
		else if (rows[counter].values[convertAttNameToURIXML(attrToCheck[i])] == "null" 
			|| rows[counter].values[convertAttNameToURIXML(attrToCheck[i])] === null
			|| rows[counter].values[convertAttNameToURIXML(attrToCheck[i])] == undefined) {
			missingAttributes.push(attrToCheck[i]);				
		}
	}						
  }
pushMissingAttributes(missingAttributes,rows,counter);  //Push the missing attributes in the missing list. 
}
//****************************************************************************//
//Function to push the missing attributes into misiing array and check for exit condition.
function pushMissingAttributes(missingAttributes,rows,counter){	
	var findings;
	if (missingAttributes.length > 0) { 	
		artifactDetails.findings = generateErrorMessage(missingAttributes);		
	}else{
		artifactDetails.findings = [];
	}	
	percentStatus = Math.round((counter/originalNoOFArtifacts)*100); //calculate percentage to upate progress.
	//update progress bar.
		if(percentStatus > 100){
			percentStatus = 100;
			document.getElementById("updateInfo").innerHTML = "Fetching link details " ;
		}else{
			document.getElementById("percentCompleteBar").value = percentStatus;
		document.getElementById("updateInfo").innerHTML = infoStatus + percentStatus+"%"+ " Complete";
		}
	// linkValidation(rows,counter); 
}	
// *********************************************
// vlc1hc 20220627
function isLinkValid(rows, counter, attName){
	var artifact = rows[counter].ref;
	var attToSearch = RM.Data.LinkTypes.LINK_TO;
	let result = false;
	switch(attName){
		case "Satisfies": attToSearch = "Satisfies"; break;
		case "Validated By": attToSearch = RM.Data.LinkTypes.VALIDATED_BY; break;
		case "Satisfied By Architecture Element": attToSearch =RM.Data.LinkTypes.VALIDATED_BY; break;
		default: attToSearch = RM.Data.LinkTypes.LINK_TO; break;
	}
	RM.Data.getLinkedArtifacts(artifact, attToSearch, function(linksResult){
		if (linksResult.code == RM.OperationResult.OPERATION_OK){
			var inlink = linksResult.data.artifactLinks;
			var outlink = linksResult.data.externalLinks;
			if(inlink.length > 0 || outlink.length > 0){
				result = true;
			}
		}
	});
	return result;
}

// ***************************************************************************//
function stepForwardAndGenContent(rows, counter, attrToCheck){
	var artifact = rows[counter].ref;
	// The block to decide which flow will be used <----------------------------
	// using for mandatory checking
	var original = 0; // number of a set mandatory attribute which is link type att
	var numSub = 0; // number link type att which is mandatory, is travelling
	for(var i = 0; i < attrToCheck.length; i++){
		if(attrToCheck[i].match(patternAtt) != null){
			original++;
		}
	}

	var numLinkRelatedAtt = 0;
	for(var i = 1; i <= valNumRow; i++){
		relatedAtt.forEach(function(element){
			if(relatedRulesMap.get(element+i) != undefined){
				if(element.match(patternAtt) != null){
					numLinkRelatedAtt++;
				}
			}
		});
	}

	// case 1: related Att & Mandatory att have link type att
	if(original == 0 && numLinkRelatedAtt == 0){ 
		recallConsistecnyCheck(rows, counter);
	}
	// case 2: Mandatory has & related dont have
	else if(original > 0 && numLinkRelatedAtt == 0){
		// the block for Mandatory Attribute Checking
		attrToCheck.forEach(function(element){
			if(element.match(patternAtt) != null){
				var attToSearch = convertAttrToSearch(element);
				RM.Data.getLinkedArtifacts(artifact, attToSearch, function(linksResult){
					numSub++;
					if (linksResult.code == RM.OperationResult.OPERATION_OK){
						var inlink = linksResult.data.artifactLinks;
						var outlink = linksResult.data.externalLinks;
						if(inlink.length == 0 && outlink.length == 0){
							missingAttributesTempt.push(element);					
						}
						processLinkAtt(rows, counter, original, numSub);
					}
				});
			}
		});
	}
	// case 3:  Related have
	// 	Note: At the present, this widget have not been able to check case Related Att & Mandatory att have link type yet.
	else {
		// the block for Mandatory Attribute Checking - vlc1hc comment because, at the present not support
		// attrToCheck.forEach(function(element){
		// 	if(element.match(patternAtt) != null){
		// 		var attToSearch = convertAttrToSearch(element);
		// 		RM.Data.getLinkedArtifacts(artifact, attToSearch, function(linksResult){
		// 			numSub++;
		// 			if (linksResult.code == RM.OperationResult.OPERATION_OK){
		// 				var inlink = linksResult.data.artifactLinks;
		// 				var outlink = linksResult.data.externalLinks;
		// 				if(inlink.length == 0 && outlink.length == 0){
		// 					missingAttributesTempt.push(element);					
		// 				}
		// 				processLinkAttWithoutRecall(original, numSub);
		// 			}
		// 		});
		// 	}
		// });

		// the block for Related Attribute Checking
		if(valNumRow > 0 && relatedAtt.length > 0 && relatedRulesMap.size > 0){
			var index = [];
			for(var i = 1; i <= valNumRow; i++){
				index.push(i);

				var numLinkType =0;
				relatedAtt.forEach(function(element){
					if(relatedRulesMap.get(element+i) != undefined
						&& element.match(patternAtt) != null){
						numLinkType++;
					}
				});
				if(numLinkType == 0){
					continue;
				}
				numRowHasLinkType++;
			}

			index.forEach(function(i){
				// thuc hien add attribute which are link attr
				relatedAtt.forEach(function(element){
					if(element.match(patternAtt) != null 
						&& relatedRulesMap.get(element+i) != undefined){
						var attToSearch = convertAttrToSearch(element);
						 
						RM.Data.getLinkedArtifacts(artifact, attToSearch, function(linksResult){
							var original = 0; // number of a set related attribute in a specific row rule
							numRowTravel++;

							relatedAtt.forEach(function(x){
								if(relatedRulesMap.get(x+i) != undefined){
									original++;
								}

								if(x.match(patternAtt) == null){
									if((relatedRulesMap.get(x+i) != undefined)
										&& ( (relatedRulesMap.get(x+i) == rows[counter].values[convertAttNameToURIXML(x)] ) 
											|| (relatedRulesMap.get(x+i) == "null" 
												&& (
													rows[counter].values[convertAttNameToURIXML(x)] == "null"
													|| rows[counter].values[convertAttNameToURIXML(x)] === null
													|| rows[counter].values[convertAttNameToURIXML(x)] == ""
													|| rows[counter].values[convertAttNameToURIXML(x)] == undefined
													)
												)  
											)
									){
										missingRelatedAttTempt.push(x);
									}
								}
							});


							if (linksResult.code == RM.OperationResult.OPERATION_OK){
								var inlink = linksResult.data.artifactLinks;
								var outlink = linksResult.data.externalLinks;
								if(inlink.length == 0 && outlink.length == 0){
									missingRelatedAttTempt.push(element);
								}
								processLinkRelatedAtt(rows, counter, original);
							}
						});
					}
				});
				
			});
		}
	}
	// --------------------------->
}


function processLinkAtt(rows, counter, original, numSub){
	if(original == numSub && original > 0){
		if(missingAttributesTempt.length > 0  ){
			if(artifactDetails.findings.length > 0){
				artifactDetails.findings = artifactDetails.findings + ", "
			}
			artifactDetails.findings = artifactDetails.findings + generateErrorMessage(missingAttributesTempt);
			missingAttributesTempt = [];
			recallConsistecnyCheck(rows, counter);
		}else{
			// artifactDetails.findings = [];
			missingAttributesTempt = [];
			recallConsistecnyCheck(rows, counter);
		}
	}
}

function processLinkAttWithoutRecall(original, numSub){
	if(original == numSub && original > 0){
		if(missingAttributesTempt.length > 0  ){
			if(artifactDetails.findings.length > 0){
				artifactDetails.findings = artifactDetails.findings + ", ";
			}
			artifactDetails.findings = artifactDetails.findings + generateErrorMessage(missingAttributesTempt);
			missingAttributesTempt = [];
		}else{
			// artifactDetails.findings = [];
			missingAttributesTempt = [];
		}
	}
}

function processLinkRelatedAtt(rows, counter, original){
	if(missingRelatedAttTempt.length > 0 && missingRelatedAttTempt.length == original){
		if(artifactDetails.relatedMissingAtt.length > 0){
			artifactDetails.relatedMissingAtt = artifactDetails.relatedMissingAtt + ", ";
		}
		artifactDetails.relatedMissingAtt = artifactDetails.relatedMissingAtt 
												+ generateRelatedMissingLinkTypeAtt(missingRelatedAttTempt);
		missingRelatedAttTempt = [];
	}else{
		missingRelatedAttTempt = [];
	}
	if(numRowHasLinkType == numRowTravel){
		numRowTravel = 0;
		numRowHasLinkType= 0;
		recallConsistecnyCheck(rows, counter);
	}
}


function convertAttrToSearch(attri){
	var attToSearch = RM.Data.LinkTypes.LINK_TO;
	switch(attri){
		case "Satisfies": attToSearch = "Satisfies"; break;
		case "Validated By": attToSearch = RM.Data.LinkTypes.VALIDATED_BY; break;
		case "Satisfied By Architecture Element": attToSearch = "Satisfy Architecture Element"; break;
		default: attToSearch = RM.Data.LinkTypes.LINK_TO; break;
	}
	return attToSearch;
}


//****************************************************************************//
//Function to determine linking on base artifact.Takes artifact reference as input as sets the result to global arrays for respective link types.
function linkValidation(rows,counter){ 
var linkArtifactType={},linkDetailsStructure={},linkToDetails={},satisfiesDetails={};
var linkTo=[],satisfiesData=[];		
var id = rows[counter].values[RM.Data.Attributes.IDENTIFIER];
var artifactType = rows[counter].values[RM.Data.Attributes.ARTIFACT_TYPE];
document.getElementById("percentCompleteBar").style.display = "";
var percentStatus = Math.round((counter/originalNoOFArtifacts)*100); //calculate percentage to upate progress.
document.getElementById("percentCompleteBar").value = percentStatus;
document.getElementById("updateInfo").innerHTML = infoCompletionMessage + percentStatus+"%"+ " Complete";	
var artifact = rows[counter].ref;
var satisfies = 'Satisfies', implementedBy = 'Implemented By', validatedBy = 'Validated By', satisfiedBy = 'Satisfied By';
//var Implemented_By = {"uri": "http://open-services.net/ns/rm#implementedBy","direction": "_SUB"},Validated_By = {  "uri": "http://open-services.net/ns/rm#validatedBy",  "direction": "_SUB"} 

RM.Data.getLinkedArtifacts(artifact,[RM.Data.LinkTypes.LINK_TO,satisfies],function(linksResult) {	
if (linksResult.code !== RM.OperationResult.OPERATION_OK){
		console.error('Error fetching links : fetchLinks '+linksResult.code+" for artifact with id="+id);
		linkDetailsStructure.linkToDetails = linkTo;
		linkDetailsStructure.satisfiesDetails = satisfiesData;
		artifactDetails.linkDetailsStructure = linkDetailsStructure ;
		linkError.push(artifactDetails.idValue);		
		recallConsistecnyCheck(rows,counter);
}else{
	var linkCounter =0;
	var inlink = linksResult.data.artifactLinks;
	var outlink = linksResult.data.externalLinks;
		if (inlink.length != 0 ) {
			var linkTargetCounts = 0;
			for(i in inlink){
				var link = inlink[i];
				if((link.linktype.uri == RM.Data.LinkTypes.LINK_TO.uri && link.linktype.direction == "_SUB") || link.linktype == satisfies){
					linkTargetCounts = linkTargetCounts+link.targets.length;			 
				}	
			} 
			fetchLinkDetails(inlink,0,inlink.length,rows,counter,linkTo,satisfiesData,linkTargetCounts); 
		}else{
			linkDetailsStructure.linkToDetails = linkTo;
			linkDetailsStructure.satisfiesDetails = satisfiesData;
			artifactDetails.linkDetailsStructure = linkDetailsStructure ;	
			recallConsistecnyCheck(rows,counter);		
		}
	}
 });

RM.Data.getLinkedArtifacts(artifact,[RM.Data.LinkTypes.LINK_TO,satisfiedBy],function(linksResult) {	
	if (linksResult.code == RM.OperationResult.OPERATION_OK){
		var inlink = linksResult.data.artifactLinks;
		var outlink = linksResult.data.externalLinks;
			if (inlink.length != 0) {
				for(i in inlink){
					var link = inlink[i];	
					if((link.linktype.uri == RM.Data.LinkTypes.LINK_TO.uri && link.linktype.direction == "_SUB") || link.linktype == satisfiedBy){
						artifactDetails.isSatisfiedBy = true;		 
					} else {
						artifactDetails.isSatisfiedBy = false;
					}
				}
			} else if (outlink.length != 0) {
				for (o in outlink) {
					var secondLink = outlink[o];
					if((secondLink.linktype.uri == RM.Data.LinkTypes.LINK_TO.uri && secondLink.linktype.direction == "_SUB") || secondLink.linktype == satisfiedBy){
						artifactDetails.isSatisfiedBy = true;		 
					} else {
						artifactDetails.isSatisfiedBy = false;
					}
				}
			} else {
				artifactDetails.isSatisfiedBy = false;
			}
	}});
}

function fetchLinkDetails(linkDetails,linkTypeCounter,linksLength,rows,counter,linkTo,satisfiesData,targetLength){ 
	var satisfies = 'Satisfies';
	var targetCounter =0;
	var satisfiesFlag=false;
	var link = linkDetails[linkTypeCounter];
	if((link.linktype.uri == RM.Data.LinkTypes.LINK_TO.uri && link.linktype.direction == "_SUB") || link.linktype == satisfies){
		if(link.linktype == satisfies){
			satisfiesFlag = true;
		}	
		fetchLinkedArtefactTypes(link,link.targets,linkTo,satisfiesData,rows,linkTypeCounter,link.targets.length,targetCounter,satisfiesFlag,linksLength,counter,linkDetails);	 
	}	
}	

function fetchLinkedArtefactTypes(link,targets,linkTo,satisfiesData,rows,linkTypeCounter,targetLength,targetCounter,satisfiesFlag,linksLength,counter,linkDetails){ 
var target = link.targets[targetCounter];	
RM.Data.getAttributes(target,[RM.Data.Attributes.ARTIFACT_TYPE,RM.Data.Attributes.IDENTIFIER],function(opResult){
	  if (opResult.code == RM.OperationResult.OPERATION_OK){
		  var artifactsData = opResult.data;
		  for(var i=0;i<artifactsData.length;i++){
			var artefactType = artifactsData[i].values[RM.Data.Attributes.ARTIFACT_TYPE];
			var identifier = artifactsData[i].values[RM.Data.Attributes.IDENTIFIER];
				if((artefactType.name == "Heading" || artefactType.name == "Stakeholder_Heading") && target.moduleUri == null){
				   if(satisfiesFlag != true){
					   linkTo.push("<p><font color='black'>"+identifier+"-<font color='red'>B<font color='black'>, <font color='red'>H</p>");
				   }else{
					   satisfiesData.push("<p><font color='black'>"+identifier+"-<font color='red'>B<font color='black'>, <font color='red'>H</p>");
				   }		
				}else if((artefactType.name == "Information" || artefactType.name == "Stakeholder_Information") && target.moduleUri == null){
				   if(satisfiesFlag != true){
					   linkTo.push("<p><font color='black'>"+identifier+"-<font color='red'>B<font color='black'>, <font color='red'>I</p>");
				   }else{
					   satisfiesData.push("<p><font color='black'>"+identifier+"-<font color='red'>B<font color='black'>, <font color='red'>I</p>");
				   }		
				}
				else if(artefactType.name == "Heading" || artefactType.name == "Stakeholder_Heading"){
				   if(satisfiesFlag != true){
					   linkTo.push("<p><font color='black'>"+identifier+"-<font color='red'>H</p>");
				   }else{
					   satisfiesData.push("<p><font color='black'>"+identifier+"-<font color='red'>H</p>");
				   }		
				}else if(artefactType.name == "Information" || artefactType.name == "Stakeholder_Information"){
				   if(satisfiesFlag != true){
					   linkTo.push("<p><font color='black'>"+identifier+"-<font color='red'>I</p>");
				   }else{
					   satisfiesData.push("<p><font color='black'>"+identifier+"-<font color='red'>I</p>");
				   }		
				}
				else if(target.moduleUri == null){
					if(satisfiesFlag != true){
						linkTo.push("<p><font color='black'>"+identifier+"-<font color='red'>B</p>");
					}else{
						satisfiesData.push("<p><font color='black'>"+identifier+"-<font color='red'>B</p>");
					}
				}	
				
		  }
		  targetCounter = targetCounter +1;
		  if(targetCounter == targetLength){
			 fetchNextLink(linkTypeCounter,linksLength,rows,counter,linkDetails,linkTo,satisfiesData,targetLength); 
		  }else{
			/* fetchLinkedArtefactTypes(link,targets,linkTo,satisfiesData,rows,linkTypeCounter,targetLength,targetCounter,satisfiesFlag); */
			fetchLinkedArtefactTypes(link,targets,linkTo,satisfiesData,rows,linkTypeCounter,targetLength,targetCounter,satisfiesFlag,linksLength,counter,linkDetails); 
		  }			  
		  
		         			
	  }
		
	});	
}	


//****************************************************************************//

function fetchNextLink(linkTypeCounter,linksLength,rows,counter,linkDetails,linkTo,satisfiesData,targetLength){ 
    var linkDetailsStructure={},linkToDetails={},satisfiesDetails={};
	linkTypeCounter = linkTypeCounter +1;
    if(linkTypeCounter == linksLength){
		linkDetailsStructure.linkToDetails = linkTo;
		linkDetailsStructure.satisfiesDetails = satisfiesData;
		artifactDetails.linkDetailsStructure = linkDetailsStructure ;	
		recallConsistecnyCheck(rows,counter); 
    }else{
	   fetchLinkDetails(linkDetails,linkTypeCounter,linksLength,rows,counter,linkTo,satisfiesData,targetLength); 
    } 		
	
}	

//****************************************************************************//

//
function fetchLastModifiedBy(url) {
	var responseText
	fetch(url,{
		headers: {'Accept' : 'application/rdf+xml'}
	})
	.then(response => response.text())
	.then(data => {
		responseText = data
		var parser = new DOMParser();
		var moduleDoc = parser.parseFromString(responseText,'text/xml')
		var name = moduleDoc.getElementsByTagName("foaf:name")[0].innerHTML
		artifactDetails.lastModifiedBy = name
	})
	.catch(err => console.log(err))
}

//Function for Interface Requirement Check.Consisting of code for all 3 cases's.
function interfaceReqCheck() {	
	newReqArray = [],newReqArrayId = [],dubsfReqArray = [],dubsfId = [],newestReqArray =[],newestReqArrayId =[],newSfArray = [],dublicateArrayId33 = [];
	newReqArray = [...interReqArray],newReqArrayId = [...interId],newSfArray = [...sfReqArray];
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
			for(var j=0;j<interReqArray.length;j++){
				if(sfReqArray[i].toLowerCase().replace(/\./g,'').replace(/,/g, '') === interReqArray[j].toLowerCase().replace(/\./g,'').replace(/,/g, '')){
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
		
}

//****************************************************************************//
//For generating reports
function createNewHTMLPage() { 
document.getElementById("hideable").style.display = "none";
var dataPresent = false;
var htmltoAppnd = htmltoAppendOnFindings;	
var linkErrorMessage ;

if(linkError.length > 0){
	linkErrorMessage = errorLinkCheck+linkError.length+" artifacts : ";
	linkErrorMessage = linkErrorMessage+linkError[0];
	for(var l=1;l< linkError.length;l++){
		linkErrorMessage = linkErrorMessage+','+linkError[l];
	}
}
var metaInfoTable = createMetadataTable();
if(artifactData.length > 0){
var findingsTable = "<div class='reportTable'><table>"; 
var rows1 = rowData;
findingsTable = findingsTable+rows1+exportBtn+rowsFlag;	
if(varientFlag == 1){
	findingsTable = findingsTable+"<th>VAR_FUNC_SYS Check</th>";	
}
findingsTable = findingsTable + lastModifiedData;
 for (var i=0;i< artifactData.length;i++){
	var findingDetails = artifactData[i].findings;	
	var relatedAttDetails = artifactData[i].relatedMissingAtt; // vlc1hc 20220602 
	// var linkDetails = artifactData[i].linkDetailsStructure;  
	// var linkToDetails = linkDetails.linkToDetails;  
	// var satisfiesDetails = linkDetails.satisfiesDetails;
	var linkToDetails = [];  // vlc1hc add 20220507
	var satisfiesDetails =[];

	var errorDetails = artifactData[i].errorValue;
	var mArchDetails = artifactData[i].mArchDetails;
	var mArchL1Details = artifactData[i].mArchL1Details;
	var lastModifiedBy = artifactData[i].lastModifiedBy;
	//var mReviewDetails = artifactData[i].mReviewAttributes;     need to change later
	var mTestAttributes = artifactData[i].mTestAttributes;
	var mReviewDetails = null;
	var mandatoryAttribute = artifactData[i].mandatoryAttribute;
	var flag1 = "",flag2 = "",flag3 = "";
	var flag = "-";
	var flagArray1 = [],flagArray2 = [];
	var flagMsgArray = [];
	var length = Math.max(sfId.length , interId.length);
	if(moduleFlag == 1 || moduleFlag == 2){
		for (var j=0;j<length;j++){
			if(artifactData[i].idValue == sfId[j]){ 
				if(!flagArray1.includes(sfReqArray[j])){
					flagArray1.push(sfReqArray[j]);
				}
				flag1 = ptsa2Flag == true ? "WARNING: interface "+'<u>'+flagArray1+'</u>'+" could not be found for the underlined interface description in the scope of the local stream"+'<br>' : "ERROR : interface "+'<u>'+flagArray1+'</u>'+" not listed as INTERFACE_REQ"+'<br>';
			}
			if(artifactData[i].idValue == interId[j]){
				if(!flagArray2.includes(interReqArray[j])){
					flagArray2.push(interReqArray[j]);
				}
				flag3 = "ERROR : interface "+'<u>'+flagArray2+'</u>'+" not referenced in any Non-interface requirement"+'<br>';
			}
		}
		for (var j=0;j<dubsfId.length;j++){
			if(artifactData[i].idValue == dubsfId[j]){
				var flagMsg = "WARNING : interface "+'<u>'+dubsfReqArray[j]+'</u>'+" listed multiple times in INTERFACE_REQ in the following artifacts:"+'<b>'+dublicateArrayId33[j].join(",").split(/\s|,/).filter(Boolean)+'</b>'+'<br>';
				
				if(!flagMsgArray.includes(flagMsg)){
					flagMsgArray.push(flagMsg);
				}
			}
		}flag2 = flag2 + flagMsgArray;
	}
	if(flag1!="" || flag2!="" || flag3!=""){
		flag = flag1 + flag2 + flag3;
	}
	var errMsg = "-",varientDataArray = [];
	for (var j=0;j<varientData.length;j++){
		if(artifactData[i].idValue == varientData[j].idValue){ 
			varientDataArray.push(varientData[j].varientValue);
			errMsg = "</br>ERROR: VAR_FUNC_SYS "+varientDataArray+" not Cleared";
			
		}
	}
	for (var j=0;j<varientWarn.length;j++){
		if(artifactData[i].idValue == varientWarn[j]){ 
			errMsg = warDetails + errMsg;
			break;
		}
	}	
	if (artifactData[i].isCRQMatching == false) {
		findingDetails = [];
		linkToDetails = [];
		satisfiesDetails = [];
		errorDetails = false;
		mReviewDetails = null;
		mArchL1Details = null;
		errMsg = "-";
		flag = "-";
	}

	if (artifactData[i].isSatisfiedBy == true) {
		mArchL1Details = null;
	}
	
	if((errMsg != "-" || flag!="-" || findingDetails.length  > 0 
		|| linkToDetails.length > 0 
		|| satisfiesDetails.length > 0  
		|| errorDetails == "true" || mReviewDetails != null 
		|| mArchL1Details != null || mTestAttributes == true)
		|| relatedAttDetails.length > 0){
		if(mTestAttributes == true){
			mTestAttributes = "INFO: TestLevel is a mandatory attribute for PTSA1.x"
		}else{
			mTestAttributes = "";
		}
		
		// vlc1hc - comment 20220605
		// if(mArchDetails != null){
		// 	if(mArchDetails.length >0){
		// 		mArchDetails = infoMarch+mArchDetails;
		// 	}else{
		// 		mArchDetails= "";
        //     } 				
		// }else{
		// 	mArchDetails= "";
		// }

		// vlc1hc - comment 20220605
		// if(mArchL1Details != null){
		// 	if(mArchL1Details.length >0){
		// 		mArchL1Details = infoMarch+mArchL1Details;
		// 	}else{
		// 		mArchL1Details= "";
		// 	} 				
		// }else{
		// 	mArchL1Details= "";
		// }

		// vlc1hc - comment 20220605
		// if(mReviewDetails != null){
		// 	if(mReviewDetails.length >0){
		// 		mReviewDetails = "<b> ERROR :</b> Field "+ mReviewDetails +" must be filled.";
		// 	}else{
		// 		mReviewDetails= "";
        //     } 				
		// }else{
		// 	mReviewDetails= "";
		// }
		
		if(findingDetails.length  > 0){
		   	findingDetails = errorMarch+findingDetails + "<br>"; 
		}else if(findingDetails.length ==0 && errorDetails == "true"){
        	findingDetails = findingMessage + "<br>";
        }
		if(relatedAttDetails.length > 0){
			findingDetails = findingDetails + relatedAttError + relatedAttDetails+ "<br>";
		}

		dataPresent = true;
		var id = artifactData[i].idValue;
		
		var idCol =	"<label id=" +id +" style="+'color:#069;text-decoration:underline;cursor:pointer;'+">"+id+"</label>";
		
		var title = artifactData[i].titleValue;
		if((title.lastIndexOf("<") != -1) && (title.lastIndexOf(">") != -1)){
			title = title.replace(/</g,'&lt');
			title = title.replace(/>/g,'&gt');
		}	
		var artifactTypeObject = artifactData[i].artifactTypeValue;
		var artifactType = artifactTypeObject.name;
		var detailsRow = "<tr><td>"+idCol+"</td><td>"+artifactType+"</td><td>"+title+"</td>";
    if(findingDetails.length > 0
		 && (
		linkToDetails.length > 0 || 
		satisfiesDetails.length > 0)
	){
		dataPresent = true;
		// vlc1hc comment 20220605
		// if(artifactData[i].mandatoryMissing == "true" && mandatoryAttribute != ""){
		// 	detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+findingDetails+"<br>"+mReviewDetails+"<br><b>Note:</b> "+ mandatoryAttribute + " attribute value should never be empty.<br>"+mTestAttributes+"</td>";
		// }else{
		// 	detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+findingDetails+"<br>"+mReviewDetails+"<br>"+mTestAttributes+"</td>";
		// }
		detailsRow = detailsRow + "<td>" + findingDetails + "<br>" + "</td>";
		detailsRow = returnLinkDetailsRow(detailsRow,linkToDetails,satisfiesDetails);
	}
	else if(findingDetails.length <= 0 
		&& (
		linkToDetails.length > 0 || 
		satisfiesDetails.length > 0)
		){
		dataPresent = true;
		findingDetails = "<p><b>No findings for attributes.</b></p>";
		// detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+findingDetails+"<br>"+mReviewDetails+"<br>"+mTestAttributes+"</td>"; //vlc1hc 20220605	
		detailsRow = detailsRow + "<td>" + findingDetails + "<br>" + "</td>";
		detailsRow = returnLinkDetailsRow(detailsRow,linkToDetails,satisfiesDetails);
	}
	else if(findingDetails.length > 0){
		 if(artifactData[i].mandatoryMissing == "true" && mandatoryAttribute != ""){
			// detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+mReviewDetails+"<br>"+findingDetails+"<br><b>Note:</b> "+ mandatoryAttribute+" attribute value should never be empty.<br>"+mTestAttributes+"</td></td><td>-</td><td>-</td>"; // vlc1hc 20220605
			detailsRow = detailsRow+ "<td>" + findingDetails + "<br>" + "</td><td>-</td><td>-</td>";
	}else{
			// detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+mReviewDetails+"<br>"+findingDetails+"<br>"+mTestAttributes+"</td><td>-</td><td>-</td>";
			detailsRow = detailsRow+ "<td>" + findingDetails + "<br>" + "</td><td>-</td><td>-</td>";
		}	 
	}
	else if(findingDetails.length <= 0 && errorDetails == "true"){
		dataPresent = true;
		detailsRow = detailsRow+errorNoRulesDef; 
		}
	else{
		// detailsRow = detailsRow+"<td>"+mArchDetails+"<br>"+mArchL1Details+"<br>"+mReviewDetails+"<br>"+findingDetails+"<br>"+mTestAttributes+"</td><td>-</td><td>-</td>";
		detailsRow = detailsRow+"<td>" + findingDetails + "<br>" + "</td><td>-</td><td>-</td>";

	}	

	findingsTable = findingsTable +detailsRow;
	if(moduleFlag == 1 || moduleFlag == 2){
		findingsTable = findingsTable+"<td>"+flag+"</td>";
	}if(varientFlag == 1){
		findingsTable = findingsTable+"<td>"+errMsg+"</td>";
	}
	findingsTable = findingsTable + "<td>"+lastModifiedBy+"</td>"
   }	
  }	
  
  if(dataPresent == false){
	  var infoMsg = " No findings " ;
	  if(linkErrorMessage != null || linkErrorMessage != undefined){
		infoMsg = infoMsg +' - '+linkErrorMessage;
	  }else{
		infoMsg = infoMsg +' - all artefacts are OK.';
	  }

	 var errordiv = "<div class='error'>Info :" + infoMsg + "</div>";
	 htmltoAppnd = htmltoAppnd+ metaInfoTable + errordiv+"</body></html>";
	  
   }else{
	if(linkErrorMessage != null || linkErrorMessage != undefined){
	var errordiv = "<div class='error'>Info :" + linkErrorMessage + "</div>";
	htmltoAppnd =  htmltoAppnd+errordiv;
	}
	findingsTable = findingsTable +"</table></div>";	
	 htmltoAppnd =  htmltoAppnd+metaInfoTable+findingsTable+"</body></html>";
	 dngModuleArray=[];dngAttributesArray=[];
   }	   
 } 
	if(opened != null)
	   opened.close();
	opened = window.open("", "first", "scrollbars=1,resizable=1");
	clearDomElements("error");
	clearDomElements("reportTable");
	clearDomElements("envTable");
	opened.document.write(htmltoAppnd);
	document.getElementById("button-chk").disabled = false;
    rulesMap.clear();
	rulesMapMarch.clear();
	rulesMapmReview.clear();
	rulesMapmVarFunc.clear();
	rulesMapmTest.clear();
	rulesMapMarchL1.clear();
	//binding event
	for(var j=0;j< artifactData.length;j++){
		idElement = opened.document.getElementById(artifactData[j].idValue);
		if(idElement != null){
			idElement.addEventListener("click",function(event){
				for(var j=0;j< artifactData.length;j++){
					if(artifactData[j].idValue == event.target.id){
						var counterval = artifactData[j].counterValue;
						RM.Client.setSelection(globalRows[counterval].ref);
						opened.resizeTo(screen.availWidth/2,screen.availHeight);
						//opened.resizeTo(screen.width/2,screen.height);
						opened.moveTo(0,0);
						break;	
					}	
				}							  
			});	
		}  				   
	}	
	var btn = opened.document.getElementById('button-export');
	btn.addEventListener("click",function(){
		var table = opened.document.getElementsByClassName('reportTable')
		var html = `<table>${table[0].childNodes[4].innerHTML}</table>`;
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
	});
  }

//****************************************************************************//
//For error messages.
function generateErrorMessage(attrs) {
	//var errorMsg = "Missing Attributes : ";
	var errorMsg = "";
	for (var i = 0; i < attrs.length; i++) {

		errorMsg = errorMsg + attrs[i];

		if (i === attrs.length - 2) {
			// errorMsg = errorMsg + " and ";
			errorMsg = errorMsg + ", ";
		} else if (i !== attrs.length - 1) {
			errorMsg = errorMsg + ", ";
		}

	}
	return errorMsg;
}
//****************************************************************************//
function errorMessage(msg) {
	ERRORMSG = ERRORMSG + "<br>" + msg;

	return ERRORMSG;
}
//****************************************************************************/ 
//For creating metadata info present in consistency check					
function createMetadataTable(){
	var userId = metadataInfo[1];
	var time = new Date();
	var moduleName = metadataInfo[0];
	var gcStreamName = metadataInfo[3];
	if(gcStreamName === null){
		gcStreamName = gcInfo;
	}
	var serverUrl = metadataInfo[2];
	SERVER_URL = serverUrl;
	var rows0 = rowValue;
	 var rows1 = "<tr><td>" + userId + "</td><td>" + time + "</td><td>" + moduleName + "</td><td>" + gcStreamName + "</td><td>" + serverUrl + "</td></tr>"; 
	var table1 = "<div class='envTable'><table>" + rows0+rows1+ "</table></div>";
    return table1;
}	
//****************************************************************************//
//Checking on links while report generation.
function returnLinkDetailsRow(detailsRow,linkToDetails,satisfiesDetails){
//Fetch linkValues here.
var linkToRow="",satisfiesRow="",linkRow;
if(linkToDetails.length > 0 && satisfiesDetails.length > 0){
	for(var i =0;i< linkToDetails.length ;i++){
	 linkToRow = linkToRow+linkToDetails[i];
	}
	for(var i =0;i< satisfiesDetails.length ;i++){
	 satisfiesRow = satisfiesRow+satisfiesDetails[i];
	}
	/* detailsRow = detailsRow+"<td>"+"<p><font color='red'>X</p>"+"</td><td>"+"<p><font color='red'>X</p>"+"</td></tr>"; */
	detailsRow = detailsRow+"<td>"+satisfiesRow+"</td>"+"<td>"+linkToRow+"</td>";
}else if(linkToDetails.length > 0){
	for(var i =0;i< linkToDetails.length ;i++){
	 linkToRow = linkToRow+linkToDetails[i];
	}
	detailsRow = detailsRow+"<td>-</td><td>"+linkToRow+"</td>";

}else if(satisfiesDetails.length > 0){
	for(var i =0;i< satisfiesDetails.length ;i++){
	 satisfiesRow = satisfiesRow+satisfiesDetails[i];
	}
	detailsRow = detailsRow+"<td>"+satisfiesRow+"</td><td>-</td>";	
   }
   return detailsRow;
}   
//****************************************************************************//
//For clearing report.
function clearDomElements(name){
if (opened.document.getElementsByClassName(name) !== null && opened.document.getElementsByClassName(name).length !== 0) {
		var rowss = opened.document.getElementsByClassName(name);
		for (rows of rowss) {
			rows.remove();
		}
	}	
	
}
//***************************************************************************//
//For setting error messages
function openNewWindowandSetErrorMsg() {
	$('#Error').empty();
	var domNode = document.getElementById('Error');
	domNode.style.display = "";
	if (ERRORMSG != "") {
		domNode.className = "serviceResult";
		domNode.innerHTML = errorMessage;
		gadgets.window.adjustHeight();		
	} else {
		domNode.className = "";
	}
}

function convertAttNameToURIXML(attributeName){
	returnValue = undefined;
	switch(attributeName){
		case "ID": returnValue = RM.Data.Attributes.IDENTIFIER; break;
		case "Contents": returnValue = RM.Data.Attributes.NAME; break;
		case "Description": returnValue = RM.Data.Attributes.DESCRIPTION; break;
		case "Artifact Type": returnValue= RM.Data.Attributes.ARTIFACT_TYPE; break;
		case "Pimary Text": returnValue = RM.Data.Attributes.NAME; break;
		default : returnValue = attributeName;
	}
	return returnValue;
}

// function to execute  
function getCurrentConfigurationUrl() {
    return new Promise((resolve, reject) => {
        let self = this;
        this.RM.Client.getCurrentConfigurationContext(function (result) {
        if (result.code === self.RM.OperationResult.OPERATION_OK) {
            let context = result.data;
            let currentConfiguration = context.localConfigurationUri;
            resolve(currentConfiguration);
        }
        });
    });
}

async function getRootFolder(){
    let currentConfigurationUrl = await this.getCurrentConfigurationUrl();
    let str = JSON.stringify(window.localStorage.RM__TmnRAbq0Eey8FsJEbEhfNA_RECENT_COMPONENTS);
    let pattern = /componentUri/i;
    let start = 0;
    let end = 0;
    start = str.match(pattern).index + 17;
    for(var i = start; i < str.length; i++){
        if(str.charAt(i) == '\\'){
            end = i;
            break;
        }
    }
    let url = str.substring(start, end) + "?root-folder";
    let header = {
        "Accept": "application/rdf+xml",
        "Configuration-Context": currentConfigurationUrl
    };
	$.ajax({
		type: "GET",
		url: url,
		headers: header,
		crossDomain: true,
		  success: function(data){
			  console.log("Line 2117: "+data);
		  }
	});
}


function getRootFolderSynchronous(){
    let currentConfigurationUrl = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/stream/_0VANljWQEeyIq_xC-8aqNw";
    let url = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/rm-projects/_0V8dsF0rEeqOLb2pbQsvTw/components/_0U2ckDWQEeyIq_xC-8aqNw?root-folder";
    let header = {
        "Accept": "text/html",
        "Configuration-Context": currentConfigurationUrl
    };
	$.ajax({
		type: "GET",
		url: url,
		headers: header,
		crossDomain: true,
		  success: function(data){
			
			  console.log("Line 2117: "+data);
		  },
		  error: function(xhr, ajaxOption, error){
			console.log("=========== getRootFolderSynchronous ===================");
			console.log(xhr.status);
			console.log(xhr.responseText);  // show rootpath
			console.log(error);
		  }
	});
}

function getMetaDataSubFolder(){
	let url = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/folders/FR_0VANozWQEeyIq_xC-8aqNw";
	let header = {
		"Accept": "none",
		"DoorsRP-Request-Type": "private",
		"OSLC-Core-Version": "2.0"
	};
	$.ajax({
		type: "GET",
		url: url, 
		headers: header,
		success: function(data){
			console.log("========= getMetaDataSubFolder ========================");
			console.log("Line 2136: ");
			console.log(data);
			showResult2(data, "//nav:subfolders/@rdf:resource"); // show metadata rootpath
		},
		error: function(xhr, ajaxOption, error){
			console.log(xhr.status);
			console.log(error);
		}
	});
}

function getSubFolder(){
	let url = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/folders?oslc.where=public_rm:parent=https://rb-ubk-clm-04.de.bosch.com:9443/rm/folders/FR_0VANozWQEeyIq_xC-8aqNw";
	let header = {
		"Configuration-Context": "https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/baseline/_hYZKcIQwEey0ochnb6Xdog",
		"Accept": "application/rdf+xml",
		"DoorsRP-Request-Type": "private"
	};
	$.ajax({
		type: "GET",
		url: url,
		headers: header,
		success: function(data){
			console.log(" ================ getSubFolder ================================");
			console.log("Line 2161: ");
			console.log(data);
			showResult3(data, "//ns:folder/@rdf:about");
		},
		error: function(xhr, ajaxOption, error){
			console.log(xhr.status);
			console.log(error);
		}
	});
}

function getTXLink(){
	let url = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/views?execute=true&fullObject=false&size=25&count=true&reuse=false&extrinsicReuse=false&page=1";
	let header = {
		"Accept": "application/xml",
		"Configuration-Context": "https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/stream/_0VANljWQEeyIq_xC-8aqNw",
		"dataType": "xml",
		"DoorsRP-Request-Type": "private",
		"X-Jazz-CSRF-Prevent": "0000Y6qqdPoW1kFd9magbbbPUlv:-1",
		"net.jazz.jfs.owning-context": "https://rb-ubk-clm-04.de.bosch.com:9443/rm/rm-projects/_0V8dsF0rEeqOLb2pbQsvTw/components/_0U2ckDWQEeyIq_xC-8aqNw",
	}
	var origin = 'https://rb-ubk-clm-04.de.bosch.com:9443/rm/views';
	var folderPath = 'https://rb-ubk-clm-04.de.bosch.com:9443/rm/folders/FR_UkvrgzWREeyIq_xC-8aqNw';

	let xmlDocs = `<rdf:RDF xmlns:dcterms="http://purl.org/dc/terms/"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rs="http://www.w3.org/2001/sw/DataAccess/tests/result-set#"
	xmlns:rrmNav="http://com.ibm.rdm/navigation#"
	xmlns:rrmViewdata="http://com.ibm.rdm/viewdata#"
	xmlns:rt="${origin}"
	xmlns:rm="http://www.ibm.com/xmlns/rdm/rdf/"
	xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
	xmlns:rql="http://www.ibm.com/xmlns/rdm/rql/"
	xmlns:owl="http://www.w3.org/2002/07/owl#">
	<rm:View rdf:about="">
	<rm:rowquery rdf:parseType="Resource">
	<rql:select rdf:parseType="Resource">
	<rdf:_1 rdf:parseType="Resource">
	<rql:object>R1</rql:object>
	<rql:field rdf:resource="http://www.ibm.com/xmlns/rdm/rdf/wrappedResourceURI"/>
	</rdf:_1>
	<rdf:_2 rdf:parseType="Resource">
	<rql:object>R1</rql:object>
	<rql:field rdf:resource="http://purl.org/dc/terms/identifier"/>
	</rdf:_2>
	</rql:select>
	<rql:where rdf:parseType="Resource">
	<rdf:_1 rdf:parseType="Resource">
	<rql:e1 rdf:parseType="Resource">
	<rql:field rdf:resource="http://com.ibm.rdm/navigation#parent"/>
	<rql:object>R1</rql:object>
	</rql:e1>
	<rql:e2>
	<rdf:Seq>
	<rdf:li rdf:resource="${folderPath}"/>
	</rdf:Seq>
	</rql:e2>
	<rql:op>in</rql:op>
	</rdf:_1>
	</rql:where>
	<rql:sort rdf:parseType="Resource">
	<rdf:_1 rdf:parseType="Resource">
	<rql:objField rdf:parseType="Resource">
	<rql:field rdf:resource="http://purl.org/dc/terms/identifier"/>
	<rql:object>R1</rql:object>
	</rql:objField>
	<rql:order>desc</rql:order>
	</rdf:_1>
	</rql:sort>
	</rm:rowquery>
	<rm:displayBaseProperties rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">true</rm:displayBaseProperties>
	<rrmNav:scope>public</rrmNav:scope>
	<rm:ofType>GridView</rm:ofType>
	<dcterms:description></dcterms:description>
	<dcterms:title>Grid View 1</dcterms:title>
	</rm:View>
	</rdf:RDF>`;
	$.ajax({
		type: "POST",
		url: url,
		headers: header,
		processData: false,
		contentType: "xml",
		dataType: "xml",
		data: xmlDocs,
		success: function(data){
			console.log(" ========== getTXLink ======================");
			console.log("Line 2184: ");
			console.log(data);
		},
		error: function(xhr, ajaxOption, error){
			console.log(xhr.status);
			console.log(error);
		}
	});

}

function checkLinkTypeAtt(){
	let url = "https://rb-ubk-clm-04.de.bosch.com:9443/rm/links?sourceOrTarget=https://rb-ubk-clm-04.de.bosch.com:9443/rm/resources/TX_cmRhVlnVEey7u8GeTAbN3g";
	let header = {
		"DoorsRP-Request-Type": "private",
		"Accept": "application/rdf+xml",
		"Configuration-Context": "https://rb-ubk-clm-04.de.bosch.com:9443/gc/configuration/319"
	}
	$.ajax({
		type: "GET",
		url: url, 
		headers: header,
		success: function(data){
			console.log(" =================== checkLinkTypeAtt ===================");
			console.log("Line 2272");
			console.log(data);

		},
		error: function(xhr, ajaxOption, error){
			console.log(xhr.status);
			console.log(error);
		}
	});
}

// get sub-folder-request
function showResult2(xmlDocs, path){
	var nodes = xmlDocs.evaluate(path, xmlDocs, 
		function(prefix){
			return getNameSpaceDefine(prefix);
		}, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	console.log("=== show result ===");
	while(result){
		console.log(result.nodeValue);
		result = nodes.iterateNext();
	}
}

// get sub-folder from response
// minh se phat biet sub folder so voi root folder bang tham so truyen vao
function showResult3(xmlDocs, path){
	var nodes = xmlDocs.evaluate(path, xmlDocs, 
		function(prefix){
			return getNameSpaceDefine(prefix);
		}, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	console.log("=== show result 3 ===");
	while(result){
		console.log(result.nodeValue);
		result = nodes.iterateNext();
	}
}

function showSubPathFolder(xmlDocs, path){
	var nodes = xmlDocs.evaluate(path, xmlDocs, 
		function(prefix){
			return getNameSpaceDefine(prefix);
		}, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	while(result){
		console.log(result.nodeValue);
		result = nodes.iterateNext();
	}
}


function getNameSpaceDefine(prefix){
	var uri;
	switch(prefix){
		case 'jp06': uri = 'http://jazz.net/xmlns/prod/jazz/process/0.6/'; break;
		case 'dcterms': uri = 'http://purl.org/dc/terms/'; break;
		case 'rdf': uri = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'; break;
		case 'rdfs': uri = 'http://www.w3.org/2000/01/rdf-schema#'; break;
		case 'process': uri = 'http://jazz.net/ns/process#'; break;
		case 'oslc_config': uri = 'http://open-services.net/ns/config#'; break;
		case 'acc': uri = 'http://open-services.net/ns/core/acc#'; break;
		case 'oslc': uri = 'http://open-services.net/ns/core#'; break;
		case 'ds': uri = 'http://jazz.net/xmlns/alm/rm/datasource/v0.1'; break;
		case 'rrm': uri = 'http://www.ibm.com/xmlns/rrm/1.0/'; break;
		case 'rm': uri = 'http://www.ibm.com/xmlns/rdm/rdf/'; break;
		case 'acp': uri = 'http://jazz.net/ns/acp#'; break;
		case 'calm': uri = 'http://jazz.net/xmlns/prod/jazz/calm/1.0/'; break;
		case 'nav': uri = 'http://jazz.net/ns/rm/navigation#'; break;
		case 'ns': uri = 'http://com.ibm.rdm/navigation#'; break;
		default: uri = null; break;
	}
	return uri;
}