import { Directory } from "./Directory";
import { fileExists } from "./Utils";
import chalk from "chalk";

export const build = async (
  dir: string,
  url: string,
  virtualName?: string
): Promise<void> => {
  console.log(chalk.white("started biiifing " + dir));

  // validate inputs

  const exists: boolean = await fileExists(dir);

  if (!exists) {
    throw new Error("Directory does not exist");
  }

  if (!url) {
    throw new Error("You must pass a url parameter");
  }

  const directory: Directory = new Directory(dir, url, virtualName);

  await directory.read();

  console.log(chalk.white("finished biiifing " + dir));
};
