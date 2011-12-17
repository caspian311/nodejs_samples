var todd = todd || {}
todd.fileServer = todd.fileServer || {}

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
   todd.fileServer.handleFileRequest(req.url, res)
}).listen(1337, '127.0.0.1')
console.log('Web server started..')

todd.fileServer.handleFileRequest = function (url, res) {
   var path = WEBROOT + url
   if (url == '/') {
      path = WEBROOT + '/index.html'
   }

   PATH.exists(path, function(exists) {
      if (exists) {
         todd.fileServer.serveFile(url, path, res, 200)
      } else {
         todd.fileServer.serveFile(url, ERRORS + '/404.html' , res, 404)
      }
   })
}

todd.fileServer.serveFile = function (url, path, res, responseCode) {
   console.log('HTTP ' + responseCode + ' ' + url)

   FS.stat(path, function(err, stats) {
      res.writeHead(responseCode, {
         'Content-type': todd.fileServer.mimeType(path),
         'Content-length': stats.size
      })
      FS.createReadStream(path).pipe(res)
   })
}

todd.fileServer.mimeType = function(path) {
   var extension = path.substring(path.lastIndexOf('.') + 1)
   var contentType = MIME_TYPES[extension]
   if (!contentType) {
      contentType = MIME_TYPES['default']
   }
   return contentType
}
