# Angular library publishing to npm
1. Generate project with `ng new [projname]`
2. Generate library with `ng g library [libname]`
3. Implement
4. Build `ng build [libname]`
5. Import in sample app (add the lib **module** to the imports in `app.module`, just as any other)
6. Link to sample app (to allow `--watch`)
   1. `cd` to `dist\[libname]`
   2. Run `npm link`
   3. `cd` to `root`
   4. Run `npm link`
7. Run in `--watch` mode
   1. Run the library with `ng build [libname] --watch`
   2. Run the sample app with `ng serve`
8. Publish
   1. Increment version number in `package.json`
   2. Build in prod mode `ng build [libname] --prod`
   3. `cd` to `dist\[libname]`
   4. Verify login with `npm whoami`
   5. Publish with `npm publish`