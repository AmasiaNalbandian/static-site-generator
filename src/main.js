import chalk from "chalk";
import fs from "fs";
import path from "path";


const fse = require('fs-extra')

let recursiveSearch = 0;

function filterArguments(args) {
  for (let i = 0; i < args.length; i++) {
    // try to get access to file:
    fs.stat(args[i], (err, stats) => {
      if (err) {
        console.error(
          "%s",
          chalk.red.bold(
            "The following file or directory does not exist: " + args[i] + "\nPlease check you have provided the correct path"
          ),
        );
      } else {
        // if it exists handle whether its a file or directory
        if (stats.isDirectory()) {
          if (recursiveSearch === 0) {
            !fs.existsSync(`./dist/${args[i]}`) && fs.mkdirSync(`./dist/${args[i]}`, { recursive: true })
            readDirectory(args[i])
          }
          recursiveSearch++;
        } else {
          readFile(args[i])
        }
      }
    });

  }
}


// Handle the dist file:
async function emptyDist () {
  try {
    await fse.emptyDir('./dist/')
  } catch (err) {
    console.error(err)
  }
}

// fn to write HTML format 
async function writeHTML(data, filename) {
  
  let datatoHTML = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Filename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>\n`;

  if (data.length){
    let content = data.split("\n\n");
    content.forEach((line)=> {
      datatoHTML +=`<p>${line}</p>\n`
    })

  }
  datatoHTML += `</body>
  </html>
  `
  const newname = filename.replace(/\.[^/.]+$/, ".html")

  if (recursiveSearch > 0)
  !fs.existsSync(`./dist/`) && fs.mkdirSync(`./dist/`, { recursive: true })

  fs.writeFile(`dist/${newname}`, datatoHTML, (err, data) => {
    if (err) {
      console.error(err);
    } else {
          // success message after html gets parsed
          console.error(
            "%s",
            chalk.green.bold(
              "HTML Created for " + filename 
            ),
          );
    }
  });
}


// fn to read each file and will handle output of HTML format.
async function readFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {

      // create html file in dist
      writeHTML(data, filePath);

    }
  });
}

async function readDirectory(directoryPath) {
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach((file)=> {
      let newpath = directoryPath + "/" + file;
      
      fs.stat(newpath, (err, stats) => {
        if (err) {
          console.error(
            "%s",
            chalk.red.bold(
              "The following file or directory does not exist: " + args[i] + "\nPlease check you have provided the correct path"
            ),
          );
        } else {
          if (stats.isFile()) {
            readFile(newpath)
          } else {
            console.log("Directory found within the directory.")
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
export async function createHtml(files) {
  console.log("Received the following files: ", files);

  await emptyDist();
  filterArguments(files)

}
