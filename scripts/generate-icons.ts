import path from "node:path";
import { iconList } from "@/components/ui/icon/icon-list";
import glob from "fast-glob";
import fs from "fs-extra";

const cwd = process.cwd();
const inputDir = path.join(cwd, "node_modules", "remixicon", "icons");
const tempDir = path.join(cwd, "temp-svg-icons");

export function copyIcons() {
  fs.ensureDirSync(tempDir);

  const svgIcons = glob.sync("**/*.svg", {
    cwd: inputDir,
  });

  for (const icon of svgIcons) {
    const iconName = path.basename(icon);

    if (iconList.has(iconName.replace(".svg", ""))) {
      const destinationFile = path.join(tempDir, iconName);
      const file = path.join(inputDir, icon);
      try {
        fs.copyFileSync(file, destinationFile);
        console.log(`Copied icon: ${iconName}`);
      } catch (err) {
        console.error(`Error copying file: ${iconName}`, err);
      }
    }
  }
}

export const removeTempDir = async () => {
  await fs.remove(tempDir);
};
