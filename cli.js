#!/usr/bin/env node
const shelljs = require("shelljs");
const colors = require("colors");
const open = require("open");

const args = process.argv;
const goToBranch = args[2] === "branch" || args[2] === "b";

shelljs.exec(
  "git remote -v",
  { silent: true },
  function (code, stdout, stderr) {
    if (code !== 0) {
      console.log(colors.red(stderr.trim()));
      return;
    }

    if (stdout.trim() === "") {
      console.log(colors.red("当前目录没有绑定 remote git 仓库"));
      return;
    }

    // str e.g.
    // origin	git@github.com:demo-space/third-party-cookie-check.git (fetch)
    // origin	git@code.byted.org:cloud-fe/onesite.git (fetch)
    // origin	git@github.com:lessfish/jsj.git (fetch)
    const str = stdout.split("\n")[0];

    const p = /git@(.*):(.*)\/(.*)\.git/;
    const res = p.exec(str);
    // e.g.
    // https://github.com/lessfish/jsj
    // res[1] = 'github.com'
    // res[2] = 'lessfish'
    // res[3] = 'jsj'
    // ----------
    // e.g.
    // https://code.byted.org/cloud-fe/onesite
    // res[1] = 'code.byted.org'
    // res[2] = 'cloud-fe'
    // res[3] = 'onesite'
    // ----------
    const url = `https://${res[1]}/${res[2]}/${res[3]}`;

    if (!goToBranch) {
      return open(url);
    }

    // go to branch
    shelljs.exec(
      "git symbolic-ref --short HEAD",
      { silent: true },
      function (code, stdout, stderr) {
        if (code !== 0) {
          console.log(colors.red(stderr));
          return;
        }

        open(`${url}/tree/${stdout.trim()}`);
      }
    );
  }
);
