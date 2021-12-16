const chalk = require("chalk");
const fs = require("fs");
const fse = require("fs-extra");
const MarkdownIt = require("markdown-it");

// will allow us to recursively convert HTML in a folder once
// This feature will be removed once the recursiveness is functional
let recursiveSearch = false;
let options = {};

/**Create a reference to use markdown-it library to parse markdown
 * to html. This is from the package Markdown-it:
 * https://www.npmjs.com/package/markdown-it
 */
var md = new MarkdownIt();

function checkExists(args, recursive) {
  for (let i = 0; i < args.length; i++) {
    // try to get access to file:
    fs.stat(args[i].name, (err, stats) => {
      if (err) {
        console.error(
          "%s",
          chalk.red.bold(
            "The following file or directory does not exist: " +
              args[i].name +
              "\nPlease check you have provided the correct path"
          )
        );
      } else {
        // if it exists handle whether its a file or directory
        if (stats.isDirectory()) {
          if (!recursiveSearch) {
            options.lang.forEach((language) => {
              !fs.existsSync(`./dist/${language}/${args[i].name}`) &&
                fs.mkdirSync(`./dist/${language}/${args[i].name}`, {
                  recursive: true,
                });
            });
          }
          recursiveSearch = !recursiveSearch;
        } else {
          readFile(args[i].name, args[i].type);
        }
      }
    });
  }
}

/**
 * Function accepts a string which then cleanses all markdown syntax
 * and returns raw text from the string.
 */
function clearMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, "$1")
    .replace(/^## (.*$)/gim, "$1")
    .replace(/^# (.*$)/gim, "$1")
    .replace(/^\> (.*$)/gim, "$1")
    .replace(/\*\*(.*)\*\*/gim, "$1")
    .replace(/\*(.*)\*/gim, "$1")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "$1")
    .replace(/\n$/gim, "$1");

  return htmlText.trim();
}

/**
 * Asynchronous function to empty a directory called dist
 * where the resulting files will be stored. Ensures old files are removed
 * and overwritten with new versions of the same filename.
 */
async function emptyDist() {
  try {
    await fse.emptyDir("./dist/");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Asynchronous function which accepts data, filename and filetype
 * to write HTML in the file.
 */
async function writeHTML(data, filename, filetype) {
  options.lang.forEach((language) => {
    let dataForBody = "";
    let title;
    if (data.length) {
      let linecount = 0;

      let content = data.split("\n");
      content.forEach((line) => {
        if (linecount === 0) {
          title = line;
          if (filetype == "md") {
            title = clearMarkdown(title);
          }
          dataForBody += `<h1>${title}</h1>\n`;
        } else {
          if (filetype == "md") {
            dataForBody += `<p>${md.render(line)}</p>\n`;
          } else {
            dataForBody += `<p>${line}</p>\n`;
          }
        }
        linecount++;
      });
    }

    let datatoHTML = `<!doctype html>
  <html lang="${language}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  </head>
  <body>\n${dataForBody}</body>
  </html>
  `;
    const newname = filename.replace(/\.[^/.]+$/, ".html");

    if (!fs.existsSync(`./dist/${language}`)) {
      fs.mkdirSync(`./dist/${language}`, { recursive: true });
    }

    fs.writeFile(`dist/${language}/${newname}`, datatoHTML, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // success message after html gets parsed
        console.log(
          "%s",
          chalk.green.bold(
            "HTML Created for " + filename + " in language: " + language
          )
        );
        return datatoHTML;
      }
    });
    return false;
  });
}

/**
 * Asynchronous function to read files which are passed. If no errors are found,
 * the function redirects the information to the writeHTML function.
 */
async function readFile(filePath, fileType) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // create html file in dist
      writeHTML(data, filePath, fileType);
    }
  });
}

/**
 * Asynchronous function accepts a path for a directory to read each file
 * to successfully create the an HTML document, and place the HTML documents
 * in their corresponding directory path within the dist directory.
 */
async function readDirectory(directoryPath) {
  let files = [];
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      let newpath = "./" + directoryPath + file;
      files.push(newpath);

      // reads the inside of directory
      fs.stat(newpath, (err, stats) => {
        if (err) {
          console.error(
            "%s",
            chalk.red.bold(
              "The following file or directory does not exist: " +
                args[i] +
                "\nPlease check you have provided the correct path"
            )
          );
        } else {
          if (stats.isFile()) {
            // files.push(newpath);
          } else {
            console.log("Directory found within the directory.");
          }
        }
      });
    });
  });
}

/**
 * Driver code to parse arguments received from the CLI and either
 * 1) Recursively access a directory, and then;
 * 2) Read each file and covert them to HTML Format.
 */
async function createHtml(opts) {
  await emptyDist();
  options = opts;
  checkExists(options.directories, false);
  checkExists(options.files, true);
}

module.exports.readDirectory = readDirectory;
module.exports.createHtml = createHtml;
module.exports.readFile = readFile;
module.exports.writeHTML = writeHTML;
module.exports.clearMarkdown = clearMarkdown;
