# static-site-generator
A CLI tool which creates a static html file from a text file that was provided. Each page includes a title in h1 format and changes the webpage title to the first line in the file. 

## How to use:
1. Clone the repository to your desired directory.
2. Download and install node for your PC using the following link: https://nodejs.dev/
3. Using the Command Line Interface(CLI), navigate to the directory the respository was cloned into.
4. Ensure you run ``npm install`` to download the dependencies.  
5. To create your first HTML file use the command ```create-html --i <filename and/or directoryname>```. You can add multiple files/directories after the flag `--i` followed by spaces as below:
    `create-html --i Sherlock-Holmes-Selected-Stories/ text.txt`

_Once you run the command, you should receive the html files in the dist folder in the corresponding language directory_

## Flags:
`--i` : Flag to indicate the files or directories to create HTML files for.
`--v` : Indicates version of the ssg.
`--h` : Will bring up the help menu.
`--lang`: allows you to include a language to display the html page in. You can input multiple choices followed by spaces. See below:
    ![](https://i.imgur.com/RZoad46.png)
    ![](https://i.imgur.com/AstdjnR.png)

## Input File Types: 
1. Directories: Recursive strategy will automatically be done.
2. Text Files: Any file that is created with the extension `.txt`   
    _Supports: creates paragraphs of each line_
3. Markdown: Any file that is created using markdown and ends in the extention `.md`
    _Supports: h1, h2, h3, blockquotes, bold, italics, image, links, breaks, in-line code blocks_

