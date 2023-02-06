/* https://www.intranet.bosch.com/doku/CCPS-ALM/Test/com.bosch.rtc.RMFormulationWidget.WORK/WebContent/rmfView.xml */

var modal;
var btn;
var selectedArtifact = null;
var selectedArtifactValues = new RM.AttributeValues();
var artifactName;
var conditionTextExpanded = false;
var funcTextExpanded = false;

//----------------Modal-----------------
var $modalOverlay;
var $modalContainer;
//--------------------------------------
var $rmf_preview;
var systemText = '';
var valueText = '';
var qualyExprText = '';
var processText = '';
var objectText = '';
var binding = '';
var functionalityText = '';
var actorText = '';
var conditionText = '';
var requirement = '';
var $rmf_submitButton;
var $rmf_cancelButton;
var $rmf_closeTopRight;

const FACT_FUNCTION = 'Fact functional';
const FACT_NON_FUNCTION = 'Fact non-functional';


// Vlc1hc add new variables
var origin;
var config;
var table;
var alreadyCheckedWords = [];
var referenceTerms;
var mapTerm;

var RM = window.parent.RM || RM ;
origin = window.location.origin;

var componentUri;
var globalConfigurationUri;
var tagLink;
var artifactLink
var mapInteractLog;

$(function () {


  StyleInjection();
  rmf_startButton = document.getElementById("rmf_openModalButton");
  rmnf_startButton = document.getElementById("rmnf_openModalButton");

  subscribeToArtifact();

  let startIndex = window.top.location.hash.indexOf('componentURI=') + 13;
	let endIndex = window.top.location.hash.indexOf('&oslc.configuration=');
	componentUri = window.top.location.hash.substring(startIndex?startIndex:0, endIndex == -1?undefined:endIndex);
  componentUri = decodeURIComponent(componentUri);

  // When the user clicks on the button - FUNCTIONAL REQUIREMENT, open the modal
  try{
    rmf_startButton.onclick = function () {
      RM.Client.getCurrentConfigurationContext(function (result) {
        if (result.code === RM.OperationResult.OPERATION_OK) {
          //vlc1hc add 20221117
          config = result.data;
          globalConfigurationUri = config.globalConfigurationUri;

          if (result.data.changeSetUri !== undefined) {
  
            if (selectedArtifact == null || selectedArtifact.length > 1) {
              alert('Please select ONE requirement after which you want to create a new one!');
            } else {
              openModal('rmf');
            }
          } else {
            alert('Please create a new changeset!');
          }
        } else {
          console.log('Error in getCurrentConfiguration');
        }
      });
    }
  } catch (e) {
    setTimeout(() => {
      rmf_startButton = document.getElementById("rmf_openModalButton");
      rmf_startButton.onclick = function () {
        RM.Client.getCurrentConfigurationContext(function (result) {
          if (result.code === RM.OperationResult.OPERATION_OK) {
            if (result.data.changeSetUri !== undefined) {
    
              if (selectedArtifact == null || selectedArtifact.length > 1) {
                alert('Please select ONE requirement after which you want to create a new one!');
              } else {
                openModal('rmf');
              }
            } else {
              alert('Please create a new changeset!');
            }
          } else {
            console.log('Error in getCurrentConfiguration');
          }
        });
      }
    }, 200);
  }

  // When the user clicks on the button - NON-FUNCTION REQUIREMENT, open the modal
  try{
    rmnf_startButton.onclick = function () {
      RM.Client.getCurrentConfigurationContext(function (result) {
        if (result.code === RM.OperationResult.OPERATION_OK) {
          //vlc1hc add 20221117
          config = result.data;
          globalConfigurationUri = config.globalConfigurationUri;

          if (result.data.changeSetUri !== undefined) {

            if (selectedArtifact == null || selectedArtifact.length > 1) {
              alert('Please select ONE requirement after which you want to create a new one!');
            } else {
              openModal('rmnf');
            }
          } else {
            alert('Please create a new changeset!');
          }
        } else {
          console.log('Error in getCurrentConfiguration');
        }
      });
    }
  } catch (e) {
    setTimeout(() => {
      rmnf_startButton = document.getElementById("rmnf_openModalButton");
      rmnf_startButton.onclick = function () {
        RM.Client.getCurrentConfigurationContext(function (result) {
          if (result.code === RM.OperationResult.OPERATION_OK) {
            if (result.data.changeSetUri !== undefined) {
  
              if (selectedArtifact == null || selectedArtifact.length > 1) {
                alert('Please select ONE requirement after which you want to create a new one!');
              } else {
                openModal('rmnf');
              }
            } else {
              alert('Please create a new changeset!');
            }
          } else {
            console.log('Error in getCurrentConfiguration');
          }
        });
      }
    }, 200);
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

/**
 * 
 * @param {String} anchor 
 * @param {String} id 
 * @param {String[]} classes 
 * @returns 
 */
var createContainer = (anchor, id = null, classes = []) => {
  idText = '';
  classesText = '';
  if (id) {
    idText = ' id="'+id+'"';
  };
  if (classes) {
    classesText = ' class="'
    classes.forEach(className => {
      classesText += ' '+className;
    });
    classesText+='"';
  };
  var el = $('<div'+idText+classesText+'></div>');
  $(window.top.document).find(anchor).append(el);
  return el;
}

/**
 * 
 * @param {String} anchor 
 * @param {String} heading 
 * @param {String} id 
 * @param {String} placeholder 
 * @param {Boolean} isEssential 
 * @returns 
 */
 var createTextarea = (anchor, heading = '', id = '', placeholder = '', isEssential = false) => {
  var rmf_item = createContainer(anchor , null, ['rmf_item3']);
  var rmf_flex = createContainer(rmf_item , null, ['rmf_flex']);
  $(window.top.document).find(rmf_flex).append('<p class="rmf_subHeading">'+heading+'</p>');
  if (isEssential) {
    // rmf_flex.append('<svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10"> <defs> <style> .cls-1 { fill: #b1ad35; } .cls-2, .cls-3 { stroke: none; } .cls-3 { fill: #b1ad35; } </style> </defs> <g class="cls-1"> <path class="cls-2" d="M 8.13389778137207 8.979253768920898 L 5.750500202178955 7.599540233612061 L 5.5 7.454529762268066 L 5.249499797821045 7.599540233612061 L 2.866101980209351 8.979253768920898 L 3.493829965591431 6.420919895172119 L 3.568650007247925 6.115950107574463 L 3.326450109481812 5.916100025177002 L 1.270013689994812 4.219321250915527 L 4.000010013580322 4.000170230865479 L 4.297540187835693 3.976279973983765 L 4.417699813842773 3.703049898147583 L 5.5 1.242033362388611 L 6.582300186157227 3.703049898147583 L 6.702459812164307 3.976279973983765 L 6.999989986419678 4.000170230865479 L 9.729986190795898 4.219321250915527 L 7.673550128936768 5.916100025177002 L 7.431350231170654 6.115950107574463 L 7.50616979598999 6.420919895172119 L 8.13389778137207 8.979253768920898 Z"/> <path class="cls-3" d="M 5.5 2.484054088592529 L 4.635069847106934 4.450799942016602 L 2.540002822875977 4.618974208831787 L 4.129079818725586 5.93011999130249 L 3.631383419036865 7.958502769470215 L 5.5 6.876790046691895 L 7.368617057800293 7.958502769470215 L 6.870920181274414 5.93011999130249 L 8.459997177124023 4.618974208831787 L 6.364930152893066 4.450799942016602 L 5.5 2.484054088592529 M 5.5 0 L 7.039999961853027 3.50177001953125 L 11 3.819660186767578 L 7.991769790649414 6.301759719848633 L 8.899189949035645 10 L 5.5 8.032259941101074 L 2.100810050964355 10 L 3.008230209350586 6.301759719848633 L 0 3.819660186767578 L 3.960000038146973 3.50177001953125 L 5.5 0 Z"/> </g>')
    rmf_flex.append('<span class="j-required" title="This field is required" aria-label="This field is required" style="cursor: help" id="com_ibm_team_gc_web_ui_RequiredMarker_0" widgetid="com_ibm_team_gc_web_ui_RequiredMarker_0"><!-- NLS_CHARSET=UTF-8 -->*</span>');
  };
  var rmf_textarea = createContainer(rmf_item , null, ['rmf_content', 'rmf_textInputLimiter']);
  $(window.top.document).find(rmf_textarea).append('<textarea id="'+ id +'" type="text" class="rmf_textInput" name="" placeholder="'+placeholder+'"></textarea>');
  return $(window.top.document).find('#'+id);
};

/**
 * 
 * @param {String} anchor 
 * @param {String} heading 
 * @param {{radioId, radioName, radioValue, radioPlaceholder, checked}} radioContent 
 * @param {String} id 
 * @param {String} placeholder 
 * @param {Boolean} isEssential 
 * @param {Boolean} checked 
 * @returns 
 */
 var createRadioButtons = (anchor, heading = '', radioContent = [{radioId, radioName, radioValue, radioPlaceholder, checked: false}], id = null, placeholder = '', isEssential = false) => {
  var rmf_item = createContainer(anchor , null, ['rmf_item3']);
  var rmf_flex = createContainer(rmf_item , null, ['rmf_flex']);
  $(window.top.document).find(rmf_flex).append('<p class="rmf_subHeading">'+heading+'</p>');
  if (isEssential) {
    // rmf_flex.append('<svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10"> <defs> <style> .cls-1 { fill: #b1ad35; } .cls-2, .cls-3 { stroke: none; } .cls-3 { fill: #b1ad35; } </style> </defs> <g class="cls-1"> <path class="cls-2" d="M 8.13389778137207 8.979253768920898 L 5.750500202178955 7.599540233612061 L 5.5 7.454529762268066 L 5.249499797821045 7.599540233612061 L 2.866101980209351 8.979253768920898 L 3.493829965591431 6.420919895172119 L 3.568650007247925 6.115950107574463 L 3.326450109481812 5.916100025177002 L 1.270013689994812 4.219321250915527 L 4.000010013580322 4.000170230865479 L 4.297540187835693 3.976279973983765 L 4.417699813842773 3.703049898147583 L 5.5 1.242033362388611 L 6.582300186157227 3.703049898147583 L 6.702459812164307 3.976279973983765 L 6.999989986419678 4.000170230865479 L 9.729986190795898 4.219321250915527 L 7.673550128936768 5.916100025177002 L 7.431350231170654 6.115950107574463 L 7.50616979598999 6.420919895172119 L 8.13389778137207 8.979253768920898 Z"/> <path class="cls-3" d="M 5.5 2.484054088592529 L 4.635069847106934 4.450799942016602 L 2.540002822875977 4.618974208831787 L 4.129079818725586 5.93011999130249 L 3.631383419036865 7.958502769470215 L 5.5 6.876790046691895 L 7.368617057800293 7.958502769470215 L 6.870920181274414 5.93011999130249 L 8.459997177124023 4.618974208831787 L 6.364930152893066 4.450799942016602 L 5.5 2.484054088592529 M 5.5 0 L 7.039999961853027 3.50177001953125 L 11 3.819660186767578 L 7.991769790649414 6.301759719848633 L 8.899189949035645 10 L 5.5 8.032259941101074 L 2.100810050964355 10 L 3.008230209350586 6.301759719848633 L 0 3.819660186767578 L 3.960000038146973 3.50177001953125 L 5.5 0 Z"/> </g>')
    rmf_flex.append('<span class="j-required" title="This field is required" aria-label="This field is required" style="cursor: help" id="com_ibm_team_gc_web_ui_RequiredMarker_0" widgetid="com_ibm_team_gc_web_ui_RequiredMarker_0"><!-- NLS_CHARSET=UTF-8 -->*</span>');
  };
  var rmf_container = createContainer(rmf_item , null, ['rmf_checkboxOuterContainer','rmf_content']);
  radioContent.forEach(el => {
    var checkedValue = '';
    if (el.checked) {
      checkedValue = 'checked="checked"';
    }
    var rmf_innerContainer = createContainer(rmf_container , null, ['rmf_checkboxInnerContainer']);
    $(window.top.document).find(rmf_innerContainer).append('<input type="radio" id="'+el.radioId+'" class="rmf_checkbox" name="'+el.radioName+'" value="'+el.radioValue+'" '+checkedValue+'>');
    $(window.top.document).find(rmf_innerContainer).append('<label for="'+el.radioId+'" class="rmf_checkboxLabel">'+el.radioPlaceholder+'</label>');
  });
  if (id) {
    var rmf_textarea = createContainer(rmf_item , null, ['rmf_content', 'rmf_textInputLimiter']);
    $(window.top.document).find(rmf_textarea).append('<textarea id="'+ id +'" type="text" class="rmf_textInput" name="" placeholder="'+placeholder+'"></textarea>');
    return $(window.top.document).find('#'+id);
  };
};

function openModal(type) {
  modal = $('#rmf_modal').modal({
    appendTo: $(window.top.document).find('body'),
    overlayCss: {
      backgroundColor: "#000000",
      width: "100%",
      height: "100%"
    },
    containerCss: {
      backgroundColor: "#ffffff",
      position: "absolute",
      float: "left",
      width: "1410px",
      height: "auto",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    overlayClose: true,
  });
  alreadyCheckedWords = [];
  referenceTerms  = new Map();
  mapTerm = new Map();

  getModalElements();
  mapInteractLog = new Map();

  $modalOverlay.css({
    'width': '100%',
    'height': '100%'
  });
  $modalContainer.css({
    "left": "50%",
    "top": "50%",
    "height": "auto",
  });

  resourceContext();
  
  if (type == 'rmnf') {

    // setup the header image
    $('<svg xmlns="http://www.w3.org/2000/svg" width="1323" height="68" viewBox="0 0 1323 68"><defs><style>.a{fill:#deeffc;}.b{fill:none;stroke:#707070;}.c{fill:#bce0fd;}.d{font-size:14px;font-family:Arial-BoldMT, Arial;font-weight:700;}.e{fill:#5acb65;}</style></defs><g transform="translate(-43 -135)"><g transform="translate(227 135)"><rect class="a" width="330" height="68" rx="6"/></g><line class="b" x2="73" transform="translate(932 168.5)"/><line class="b" x2="73" transform="translate(356 168.75)"/><line class="b" x2="73" transform="translate(1173 168.5)"/><g transform="translate(739.5 114.5)"><line class="b" y1="0.5" x2="72.967" transform="translate(0 54)"/><path class="b" d="M77.155,44.807" transform="translate(-4.188 9.443)"/></g><g transform="translate(548.5 114.5)"><line class="b" x1="72.967" y1="0.5" transform="translate(0.033 54)"/><path class="b" d="M4.188,44.807" transform="translate(-4.155 9.443)"/></g><g transform="translate(43 147)"><rect class="c" width="122" height="44" rx="6"/><text class="d" transform="translate(61 27)"><tspan x="-43.586" y="0">|&lt;condition&gt;|</tspan></text></g><g transform="translate(235 147)"><rect class="e" width="122" height="44" rx="6"/><text class="d" transform="translate(61 27)"><tspan x="-53.703" y="0">&lt;characteristic&gt;</tspan></text></g><g transform="translate(427 147)"><rect class="e" width="122" height="44" rx="6"/><text class="d" transform="translate(61 27)"><tspan x="-56.024" y="0">&lt;subject matter&gt;</tspan></text></g><g transform="translate(619 147)"><rect class="e" width="122" height="44" rx="6"/><text class="d" transform="translate(61 27)"><tspan x="-15.952" y="0">shall</tspan></text></g><g transform="translate(1004 147)"><rect class="c" width="170" height="44" rx="6"/><text class="d" transform="translate(85 19)"><tspan x="-40.271" y="0">|&lt;Qualifying</tspan><tspan x="-43.784" y="16">Expression&gt;|</tspan></text></g><g transform="translate(811 147)"><rect class="e" width="123" height="44" rx="6"/><text class="d" transform="translate(61.5 27)"><tspan x="-8.169" y="0">be</tspan></text></g><g transform="translate(1244 147)"><rect class="e" width="122" height="44" rx="6"/><text class="d" transform="translate(61 27)"><tspan x="-26.076" y="0">&lt;value&gt;</tspan></text></g><line class="b" x2="73" transform="translate(164 168.75)"/></g></svg>').appendTo($(window.top.document).find('#rmf_overviewImage'));

    // create a top level container which contains the 3 mandatory inputs
    var $rmf_containerTop = createContainer('#rmf_modal' , null, ['rmf_container', 'rmf_borderBottom']);
    var $rmf_tableTop = createContainer($rmf_containerTop , null, ['rmf_table']);
    var $rmf_systemInput = createTextarea($rmf_tableTop , 'The System', 'rmf_systemInput', 'Write the System here', true);
    var $rmf_legalBinding = createRadioButtons(
      $rmf_tableTop,
      'The legal Binding',
      [{radioId: 'rmf_Shall', radioName: 'binding', radioValue: 'shall ', radioPlaceholder: 'Shall', checked: true}],
      null,
      null,
      true);
    var $rmf_valueInput = createTextarea($rmf_tableTop , 'The Value', 'rmf_valueInput', 'Write the Value here', true);

    // create a second container after the top level one, which contains the 2 optional inputs
    var $rmf_containerMiddle = createContainer('#rmf_modal' , null, ['rmf_container', 'rmf_borderBottom']);
    var $rmf_tableMiddle = createContainer($rmf_containerMiddle , null, ['rmf_table']);
    var $rmf_qualifyingExpr = createTextarea($rmf_tableMiddle , 'The qualifying expression', 'rmf_qualifyingExpr', 'Write the qualifying expression here');
    var $rmf_conditionInput = createRadioButtons(
      $rmf_tableMiddle,
      'The condition',
      [{radioId: 'rmnf_if', radioName: 'condition', radioValue: 'If ', radioPlaceholder: 'If'},
      {radioId: 'rmnf_long', radioName: 'condition', radioValue: 'As long as ', radioPlaceholder: 'As long as'},
      {radioId: 'rmnf_soon', radioName: 'condition', radioValue: 'As soon as ', radioPlaceholder: 'As soon as'},
      {radioId: 'rmnf_cNone', radioName: 'condition', radioValue: '', radioPlaceholder: '(None)'}],
      'rmf_conditionInput',
      'Write the condition here');

    $rmf_systemInput.keyup(function (event) {
      mapInteractLog.set("system", "system");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      systemText = event.target.value;
      lookupTerm(event);
      rmnfBuildRequirementPreview();
    });

    $rmf_valueInput.keyup(function (event) {
      mapInteractLog.set("value", "value");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      valueText = event.target.value;
      lookupTerm(event);
      rmnfBuildRequirementPreview(false, true, false, false);
    });

    $rmf_qualifyingExpr.keyup(function (event) {
      mapInteractLog.set("qualify", "qualify");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      qualyExprText = event.target.value;
      lookupTerm(event);
      rmnfBuildRequirementPreview(false, false, true, false);
    });
    
    $rmf_conditionInput.keyup(function (event) {
      mapInteractLog.set("condition", "condition");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      conditionText = event.target.value;
      lookupTerm(event);
      rmnfBuildRequirementPreview(false, false, false, true);
    });
  
    // include the input from the condition in the requirement + preview
    $(window.top.document).find("input[type='radio'][name=binding]").change(function () {
      binding = $(window.top.document).find("input[type='radio'][name=binding]:checked").val();
      rmnfBuildRequirementPreview(true, false, false, false);
    });
    // only for this version necessary, because only shall is availabe as option 
    binding = $(window.top.document).find("input[type='radio'][name=binding]:checked").val();
    rmnfBuildRequirementPreview(true, false, false, false);

    // opens/ closes a textarea for the condition
    $(window.top.document).find("input[type='radio'][name=condition]").change(function () {
      conditionText = $(window.top.document).find("input[type='radio'][name=condition]:checked").val();
      $rmf_conditionInput.val(conditionText);
      if (conditionText == '') {
        $rmf_conditionInput.css({
          'display': 'none'
        });
        conditionTextExpanded = false;
        setObjectInputHeight($rmf_qualifyingExpr, false);
      } else {
        $rmf_conditionInput.css({
          'display': 'inline'
        });
        conditionTextExpanded = true;
        setObjectInputHeight($rmf_qualifyingExpr);
      }
      rmnfBuildRequirementPreview(false, false, false, true);
    });
    
  } else if(type == 'rmf') {

    // setup the header image
    $('<svg xmlns="http://www.w3.org/2000/svg" width="1370" height="152" viewBox="0 0 1370 152"><defs><style>.a{fill:none;stroke:#707070;}.b{fill:#bce0fd;}.c{font-size:14px;font-family:Arial-BoldMT, Arial;font-weight:700;}.d{fill:#5acb65;}</style></defs><g transform="translate(-19 -92)"><line class="a" y1="62" transform="translate(1136 152)"/><line class="a" y1="92" transform="translate(1328 122)"/><line class="a" x2="73" transform="translate(1197 167.5)"/><g transform="translate(1003.5 113.5)"><line class="a" y1="54.5" x2="73" transform="translate(0 54)"/><line class="a" y1="0.5" x2="72.967" transform="translate(0 54)"/><path class="a" d="M4.188-9.443l72.967,54.25" transform="translate(-4.188 9.443)"/></g><g transform="translate(763.5 113.5)"><path class="a" d="M73,54.5,0,0" transform="translate(0 54)"/><line class="a" x1="72.967" y1="0.5" transform="translate(0.033 54)"/><path class="a" d="M77.155-9.443,4.188,44.807" transform="translate(-4.155 9.443)"/></g><g transform="translate(763.5 113.5)"><path class="a" d="M73,0" transform="translate(0 54)"/><line class="a" y1="0.5" x2="72.967" transform="translate(0 54)"/></g><g transform="translate(572.5 113.5)"><path class="a" d="M0,0" transform="translate(0 54)"/><line class="a" x1="72.967" y1="0.5" transform="translate(0.033 54)"/></g><g transform="translate(-1)"><line class="a" x2="73" transform="translate(141 167.75)"/><line class="a" x2="73" transform="translate(141 222)"/><line class="a" x2="73" transform="translate(141 113.75)"/></g><g transform="translate(-1)"><line class="a" y1="54.5" x2="73" transform="translate(380.5 167.5)"/><line class="a" y1="0.5" x2="72.967" transform="translate(380.5 167.5)"/><path class="a" d="M4.188-9.443l72.967,54.25" transform="translate(376.312 122.943)"/></g><g transform="translate(-1)"><line class="a" y1="54.5" x2="73" transform="translate(380.5 167.5)"/><line class="a" y1="0.5" x2="72.967" transform="translate(380.5 167.5)"/><path class="a" d="M4.188-9.443l72.967,54.25" transform="translate(376.312 122.943)"/></g><g transform="translate(19 92)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 27.483)"><tspan x="-4.276" y="0">If</tspan></text></g><g transform="translate(19 146)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 27)"><tspan x="-35.396" y="0">As long as</tspan></text></g><g transform="translate(19 200)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 27)"><tspan x="-37.345" y="0">As soon as</tspan></text></g><g transform="translate(211 92)"><rect class="b" width="170" height="44" rx="6"/><text class="c" transform="translate(85 27)"><tspan x="-72.362" y="0">&lt;Logical Expression&gt;</tspan></text></g><g transform="translate(211 146)"><rect class="b" width="170" height="44" rx="6"/><text class="c" transform="translate(85 27)"><tspan x="-26.462" y="0">&lt;event&gt;</tspan></text></g><g transform="translate(211 200)"><rect class="b" width="170" height="44" rx="6"/><text class="c" transform="translate(85 27)"><tspan x="-45.903" y="0">&lt;time period&gt;</tspan></text></g><g transform="translate(451 146)"><rect class="d" width="122" height="44" rx="6"/><text class="c" transform="translate(61 27)"><tspan x="-24.903" y="0">System</tspan></text></g><g transform="translate(643 146)"><path class="d" d="M6,0H116a6,6,0,0,1,6,6V38a6,6,0,0,1-6,6H6a6,6,0,0,1-6-6V6A6,6,0,0,1,6,0Z"/><text class="c" transform="translate(61 27)"><tspan x="-15.952" y="0">shall</tspan></text></g><g transform="translate(835 146)"><rect class="b" width="170" height="44" rx="6"/><text class="c" transform="translate(85 19)"><tspan x="-68.855" y="0">Provide &lt;actor&gt; with</tspan><tspan x="-43.169" y="16" xml:space="preserve">the  ability to</tspan></text></g><g transform="translate(1075 146)"><path class="d" d="M6,0H117a6,6,0,0,1,6,6V38a6,6,0,0,1-6,6H6a6,6,0,0,1-6-6V6A6,6,0,0,1,6,0Z"/><text class="c" transform="translate(61.5 27)"><tspan x="-51.755" y="0">&lt;process verb&gt;</tspan></text></g><g transform="translate(1267 146)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 27)"><tspan x="-28.79" y="0">&lt;object&gt;</tspan></text></g><g transform="translate(835 200)"><rect class="b" width="170" height="44" rx="6"/><text class="c" transform="translate(85 27)"><tspan x="-32.672" y="0">be able to</tspan></text></g><g transform="translate(835 92)"><rect class="b" width="170" height="45" rx="6"/><text class="c" transform="translate(85 27.5)"><tspan x="-2.331" y="0">-</tspan></text></g><line class="a" x2="73" transform="translate(140 167.75)"/><line class="a" x2="73" transform="translate(140 222)"/><line class="a" x2="73" transform="translate(140 113.75)"/><g transform="translate(1267 200)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 19)"><tspan x="-4.088" y="0">+</tspan><tspan x="-55.658" y="16">|&lt;Specification&gt;|</tspan></text></g><g transform="translate(1267 92)"><rect class="b" width="122" height="44" rx="6"/><text class="c" transform="translate(61 19)"><tspan x="-55.658" y="0">|&lt;Specification&gt;|</tspan><tspan x="-4.088" y="16">+</tspan></text></g><g transform="translate(1072 200)"><rect class="b" width="130" height="44" rx="6"/><text class="c" transform="translate(65 19)"><tspan x="-4.088" y="0">+</tspan><tspan x="-62.651" y="16">|&lt;Concretization &gt;|</tspan></text></g></g></svg>').appendTo($(window.top.document).find('#rmf_overviewImage'));

    // create a top level container which contains the 3 mandatory inputs
    var $rmf_containerTop = createContainer('#rmf_modal' , null, ['rmf_container', 'rmf_borderBottom']);
    var $rmf_tableTop = createContainer($rmf_containerTop , null, ['rmf_table']);
    var $rmf_systemInput = createTextarea($rmf_tableTop , 'The System', 'rmf_systemInput', 'Write the System here', true);
    var $rmf_legalBinding = createRadioButtons(
      $rmf_tableTop,
      'The legal Binding',
      [{radioId: 'rmf_Shall', radioName: 'binding', radioValue: 'shall ', radioPlaceholder: 'Shall', checked: true}],
      null,
      null,
      true);
    var $rmf_processInput = createTextarea($rmf_tableTop , 'Process word with an optional concretization', 'rmf_processInput', 'Write the process word here', true);

    // create a second container after the top level one, which contains the 3 optional inputs
    var $rmf_containerMiddle = createContainer('#rmf_modal' , null, ['rmf_container', 'rmf_borderBottom']);
    var $rmf_tableMiddle = createContainer($rmf_containerMiddle , null, ['rmf_table']);
    var $rmf_actorInput = createRadioButtons(
      $rmf_tableMiddle,
      'Type of functionality',
      [{radioId: 'rmf_None', radioName: 'functionality', radioValue: '', radioPlaceholder: '(None)'},
      {radioId: 'rmf_Provide', radioName: 'functionality', radioValue: 'provide', radioPlaceholder: 'Provide [Actor] with the ability to'},
      {radioId: 'rmf_able', radioName: 'functionality', radioValue: 'be able to ', radioPlaceholder: 'Be able to'}],
      'rmf_actorInput',
      'Write the actor here');
    var $rmf_objectInput = createTextarea($rmf_tableMiddle , 'Define the object with optional specifications', 'rmf_objectInput', 'Write the object here');
    var $rmf_conditionInput = createRadioButtons(
      $rmf_tableMiddle,
      'The condition',
      [{radioId: 'rmnf_if', radioName: 'condition', radioValue: 'If ', radioPlaceholder: 'If'},
      {radioId: 'rmnf_long', radioName: 'condition', radioValue: 'As long as ', radioPlaceholder: 'As long as'},
      {radioId: 'rmnf_soon', radioName: 'condition', radioValue: 'As soon as ', radioPlaceholder: 'As soon as'},
      {radioId: 'rmnf_cNone', radioName: 'condition', radioValue: '', radioPlaceholder: '(None)'}],
      'rmf_conditionInput',
      'Write the condition here');

    $rmf_systemInput.keyup(function (event) {
      mapInteractLog.set("system", "system");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      systemText = event.target.value;
      lookupTerm(event);
      buildRequirementPreview();
    });
  
    $rmf_processInput.keyup(function (event) {
      mapInteractLog.set("process", "process");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      processText = event.target.value;
      lookupTerm(event);
      buildRequirementPreview(false, true, false, false, false);
    });
  
    $rmf_objectInput.keyup(function (event) {
      mapInteractLog.set("object", "object");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      objectText = event.target.value;
      lookupTerm(event);
      buildRequirementPreview(false, false, false, true, false);
    });

    $rmf_actorInput.keyup(function (event) {
      mapInteractLog.set("actor", "actor");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      actorText = event.target.value;
      functionalityText = 'provide ' + actorText + ' with the ability to'
      lookupTerm(event);
      buildRequirementPreview(false, false, true, false, false);
    });

    $rmf_conditionInput.keyup(function (event) {
      mapInteractLog.set("condition", "condition");
      if(mapInteractLog.size > 1){
        $(window.top.document).find("#glossary").empty();
        mapInteractLog.clear();
        alreadyCheckedWords = [];
      }
      conditionText = event.target.value;
      lookupTerm(event);
      buildRequirementPreview(false, false, false, false, true);
    });
  
    // include the input from the condition in the requirement + preview
    $(window.top.document).find("input[type='radio'][name=binding]").change(function () {
      binding = $(window.top.document).find("input[type='radio'][name=binding]:checked").val();
      buildRequirementPreview(true, false, false, false, false);
    });
    // only for this version necessary, because only shall is availabe as option 
    binding = $(window.top.document).find("input[type='radio'][name=binding]:checked").val();
    buildRequirementPreview(true, false, false, false, false);

    // opens/ closes a textarea for the functionality and sets the functionality text
    $(window.top.document).find("input[type='radio'][name=functionality]").change(function () {
      functionalityText = $(window.top.document).find("input[type='radio'][name=functionality]:checked").val();
      if (functionalityText == 'provide') {
        $rmf_actorInput.css({
          'display': 'inline'
        });
        funcTextExpanded = true;
        setObjectInputHeight($rmf_objectInput);
        functionalityText = 'provide ' + actorText + ' with the ability to';
      } else {
        $rmf_actorInput.css({
          'display': 'none'
        });
        funcTextExpanded = false;
        setObjectInputHeight($rmf_objectInput, false);
      }
      buildRequirementPreview(false, false, true, false, false);
    });

    // opens/ closes a textarea for the condition
    $(window.top.document).find("input[type='radio'][name=condition]").change(function () {
      conditionText = $(window.top.document).find("input[type='radio'][name=condition]:checked").val();
      $rmf_conditionInput.val(conditionText);
      if (conditionText == '') {
        $rmf_conditionInput.css({
          'display': 'none'
        });
        conditionTextExpanded = false;
        setObjectInputHeight($rmf_objectInput, false);
      } else {
        $rmf_conditionInput.css({
          'display': 'inline'
        });
        conditionTextExpanded = true;
        setObjectInputHeight($rmf_objectInput);
      }
      buildRequirementPreview(false, false, false, false, true);
    });
  }

  var $rmf_containerBottom = createContainer('#rmf_modal' , null, ['rmf_flex']);
  $(window.top.document).find($rmf_containerBottom).append('<button id="rmf_cancelButton" class="rmf_footerButton rmf_secondaryButton">Cancel</button><button id="rmf_submitButton" class="rmf_footerButton rmf_primaryButton" disabled>Ok</button>');

  $(window.top.document).find('#rmf_cancelButton').click(function () {
    modal.close();
  });

  $rmf_closeTopRight.click(function () {
    modal.close();
  });
  var typeValue = undefined;
  if(type == 'rmnf' ){
    typeValue = FACT_NON_FUNCTION;
  }else if(type == 'rmf'){
    typeValue = FACT_FUNCTION;
  }

  $rmf_submitButton = $(window.top.document).find('#rmf_submitButton');
  $rmf_submitButton.click(function () {
    createChildArtifact(selectedArtifact[0], requirement, typeValue);
    modal.close();
  });
}

/**
 * increases the height differences to the top for the object textarea
 * @param {boolean} increase true if you want a n extra margin to the top
 * @returns {void}
 */
function setObjectInputHeight($object, increase = true) {
  if (increase) {
    $object.css({
      'margin-top': '24px',
    });
  } else {
    if (!conditionTextExpanded && !funcTextExpanded) {
      $object.css({
        'margin-top': '0px',
      });
    }
  }
}

/**
 * builds the requirement and string while checking for if a input was given.
 * Enables the submit button.
 * @param {void}
 * @returns {void}
 */
function buildRequirementPreview(WriteBinding = false, writeProcess = false, writeFunctionality = false, writeObject = false, writeCondition = false) {
  if (binding !== '' && WriteBinding) {
    binding = ' ' + binding;
  } else;
  if (processText !== '' && writeProcess) {
    processText = ' ' + processText;
  };
  if (functionalityText !== '' && writeFunctionality) {
    functionalityText = ' ' + functionalityText;
  };
  if (objectText !== '' && writeObject) {
    objectText = ' ' + objectText;
  };
  if (conditionText !== '' && writeCondition) {
    conditionText = conditionText + ', ';
  };
  if (binding !== '' && processText !== '' && systemText !== '') {
    $rmf_submitButton.prop('disabled', false);
  }
  requirement = conditionText + systemText + binding + functionalityText + processText + objectText + '.';
  for(let [key, val] of mapTerm){
    var re = new RegExp('\\b' + key + '\\b', "gi");
    requirement = requirement.replace(re, val);
  }
  var size = $rmf_preview.size();
  $rmf_preview[size -1].innerHTML = requirement;

}

/**
 * 
 * @param {boolean} WriteBinding 
 * @param {boolean} writeValue 
 * @param {boolean} writeQualyExpr 
 * @param {boolean} writeCondition 
 */
function rmnfBuildRequirementPreview(WriteBinding = false, writeValue = false, writeQualyExpr = false, writeCondition = false) {
  if (binding !== '' && WriteBinding) {
    binding = ' ' + binding + 'be';
  } else;
  if (valueText !== '' && writeValue) {
    valueText = ' ' + valueText;
  };
  if (qualyExprText !== '' && writeQualyExpr) {
    qualyExprText = ' ' + qualyExprText;
  };
  if (conditionText !== '' && writeCondition) {
    conditionText = conditionText + ', ';
  };
  if (binding !== '' && valueText !== '' && systemText !== '') {
    $rmf_submitButton.prop('disabled', false);
  }
  requirement = conditionText + systemText + binding + qualyExprText + valueText + '.';
  for(let [key, val] of mapTerm){
    var re = new RegExp('\\b' + key + '\\b', "gi");
    requirement = requirement.replace(re, val);
  }
  var size = $rmf_preview.size();
  $rmf_preview[size -1].innerHTML = requirement;
}

/**
 * subscribe to the currently selected artifact
 * if more than one artifact is selected, it does not subscibe to eather
 * @param {boolean} logging logging option, default value is false
 * @returns {void}
 */
function subscribeToArtifact(logging = false) {
  RM.Event.subscribe(RM.Event.ARTIFACT_SELECTED, function (artifact) {
    if (artifact.length !== 0) {
      if (logging) {
        console.log('---------- ARTIFACT SELECTED ------------')
        console.log(artifact) // object containing all meta information
        // console.log(RM.Data.Attributes) // overview of all available standard IBM attributes
      }
      selectedArtifact = artifact;
      getAttributesOfSelectedArtifact(selectedArtifact);
    } else {
      selectedArtifact = null;
    }
  });
}

/**
 * return all attributed of a selected artifact
 * @param {object} selectedArtifact the selected artifact
 * @param {boolean} logging true if you want to debug in the console
 * @returns {void}
 */
function getAttributesOfSelectedArtifact(selectedArtifact, logging = false) {
  RM.Data.getAttributes(selectedArtifact, function (attrResult) {
    if (attrResult.code == RM.OperationResult.OPERATION_OK) {
      if (attrResult.data.length > 1) {
        console.log('more than 1 artifact selected');
      } else {
        selectedArtifactValues = attrResult.data[0].values;
        //--------------------------------------------------------------------------------
        if (logging) {
          console.log(selectedArtifactValues);
        }
        var keys = [];
        for (var key in selectedArtifactValues) {
          keys.push(key);
        }
        RM.Data.getValueRange(selectedArtifact[0], keys, function (valResult) {
          // Retrieve the value range for attributes so that opaque reference
          // objects can be identified and further queried to extract
          // information suitable for display for them.
          if (valResult.code != RM.OperationResult.OPERATION_OK) {
            return;
          }
          for (var i = 0; i < keys.length; i++) {
            // Get and display the information for each attribute in turn.
            var key = valResult.data[i].attributeKey;
            var possibleValues = valResult.data[i].possibleValues;
            var range = valResult.data[i];
            var value = selectedArtifactValues[range.attributeKey];

            if (logging) {
              console.log('---------------------------------')
              console.log('Keys: ' + keys.length)
              console.log('Key: ' + key)
              console.log('possible Values: ' + possibleValues)
              console.log('value: ' + value)
            }

            // Check if it is an opaque reference that we need to retrieve more information about.
            switch (range.valueType) {
              case RM.Data.ValueTypes.INTEGER:
                break;
              case RM.Data.ValueTypes.FLOAT:
                break;
              case RM.Data.ValueTypes.STRING:
                break;
              case RM.Data.ValueTypes.XHTML:
                break;

              case RM.Data.ValueTypes.USER:
                // Retrieve the name of the user for an RM.UserRef instance.
                RM.Data.getUserDetails(value, function (result) {
                  if (result.code != RM.OperationResult.OPERATION_OK) {
                    return;
                  }
                });
                break;

              case RM.Data.ValueTypes.ARTIFACT:
                // Retrieve the name of an artifact for an RM.ArtifactRef isntance
                RM.Data.getAttributes(value, [RM.Data.Attributes.NAME], function (result) {
                  if (result.code != RM.OperationResult.OPERATION_OK) {
                    return;
                  }
                  // console.log(result.data[0].values[RM.Data.Attributes.NAME])
                });
                break;

              default:
                // Otherwise display either the value we have retrieved for it, or a
                // blank entry in the table if it is an attribute the artifact had
                // no value assigned for.
                if (value == null) {
                  value = "";
                }
            }
          }
        });
        //--------------------------------------------------------------------------------
        // selectedArtifactValues = Object.keys(selectedArtifactValues).map((key) => [key, selectedArtifactValues[key]]);
      }
    }
  });
}

/**
 * code snippet to save a new artifact AFTER or BELOW an existing one
 * @param {object} parentRef
 * @param {string} Name
 * @param {boolean} After true if you want to save AFTER an exisiting artifact, false if you want to save BELOW
 * @param {boolean} logging
 * @returns {void}
 */
function createChildArtifact(parentRef, Content, typeValue, After = true, logging = false) {
  if (logging) {
    console.log('---------- ARTIFACT CREATION ------------')
    console.log("parentRef:")
    console.log(parentRef)
  }
  if (After) {
    var strategy = new RM.LocationSpecification(parentRef, RM.Data.PlacementStrategy.AFTER);
  } else {
    var strategy = new RM.LocationSpecification(parentRef, RM.Data.PlacementStrategy.BELOW);
  }
  var attrs = new RM.AttributeValues();
  if (logging) {
    console.log("strategy:")
    console.log(strategy)
  }
  attrs[RM.Data.Attributes.ARTIFACT_TYPE] = 'Requirement';
  // attrs[RM.Data.Attributes.NAME] = Name;
  attrs[RM.Data.Attributes.PRIMARY_TEXT] = Content;
  attrs[RM.Data.Attributes.FORMAT] = 'Text';
  // attrs['Requirement Classification'] = 'Fact non-functional';
  attrs['Requirement Classification'] = typeValue;
  if (logging) {
    console.log("attrs:")
    console.log(attrs)
  }

  RM.Data.Module.createArtifact(attrs, strategy, function (result) {
    if (result.code === RM.OperationResult.OPERATION_OK) {
      artifactLink = result.data.uri;

      // set value for attribute: tag
      setTag();

      console.log("Operation Success");

      // add term into References Term
      for(let [key, val] of referenceTerms){
        console.log('key' + key + "|" + 'val' + val);
        addReferenceTerm(val['url']);
      }

    } else {
      console.log('Creation unsuccessful.');
      console.log(result);
    }
  });
};

/**
 * sets the style of the modal
 * @param {void}
 * @returns {void}
 */
function getModalElements() {
  systemText = '';
  valueText = '';
  qualyExprText = '';
  processText = '';
  objectText = '';
  binding = '';
  functionalityText = '';
  actorText = '';
  conditionText = '';

  $modalOverlay = $(window.top.document).find('#simplemodal-overlay');
  $modalContainer = $(window.top.document).find('#simplemodal-container');
  $rmf_preview = $(window.top.document).find('#rmf_preview');
  $rmf_submitButton = $(window.top.document).find('#rmf_submitButton');
  $rmf_cancelButton = $(window.top.document).find('#rmf_cancelButton');
  $rmf_closeTopRight = $(window.top.document).find('.rmf_closeButton');

}

/**
 * injects css without an css file for chrome and edge
 */
function StyleInjection() {
  $(window.top.document)
  .find('head')
  .append('<style type="text/css">#simplemodal-container a.modalCloseImg {     display: none; }  #rmf_conditionInput {     display: none; }  #rmf_actorInput {     display: none; }  .rmf_container {     padding: 20px; }  .rmf_flex {     display: flex; }  .rmf_img {     object-fit: contain;     margin-left: 5px; }  .rmf_help {     width: 16px;     height: 16px;     cursor: pointer; }  .rmf_table {     box-sizing: border-box; }  .rmf_table:after {     content: "";     display: table;     clear: both; }  .rmf_item3 {     float: left;     width: 33.33%;     box-sizing: border-box;     display: block; }  .rmf_item2 {     float: left;     width: 50%;     box-sizing: border-box;     display: block; }  .rmf_borderBottom {     border-bottom: 1px solid #000; }  .rmf_noMargin {     margin: 0; }  .rmf_heading {     font-size: 20px;     font-weight: bold; }  .rmf_subHeading {     font-size: 12px;     font-weight: bold;     margin-top: auto !important;     margin-bottom: auto !important; }  .rmf_textInput {     box-sizing: border-box;     height: 50px;     width: 100%;     max-width: 100%;     padding: 5px; }  .rmf_content {     margin-top: 10px; }  .rmf_textInputLimiter {     padding-right: 20px; }  .rmf_checkboxOuterContainer {     list-style: none;     display: flex;     flex-wrap: nowrap;     flex-direction: row; }  .rmf_checkboxInnerContainer {     align-items: center;     display: flex;     margin-right: 20px; }  .rmf_checkboxLabel {     vertical-align: middle;     font-size: 12px;     text-align: center;     margin-left: 10px; }  .rmf_footerButton {     flex-grow: 1;     flex-shrink: 1;     flex-basis: 0%; }  .rmf_secondaryButton {     background-color: #393939 !important;     color: white !important;     cursor: pointer !important;     box-sizing: border-box !important;     min-height: 32px !important;     height: 64px !important;     text-align: center !important;     word-wrap: break-word !important;     overflow: hidden !important;     border: solid 3px transparent !important;     border-radius: 0 !important;     margin: 0px !important;     padding: 0px !important;     transition: none !important; }  .rmf_secondaryButton:hover {     background-color: #4c4c4c !important; }  .rmf_primaryButton {     color: white !important;     cursor: pointer !important;     box-sizing: border-box !important;     min-height: 32px !important;     height: 64px !important;     text-align: center !important;     word-wrap: break-word !important;     overflow: hidden !important;     border: solid 3px transparent !important;     border-radius: 0 !important;     margin: 0px !important;     padding: 0px !important;     transition: none !important; }  .rmf_primaryButton:disabled {     cursor: not-allowed !important;     color: #8d8d8d !important;     background-color: #c6c6c6 !important; }  .rmf_primaryButton:not([disabled]) {     color: white !important;     background-color: #0f62fe !important; }  .rmf_primaryButton:not([disabled]):hover {     background-color: #0353e9 !important; }  .rmf_closeButton{     position: absolute !important;     top: 0 !important;     right: 0 !important;     height: 48px !important;     width: 48px !important;     padding: 12px !important;     border: 2px solid transparent !important;     overflow: hidden !important;     cursor: pointer !important;     background-color: initial !important;     transition: background-color 0.11s cubic-bezier(0.2, 0, 0.38, 0.9) !important; }  .rmf_closeButton:hover {     background-color: #e5e5e5 !important; }  .infoGlossary{overflow-y:scroll;height:100px;} #rmf_preview{overflow-y:scroll; height: 100px;} tbody {display: block; max-height:200px;} .nameCell { font-weight: bold; max-height: 50px;min-width: 70px;	appearance: button;	display: inline-block;	color: white;	border: 1px solid black;	background: #0f62fe;	box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);	cursor: pointer;	vertical-align: middle;	max-width: 100px;	padding: 5px;	text-align: center;} .contentCell {  display: block;  overflow-y: scroll;  max-height:50px;} </style>');
}


const stopwords = ['about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are',
	'as', 'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came',
	'can', 'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had', 'he',
	'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'like',
	'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must', 'my', 'never', 'now', 'of', 'on',
	'only', 'or', 'other', 'our', 'out', 'over', 'said', 'same', 'should', 'since', 'some', 'still',
	'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this',
	'those', 'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were', 'what',
	'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i'
];

/**
 * 
 * @param {String[]} tokens 
 * @returns 
 */
 const removeStopwords = function (tokens) {
	if (typeof tokens !== 'object' || typeof stopwords !== 'object') {
		throw new Error('expected Arrays try: removeStopwords(Array[, Array])')
	}
	return tokens.filter(function (value) {
		return stopwords.indexOf(value.trim().toLowerCase()) === -1
	})
}

/**
 * filters stopwords from a given array of strings
 * @param {String} input 
 * @returns filtered string array 
 */
 const handleInput = (input) => {
	input = input.replace(/\n/g, " ");
	const token = input.split(" ");
	var filtered = token.filter(function (value) {
		return value != "";
	});
	filtered = removeStopwords(filtered);
	return filtered;
};

/**
 * 
 * @param {object} config 
 * @param {String} term 
 */
 const getChangeSetsFromArtifact = (config, term) => {
	var settings = {
		"url": origin + "/rm/glossary/termslookup?termMatch=startsWith&oslc.pageSize=20&oslc.pageno=1&format=full&scope=allProjects",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"Content-Type": " application/x-www-form-urlencoded",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		},
		"data": "terms=" + term,
	};
	var results = [];

	$.ajax(settings).done(function (response) {
		// console.log(response);
		table = makeNamedTable();
		var currentElement = response.firstChild.firstElementChild.firstElementChild
		while (currentElement.localName == 'li') {
			let content = {};
			currentArtifact = currentElement.firstElementChild;
			content['url'] = currentArtifact.attributes[0].value;
			for (let item of currentArtifact.children) {
				switch (item.localName) {
					case 'matchedGlossaryTerms':
						try {
							var el = item.firstElementChild;
							content['glossary_term'] = el.textContent;
						} catch (err) {};
						break;
					case 'primaryGlossaryTerm':
						try {
							content['glossary_term'] = item.textContent;
						} catch (err) {};
						break;
					case 'PrimaryText':
						var el = item.firstElementChild;
						content['primary_txt'] = el.textContent;
						break;
					default:
						break;
				};
			};
			results.push(content);
      referenceTerms.set(content['glossary_term'], content);
			currentElement = currentElement.nextElementSibling;
		};
		results.forEach(el => {
			addTableRows(term, [el['glossary_term'], el['primary_txt']], el['url'], table, ['nameCell', 'contentCell'])
		});
		if (results.length) {
			$(window.top.document).find("#glossary").append(table);
			table.before(makeHeadeing(term));
		} else {
			$(window.top.document).find("#glossary").append(makeHeadeing("No result for: " + term));
		}

    $(window.top.document).find("#glossary").scrollTop(1000000000);
		// globalResults.push(results);
		$('.nameCell').off();
	});
}

/**
 * constructs a HTML h2 element from a string
 * @param {String} text 
 * @returns h2 html element
 */
 const makeHeadeing = (text) => {
	var heading = $("<h2>").text(text);
	return heading;
}

/**
 * constructs a HTML table element
 * @returns table HTML element
 */
 const makeNamedTable = () => {
	var table = $("<table>");
	return table;
};

/**
 * creates a new row in a given table HTML element with given classes and links the first column to a glossary element
 * @param {String} term 
 * @param {String[]} values 
 * @param {String} url 
 * @param {object} table 
 * @param {String[]} classes 
 */
 const addTableRows = (term, values, url, table, classes) => {
	var row = $('<tr>');
	var nameDiv = $('<div>');
	var nameTd = $('<td>');

	row.append(nameTd.append(nameDiv.attr('class', classes[0]).text(values[0])));

	nameTd.click(function () {
		targetArtifact = url;
		// link(term, values[0]);
    attachHyberLink(values[0]);
	})

	row.append($('<td>').append($('<div>').attr('class', classes[1]).text(values[1])));

	table.append(row);
};


// lookup and display
function lookupTerm(event){
  if(event.keyCode == 32){
    var token = handleInput(event.target.value);
    if(token.length > 0){
      var currentWord = token[token.length - 1].toLowerCase().trim();
      if (alreadyCheckedWords.includes(currentWord) == false) {
        alreadyCheckedWords.push(currentWord);
        getChangeSetsFromArtifact(config.globalConfigurationUri, currentWord);
      }
    }
  }
}

/**
 * HTTP request often used by IBM JAZZ
 */
 const rmIndexing = () => {
	var settings = {
		"url": origin + "/rm/rmIndexing?dojo.preventCache=1632206096470",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config,
			"Accept": " none",
			"Accept-Language": " de-DE",
			// "Accept-Encoding": " gzip, deflate, br",
			"Content-Type": " application/x-www-form-urlencoded",
			"X-Requested-With": " XMLHttpRequest",
			// "Connection": " keep-alive",
		}
	};
	$.ajax(settings).done(function (response) {
    console.log(response);
  });
}



const attachHyberLink = (value) => {
  rdm = Math.random().toString().slice(2);

  $txtarea = $(window.top.document).find('#rmf_preview');
  var size = $txtarea.size();
  temp = $txtarea[size - 1].innerHTML;
  var re = new RegExp('\\b' + value + '\\b', "gi");
  var li = '<a id="_' + rdm + '"href="' + targetArtifact + '">' + value + '</a>';
  mapTerm.set(value, li);
  temp = temp.replace(re, li);
  requirement = requirement.replace(re, li);
  $txtarea[size - 1].innerHTML = temp;
}


/**
 * maybe we dont need to use this function for Requirement Formulator
 * @param {String} term 
 * @param {String} value 
 */
 const link = (term, value) => {

	rdm = Math.random().toString().slice(2);

	var data = '<rdf:RDF xmlns:rm="http://www.ibm.com/xmlns/rdm/rdf/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
					<rm:Link rdf:about="">\
					<rdf:subject rdf:resource="' + selectedArtifact[0].uri + '"/>\
					<rdf:object rdf:resource="' + targetArtifact + '"/>\
					<rdf:predicate rdf:resource="http://www.ibm.com/xmlns/rdm/types/ArtifactTermReferenceLink"/>\
					<rm:suspectSubjectCleared/>\
					<rm:suspectObjectCleared/>\
					<rdf:type rdf:resource="http://www.ibm.com/xmlns/rdm/rdf/Link"/>\
					<rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#string"></rdf:value>\
					<rm:subjectElementId>_' + rdm + '</rm:subjectElementId>\
					<rm:subjectElementLabel>Term Reference</rm:subjectElementLabel>\
				</rm:Link>\
			</rdf:RDF>'

	var settings = {
		"url": origin + "/rm/links",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config.globalConfigurationUri,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"net.jazz.jfs.owning-context": selectedArtifact[0].componentUri,
			"Content-Type": "application/rdf+xml",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		},
		"data": data,
	};
	$.ajax(settings).done(function (response) {
		$txtarea = $(window.top.document).find('#rmf_preview');
		var size = $txtarea.size();
		temp = $txtarea[size - 1].innerHTML;
		var re = new RegExp('\\b' + value + '\\b', "gi");
		var li = '<a id="_' + rdm + '"href="' + targetArtifact + '">' + value + '</a>';
    mapTerm.set(value, li);
		temp = temp.replace(re, li);
    requirement = requirement.replace(re, li);
		$txtarea[size - 1].innerHTML = temp;
		// rmIndexing();
	});
}

// term is hyber-link glossary term
const addReferenceTerm = (term) => {
  rdm = Math.random().toString().slice(2);
  var data = '<rdf:RDF xmlns:rm="http://www.ibm.com/xmlns/rdm/rdf/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
    <rm:Link rdf:about="">\
    <rdf:subject rdf:resource="' + artifactLink + '"/>\
    <rdf:object rdf:resource="' + term + '"/>\
    <rdf:predicate rdf:resource="http://www.ibm.com/xmlns/rdm/types/ArtifactTermReferenceLink"/>\
    <rm:suspectSubjectCleared/>\
    <rm:suspectObjectCleared/>\
    <rdf:type rdf:resource="http://www.ibm.com/xmlns/rdm/rdf/Link"/>\
    <rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#string"></rdf:value>\
    <rm:subjectElementId>_' + rdm + '</rm:subjectElementId>\
    <rm:subjectElementLabel>Term Reference</rm:subjectElementLabel>\
  </rm:Link>\
  </rdf:RDF>';

  var settings = {
		"url": origin + "/rm/links",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config.globalConfigurationUri,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"net.jazz.jfs.owning-context": selectedArtifact[0].componentUri,
			"Content-Type": "application/rdf+xml",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		},
		"data": data,
	};
  $.ajax(settings).done(function (response) {
    // do something
    console.log("addReferenceTerm done");
	});
}




const resourceContext = () => {
  var setting = {
    "url": origin + "/rm/tags?resourceContext=" + componentUri,
    "method": "GET",
    "headers":{
      "Accept": "none",
      "Content-Type": "text/plain",
      "oslc.configuration": globalConfigurationUri,
      "DoorsRP-Request-Type": "private"
    }
  }
  $.ajax(setting).done(function(response){
    // console.log('resourceContext');
    // console.log(response);
    // showResult(response, '//rdf:RDF');
    showResult(response, '//rdf:RDF/ns:tag');
  });
}

const showResult = (xmlDoc, path) => {
  var nodes = xmlDoc.evaluate(path, xmlDoc, function(prefix){
    return getNameSpaceDefine(prefix);
  }, XPathResult.ANY_TYPE, null);

  var result = nodes.iterateNext();
  // console.log("==== showResult ===");
  while(result){
    // console.log(result);
    //get tag link
    // console.log("tag link" + result.attributes[1].nodeValue);
    // get tag name
    // console.log("tag name" + result.childNodes[0].textContent);

    if("requirementformulator" == result.childNodes[0].textContent){
      tagLink = result.attributes[1].nodeValue;
      break;
    }
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

const setTag = () => {
  let start = artifactLink.indexOf('BI');
  let shortArtifactLink = artifactLink.substring(start);

  var data = `<?xml version="1.0" encoding="UTF-8"?>
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <ns:taggedResources xmlns:ns="http://com.ibm.rdm/navigation#" rdf:about="">
  <ns:taggedResource rdf:resource="../resources/${shortArtifactLink}" xmlns:ns="http://com.ibm.rdm/navigation#"/>
  </ns:taggedResources>
  </rdf:RDF>`;

  var setting = {
    "url": tagLink + "?taggedResources",
    "method": "POST",
    "headers": {
      "Accept": "none",
      "Content-Type": "text/plain",
      "oslc.configuration": globalConfigurationUri,
      "DoorsRP-Request-Type": "private",
      "net.jazz.jfs.owning-context": componentUri
    },
    "data": data
  };

  $.ajax(setting).done(function(response){
    // console.log(response);
    // rmIndexing();
    // refesh();
  });
}

const refesh = () => {
  var setting = {
    "url": "https://rb-ubk-clm-04.de.bosch.com:9443/rm/configurationResolutionService?componentUri="+ componentUri + "&configurationUri=" + globalConfigurationUri+ "&dojo.preventCache=1669610104573",
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "oslc.configuration": globalConfigurationUri
    }
  }
  $.ajax(setting).done(function(response){
    console.log("== refesh ==");
    console.log(response);
  });
}