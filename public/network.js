class Network
{
    static Request(type, data, callback) {
        var request = new XMLHttpRequest();
        request.open(type, data);
        request.responseType = 'text';
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                callback(request.responseText);
            }
        }
        request.send();
    }
}