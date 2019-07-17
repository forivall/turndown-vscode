'use strict'
import * as vscode from 'vscode'
import TurnDown = require('turndown')

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.turndown',() => {
			const editor = vscode.window.activeTextEditor
			editor.edit((edit) => {
                const config = vscode.workspace.getConfiguration('turndown')
                const doc = vscode.window.activeTextEditor.document

                const td = createTurndown(config.get('useSpecialImage'))
                for (const sel of editor.selections) {
                    const t = doc.getText(sel)
                    const prefix = doc.getText(new vscode.Range(
                        new vscode.Position(sel.start.line, 0),
                        sel.start
                    ))
                    const replacement = td.turndown(t).replace(/\n/g, () => `\n${prefix}`)
                    edit.replace(sel, replacement)
                }
			})
		},
	)

	context.subscriptions.push(disposable)
}

export function deactivate() {

}

function createTurndown(useSpecialImage: boolean) {
    const td = new TurnDown()
    if (useSpecialImage) {
        td.addRule('image', {
            filter: 'img',
            replacement: function(content, node: HTMLElement) {
                const rv = '{{' + node.outerHTML + '}}'
                return rv
            },
        })
    }
    return td
}

export function replaceText(text: string, useSpecialImage: boolean) {
    return createTurndown(useSpecialImage).turndown(text)
}
