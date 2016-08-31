# trailmap
Trailmap - A preboot for Trails.js Trailpacks

Trailpacks are amazing little modules that give a Trails App tons of functionality.
However, it can be difficult of them to perform operations outside of a Trails App container. 
Trailmap fixes this problem allowing every Trailpack to have a versatile preboot. 

This means that you can now write your trailpacks with a peboot function.  Trailmap will loop through  all your enabled trailpacks in `config/main.js` and preform the preboot before handing the reigns over to the next step in your execution strategy.

## Why?
There are countless uses cases but here are a few favorites:
* Write Trails App parts in languages like TypeScript or Swift and convert them before runtime
* Perform Gulp, Wepback, etc. tasks before trails starts or at a completely separate time
* Get all the functionality of `npm run script` in a single dependency and standard way

## Examples of usage

Directly from terminal:
```sh
$ trailmap
```

As part of package.json
```js
"scripts": {
    "start": “trailmap && node server.js"
}
```

## Trialpack Example of Preboot function
```js
// TODO
```
