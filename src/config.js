import fs from "fs";

export async function getOptions(pathToJsonFile) {
  if (!pathToJsonFile.endsWith(".json")) {
    console.error(
      "This is not a JSON file.\n" +
        "Please, provide a proper file with '.json' extension."
    );
    return null;
  }

  let fileContents = null;
  try {
    fileContents = fs.readFileSync(pathToJsonFile, "utf8");
  } catch (err) {
    console.error(
      "An error occurred while trying to access the file.\n" +
        "The file might not exist or you may not have permission to read it.\n" +
        "Please, provide a file that can be read."
    );
    return null;
  }

  let config = null;

  try {
    config = JSON.parse(fileContents);
  } catch (err) {
    console.error(
      "An error occurred while reading the JSON file.\n" +
        "This might indicate that the JSON file is not valid.\n" +
        "Please, ensure that it is a valid JSON file."
    );
    return null;
  }

  // if the input is not an array of elements, then
  //   we create an array with a single element
  let input_arr = !config["input"]
    ? false
    : Array.isArray(config["input"])
    ? config["input"]
    : Array(config["input"]);

  // if the language is not an array of elements, then
  //   we create an array with a single element
  let lang_arr = !config["lang"]
    ? ["en"]
    : Array.isArray(config["lang"])
    ? config["lang"]
    : Array(config["lang"]);

  return {
    input: input_arr,
    lang: lang_arr,
    empty: false,
    version: false,
    help: false,
    files: [],
    directories: [],
  };
}
