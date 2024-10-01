# Tech Stack used in this Project
  + NodeJs
  + Express
  + Dot env
  + Mongoose
  + Mongoose-aggregate-paginate-v2
  + Bcrypt
  + Cloudinary
  + CORS
  + Jsonwebtoken
  + Multer
  + Cookie-Parser

# Setting Project Professionally

1. Create Package.json <npm-init>

2. Add Readme.md file

3. Create **public** folder  
   - Create **temp** folder inside **public** folder

   - Create **.gitkeep** file inside **temp** so that this **public,temp** folder can be push into git

4. Create  **.gitkeep** in the root then  **.gitkeep** will tell which files should not be pushed

5. Create **.env** in the root

6. Create **.env.sample** in the root

7. Create **src** folder
    - Create **_app.js , constants.js , index.js_**
    - Create **_controllers , db , middlewares , models , routes , utils_** folders inside **src** folder

8. Change the type _commonjs_ into _module_

9. Install **nodemon** as dev dependency

10. Install **Prettier** as dev dependency
    - Create ***.prettierrc*** file in root to configure the Prettier code formatter

    - Create ***.prettierignore*** file in root to ignore certain files and folders completely


> [!TIP]
```
 When project should run:
 1.Database connection
 2.Server connection
 3.Routes creation (Check routes using Postman)
```

> [!TIP]
```
How to find error:
1.Use throw or throw new error
2.Use console.log -> to find where our code is not running
3.See for await
```

# Problems & Error

## Error

- Else error
> **Reason :** constructor used inside else statement is outside of scope

> **Solve :** Putting else statement inside the scope

- App is not defined
 > **Reason :** Because not import the express package

> **Solve :** Import the express package & stored in app variable

- querySrv ECONNREFUSED
 > **Reason :** Because of slow network it couldn't connect to database

 > **Solve :** By connecting to good network

- ReferenceError
> **Reason :** I did not call super constructor in derived class "_ApiResponse.js_" before accessing 'this' or returning from derived constructor

> **Solve :** call super constructor in derived class before accessing 'this' 

## Problem

- dot env configuration
> **Reason :** In documentation there is only way to import _.env_ that is from ***commonJs*** , there is no mention of ***moduleJs***

> **Solve :** Use this syntax
```
require('dotenv').config({path:'./env'})
```
OR
```
import dotenv from "dotenv"
dotenv.config({ path:'./env' })

- If u use this syntax then you also have to modify
your script line by experimental line

 "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  }

  ```

  # To Understand Project more Learn this Topics

  1. Node
  ```
 nodeJs Api Error Class (this.data)
 nodeJs (fs) for file handling
 ```
 2. Mongoose
```
middleware mongoose
Aggregation mongoose
Pre & Post method
```
  3. Multer
 ```
 Documentation
 ```

  4. jsonwebtoken : [Documentation](https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
  

  5. npm cors

  6. Server status code & HTTP status code

  7. Link & UnLink in OS 
  
  8. router import & export


