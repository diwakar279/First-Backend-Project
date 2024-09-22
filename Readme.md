# Setting Project Professionally

1. Create Package.json <npm-init>

2. Add Readme.md file

3. Create [public] folder  
   - Create [temp] folder inside [public] folder
   - Create [.gitkeep] file inside [temp] so that this [public,temp] folder can be push into git

4. Create [.gitignore] in the root & to tell which files should not be pushed

5. Create [.env] in the root

6. Create [.env.sample] in the root

7. Create [src] folder
    - Create [app.js , constants.js , index.js]
    - Create [controllers , db, middlewares, models, routes, utils] folders inside [src] folder

8. Change the type commonjs into module

9. Install nodemon as dev dependency

10. Install Prettier as dev dependency
    - Create [.prettierrc] file to configure the Prettier code formatter
    - Create [.prettierignore] file to ignore certain files and folders completely