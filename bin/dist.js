const fs = require('fs');

try { fs.mkdirSync('./dist'); } catch (err) {}

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


var outFile = './dist/'+pjson.grcrtdata.file+'.user.js';
var metaFile = './meta/'+pjson.grcrtdata.file+'.meta.js'; 
var metaDist = './dist/'+pjson.grcrtdata.file+'.meta.js'; 

try {
  fs.unlinkSync(outFile);
  console.log(outFile+' successfully deleted');
} catch (err) {}

function write2file(fileNameIn, fileNameOut, append){
  var data = fs.readFileSync(fileNameIn, 'utf8');
  var result = data.replace(/{GRCRT_VERSION}/g, GRCRT_VERSION).replace(/{GRCRT_NAME}/g, GRCRT_NAME).replace(/{GRCRT_URL}/g, GRCRT_URL).replace(/\r\n/g,'\n');
  if(append){
    fs.appendFileSync(fileNameOut, result+'\n', 'utf8');
  } else {
    fs.writeFileSync(fileNameOut, result+'\n', 'utf8');
  }
}

write2file(metaFile, outFile, false);
write2file('./tmp/_GrepolisReportConverterV2.user.js', outFile, true);
write2file(metaFile, metaDist, false);

try { fs.unlinkSync('./tmp/_GrepolisReportConverterV2.user.js'); } catch (err) {}
try { fs.unlinkSync('./tmp/GrepolisReportConverterV2.user.js');} catch (err) {}
