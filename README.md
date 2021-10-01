# static-site-generator
A CLI tool which creates a static html file from a text file that was provided.

## Steps to test
1. Clone the directory to your desired directory.
2. Using the CLI, ensure you run npm i to install the dependencies and packages.
3. To create your first HTML file use the command ```create-html --i <filename> <directoryname>```
4. Once you run the command, you should receive the html files in the dist folder. 

Additional features:
1. You can create html files for a directory with txt files.
2. You can specify the location of the file using the relative path.
3. You can create html files from markdown files as well with markdown features implemented.

  
## Flags:
`--i` : Flag to indicate the files or directories to create HTML files for.
`--v` : Indicates version of the ssg.
`--h` : Will bring up the help menu.
`--lang`: allows you to include a language to display the html page in. You can input multiple choices followed by spaces. See below:
    ![](https://i.imgur.com/RZoad46.png)
    ![](https://i.imgur.com/AstdjnR.png)