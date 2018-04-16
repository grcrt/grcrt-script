const langsFolder = './langs/';
const fs = require('fs');

var langOneFile = './tmp/GRCRTLangs.js';
var data, result;

try { fs.mkdirSync('./tmp'); } catch (err) {}
// try { fs.mkdirSync('./dist'); } catch (err) {}


try {
  fs.unlinkSync(langOneFile);
  console.log(langOneFile+' successfully deleted');
} catch (err) {}

/* Langs files to one file */
fs.readdirSync(langsFolder).forEach(function(file){
  var data = fs.readFileSync(langsFolder+file, 'utf8')
  var result = "/* "+file+" */\n"+data.replace(/RepConvLangArray/g, 'this');
  fs.appendFileSync(langOneFile, result+'\n', 'utf8');
})

data = fs.readFileSync(langOneFile, 'utf8');
result = 'function _GRCRTRepConvLangArray() {\n'+data+'}';
fs.writeFileSync(langOneFile, result+'\n', 'utf8');
console.log(langOneFile+" created");

var pjson = require('../package.json');
var GRCRT_VERSION = pjson.version;
var GRCRT_NAME=pjson.grcrtdata.name;
var GRCRT_URL=pjson.grcrtdata.host;

try {
  pjson = require('../dev_package.json');
  GRCRT_VERSION = pjson.version;
  GRCRT_NAME=pjson.grcrtdata.name;
  GRCRT_URL=pjson.grcrtdata.host;
} catch (err) {}

var add2main1 = "";
var add2main2 = "";
var add2main3 = "_grcrtAppendScript(\"GRCRTRepConvLangArray\",_GRCRTRepConvLangArray.toString());\n";

const commonFolder = './common/';
var commonOneFile = './tmp/common.js';

try {
  fs.unlinkSync(commonOneFile);
  console.log(commonOneFile+' successfully deleted');
} catch (err) {}

fs.readdirSync(commonFolder).forEach(function(file){
  var modName = file.replace('\.js','');
  add2main1 += "try { "+modName+" = new _"+modName+"() } catch(e) { grcrtErrReporter(e);}\n";
  add2main2 += "try { uw."+modName+" = new _"+modName+"() } catch(e) { grcrtErrReporter(e);}\n";
  add2main3 += "_grcrtAppendScript(\""+modName+"\",_"+modName+".toString());\n";
  data = fs.readFileSync(commonFolder+file, 'utf8');
  result = "/* "+file+" */\n"+data;
  fs.appendFileSync(commonOneFile, result+'\n', 'utf8');
})
console.log(commonOneFile+" created");

const modulesFolder = './modules/';
var modulesOneFile = './tmp/modules.js';

try {
  fs.unlinkSync(modulesOneFile);
  console.log(modulesOneFile+' successfully deleted');
} catch (err) {}

fs.readdirSync(modulesFolder).forEach(function(file){
  var modName = file.replace('\.js','');
  add2main1 += "try { "+modName+" = new _"+modName+"() } catch(e) { grcrtErrReporter(e);}\n";
  add2main2 += "try { uw."+modName+" = new _"+modName+"() } catch(e) { grcrtErrReporter(e);}\n";
  add2main3 += "_grcrtAppendScript(\""+modName+"\",_"+modName+".toString());\n";
  data = fs.readFileSync(modulesFolder+file, 'utf8');
  result = "/* "+file+" */\n"+data;
  fs.appendFileSync(modulesOneFile, result+'\n', 'utf8');
})
console.log(modulesOneFile+" created");

var outFile = './tmp/'+pjson.grcrtdata.file+'.user.js';
var metaFile = './meta/'+pjson.grcrtdata.file+'.meta.js'; 
// var metaDist = './dist/'+pjson.grcrtdata.file+'.meta.js'; 

try {
  fs.unlinkSync(outFile);
  console.log(outFile+' successfully deleted');
} catch (err) {}

function write2file(fileNameIn, fileNameOut, append){
  var data = fs.readFileSync(fileNameIn, 'utf8');
  var result = data
    .replace(/{GRCRT_NAME}/g, GRCRT_NAME)
    .replace(/{GRCRT_URL}/g, GRCRT_URL)
    .replace(/\r\n/g,'\n')
    .replace(/\/\*ADD2MAIN1\*\//g,add2main1)
    .replace(/\/\*ADD2MAIN2\*\//g,add2main2)
    .replace(/\/\*ADD2MAIN3\*\//g,add2main3);
  if(append){
    fs.appendFileSync(fileNameOut, result+'\n', 'utf8');
  } else {
    fs.writeFileSync(fileNameOut, result+'\n', 'utf8');
  }
}

write2file(metaFile, outFile, false);
write2file('GRCRT.f.errReporter.js', outFile, true);
write2file(langOneFile, outFile, true);
write2file(commonOneFile, outFile, true);
write2file(modulesOneFile, outFile, true);
write2file('GRCRTMain.js', outFile, true);
// write2file(metaFile, metaDist, false);

try { fs.unlinkSync(langOneFile); } catch (err) {}
try { fs.unlinkSync(commonOneFile);} catch (err) {}
try { fs.unlinkSync(modulesOneFile);} catch (err) {}
