function save_options() {
    let normalValue = document.getElementById('normalDpiZoom').value;
    let highValue   = document.getElementById('highDpiZoom').value;

    console.log("option for normal value is : " + normalValue);
    console.log("option for high value is : " + highValue);

<<<<<<< HEAD
    chrome.storage.local.set({
        normalDpiZoomValue: Number(normalValue),
        highDpiZoomValue: Number(highValue),
=======
    chrome.storage.sync.set({
        normalDpiZoomValue: normalValue,
        highDpiZoomValue: highValue,
>>>>>>> fa59ed29fbf05cae3091fafd0360fe431d520054
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
<<<<<<< HEAD
    chrome.storage.local.get({
        normalDpiZoomValue: 1,
        highDpiZoomValue: 1.25,
=======
    chrome.storage.sync.get({
        normalDpiZoomValue: "1",
        highDpiZoomValue: "1.25",
>>>>>>> fa59ed29fbf05cae3091fafd0360fe431d520054
    }, function(items) {
        document.getElementById('normalDpiZoom').value = items.normalDpiZoomValue;
        document.getElementById('highDpiZoom').value = items.highDpiZoomValue;
    });
}

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
=======
document.getElementById('save').addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options);
>>>>>>> fa59ed29fbf05cae3091fafd0360fe431d520054
