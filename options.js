function save_options() {
    let normalValue = document.getElementById('normalDpiZoom').value;
    let highValue   = document.getElementById('highDpiZoom').value;

    console.log("option for normal value is : " + normalValue);
    console.log("option for high value is : " + highValue);

    chrome.storage.local.set({
        normalDpiZoomValue: Number(normalValue),
        highDpiZoomValue: Number(highValue),
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.local.get({
        normalDpiZoomValue: 1,
        highDpiZoomValue: 1.25,
    }, function(items) {
        document.getElementById('normalDpiZoom').value = items.normalDpiZoomValue;
        document.getElementById('highDpiZoom').value = items.highDpiZoomValue;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);