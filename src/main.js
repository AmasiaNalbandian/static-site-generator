import chalk from "chalk";
import fs, { Stats } from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const access = promisify(fs.access);

// fn to read each file and will handle output of HTML format.
async function readFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {

      // success message after html gets parsed
      console.error(
        "%s",
        chalk.green.bold(
          "HTML Created for " + filePath 
        ),
      );

      console.log(data);
    }
  });
}

async function readDirectory(directoryPath) {
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});
}

/* driver code to grab arguments received and either 
  1) read the file and convert to html format.
  2) recursively access files in the directory and perform option 1
*/
export async function createHtml(files) {
  console.log("Received the following files: ", files);

  // check if file or directory for each... this will allow us to properly handle data.
  for (let i = 0; i < files.length; i++) {
    fs.stat(files[i], (err, stats) => {
      if (err) {
        console.error(
          "%s",
          chalk.red.bold(
            "The following file or directory does not exist: " + files[i] + "\nPlease check you have provided the correct path"
          ),
        );
      } else {
        if (stats.isDirectory()) {
          console.log("This is a directory.");
          readDirectory(files[i])
        } else {
          console.log("This is a file");
          readFile(files[i])
        }
      }
    });
  }




  // options = {
  //     ...options,
  //     targetDirectory: options.targetDirectory || process.cwd(),
  // };

  // const currentFileUrl = import.meta.url;
  // const templateDir = path.resolve(
  //     new URL(currentFileUrl).pathname,
  //     '../../templates',
  //     options.template
  // );

  // options.templateDirectory = templateDir;

  // try {
  //     await access(templateDir, fs.constants.R_OK);
  // } catch(err) {
  //     console.error("%s Invalid template name" + err, chalk.red.bold('The following file or directory does not exist. Please check you have provided the correct path'));
  //     process.exit(1);
  // }

  // console.log('copy p files')
  // await copyTemplateFiles(options);

  // console.log(chalk.green.bold("Project is now ready"))
}
