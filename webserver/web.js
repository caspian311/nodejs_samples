var webserver = webserver || {}

var WEB = require('http')
var FS = require('fs')
var PATH = require('path')

var WEBROOT = "./webroot"
var ERRORS = "./errors"
var MIME_TYPES = {
   default: 'text/plain',
   html: 'text/html',
   js: 'application/javascript',
   css: 'text/css',
   gif: 'image/gif',
   jpg: 'image/jpeg',
   png: 'image/png',
}

WEB.createServer(function(req, res) {
   webserver.handleFileRequest(req.url, res)
}).listen(1337, '127.0.0.1')
console.log('Web server started..')

webserver.handleFileRequest = function (url, res) {
   var path = WEBROOT + url
   if (url == '/') {
      path = WEBROOT + '/index.html'
   }

   PATH.exists(path, function(exists) {
      if (exists) {
         webserver.serveFile(url, path, res, 200)
      } else {
         webserver.serveFile(url, ERRORS + '/404.html' , res, 404)
      }
   })
}

webserver.serveFile = function (url, path, res, responseCode) {
   console.log('HTTP ' + responseCode + ' ' + url)

   FS.stat(path, function(err, stats) {
      res.writeHead(responseCode, {
         'Content-type': webserver.mimeType(path),
         'Content-length': stats.size
      })
      FS.createReadStream(path).pipe(res)
   })
}

webserver.mimeType = function(path) {
   var extension = path.substring(path.lastIndexOf('.') + 1)
   var contentType = MIME_TYPES[extension]
   if (!contentType) {
      contentType = MIME_TYPES['default']
   }
   return contentType
}
