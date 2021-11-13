const { getOptions } = require("../src/config.js");
// const correctFile = require("./helpers/config.json");
// const wrongExtensionFile = require("./helpers/config.md");

function getOptionFn(fileName) {
  return getOptions(fileName);
}

describe("Pass different types of files", function () {
  // Pass an empty file
  it("Passes empty config", function () {
    const emptyFile = "./helpers/config2.json";
    let result = getOptionFn(emptyFile);
    expect(result).toBeNull();
  });

  // Pass a file with wrong extension
  it("Passes a file with wrong extension", function () {
    const wrongExtensionFile = "./helpers/config.md";
    let result = getOptionFn(wrongExtensionFile);
    expect(result).toBeNull();
  });

  // Pass a file with correct config
  // it("Passes a correct config file", function () {
  //   const correctFile = "./helpers/config.json";
  //   let result = getOptionFn(correctFile);

  //   expect(result).toBe({
  //     input: ["text.txt"],
  //     lang: ["en", "fr"],
  //     empty: false,
  //     version: false,
  //     help: false,
  //     files: [],
  //     directories: [],
  //   });
  // });
});
