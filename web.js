var todd = todd || {}
todd.fileServer = todd.fileServer || {}

var WEB = require('http')
var FS = require('fs')
var PATH = require('path')

var WEBROOT = "./webroot"

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
         todd.fileServer.serveFile(url, path, res)
      } else {
         console.log('HTTP 404 ' + url)
         res.writeHead(404)
         res.end()
      }
   })
}

todd.fileServer.serveFile = function (url, path, res) {
   console.log('HTTP 200 ' + url)

   FS.stat(path, function(err, stats) {
      res.writeHead(200, {
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
   console.log(extension + ' => ' + contentType)
   return contentType
}
