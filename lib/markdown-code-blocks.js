'use babel';

import MarkdownCodeBlocksView from './markdown-code-blocks-view';
import { CompositeDisposable, File } from 'atom';


const markdownCodeBlocksTemplate = `\`\`\`

\`\`\`
`

export default {

  markdownCodeBlocksView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.markdownCodeBlocksView = new MarkdownCodeBlocksView(state.markdownCodeBlocksViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.markdownCodeBlocksView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'markdown-code-blocks:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.markdownCodeBlocksView.destroy();
  },

  serialize() {
    return {
      markdownCodeBlocksViewState: this.markdownCodeBlocksView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let grammarInstance = editor.getGrammar()
      const fileTypes = grammarInstance.fileTypes
      const fileTypesSet = new Set(fileTypes)
      if (!fileTypesSet.has('md')) return

      editor.insertText(markdownCodeBlocksTemplate)
      editor.moveUp(2)
      editor.moveToEndOfLine()
    }
  }
};
