import path from "path";

export default (env) => {
  const webpackConfigPath = path.resolve(__dirname, 'config', `${env}.webpack.config.babel.js`);
  const webpackConfig = require(webpackConfigPath).default(env);
  return webpackConfig;
};
