//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

const importDynamicCode = async () => {
  const a = './dyn-code.js';
  return import(a);
};

module.exports = async (/** @type {string} */ phase) => {
  // This is a workaround to avoid running the dynamic code during the build phase.
  // to prevent the configurations from being executed before the dependency task
  // is executed.
  // if (
  //   process.env.NEXT_DEPLOYMENT_ID === undefined && // build
  //   process.env.__NEXT_PROCESSED_ENV === undefined // development
  // ) {
  //   /** @type {import("next").NextConfig} */
  //   const r = {};
  //   return r;
  // }
  await importDynamicCode();
  return composePlugins(...plugins)(nextConfig)(phase);
};
