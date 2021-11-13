const { readFile, writeHTML } = require("../src/main.js");

describe("Pass an various txt file to read", function () {
  // reads the file
  it("Passes empty text.txt file", function () {
    const filePath = "./spec/helpers/text.txt";
    setTimeout(function () {
      readFile(filePath, "txt").then((r) => {
        expect(r).toEqual("");
      });
    }, 10000);
  });

  // reads the file with text
  it("Passes file with some text", function () {
    const filePath = "./spec/helpers/textfile.txt";
    setTimeout(function () {
      readFile(filePath, "txt").then((r) => {
        expect(r).toEqual("there is some text in this file!");
      });
    }, 10000);
  });
});

describe("Pass an various txt file to write", function () {
  // reads the file
  it("Passes empty text.txt file", function () {
    const filePath = "./spec/helpers/text.txt";
    let result;
    setTimeout(function () {
      writeHTML("", filePath, "txt").then((r) => {
        result = r;
        expect(r).toEqual("");
      });
    }, 10000);
  });

  // reads the file with text
  it("Passes file with some text", function () {
    const filePath = "./spec/helpers/textfile.txt";
    setTimeout(function () {
      writeHTML("This is some text123", filePath, "txt").then((r) => {
        expect(r).toBeTrue();
      });
    }, 10000);
  });
});
