#!/usr/bin/env node

const readline = require("readline");
const http = require("http");

const DELAY = 50;

let counter = 0;
let pending = 0;

const checkPackage = (name, index) =>
  setTimeout(
    () =>
      http
        .request(
          {
            method: "HEAD",
            host: "registry.npmjs.org",
            path: `/${name}/latest`
          },
          ({ statusCode }) => {
            pending--;
            if (index % (1000 / DELAY) === 0) {
              process.stderr.write(".");
            }
            if (statusCode === 404) {
              process.stdout.write(`${name}\n`);
            }
            if (pending === 0) {
              process.stderr.write("\nDone!\n");
            }
          }
        )
        .end(),
    index * DELAY
  );

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  .on("line", line => {
    pending++;
    checkPackage(line.toLowerCase(), counter++);
  });
