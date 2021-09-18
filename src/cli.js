import arg from "arg";
import inquirer from "inquirer";
import { createHtml} from './main';


function parseArguments(argsRaw) {

  const args = arg(
    {
      "--input": Boolean,
      "--i": "--input",
      "--empty": Boolean,
      "--e": "--empty",
      "--recursive": Boolean,
      "--r":"--recursive"
    },
    {
      argv: argsRaw.slice(2),
    }
  );

  return {
    input: args["--input"] || false,
    empty: args["--empty"] || false,
    // recursive: args["--recursive"] || false,
    files: argsRaw.slice(2),
  };
  
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
  let options = parseArguments(args);
  
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
