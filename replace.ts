import * as fs from "node:fs";
import * as path from "node:path";

function toKebabCase(input: string): string {
  // Remove the leading "Ri" if it exists
  const trimmedInput = input.startsWith("Ri") ? input.slice(2) : input;

  return trimmedInput
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert hyphen between lowercase and uppercase letters
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Handle consecutive uppercase letters
    .replace(/([a-zA-Z])(\d)/g, "$1-$2") // Insert hyphen between letters and numbers
    .replace(/(\d)([A-Z])/g, "$1-$2") // Insert hyphen between numbers and letters
    .toLowerCase(); // Convert the whole string to lowercase
}

function replaceImports(directory: string): void {
  const files = getAllFiles(directory);

  // biome-ignore lint/complexity/noForEach: <explanation>
  files.forEach((file) => {
    if (file.endsWith(".tsx")) {
      let content = fs.readFileSync(file, "utf8");

      // Check if the Icon import already exists
      const iconImportExists =
        /import\s+{\s*Icon\s*}\s+from\s+["']@\/components\/ui\/icon["']/.test(
          content,
        );

      // Add Icon import if it doesn't exist
      if (!iconImportExists) {
        content = content.replace(
          /(import\s+(\{[\s\S]*?\})\s+from\s+["']@remixicon\/react["'])/,
          '$1\nimport { Icon } from "@/components/ui/icon"',
        );
      }

      // Replace component usage
      content = content.replace(
        /<(Ri[A-Z][a-zA-Z]+)(\s+[^>]*)?>/g,
        (match, componentName, props) => {
          const iconName = toKebabCase(componentName);
          return `<Icon name="${iconName}" ${props || ""}>`;
        },
      );

      fs.writeFileSync(file, content, "utf8");
      console.log(`Processed: ${file}`);
    }
  });
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  // biome-ignore lint/complexity/noForEach: <explanation>
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(filePath));
    } else {
      files.push(filePath);
    }
  });

  return files;
}

// Replace 'your_project_directory' with the actual path to your project
replaceImports("./src");
