import arg from "arg";
import inquirer from "inquirer";
import chalk from "chalk";
import { createHtml} from './main';
const p = require("../package");

function parseArguments(argsRaw) {

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

  const values = {
    input: args["--input"] || false,
    empty: args["--empty"] || false,
    version: args["--version"] || false,
    help: args["--help"] || false,
    // recursive: args["--recursive"] || false,
    files: []
  };

  // Will print out the help dialogue - this flag will not do anything other than print out the help.
  if (values.help) {
    printHelp();
    return;
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

    files.forEach(file => {
      if (file.includes(".txt")){
        values.files.push({
          name: file,
          type: "txt"
        })
      } else if (file.includes(".md")) {
        values.files.push({
          name: file,
          type: "md"
        })
      }
    });
  }

  return values;
  
}

function printHelp() {
  console.log(
    "%s",
    chalk.blue.bold.underline(
      "Information Directives:"
    ),
  );

  console.log(
    "%s",
    chalk.cyan(
      "The Static Site Generator will accept .txt files and convert the data within it to HTML.\nThese HTML files can then be used to host the website\n"
    ),
  );

  console.log(
   "%s \n--version: provides version of package\n--input: flag used to indicate files to convert", chalk.inverse.bold("Flag Directory")
    );
  
}



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
  let filename ="";
  if (!res.empty && !options.input) {
    promptQuestions.splice(0,promptQuestions.length);
    promptQuestions.push({
        type: "input",
        name: "filename",
        message: "Please enter the file name: ",
        default: false,
      });
      
      filename = await inquirer.prompt(promptQuestions);
  }


  return {
    ...options,
    empty: options.empty || res.empty,
    files: filename
  };
}

export async function cli(args) {
  // console.log(args)
  let options = parseArguments(args);
  // console.log(options)
  
  
  if (options.files[0] === "--i" || options.files === "--input"){
    
    // if (options.recursive) {
    //   await createHtml(options.files.slice(2), options.recursive);
    // } else {
      await createHtml(options.files.slice(1), options.recursive);
    // }
  } else {
    options = await promptOptions(options);
    await createHtml(options.files);
  }
  
}
