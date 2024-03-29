// This script depends on the following Python variables interpolated into the relevant HTML template:
// - inferenceParamName
// - inferencePath
// - inferenceValueResponseKey
// - inferenceLanguageResponseKey
// - currentFileTextParamName
// - environmentContextParamName
// - openaiAPIKeyParamName
// - openaiOrganizationIDParamName
import {VanillaTreeView} from "../tree_viewer/treeview.vanilla.js";

// Animates a 3-dot loading indicator in the given file editor field.
function animateLoadingIndicator(fileEditor) {
    let dots = 0;
    return setInterval(() => {
        if (dots === 3) {
            dots = 0;
        }
        dots++;
        fileEditor.setValue('Working' + '.'.repeat(dots));
    }, 1000);
}

// ALl languages supported in syntax highlighting. Adding more is fairly straightforward - just look at languages supported
// in static/js/src-noconflict
const languageOptions = [
    { mode_name: "c", display_name: "C" },
    { mode_name: "c_cpp", display_name: "C++" },
    { mode_name: "csharp", display_name: "C#" },
    { mode_name: "css", display_name: "CSS" },
    { mode_name: "dot", display_name: ".NET" },
    { mode_name: "go", display_name: "Go" },
    { mode_name: "html", display_name: "HTML" },
    { mode_name: "java", display_name: "Java" },
    { mode_name: "javascript", display_name: "JavaScript" },
    { mode_name: "json", display_name: "JSON" },
    { mode_name: "json5", display_name: "JSON5" },
    { mode_name: "kotlin", display_name: "Kotlin" },
    { mode_name: "lua", display_name: "Lua" },
    { mode_name: "markdown", display_name: "Markdown" },
    { mode_name: "objectivec", display_name: "Objective-C" },
    { mode_name: "perl", display_name: "Perl" },
    { mode_name: "php", display_name: "PHP" },
    { mode_name: "python", display_name: "Python" },
    { mode_name: "rust", display_name: "Rust" },
    { mode_name: "scala", display_name: "Scala" },
    { mode_name: "sql", display_name: "SQL" },
    { mode_name: "swift", display_name: "Swift" },
    { mode_name: "text", display_name: "Text" },
    { mode_name: "typescript", display_name: "TypeScript" },
    { mode_name: "yaml", display_name: "YAML" }
];

// Populates a dropdown menu with the given language options.
function populateDropdown(selectElement, options) {
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.mode_name;
        optionElement.textContent = option.display_name;
        selectElement.appendChild(optionElement);
    });
}

// Reads the given file into the fileEditor
function readFileUsingFetch(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          reject(new Error('Error reading the file'));
        }
      })
      .then((fileText) => {
        resolve(fileText);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        URL.revokeObjectURL(url);
      });
  });
}
function readFileIntoFileEditor(file, fileEditor, fileNameField) {
    readFileUsingFetch(file).then((fileText) => {
        // Use the fileText here
        fileEditor.setValue(fileText);
        console.log(`DEBUG: ${fileText} ${fileEditor}`);
    }).catch((error) => {
        console.error('Error:', error);
        alert("Error loading file: the underlying file may have been changed on your machine. Please try reuploading your directory or refreshing.")

    });
    fileNameField.innerHTML = file.name;
}

// Given a list of files, filter them to exclude hidden files and files in hidden folders.
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

// Clears the given prompt field and output field, and optionally clears the current file editor.
function clearFields(promptField, outputEditor, currentFileEditor, resetCurrentFile) {
    if (promptField != null) {
        promptField.value = '';
    }
    post('/clear', null, null, (output) => {
        console.log(output);
        if (resetCurrentFile) {
            currentFileEditor.setValue('');
        }
        outputEditor.setValue('');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let currentFileField = document.getElementById('current-file');
    let outputField = document.getElementById('output-field');
    let promptField = document.getElementById('prompt-field');
    let contextField = document.getElementById('context-field');
    let apiKeyField = document.getElementById('openai-api-key-field');
    let openaiOrganizationIDField = document.getElementById('openai-organization-id-field');
    let fileSearchField = document.getElementById('file-search-field');
    let fileCountLabel = document.getElementById('file-count-label');
    let currentFileNameField = document.getElementById('current-file-title');

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

    // Set up language selectors for code editors.
    let currentFileLanguageSelector = document.getElementById('current-file-language-menu');
    let outputLanguageSelector = document.getElementById('output-language-menu');
    populateDropdown(currentFileLanguageSelector, languageOptions);
    populateDropdown(outputLanguageSelector, languageOptions);

    // Sets the language of the given editor to the given language, defaulting to 'text' if not found.
    // Or, if there is no language, do nothing.
    function setEditorLanguage(editor, languageSelector, selectedLanguage) {
        if (selectedLanguage === null || selectedLanguage.length === 0) {
            return;
        }
        if (languageOptions.map(option => option.mode_name).indexOf(selectedLanguage) === -1) {
            console.log("Language type not found: " + selectedLanguage + ". Defaulting to 'text'.");
            selectedLanguage = 'text';
        }
        editor.session.setMode('ace/mode/' + selectedLanguage);
        languageSelector.value = selectedLanguage;
    }
    setEditorLanguage(currentFileEditor, currentFileLanguageSelector, 'text');
    setEditorLanguage(outputEditor, outputLanguageSelector, 'text');

    currentFileLanguageSelector.addEventListener('change', (e) => {
        setEditorLanguage(currentFileEditor, currentFileLanguageSelector, e.target.value);
    });
    outputLanguageSelector.addEventListener('change', (e) => {
        setEditorLanguage(outputEditor, outputLanguageSelector, e.target.value);
    });

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
        let loadingInterval = animateLoadingIndicator(outputEditor);
        let params = new URLSearchParams();
        let dict = {};
        dict[inferenceParamName] = promptField.value;
        dict[currentFileTextParamName] = currentFileEditor.getValue();
        dict[environmentContextParamName] = contextField.value;
        params.append(openaiAPIKeyParamName, apiKey);
        params.append(openaiOrganizationIDParamName, organizationID);
        post(inferencePath, params, JSON.stringify(dict), (output) => {
            clearInterval(loadingInterval);
            let outputCode = output[inferenceValueResponseKey];
            let outputLanguage = output[inferenceLanguageResponseKey];
            console.log(output);
            outputEditor.setValue(outputCode);
            setEditorLanguage(outputEditor, outputLanguageSelector, outputLanguage);
        }, (error) => {
            clearInterval(loadingInterval);
            outputEditor.setValue('');
            alert('Error: ' + error);
        });
    });

    // Add clear button action.
    let clrBtn = document.getElementById('clear-button');
    clrBtn.addEventListener('click', () => {
        clearFields(null, outputEditor, currentFileEditor, true);
    });

    // All current files
    let currentFiles = [];
    let updateCurrentFiles = function(files) {
        currentFiles = filterFiles(files).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        fileCountLabel.innerHTML = currentFiles.length + " Files";
    }

    let tree;
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
        let file = currentFiles.find((file) => {
            return file.name === node.id;
        });
        clearFields(null, outputEditor, currentFileEditor, false);
        if (file) {
            console.log("Loading new file into editor: " + file.name);
            readFileIntoFileEditor(file, currentFileEditor, currentFileNameField);
        } else {
            console.log("Error! Current file not found for file name: " + node.id + ".");
        }
    };

    // Add file upload responder
    let fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
        updateCurrentFiles([...e.target.files]);
        let file = currentFiles[0];
        readFileIntoFileEditor(file, currentFileEditor, currentFileNameField);

        tree.detach();
        tree.removeAllRootChildren();
        tree.attach();
    });

    // Setup file search
    fileSearchField.addEventListener('input', (e) => {
        let search = e.target.value.toLowerCase();;
        let files = [...fileInput.files].filter((file) => {
            return file.name.toLowerCase().includes(search);
        });
        console.log(files);
        updateCurrentFiles(files);
        tree.detach();
        tree.removeAllRootChildren();
        tree.attach();
    });

    // TODO: Set up resize listeners for sidebar. https://stackoverflow.com/questions/6492683/how-to-detect-divs-dimension-changed
});
