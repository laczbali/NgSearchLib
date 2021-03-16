# Angular library publishing to npm
1. Generate project with `ng new [projname]`
2. Generate library with `ng g library [libname]`
3. Implement
4. Build `ng build [libname]`
5. Set up import
   1. Create `index.ts` in `projects\[libname]\src`, with the content: `export * from './public-api';`
   2. Add the following to `tsconfig.json\compilerOptions`:
   ```json
   "paths": {
      "[libname]": ["projects/[libname]/src"],
      "[libname]/*": ["projects/[libname]/src/*"]
    }
   ```
   3. Add the following to `tsconfig.app.json\compilerOptions`:
   ```json
   "baseUrl": "./",
   "paths": {
      "[libname]": ["projects/[libname]/src"],
      "[libname]/*": ["projects/[libname]/src/*"]
    }
   ```
   4. Add the following to `tsconfig.app.json`:
   ```json
   "exclude": [
    "test.ts",
    "**/*.spec.ts"
   ]
   ```
   5. Import in Tester app (add the lib **module** to the imports in `app.module` from **projcets**)
6. **Run the app with `ng serve`**
7. **Publish**
   1. Increment version number in `package.json`
   2. Build in prod mode `ng build [libname] --prod`
   3. `cd` to `dist\[libname]`
   4. Verify login with `npm whoami`
   5. Publish with `npm publish`