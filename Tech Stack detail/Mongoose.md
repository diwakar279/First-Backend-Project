# Introduction to Mongoose

 There are 3 mandatory line which we always going to write in any file  

```
 1. import mongoose from "mongoose"
 2. const <demoName> = new mongoose.Schema({})
 3. export const Demo = mongoose.model("Name" , <demonName>)
```

# Breakdown Of Above 3 Lines 

  1. First import mongoose
  2. Creating **Schema** from method **Schema**  using _new_ keyword from mongoose and stored that in a variable.

     Schema contains only object .

  3. Exporting any variable contain **model**  that **model**  method takes [ _model-Name-as-per-wish_ , _Schema-Name (2Line)_ ]

# Important  
- model Name (Line3) becomes _plural , Lowercase_ and add ('s') at last in Database side

- e.g.-> If model Name is **DEMO**  becomes **demos** in Database

- Here Schema ( { } ) Line 2 method takes object

- While at the same time model ( ) takes 2 parameter 
  
   1. Model Name
   2. Name of the schema

# Method

> ***Schema :*** used to build schema for more info. see above content
```
This method is used in src/models/user.model.js
& src/models/video.model.js
```

> ***model :*** used to build model using _Schema_ for more info. see above content
```
This method is used in src/models/user.model.js
& src/models/video.model.js
```

> ***methods :*** used to make method inside the model for later use
```
This method is used in src/models/user.model.js
```

> ***pre :***This method run before any event eg.next() 
```
This method is used in src/models/user.model.js
```

> ***findById :*** Finds a single document by its _id field.
```
This method is used in src/controllers/user.controller.js
```

>***select :*** Specifies which document fields to include or exclude.
```
This method is used in src/controllers/user.controller.js
```

>***findByIdAndUpdate :*** Creates a findOneAndUpdate query, filtering by the given _id.
```
This method is used in src/controllers/user.controller.js
```

>***findOne :*** Finds one document.

>***save :***

# Aggregation Pipelines

MongoDB Aggregation Pipelines allows you to perform a sequence of data processing operations on the documents in a collection.

Aggregation pipeline consists of a series of stages, where each stage represents a specific operation or transformation.

Here are some common aggregation pipeline stages that is used in this project-

- **$match :** Filters the documents to pass only the documents that match the specified condition to the next pipeline stage.

- **$project :** Passes along the documents with the requested fields to the next stage in the pipeline.

- **$lookup :** Performs a left outer join with another collection, combining documents from both collections based on a specified condition.

- **$addFields :** Adds new fields to documents

