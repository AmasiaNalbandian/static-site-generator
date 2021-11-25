const { readFile, writeHTML, clearMarkdown } = require("../src/main.js");

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

describe("cleanses all markdown syntax", function () {
  // reads the file
  it("Passes string with markdown for bold using asterisks", function () {
    let result;
    setTimeout(function () {
      clearMarkdown("**This is bold text**").then((r) => {
        result = r;
        expect(r).toEqual("");
      });
    }, 10000);
  });

  // reads the file with text
  it("Passes string with markdown for bold using underscores", function () {
    let result;
    setTimeout(function () {
      clearMarkdown("__This is bold text__").then((r) => {
        result = r;
        expect(r).toEqual("This is bold text");
      });
    }, 10000);
  });
});
