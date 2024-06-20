# Demo

Notice that we have a target called `random-depedency` in the [project.json](apps/next-app/project.json) file. That target
is set as a dependency of the next-app's `build` target:

```terminal
"build": {
    "dependsOn": ["random-dependency"]
}
```

The `random-dependency` only task is to create a javascript file (`dyn-var.js`) as a sibling of the [next.config.js](apps/next-app/next.config.js) file,
to be imported when that file is executed:

```js
const importVars = async () => {
  // @ts-ignore
  return import('./dyn-var.js');
};

module.exports = async (/** @type {string} */ phase) => {
  const { a } = await importVars();
  console.log({ a });
  return composePlugins(...plugins)(nextConfig)(phase);
};
```

This setup works if I use the `@nx/next:build` executor, but it fails if I let Nx infer the executor
from the configuration file.

## Possible workaround

As a workaround, we can check for the presence of `process.env.NEXT_DEPLOYMENT_ID` (for build) or
`process.env.__NEXT_PROCESSED_ENV` (for development), that appear to
be there after the dependencies have been executed.
