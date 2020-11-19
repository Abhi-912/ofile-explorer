//require node modules
var fs = require("fs");

const calculateSizeF = stats => {
    
    //size in bytes
    const filesizeBytes = stats.size; //bytes

    //size in human readable format
    const units = "BKMGT";

    const index = Math.floor(Math.log10(filesizeBytes)/3);

    const filesizeHuman = (filesizeBytes/Math.pow(1024,index)).toFixed(1);
    
    const unit = units[index];
   
    filesize = `${filesizeHuman}${unit}`;

    return [filesize, filesizeBytes];
};

module.exports = calculateSizeF;