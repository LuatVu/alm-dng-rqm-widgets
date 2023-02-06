//***************Declare all gloabal variables***************//
//var RM = parent.RM || RM;
var firstSearch = true,$loadingImage;
var rowssglobal, moduleType, moduleRef, ERRORMSG = "", moduleName, opened,missingAttributesPresent;
var noOfArtifacts = 0,configUrl,configKey,percentStatus = 0,originalNoOFArtifacts = 0,oslcStatus = false,globalRows;
var metadataInfo=[],idElement=null;
var artifactDetails = {},artifactData=[],alreadyPushed=[],linkError=[];
var rulesMap = new Map();      //to maintain rules mentioned as m
var rulesMapMarch = new Map();//to maintain rules mentioned as mArch
var rulesMapmReview = new Map();
var rulesMapmVarFunc = new Map();//to maintain rules mentioned as mVarFunc
var rulesMapmTest = new Map();//to maintain rules mentioned as mTest
var rulesMapMarchL1 = new Map();//to maintain rules mentioned as mArchL1
var dngAttributesArray=[]; 	 //to store dng attributes names to be used later.
var dngModuleArray=[] ; 	//to maintain list of modules present in DNG.
var mandatoryAttributesArray =[];
// vlc1hc 20220531
var relatedAtt = [];
var relatedRulesMap = new Map();
var valNumRow = 0; // number row of data of sheet RelatedAttributesRule

// vlc1hc 20220627
var patternAtt = /Satisfies|Satisfied|Validated/i;
var missingAttributesTempt = [];
var missingRelatedAttTempt = [];
var numRowTravel = 0;
var numRowHasLinkType = 0;
var moduleTypeAllow = ["SysRS - Requirement", "SWCRS - Requirement", "Requirement Specification"];


//****************Constant Variables**************************//
var fileUrl = "https://www.intranet.bosch.com/doku/CCPS-ALM/Test/DNGWidget/ConsistencyCheckRules.xlsx" ;//hardcoded Url of server to pick rules sheet.
var PS_EC_IS_RS = "PS_EC_IS_RS";  //hardcoded since for each level of DOORS two DNG levels present
var PS_EC_SF_RS = "PS_EC_SF_RS"; //hardcoded since for each level of DOORS two DNG levels present
var PS_EC_System_Software_RS = "PS_EC_System_Software_RS"; //for L3_L4 modules
var mandatorySymbol = "m"; // rule check undefined value, check mandatory attribute
var mArchSymbol     = "mArch"; // rule check values of related Attributes
var mArchL1Symbol   = "mArch_L1"; // rule is the combination of both rule m and mArch
var interfaceSymbol = "mInputInterface";
var mReviewSymbol   = "mReview";
var mTestSymbol 	= "mTest";
var mVarFuncSymbol 	= "mVarFunc";

var REQUIREMENT_SPECIFICATION = "Requirement Specification";


var statusValueArray = ["NEW/CHANGED","READY_FOR_INTERNAL_REVIEW","READY_FOR_EXTERNAL_REVIEW","REVIEW_FINDING","REVIEW_END","ACCEPTED","READY_FOR_STAKEHOLDER_REVIEW"];
var htmltoAppendOnFindings = "<html><head><style>table{border-collapse: collapse;border-spacing: 0px;margin-top: 20px;margin-bottom: 40px;}table, th, td{padding: 5px;border: 2px solid black;}.error{font-size: 20px;font-weight:bold;}</style><title>Consistency Check Output</title></head><body class='reportBody'>";
var rowData = "<b>Link Details Legend</b></br><p><font color='red'>B<font color='black'>-Link to Base artifact detected</br><font color='red'>H<font color='black'>/<font color='red'>I<font color='black'>-Link to Heading or Information artifact detected</p>"+"<tr><th>Id</th><th>Type</th><th>Name</th><th>Consistency Check Findings</th><th>Satisfies</th><th>Link To</th>";
var exportBtn = "<button id='button-export'>Export</button>"
var lastModifiedData = "<th>Last Modified by</th></tr>"
var PS_EC_IS_RSSOFTWARE_REQ = "PS_EC_IS_RS:SOFTWARE_REQ";
var PS_EC_SF_RSSOFTWARE_REQ = "PS_EC_SF_RS:SOFTWARE_REQ";
var PS_EC_IS_RSSOFTWARE_NONFUNC_REQ = "PS_EC_IS_RS:SOFTWARE_NONFUNC_REQ";
var PS_EC_SF_RSSOFTWARE_NONFUNC_REQ = "PS_EC_SF_RS:SOFTWARE_NONFUNC_REQ";
var PS_EC_System_RSSOFTWARE_NONFUNC_REQ = "PS_EC_System_RS:SOFTWARE_NONFUNC_REQ"
var reqUrl = "https://si0vmc0854.de.bosch.com/swap-prod/api/feature-model/features?featureUniqueName=";
var regExpr1 = /AND|OR|NOT|[()]/;
var regExpr2 = /<|>|=|≠|≥|≤/;
var warDetails = "WARNING: Relational operators are not evaluated. Only variant points need to be mentioned"
var userCRQValue;
var userCRQValueArray;
//*************************************************************************//
//***************************Messages********************************//
var errorGCFetch = "Unable to fetch GC configuration.";
var noGCConfig  = "No GC Configurations found.";
var error = "Error";
var fileError = "Unable to locate rules file on server.Please contact your administrator.";
var infoFetching = "Fetching Artifact Details... ";
var errorNoRules = "No consistency check rules are defined for currently opened module of type = ";
var errorModuleDetails = "Unable to fetch Module Details!";
var infoStatus = "Consistency Check : 1/2 Fetching attribute details ";
var infoCompletionMessage = "Consistency Check : Completion status: ";
var errorLinkCheck = "Link check could not be executed for the following artifacts as the links could not be fetched: ";
var infoMarch = "<b>INFO: In case of reuse following fields must be filled until accepted - </b>";
var errorMarch = "<b>ERROR: The list of attributes must be checked values again: </b>";
var relatedAttError = "<b>Error: The list of related attributes must be checked values again: </b>";
var findingMessage = "<p><b>No rules are defined for this artifact type inside the currently opened module.</b></p>"
var errorNoRulesDef = "<td><p><b>No rules are defined for this artifact type inside the currently opened module.</b></p></td><td>-</td><td>-</td><td>-</td></tr>";
var gcInfo = "Unable to fetch global configuration information .Please refresh the module and try again."
var rowValue = "<tr><th>Userid</th><th>Time</th><th>Module Name</th><th>GC Stream</th><th>Server Url</th></tr>"
//****************************************************************************//