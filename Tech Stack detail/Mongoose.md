# Introduction to Mongoose

 There are 3 mandatory line which we always going to write in any file  

```
 1. import mongoose from "mongoose"

 2. const <demoName> = new mongoose.Schema({})

 3. export const Demo = mongoose.model("Name" , <demonName>)
```

# Breakdown-of-Above-3 Lines 

  1. First import mongoose
  2. Creating **Schema** from method **Schema**  using _new_ keyword from mongoose and stored that in a variable.

     Schema contains only object .

  3. Exporting any variable contain **model**  that **model**  method takes [ _model-Name-as-per-wish_ , _Schema-Name (2Line)_ ]

# Important - 
- model Name (Line3) becomes _plural , Lowercase_ and add ('s') at last in Database side

- e.g.-> If model Name is **DEMO**  becomes **demos** in Database

- Here Schema ( { } ) Line 2 method takes object

- While at the same time model ( ) takes 2 parameter 
  
   1. Model Name
   2. Name of the schema


