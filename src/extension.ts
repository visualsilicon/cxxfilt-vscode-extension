import * as vscode from 'vscode';
import * as cp from "child_process";

function getCxxFilt(word: string): string {
    const result = cp.spawnSync("c++filt", [word]);
    if (result.status === null && result.error) {
        return "";
    }

    return result.stdout.toString();
}

export function activate(context: vscode.ExtensionContext) {
    // vscode.window.showInformationMessage('c++filt tool extension has been activated.');

    vscode.languages.registerHoverProvider(
        '*',
        {
            provideHover(document, position, token) {

            const regexp = /[^ ]+/g;
            const range = document.getWordRangeAtPosition(position, regexp);
            const word = document.getText(range);

            if (word.length > 1) {
                const cxxfilt: string = getCxxFilt(word);

                if (cxxfilt.length > 0) {
                    return new vscode.Hover({
                        language: "*",
                        value: `c++filt: ${cxxfilt}`
                    });
                }

                return null;
            }
        }
    });
}

export function deactivate() {}

module.exports = {
    activate,
    deactivate
}
