import path from "path";
import fs from "fs";
import url from "url";
import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { green, cyan, bold } = chalk;

let projectName;

const program = new Command("create-express-app")
  .version("0.0.1")
  .argument("<project-name>")
  .action((name) => (projectName = name))
  .option("-p, --prettier", "Enable code formatting using prettier")
  .option("-e, --eslint", "Enable code linting using eslint")
  .option("-t, --test", "Enable automated testing using mocha and chai")
  .parse(process.argv);

const projectPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, "templates");

let dependencies = ["express", "morgan", "http-errors", "dotenv"];
let devDependencies = [
  "@babel/cli",
  "@babel/core",
  "@babel/node",
  "@babel/preset-env",
  "nodemon"
];
let packageJson = {
  name: projectName,
  scripts: {
    start: "node dist",
    build: "babel src --out-dir dist",
    dev: "nodemon --watch .env --watch src --exec babel-node src"
  }
};

console.log();
console.log(`Creating a new express app in ${green(projectPath)}.`);
console.log();

fs.mkdirSync(projectPath);

fs.cpSync(path.join(templatePath, "src"), path.join(projectPath, "src"), {
  recursive: true
});

fs.copyFileSync(
  path.join(templatePath, "babelrc"),
  path.join(projectPath, ".babelrc")
);

fs.copyFileSync(path.join(templatePath, "env"), path.join(projectPath, ".env"));

fs.copyFileSync(
  path.join(templatePath, "gitignore"),
  path.join(projectPath, ".gitignore")
);

if (program.opts().eslint) {
  fs.copyFileSync(
    path.join(templatePath, "eslintrc"),
    path.join(projectPath, ".eslintrc")
  );
  devDependencies.push("eslint");
}

if (program.opts().prettier) {
  fs.copyFileSync(
    path.join(templatePath, "prettierrc"),
    path.join(projectPath, ".prettierrc")
  );
  devDependencies.push("prettier");
}

if (program.opts().test) {
  fs.cpSync(path.join(templatePath, "test"), path.join(projectPath, "test"), {
    recursive: true
  });
  devDependencies.push("mocha", "chai", "supertest", "@babel/register");
  packageJson.scripts["test"] = "mocha --watch --require @babel/register test";
}

fs.writeFileSync(
  path.join(projectPath, "package.json"),
  JSON.stringify(packageJson, null, 2),
  { encoding: "utf8" }
);

let command;

command = `npm install --prefix ${projectPath} --save`;
command += ` ${dependencies.join(" ")}`;

console.log("Installing dependencies:");
for (const dependency of dependencies) {
  console.log(`- ${cyan(dependency)}`);
}
console.log();

execSync(command, { stdio: "inherit" });

command = `npm install --prefix ${projectPath} --save-dev`;
command += ` ${devDependencies.join(" ")}`;

console.log();
console.log("Installing devDependencies:");
for (const devDependency of devDependencies) {
  console.log(`- ${cyan(devDependency)}`);
}
console.log();

execSync(command, { stdio: "inherit" });

process.chdir(projectPath);
execSync("git init", { stdio: "ignore" });
execSync("git branch -M main", { stdio: "ignore" });
execSync("git add -A", { stdio: "ignore" });
execSync('git commit -m "Initial commit"', { stdio: "ignore" });

console.log();
console.log(bold(green("Success!")));
console.log();
console.log(
  "Run the following commands to start the server in development mode:"
);
console.log();
console.log(`   ${cyan("cd")} ${projectName}`);
console.log(`   ${cyan("npm run dev")}`);
console.log();
