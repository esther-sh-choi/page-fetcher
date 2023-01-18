const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const [url, path] = process.argv.slice(2);

const request = require("request");
request(url, (error, response, body) => {
  if (error) {
    // if URL results in an error terminate the app and tell use what is wrong
    console.error(error);
    process.exit();
  }

  if (fs.existsSync(path)) {
    rl.question(
      "This file already exists. Would you like to overwrite on the existing file? Type Y: ",
      (answer) => {
        if (answer === "Y" || !fs.existsSync(path)) {
          // if user responds Y - yes, then overwrite file
          fs.writeFile(path, body, (err) => {
            if (err) {
              console.error(err);
            }
            if (!err) {
              // const bytes = fs.statSync(path).size;
              const bytes = body.length;
              console.log(`Downloaded and saved ${bytes} bytes to ${path}`);
              process.exit();
            }
          });
        } else {
          // if response is not Y terminate program
          process.exit();
        }
      }
    );
  } else {
    fs.writeFile(path, body, (err) => {
      if (err) {
        console.error(err.message);
        process.exit();
      }
      if (!err) {
        // const bytes = fs.statSync(path).size;
        const bytes = body.length;
        console.log(`Downloaded and saved ${bytes} bytes to ${path}`);
        process.exit();
      }
    });
  }
});
