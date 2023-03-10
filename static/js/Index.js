// This script depends on the following Python variables interpolated into the relevant HTML template:
// - inferenceParamName
// - inferencePath
document.addEventListener('DOMContentLoaded', () => {
    let outputField = document.getElementById('output-field');
    let promptField = document.getElementById('prompt-field');

    // Add go button action.
    let btn = document.getElementById('go-button');
    btn.addEventListener('click', () => {
        let params = new URLSearchParams();
        let dict = {};
        dict[inferenceParamName] = document.getElementById('input').value;
        params.append(inferenceParamName, JSON.stringify(dict));
        postInference(inferencePath, params, inferenceParamName, (output) => {
            outputField.innerHTML = '<pre>' + output + '</pre>';
        });
    });

    // Add clear button action.
    let clrBtn = document.getElementById('clear-button');
    clrBtn.addEventListener('click', () => {
        promptField.innerHTML = '';
    });
});
