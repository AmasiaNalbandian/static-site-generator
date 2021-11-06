import arg from "arg";
import chalk from "chalk";
import { createHtml } from "./main";
import { name, version } from "../package.json";
import fs from "fs";
import { getOptions } from "./config";

/**
 * Asynchronous function to parse the flags passed in the CLI
 * when running the program.
 */
async function parseArguments(argsRaw) {
  try {
    const args = arg({
      "--input": Boolean,
      "--i": "--input",
      "--empty": Boolean,
      "--e": "--empty",
      "--recursive": Boolean,
      "--r": "--recursive",
      "--help": Boolean,
      "--h": "--help",
      "--version": Boolean,
      "--v": "--version",
      "--lang": Boolean,
      "--config": String,
      "--c": "--config",
    });

    const values = {
      input: args["--input"] || false,
      empty: args["--empty"] || false,
      version: args["--version"] || false,
      help: args["--help"] || false,
      lang: args["--lang"] || false,
      // recursive: args["--recursive"] || false,
      files: [],
      directories: [],
    };

    // Will print out the help dialogue - this flag will not do anything other than print out the help.
    if (values.help) {
      printHelp();
      return;
    }

    if (args["--config"]) {
      const jsonValues = await getOptions(args["--config"]);
      if (jsonValues && jsonValues.input) {
        getFiles(jsonValues.input, jsonValues);
      }

      // exit early, since the rest is
      // dealing with the CLI args
      return jsonValues;
    }

    // Prints out the dialogue for the version of the package, alongside the name of the package.
    if (values.version) {
      console.error(
        "%s",
        chalk.green.bold.inverse(name + " version: " + version + "\n")
      );
    }

    if (values.input && values.lang) {
      let languages, files;
      // if more than one flag with inputs (specifically lang flag)
      if (argsRaw.indexOf("--i") < argsRaw.indexOf("--lang")) {
        //input before lang flag
        files = argsRaw.splice(argsRaw.indexOf("--i") + 1);
        languages = files.splice(files.indexOf("--lang") + 1);
        files.splice(files.indexOf("--lang"));
      } else {
        //lang flag before input
        languages = argsRaw.splice(argsRaw.indexOf("--lang") + 1);
        files = languages.splice(languages.indexOf("--i") + 1);
        languages.splice(languages.indexOf("--i"));
      }
      getFiles(files, values);
      values.lang = languages;
    }
    // filter out all arguments after the --input flag to identify as text files and push to the values.files
    if (values.input && !values.lang) {
      //find the location of where the input flag was put, and parse arguments after that as files.
      let files = argsRaw.splice(argsRaw.indexOf("--i") + 1);
      values.lang = ["en"];
      getFiles(files, values);
    }
    return values;
  } catch (err) {
    console.log(
      "%s",
      chalk.red("An error occured - Please check your input.\n")
    );
    printHelp();
    return;
  }
}

/**
 * Function to handle files and organize into objects
 */
function getFiles(files, values) {
  files.forEach((file) => {
    if (file.includes(".txt")) {
      values.files.push({
        name: file,
        type: "txt",
      });
    } else if (file.includes(".md")) {
      values.files.push({
        name: file,
        type: "md",
      });
    } else {
      let dirFiles = fs.readdirSync(file);
      values.directories.push({ name: file, type: "dir" });
      // getFiles(dirFiles, values)

      dirFiles.forEach((f) => {
        let newpath = "./" + file + "/" + f; // condense into the statement, no need for var
        values.files.push({
          name: newpath,
        });
        fs.stat(newpath, (err, stats) => {
          if (err) {
            console.error(
              "%s",
              chalk.red.bold(
                "The following file or directory does not exist: " +
                  f +
                  "\nPlease check you have provided the correct path"
              )
            );
          } else {
            // if it exists handle whether its a file or directory
            if (stats.isDirectory()) {
              getFiles(f, values);
            }
          }
        });
      });
    }
  });
}

/**
 * Function to print the help menu
 */
function printHelp() {
  console.log("%s", chalk.blue.bold.underline("Information Directives:"));

  console.log(
    "%s",
    chalk.cyan(
      "The Static Site Generator will accept input for text(.txt) or markdown(.md) files and convert the data within it to HTML.\nDirectories with the mentioned file types are also supported.\nThese HTML files can then be used to host the website\n"
    )
  );

  console.log(
    "%s \n--version: provides version of package\n--input: flag used to indicate files to convert\n--config: option to indicate config file to read from\n--lang: option to indicate the language for the HTML page",
    chalk.inverse.bold("Flag Directory")
  );
}

/**
 * Asynchronous function to handle the CLI arguments passed.
 */
export async function cli(args) {
  let options = await parseArguments(args);
  if (options && options.input) {
    await createHtml(options, true);
  } else if (options !== undefined && !options.version && !options.help) {
    console.log(
      "%s",
      chalk.red("Input received was incorrect. Please refer to help below.\n")
    );
    printHelp();
  }
}
