import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "create-component.run",
    async (uri: vscode.Uri) => {
      const basePath = uri.fsPath;
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter component name",
        placeHolder: "MyComponent",
      });

      if (!componentName) {
        vscode.window.showErrorMessage("Component name is required!");
        return;
      }

      const componentPath = path.join(basePath, componentName);
      const interfacePath = path.join(componentPath, "interfaces");

      fs.mkdirSync(interfacePath, { recursive: true });

      // File paths
      const interfaceIndex = path.join(interfacePath, "index.ts");
      const tsxFile = path.join(componentPath, `${componentName}.tsx`);
      const scssFile = path.join(componentPath, `${componentName}.module.scss`);
      const indexFile = path.join(componentPath, "index.ts");

      // File contents
      const interfaceContent = `export interface Props${componentName} {}\n`;
      const indexContent = `export { default } from "./${componentName}";\n`;
      const tsxContent = `import styles from "./${componentName}.module.scss";
import { Props${componentName} } from "./interfaces";

function ${componentName}({}: Props${componentName}) {
  return <div>${componentName}</div>;
}

export default ${componentName};
`;

      fs.writeFileSync(interfaceIndex, interfaceContent);
      fs.writeFileSync(indexFile, indexContent);
      fs.writeFileSync(tsxFile, tsxContent);
      fs.writeFileSync(scssFile, "");

      vscode.window.showInformationMessage(
        `Component ${componentName} created successfully!`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
