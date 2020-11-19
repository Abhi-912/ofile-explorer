//require node modules
const url=require('url');
const path = require('path');
const fs = require('fs');
//file imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildmainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

//Staticbasepath : location of your static folder
const Staticbasepath = path.join(__dirname, '..', 'static');

//respond to request
const respond=(request,response) =>{
	// response.write('respond fired:');

//before working with the pathname,we need to decode it
let pathname = url.parse(request.url, true).pathname;

if(pathname === '/favicon.ico'){
	return false;
}

pathname = decodeURIComponent(pathname);

//get the corresponding full static path located in the static folder
const fullstaticpath = path.join(Staticbasepath, pathname);

//File not found
if(!fs.existsSync(fullstaticpath)) {
	console.log('fullstaticpath does not exist');
	response.write('404 : File not found');
}
else {
	console.log('File is found');
	// response.write("file is found");
    }
//We found something
//Is it a file or directory
let stats;
stats = fs.lstatSync(fullstaticpath, options = {bigint: false});

//It is a directory
if(stats.isDirectory()){
// response.write(stats.isDirectory().toString());
//get content from the template index.html
let data = fs.readFileSync(path.join(Staticbasepath, 'Project_files/index.html'), 'UTF-8');

//build the page title
//console.log(pathname);
let pathElements = pathname.split('/').reverse();
pathElements = pathElements.filter(element =>element !== '');
let foldername = pathElements[0];
if(foldername === undefined) foldername = 'Home';
//console.log(foldername);
data = data.replace('page_title', foldername);

//build breadcrumb
const breadcrumb = buildBreadcrumb(pathname);
data = data.replace('pathname', breadcrumb);

//build the maincontent
const mainContent = buildmainContent(fullstaticpath, pathname);
data = data.replace('mainContent', mainContent);


response.writeHead(200,{"Content-Type" : "text/html"});
response.write(data);
return response.end(); //This means our code is ending here
}

//Is not a directory not a file either
//Send 401 : Access denied
if(!stats.isFile()) {
	response.statusCode = 401;
	response.write('401 : Access denied:');
	response.end();
}
//It is a file
//Getting the file extension
let filedetails = {};
filedetails.extname = path.extname(fullstaticpath);

//file size
    let stat;
    try{
        stat = fs.statSync(fullstaticpath);
    }catch(err){
        console.log(`error: ${err}`);
    }
    filedetails.size = stat.size;

//get the filemime type and add to the file response header
getMimeType(filedetails.extname).then(mime =>{
     //stores headers here
     let head = {};
     let options = {};

     //response status code
     let statusCode = 200;

     //Set "Content-type" for all file types
     head['Content-Type'] = mime;

     //pdffile? ->display in browser
     if(filedetails.extname === '.pdf'){
     	head['Content-Disposition'] = 'inline';
     	//head['Content-Disposition'] = 'attachment;filename=file.pdf';
     }

     //audio and video files...stream in ranges
     if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            //header
            head['Accept-Ranges'] = 'bytes';

            const range = request.headers.range;
            //console.log(`range: ${range}`);
            if(range){
                
                const start_end = range.replace(/bytes=/, "").split('-');
                const start = parseInt(start_end[0]);
                const end = start_end[1]
                ? parseInt(start_end[1])
                : filedetails.size - 1;
                //0 ... last byte
                
                //headers
                //Content-Range
                head['Content-Range'] = `bytes ${start}-${end}/${filedetails.size}`;
                //Content-Length
                head['Content-Length'] = end - start + 1;
                statusCode = 206;
                
                //options
                options = {start, end};
            }
        }

     //Streaming method
     const filestream = fs.createReadStream(fullstaticpath, options);

     //stream chunks to your response object
     response.writeHead(statusCode, head);
      filestream.pipe(response);

      //events
      filestream.on('close', () => {
        return response.end();
      });
      filestream.on('error', error => {
         response.statusCode = 404;
        response.write(`404 : File Handling error`);
        console.log(error.code);
        return response.end();
      });
})
.catch(err => {
	response.statusCode = 500;
	response.write('500: Internal Server error:');
	console.log(`Promise error: ${err}`);
	return response.end();
})

//Getting the mime type and adding it to the response heaader
getMimeType(filedetails.extname);
}

//export function
module.exports=respond;
