// This script depends on the following Python variables interpolated into the relevant HTML template:
// - inferenceParamName
// - inferencePath
// - inferenceValueResponseKey
// - inferenceLanguageResponseKey
// - openaiAPIKeyParamName
// - openaiOrganizationIDParamName
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
        promptField.innerHTML = '';
    });
});
