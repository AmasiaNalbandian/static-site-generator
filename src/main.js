import chalk from "chalk";
import fs, { stat } from "fs";
const fse = require("fs-extra");

// will allow us to recursively convert HTML in a folder once
// This feature will be removed once the recursiveness is functional
let recursiveSearch = 0;
let options = {};

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
          if (recursiveSearch === 0) {
            options.lang.forEach((language) => {
              !fs.existsSync(`./dist/${language}/${args[i].name}`) &&
                fs.mkdirSync(`./dist/${language}/${args[i].name}`, {
                  recursive: true,
                });
            });
          }
          recursiveSearch++;
        } else {
          readFile(args[i].name, args[i].type);
        }
      }
    });
  }
}

// Markdown support function
function parseMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />");

  return htmlText.trim();
}

// Markdown clean function
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

// Handle the dist file:
async function emptyDist() {
  try {
    await fse.emptyDir("./dist/");
  } catch (err) {
    console.error(err);
  }
}

// fn to write HTML format
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
            dataForBody += `<p>${parseMarkdown(line)}</p>\n`;
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

    if (recursiveSearch > 0)
      !fs.existsSync(`./dist/${language}`) &&
        fs.mkdirSync(`./dist/${language}`, { recursive: true });

    fs.writeFile(`dist/${language}/${newname}`, datatoHTML, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // success message after html gets parsed
        console.error(
          "%s",
          chalk.green.bold(
            "HTML Created for " + filename + " in language: " + language
          )
        );
      }
    });
  });
}

// fn to read each file and will handle output of HTML format.
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

export async function readDirectory(directoryPath) {
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

/* driver code to grab arguments received and either 
  1) read the file and convert to html format.
  2) recursively access files in the directory and perform option 1
*/
export async function createHtml(opts) {
  await emptyDist();
  options = opts;
  checkExists(options.directories, false);
  checkExists(options.files, true);
}
