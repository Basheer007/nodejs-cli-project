import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import chalk from "chalk";
const filePath: string = path.join(__dirname, "taskFile.json");

const argv: string[] = process.argv.slice(2);

interface taskvalue {
  id: number;
  taskName: string;
  todo: boolean;
  progress: boolean;
  done: boolean;
}

function writeFile(taskarray: taskvalue[]) {
  fs.writeFileSync(filePath, JSON.stringify(taskarray, null, 2));
}

function readFile(): taskvalue[] {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  }
  return [];
}

function generateIDs(): number {
  const ids = readFile().map((obj) => obj.id);
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

//cli command..

if (argv.includes("add")) {
  const taskarray = readFile();
  const data = argv.slice(1).toString();
  const obj = {
    id: generateIDs(),
    taskName: data,
    todo: false,
    progress: false,
    done: false,
  };
  taskarray.push(obj);
  writeFile(taskarray);
  console.log(`${chalk.blue.bold.bgGreenBright("Task created")}`);
} else if (argv.includes("list")) {
  const taskName = readFile().map((obj) => obj.taskName);
  console.log(taskName);
} else if (argv.includes("update")) {
  const taskarray = readFile();
  const id = argv.slice(1).toString();
  const data = argv.slice(2).toString();
  const updateArray = taskarray.filter((obj) => obj.id !== parseInt(id));
  const newObj = {
    id: parseInt(id),
    taskName: data,
    todo: false,
    progress: false,
    done: false,
  };
  updateArray.push(newObj);
  writeFile(updateArray);
  console.log(`${chalk.greenBright.bold.bgBlue("Task updated")}`);
} else if (argv.includes("delete")) {
  const taskarray = readFile();
  const id = argv.slice(1).toString();
  const updateArray = taskarray.filter((obj) => obj.id !== parseInt(id));
  writeFile(updateArray);
  console.log(`${chalk.redBright.bold("Task Deleted")}`);
} else {
  console.log(`${chalk.yellowBright.italic("Please a put a command")}`);
}
