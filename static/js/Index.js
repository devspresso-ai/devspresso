// This script depends on the following Python variables interpolated into the relevant HTML template:
// - inferenceParamName
// - inferencePath
// - inferenceValueResponseKey
// - inferenceLanguageResponseKey
// - currentFileTextParamName
// - openaiAPIKeyParamName
// - openaiOrganizationIDParamName
import {VanillaTreeView} from "../tree_viewer/treeview.vanilla.js";

document.addEventListener('DOMContentLoaded', () => {
    let currentFileField = document.getElementById('current-file');
    let outputField = document.getElementById('output-field');
    let promptField = document.getElementById('prompt-field');
    let apiKeyField = document.getElementById('openai-api-key-field');
    let openaiOrganizationIDField = document.getElementById('openai-organization-id-field');
    let fileSearchField = document.getElementById('file-search-field');
    let fileCountLabel = document.getElementById('file-count-label');

    // Set up codemirror elements.
    let outputEditor = ace.edit(outputField, {
        mode: 'ace/mode/text',
        selectionStyle: 'text',
        wrap: true
    });
    outputEditor.setTheme('ace/theme/twilight');
    let currentFileEditor = ace.edit(currentFileField, {
        mode: 'ace/mode/text',
        selectionStyle: 'text',
        wrap: true
    });
    currentFileEditor.setTheme('ace/theme/twilight');

    function clearFields(resetCurrentFile) {
        promptField.value = '';
        post('/clear', null, null, (output) => {
            console.log(output);
            if (resetCurrentFile) {
                currentFileEditor.setValue('');
            }
            outputEditor.setValue('');
        });
    }

    function readFileIntoCurrentFileEditor(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let fileText = e.target.result;
            currentFileEditor.setValue(fileText);
        };
        reader.readAsText(file);
    }

    // Add go button action.
    let btn = document.getElementById('go-button');
    btn.addEventListener('click', () => {
        let apiKey = apiKeyField.value;
        let organizationID = openaiOrganizationIDField.value;
        if (apiKey === '') {
            alert('Please enter an OpenAI API key.');
            return;
        } else if (organizationID === '') {
            alert('Please enter an OpenAI organization ID.');
            return;
        }
        let params = new URLSearchParams();
        let dict = {};
        dict[inferenceParamName] = promptField.value;
        dict[currentFileTextParamName] = currentFileEditor.getValue();
        params.append(openaiAPIKeyParamName, apiKey);
        params.append(openaiOrganizationIDParamName, organizationID);
        post(inferencePath, params, JSON.stringify(dict), (output) => {
            let outputCode = output[inferenceValueResponseKey];
            let outputLanguage = output[inferenceLanguageResponseKey];
            console.log(output);
            outputEditor.setValue(outputCode);
            outputEditor.session.setMode('ace/mode/' + outputLanguage);
        });
    });

    // Add clear button action.
    let clrBtn = document.getElementById('clear-button');
    clrBtn.addEventListener('click', () => {
        clearFields(true);
    });

    // All current files
    let currentFiles = [];

    function filterFiles(files) {
        return files.filter(file => {
            const relativePath = file.webkitRelativePath;
            const folders = relativePath.split('/');
            const filteredFolders = folders.filter(folder => !folder.match(/^[\._]/));
            const isInDisallowedPath = filteredFolders.length === folders.length;
            const isNotHiddenFile = !file.name.match(/^[\._]/);
            return isInDisallowedPath && isNotHiddenFile;
        });
    }

    function updateCurrentFiles(files) {
        currentFiles = filterFiles(files).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        fileCountLabel.innerHTML = currentFiles.length + " Files";
    }

    let tree;

    // Add file upload responder
    let fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
        let files = [...e.target.files];
        updateCurrentFiles(files);
        let file = currentFiles[0];
        readFileIntoCurrentFileEditor(file);

        // Setup tree view
        tree = new VanillaTreeView(document.getElementById('tree'), {
            provider: {
                async getChildren(id) {
                    if (!id) {
                        // Return all files. In the future this can be a hierarchical list, but for now
                        // the upload method used will only return all files in a flat structure.
                        let newFiles = currentFiles.map((file) => {
                            return {
                                id: file.name,
                                label: file.name,
                                icon: 'fa-file',
                                expanded: false
                            };
                        });
                        console.log("Loading new files into DOM: " + newFiles);
                        return newFiles;
                    } else {
                    }
                }
            }
        });
        tree.onNodeClick = (node) => {
            let file = files.find((file) => {
                return file.name === node.id;
            });
            clearFields(false);
            if (file) {
                readFileIntoCurrentFileEditor(file);
            }
        };
    });

    // Setup file search
    fileSearchField.addEventListener('input', (e) => {
        let search = e.target.value;
        let files = [...fileInput.files].filter((file) => {
            return file.name.includes(search);
        });
        console.log(files);
        updateCurrentFiles(files);
        tree.detach();
        tree.removeAllRootChildren();
        tree.attach();
    });
});
