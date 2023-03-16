// This script depends on the following Python variables interpolated into the relevant HTML template:
// - inferenceParamName
// - inferencePath
// - inferenceValueResponseKey
// - inferenceLanguageResponseKey
// - openaiAPIKeyParamName
// - openaiOrganizationIDParamName

import {VanillaTreeView} from "../tree_viewer/treeview.vanilla.js";

document.addEventListener('DOMContentLoaded', () => {
    let currentFileField = document.getElementById('current-file');
    let outputField = document.getElementById('output-field');
    let promptField = document.getElementById('prompt-field');
    let apiKeyField = document.getElementById('openai-api-key-field');
    let openaiOrganizationIDField = document.getElementById('openai-organization-id-field');

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
        params.append(inferenceParamName, JSON.stringify(dict));
        params.append(openaiAPIKeyParamName, apiKey);
        params.append(openaiOrganizationIDParamName, organizationID);
        postInference(inferencePath, params, inferenceValueResponseKey, (output) => {
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
        promptField.value = '';
    });

    // Add file upload responder
    let fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
        let files = [...e.target.files];
        let file = files[0];
        console.log(files);
        let reader = new FileReader();
        reader.onload = (e) => {
            let fileText = e.target.result;
            currentFileEditor.setValue(fileText);
        };
        reader.readAsText(file);

        // Setup tree view
        let tree = new VanillaTreeView(document.getElementById('tree'), {
            provider: {
                async getChildren(id) {
                    if (!id) {
                        // Return all files. In the future this can be a hierarchical list, but for now
                        // the upload method used will only return all files in a flat structure.
                        return files.map((file) => {
                            return {
                                id: file.name,
                                label: file.name,
                                icon: 'fa-file'
                            };
                        });
                    } else {
                    }
                }
            }
        });
        tree.onNodeClick = (node) => {
            let file = files.find((file) => {
                return file.name === node.id;
            });
            if (file) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let fileText = e.target.result;
                    currentFileEditor.setValue(fileText);
                };
                reader.readAsText(file);
            }
        };
    });
});
