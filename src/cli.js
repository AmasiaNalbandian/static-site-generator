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
    raw: argsRaw
  };

  if (values.version) {
    console.error(
      "%s",
      chalk.green.bold(
        p.name + " version: " + p.version + "\n"
      ),
    );
  }

  return values;
  
}


function getInputFiles(args) {
  console.log("received input")

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
  console.log(args)
  let options = parseArguments(args);
  console.log(options)
  // if (options.files[0] === "--i" || options.files === "--input"){
    
  //   // if (options.recursive) {
  //   //   await createHtml(options.files.slice(2), options.recursive);
  //   // } else {
  //     await createHtml(options.files.slice(1), options.recursive);
  //   // }
  // } else {
  //   options = await promptOptions(options);
  //   await createHtml(options.files);
  // }
  
}
