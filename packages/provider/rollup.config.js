const path = require("path");
const babel = require("rollup-plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const uglify = require("rollup-plugin-uglify").uglify;
const merge = require("lodash.merge");
const pkg = require("./package.json");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");

const extensions = [".js", ".ts"];

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

// 打包任务的个性化配置
const jobs = {
  esm: {
    output: {
      format: "esm",
      file: resolve(pkg.module),
    },
  },
};

const workerJobs = {
  esm: {
    output: {
      format: "esm",
      file: "dist/worker.js",
    },
  },
};

// 从环境变量获取打包特征
const mergeConfig = jobs[process.env.FORMAT || "esm"];
const workerMergeConfig = workerJobs[process.env.FORMAT || "esm"];

module.exports = [
  {
    input: "src/index.ts",
    output: {},
    plugins: [
      peerDepsExternal(),
      // nodeResolve({
      //   extensions,
      //   modulesOnly: true,
      // }),
      babel({
        exclude: "node_modules/**",
        extensions,
      }),
    ],
    external: ["@ethereumjs/common", "ethers"],
    ...mergeConfig,
  },

  {
    input: "src/worker.ts",
    output: {},
    plugins: [
      peerDepsExternal(),
      // nodeResolve({
      //   extensions,
      //   modulesOnly: true,
      // }),
      babel({
        exclude: "node_modules/**",
        extensions,
      }),
    ],
    external: ["@remix-project/remix-simulator"],
    ...workerMergeConfig,
  },
];
