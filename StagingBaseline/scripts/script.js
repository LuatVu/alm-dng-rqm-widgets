const fs = require("fs");
const path = require("path");

// TODO: insert correct title in xml
const xml1 =
  '<?xml version="1.0" encoding="UTF-8" ?> <!--  Licensed Materials - Property of IBM  attr-links-ext.xml © Copyright IBM Corporation 2013  U.S. Government Users Restricted Rights:  Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp. --> <Module specificationVersion="2.0"><Content type="html"> 	<![CDATA[';
const xml2 =
  ']]></Content> <ModulePrefs title="Staging Baseline" scrolling="true"> <Optional feature="com.ibm.rdm.rm.api"/> <Require feature="dynamic-height"/> <Optional feature="setprefs"/> </ModulePrefs></Module>';

try {
  const file = fs.writeFileSync(
    path.resolve(__dirname, "../build/index.xml"),
    xml1
  );
  // file written successfully
} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync(
    path.resolve(__dirname, "../build/index.html"),
    "utf8"
  );
  fs.appendFileSync(
    path.resolve(__dirname, "../build/index.xml"),
    data,
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  fs.appendFileSync(
    path.resolve(__dirname, "../build/index.xml"),
    xml2,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Created the xml");
    }
  );
} catch (err) {
  console.error(err);
}
