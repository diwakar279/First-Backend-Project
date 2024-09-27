# Multer

***Multer*** is a node.js middleware for handling multipart/form-data, which is primarily **_used for uploading files._**

 It is written on top of busboy for maximum efficiency.

 Method used for this project- 
 
 > ***DiskStorage :*** The disk storage engine gives you full control on storing files to disk.

 > This is method is used in _./middlewares/multer.middleware.js_

Syntax:
```
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
```