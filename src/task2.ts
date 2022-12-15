import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";


const csvFilePath = "./task2Data.csv";
const jsonFilePath = "./task2Data.txt";

fs.readFile(jsonFilePath, (err) => {
  if (err) {
    console.log("creating file");
    fs.appendFile(jsonFilePath, "", "utf8", (err) => {
      if (err) {
        return console.error(err)
      }
    });
  }
})

const readStream = fs.createReadStream(csvFilePath, { highWaterMark: 256 * 1024 });

const writeStream = fs.createWriteStream(jsonFilePath);

let check = 0;
readStream.on("data", (data) => {
  console.log(data.length, check);
  check++;
});

writeStream.on("data", (err, data) => {
  if (err) {
    return console.error(err);
  }

  console.log(data, "data");
})

const pipelineAsync = promisify(pipeline);


async function createPipeline() {
  try {
    await pipelineAsync(
      readStream,
      writeStream
    );
    console.log("pipeline accomplished.");
  } catch {

  } 
}

createPipeline();
