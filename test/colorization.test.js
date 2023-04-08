// @ts-check

import assert from "assert";
import * as vscode from "vscode";

import path from "node:path";
import fs from "node:fs";

function assertUnchangedTokens(testFixurePath, done) {
  let fileName = path.basename(testFixurePath);

  return vscode.commands
    .executeCommand("_workbench.captureSyntaxTokens", vscode.Uri.file(testFixurePath))
    .then((data) => {
      try {
        let resultsFolderPath = path.join(
          path.dirname(path.dirname(testFixurePath)),
          "colorize-results"
        );
        if (!fs.existsSync(resultsFolderPath)) {
          fs.mkdirSync(resultsFolderPath);
        }
        let resultPath = path.join(
          resultsFolderPath,
          fileName.replace(".", "_") + ".json"
        );
        if (fs.existsSync(resultPath)) {
          let previousData = JSON.parse(fs.readFileSync(resultPath).toString());
          try {
            assert.deepEqual(data, previousData);
          } catch (e) {
            fs.writeFileSync(resultPath, JSON.stringify(data, null, "\t"), {
              flag: "w",
            });
            if (
              Array.isArray(data) &&
              Array.isArray(previousData) &&
              data.length === previousData.length
            ) {
              for (let i = 0; i < data.length; i++) {
                let d = data[i];
                let p = previousData[i];
                if (d.c !== p.c || hasThemeChange(d.r, p.r)) {
                  throw e;
                }
              }
              // different but no tokenization ot color change: no failure
            } else {
              throw e;
            }
          }
        } else {
          fs.writeFileSync(resultPath, JSON.stringify(data, null, "\t"));
        }
        done();
      } catch (e) {
        done(e);
      }
    }, done);
}

function hasThemeChange(d, p) {
  let keys = Object.keys(d);
  for (let key of keys) {
    if (d[key] !== p[key]) {
      return true;
    }
  }
  return false;
}

suite("colorization", () => {
  let extensionColorizeFixturePath = path.join(__dirname, "colorize-fixtures");
  if (fs.existsSync(extensionColorizeFixturePath)) {
    let fixturesFiles = fs.readdirSync(extensionColorizeFixturePath);
    fixturesFiles.forEach((fixturesFile) => {
      // define a test for each fixture
      test(fixturesFile, function (done) {
        assertUnchangedTokens(
          path.join(extensionColorizeFixturePath, fixturesFile),
          done
        );
      });
    });
  }
});
