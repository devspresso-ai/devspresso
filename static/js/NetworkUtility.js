// Posts an inference request to the provided inference path with the provided parameters. Returns the inference value.
function postInference(inferencePath, params, inferenceValueResponseKey, completion) {
    // Make a POST XMLHttpRequest to the `/infer` endpoint.
    let xhr = new XMLHttpRequest();
    // Add query parameters to the request.
    xhr.open('POST', inferencePath + '?' + params.toString());
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = () => {
        // Get the response from the server, parsed as JSON.
        if (xhr.status > 299) {
            alert('There was an error in the network request: ' + xhr.statusText);
            return;
        }
        let response = JSON.parse(xhr.responseText);
        completion(response);
    };
    xhr.onerror = () => {
        alert('There was an error in the network request: ' + xhr.statusText);
    };
    xhr.send();
}
