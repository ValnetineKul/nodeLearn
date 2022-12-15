import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line: string) => {
  if (line === "exit") {
    rl.close();
    return;
  }

  console.log(line.split('').reverse().join(''));
});

rl.once('close', () => {
  console.log("Closed")
});

