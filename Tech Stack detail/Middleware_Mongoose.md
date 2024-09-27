# Middleware

Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions.

 Middleware is specified on the schema level and is useful for writing plugins.

 ## Types of Middleware

 Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and query middleware.

# Middleware Function

## Use Cases
  Middleware are useful for atomizing model logic. Here are some other ideas:

   - complex validation
   - removing dependent documents (removing a user removes all their blogPost)
   - asynchronous defaults
   - asynchronous tasks that a certain action triggers

## Pre
Pre middleware functions are executed one after another, when each middleware calls next.

> This function is used in _./models/user.model.js


In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await.


If you use next(), the next() call does not stop the rest of the code in your middleware function from executing. 

Use the early return pattern to prevent the rest of your middleware function from running when you call next().

```
const schema = new Schema({ /* ... */ });
schema.pre('save', function(next) {
  if (foo()) {
    console.log('calling next!');
    // `return next();` will make sure the rest of this function doesn't run
  }
  // Unless you comment out the `return` above, 'after next' will print
  console.log('after next');
});
```

## Errors in Pre Hooks
If any pre hook errors out, mongoose will not execute subsequent middleware or the hooked function. 

Mongoose will instead pass an error to the callback and/or reject the returned promise. 

## Post 
post middleware are executed after the hooked method and all of its pre middleware have completed.
