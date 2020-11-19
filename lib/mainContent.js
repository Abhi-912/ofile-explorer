//require node modules
const fs = require('fs');
const path = require('path');

//require files
const calculateSizeD = require('./calculateSizeD.js');
const calculateSizeF = require('./calculateSizeF.js');

const buildMainContent = (fullstaticPath, pathname) => {
    let mainContent = '';
    let items;
    //loop through the elements inside the folder
    try{
    items = fs.readdirSync(fullstaticPath);
    //console.log(items);
    }catch(err) {
      console.log(`readdirSync error : ${err}`);
    }

    //remove .DS_store
    items = items.filter(element => element !== '.DS_Store');

    //home directory remove project_files
    if(pathname ==='/') {
      items = items.filter(element => element !== 'Project_files');
    }
    //Get the following elements for each line
    items.forEach(item => {
     //store itme details in an object to avoid block scoping error as we had to defien
     //everytime new elements
     let itemdetails = {};

     //name
     itemdetails.name = item;
      //link
      const link = path.join(pathname, item);

      //icon
      //get stats of the items
      const itemFullstaticpath = path.join(fullstaticPath, item);
      try{
        itemdetails.stats = fs.statSync(itemFullstaticpath);
      }catch(err){
        console.log(`statsync error : ${err}`);
      }

      if(itemdetails.stats.isDirectory()) {
         itemdetails.icon = `<ion-icon name = "folder"></ion-icon>`;

         [itemdetails.size, itemdetails.sizeBytes] = calculateSizeD(itemFullstaticpath);
      }
      else if(itemdetails.stats.isFile()) {
         itemdetails.icon = `<ion-icon name="document"></ion-icon>`;

         [itemdetails.size, itemdetails.sizeBytes] = calculateSizeF(itemdetails.stats);
       
       }

       //When file was last changed..(unix timestamp)
       itemdetails.timeStamp = parseInt(itemdetails.stats.mtimeMs);

       //convert timestamps to a date
       itemdetails.date = new Date(itemdetails.timeStamp);

       itemdetails.date = itemdetails.date.toLocaleString();

mainContent +=  `
<tr data-name = "${itemdetails.name}" data-size = "${itemdetails.sizeBytes}" data-time = "${itemdetails.timeStamp}"> 
<td>${itemdetails.icon}<a href = "${link}" target = '${itemdetails.stats.isFile() ? "blank" : ""}'>${item}</a></td>
<td>${itemdetails.size}</td>
<td>${itemdetails.date}</td>
</tr>`;
}) ;
    

    //name
    //icon
    //link to the item
    //size
    //last modified

    return mainContent;
};




module.exports = buildMainContent;