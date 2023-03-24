// Posts a request to the provided path with the provided parameters. Returns the post value.
function post(path, params, body, completion) {
    // Make a POST XMLHttpRequest to the endpoint.
    let xhr = new XMLHttpRequest();
    // Add query parameters to the request.
    if (params != null) {
        path = path + '?' + params.toString();
    }
    xhr.open('POST', path);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = () => {
        // Get the response from the server, parsed as JSON.
        if (xhr.status > 299) {
            alert('There was an error in the network request: ' + xhr.responseText);
            return;
        }
        let response = JSON.parse(xhr.responseText);
        completion(response);
    };
    xhr.onerror = () => {
        alert('There was an error in the network request: ' + xhr.responseText);
    };
    xhr.send(body);
}