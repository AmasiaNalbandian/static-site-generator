import arg from "arg";
import inquirer from "inquirer";
import chalk from "chalk";
import { createHtml} from './main';
const p = require("../package");

function parseArguments(argsRaw) {

  // All acceptable flags
  const args = arg(
    {
      "--input": Boolean,
      "--i": "--input",
      "--empty": Boolean,
      "--e": "--empty",
      "--recursive": Boolean,
      "--r":"--recursive",
      "--help": Boolean,
      "--h":"--help",
      "--version": Boolean,
      "--v":"--version"
    }
  );

  // Variable to hold parsed arguments.
  const values = {
    input: args["--input"] || false,
    empty: args["--empty"] || false,
    version: args["--version"] || false,
    help: args["--help"] || false,
    // recursive: args["--recursive"] || false,
    files: []
  };

  // If flag for help present, will print help dialogue- 
  // this flag disregards all other arguments, assuming user doesn't understand how to use package.
  if (values.help) {
    printHelp();
    return values;
  }

  // Prints out the dialogue for the version of the package, alongside the name of the package.
  if (values.version) {
    console.error(
      "%s",
      chalk.green.bold.inverse(
        p.name + " version: " + p.version + "\n"
      ),
    );
  }


  // filter out all arguments after the --input flag to identify as text files and push to the values.files
  if (values.input) {
    //find the location of where the input flag was put, and parse arguments after that as files.
    let files = argsRaw.splice(argsRaw.indexOf("--i") + 1);

    values.files = filterFiles(files)
  }
  return values;
}

function filterFiles(files){

  let filteredFiles = [];
  files.forEach(file => {
    if (file.includes(".txt")){
      filteredFiles.push({
        name: file,
        type: "txt"
      })
    } else if (file.includes(".md")) {
      filteredFiles.push({
        name: file,
        type: "md"
      })
    }
  });

  return filteredFiles;

}


function printHelp() {
  console.log(
    "%s%s%s\n--version: provides version of package\n--input: flag used to indicate files to convert",
    chalk.blue.bold.underline(
      "Information Directives:"
    ),chalk.cyan(
      "The Static Site Generator will accept .txt files and convert the data within it to HTML.\nThese HTML files can then be used to host the website\n"
    ),chalk.inverse.bold("Flag Directory")
  );
}


// Future feature: Prompt for user to enter file names separately.
async function promptOptions(options) {
  const promptQuestions = [];
  if (!options.input && !options.empty) {
    // if no arguments were given- prompt to make an empty html file or input the file name
    promptQuestions.push({
      type: "confirm",
      name: "empty",
      message: "Would you like to create an empty HTML file?",
      default: true,
    });
  }

  const res = await inquirer.prompt(promptQuestions);
  let filenames = "";
  if (!res.empty && !options.input) {
    promptQuestions.splice(0,promptQuestions.length);
    
    
    promptQuestions.push({
        // type: "input",
        name: "filename",
        message: "Please enter the file name: ",
        default: false,
      });
      
      // filenames = await inquirer.prompt(promptQuestions);

      inquirer.prompt(promptQuestions).then(ans => {
        console.log(ans);
      })
  }

  // let place = filenames.toString().splice(" ");

  console.log("filenames out", (filenames['filenames']));
  console.log("filenames", (typeof filenames.toString()));
  
  let filteredFiles = filterFiles(filenames)

  return {
    ...options,
    empty: options.empty || res.empty,
    files: filteredFiles
  };
}

export async function cli(args) {
  let options = parseArguments(args);
    if (options.input && !options.help){
      await createHtml(options.files, options.recursive);
    // }
  } else {
    options = await promptOptions(options);
    console.log("returned from optiopns", options)
    await createHtml(options.files);
    console.log("after call")
  }
  
}
