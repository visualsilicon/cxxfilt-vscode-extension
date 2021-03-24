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

            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            const regexp = /[^ ]+/g;
            const rangeGreedy = document.getWordRangeAtPosition(position, regexp);
            const wordGreedy = document.getText(rangeGreedy);

            if (word.length > 1) {
                const cxxfilt: string = getCxxFilt(word);
                const cxxfiltGreedy: string = getCxxFilt(wordGreedy);

                if (cxxfilt.length > 0 || cxxfiltGreedy.length > 0) {
                    return new vscode.Hover({
                        language: "*",
                        value: `c++filt: ${cxxfilt}\nc++filt: ${cxxfiltGreedy}`
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
