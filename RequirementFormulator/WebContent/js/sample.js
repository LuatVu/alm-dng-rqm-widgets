/* Helper function for simple output */
function println(string) {
	var p = document.createElement('p');
	p.innerHTML = string;
	$(p).appendTo('#result');
};

/* https://www.intranet.bosch.com/doku/CCPS-ALM/Test/RMformulationSample/sample.xml */
/* Main Operating Function */

$(function () { // this function is run when the document is ready.	
		
	//////////////////////////////////////////////////////////////////
	// subscribe to an artifact when selected
	//////////////////////////////////////////////////////////////////
	RM.Event.subscribe(RM.Event.ARTIFACT_SELECTED, function (artifact) {
		if (artifact.length !== 0) {
			console.log('---------- ARTIFACT SELECTED ------------')
			console.log(artifact) // object containing all meta information
			// console.log(RM.Data.Attributes) // overview of all available standard IBM attributes

			var artName;

			//////////////////////////////////////////////////////////////////
			// code snippet to access a single artifact
			//////////////////////////////////////////////////////////////////
			RM.Data.getAttributes(artifact, function (attrResult) {
				if (attrResult.code == RM.OperationResult.OPERATION_OK) {

					attrResult.data.forEach(function (artAttrs) {
						console.log('FORMAT: ' + artAttrs.values[RM.Data.Attributes.FORMAT])
						console.log('ARTIFACT_TYPE: ' + artAttrs.values[RM.Data.Attributes.ARTIFACT_TYPE])
						artName = artAttrs.values[RM.Data.Attributes.NAME];
						console.log('NAME: ' + artName)
						console.log('CUSTOM ARTIFACT_TYPE: ' + artAttrs.values['Object_Type']) // custom user attribute
					});

					//////////////////////////////////////////////////////////////////
					// code snippet to update the values of an existing artifact
					//////////////////////////////////////////////////////////////////

					var toSave = []; // Store any required attribute changes here
					attrResult.data.forEach(function (item) { // Go through artifact data 
						var current = item.values[RM.Data.Attributes.PRIMARY_TEXT];
						item.values[RM.Data.Attributes.PRIMARY_TEXT] = current + " updated";
						// toSave.push(item); // uncomment to enable update
					});

					RM.Data.setAttributes(toSave, function (result) { // Perform a bulk save for all changed attributes
						if (result.code !== RM.OperationResult.OPERATION_OK) {
							// error handling code here
						}
					});


					//////////////////////////////////////////////////////////////////
					// code snippet that allows the discovery of artifacts that are linked to a given single artifact
					//////////////////////////////////////////////////////////////////
					attrResult.data.forEach(function (item) {
						RM.Data.getLinkedArtifacts(item.ref, function (result) {
							if (result.code !== RM.OperationResult.OPERATION_OK) {
								console.log('error in getLinkedArtifacts')
								return;
							}
							var artLinks = result.data.artifactLinks;
							artLinks.forEach(function (linkDefinition) {
								console.log(linkDefinition.linktype, linkDefinition.targets.length);
							});
						});
					});
				}
			});

			//////////////////////////////////////////////////////////////////
			// code snippet to access a module (only works for modules/ collections)
			//////////////////////////////////////////////////////////////////
			RM.Data.getContentsAttributes(artifact[0], [RM.Data.Attributes.PRIMARY_TEXT], function (result) {
				if (result.code !== RM.OperationResult.OPERATION_OK) {
					console.log('error in getContentAttributes')
					return;
				}

				result.data.forEach(function (item) {
					console.log(item);
				});
			});


			//////////////////////////////////////////////////////////////////
			// code snippet to access a module, but is not a collection (only works for modules)
			//////////////////////////////////////////////////////////////////
			RM.Data.getContentsStructure(artifact[0], function (result) {
				if (result.code !== RM.OperationResult.OPERATION_OK) {
					console.log('error in getContentsStructure')
					return;
				}

				result.data.forEach(function (item) {
					console.log(item);
				});
			});

			// createChildArtifact(artifact[0]); // create a new artifact below the selected one


		} else {
			console.log("artifact empty")
		}
	});

	//////////////////////////////////////////////////////////////////
	// code snippet to save a new artifact AFTER an existing one
	//////////////////////////////////////////////////////////////////
	createChildArtifact = function(parentRef) {
		
		console.log('---------- ARTIFACT CREATION ------------')

		var strategy = new RM.LocationSpecification(parentRef, RM.Data.PlacementStrategy.BELOW);
		var attrs = new RM.AttributeValues();
		var Name = 'new Requirement'

		attrs['Object_Type'] = 'Requirement';
		attrs[RM.Data.Attributes.ARTIFACT_TYPE] = 'Requirement';
		attrs[RM.Data.Attributes.NAME] = Name;
		attrs[RM.Data.Attributes.PRIMARY_TEXT] = Name;
		
		RM.Data.Module.createArtifact(attrs, strategy, function(result) {
			if (result.code === RM.OperationResult.OPERATION_OK) {
				console.log("Operation Success");
			} else {
				console.log('Creation unsuccessful.');
				console.log(result);
			}
		});
	};

		
	//////////////////////////////////////////////////////////////////
	// subscribe to an artifact when opened (includes overview)
	//////////////////////////////////////////////////////////////////
	RM.Event.subscribe(RM.Event.ARTIFACT_OPENED, function (artifact) {
		console.log('---------- ARTIFACT OPENED ------------')
		console.log(artifact)

		//////////////////////////////////////////////////////////////////
		// code snippet to access a single artifact
		//////////////////////////////////////////////////////////////////
		RM.Data.getAttributes(artifact, function (attrResult) {
			if (attrResult.code == RM.OperationResult.OPERATION_OK) {

				attrResult.data.forEach(function (artAttrs) {
					console.log('FORMAT: ' + artAttrs.values[RM.Data.Attributes.FORMAT])
					console.log('ARTIFACT_TYPE: ' + artAttrs.values[RM.Data.Attributes.ARTIFACT_TYPE])
					artName = artAttrs.values[RM.Data.Attributes.NAME];
					console.log('NAME: ' + artName)
					console.log('CUSTOM ARTIFACT_TYPE: ' + artAttrs.values['Object_Type']) // custom user attribute
				});
			}
		});
	});

	//////////////////////////////////////////////////////////////////
	// subscribe to an artifact when saved
	//////////////////////////////////////////////////////////////////
	RM.Event.subscribe(RM.Event.ARTIFACT_SAVED, function (artifact) {
		console.log('---------- ARTIFACT SAVED ------------')
		console.log(artifact)

		//////////////////////////////////////////////////////////////////
		// code snippet to access a single artifact
		//////////////////////////////////////////////////////////////////
		RM.Data.getAttributes(artifact, function (attrResult) {
			if (attrResult.code == RM.OperationResult.OPERATION_OK) {

				attrResult.data.forEach(function (artAttrs) {
					console.log('FORMAT: ' + artAttrs.values[RM.Data.Attributes.FORMAT])
					console.log('ARTIFACT_TYPE: ' + artAttrs.values[RM.Data.Attributes.ARTIFACT_TYPE])
					artName = artAttrs.values[RM.Data.Attributes.NAME];
					console.log('NAME: ' + artName)
					console.log('CUSTOM ARTIFACT_TYPE: ' + artAttrs.values['Object_Type']) // custom user attribute
				});
			}
		});
	});
});