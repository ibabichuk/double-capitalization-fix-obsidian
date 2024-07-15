const { Plugin } = require('obsidian');

class DoubleCapFixPlugin extends Plugin {
    onload() {
        console.log('Loading Double Capitalization Fix Plugin');
        
        // Register keyup event on the editor container
        this.registerDomEvent(document, 'keyup', (evt) => this.handleKeyUp(evt));
        
        console.log('Keyup event listener registered');
    }

    onunload() {
        console.log('Unloading Double Capitalization Fix Plugin');
    }

    handleKeyUp(evt) {
        // Get the active editor
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf || !activeLeaf.view || !activeLeaf.view.editor) {
            return;
        }

        const editor = activeLeaf.view.editor;
        let cursor = editor.getCursor();
        let line = editor.getLine(cursor.line);

        if (evt.key === ' ' || evt.key === 'Enter') {
            if (evt.key === 'Enter' && cursor.line > 0) {
                cursor = { line: cursor.line - 1, ch: editor.getLine(cursor.line - 1).length };
                line = editor.getLine(cursor.line);
            }

            // Match words with exactly two initial capital letters followed by lowercase letters and at least one more character
            const lastWordMatch = line.match(/\b[A-Z]{2}[a-z][a-zA-Z]*\b/g);

            if (lastWordMatch && lastWordMatch.length > 0) {
                const lastMatch = lastWordMatch[lastWordMatch.length - 1];
            //    console.log('Last word match:', lastMatch);

                const correctedWord = lastMatch.replace(/^([A-Z]{2})([a-zA-Z]*)/, (match, p1, p2) => {
                    return p1.charAt(0) + p1.slice(1).toLowerCase() + p2;
                });

             //   console.log('Corrected word:', correctedWord);

                const startPos = { line: cursor.line, ch: line.lastIndexOf(lastMatch) };
                const endPos = { line: cursor.line, ch: line.lastIndexOf(lastMatch) + lastMatch.length };

                editor.replaceRange(correctedWord, startPos, endPos);
            }
        }
    }
}

module.exports = DoubleCapFixPlugin;

