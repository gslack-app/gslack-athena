function doGet(request) {
    return app.doGet(request);
}

function doPost(request) {
    return app.doPost(request);
}

function onOpen(e) {
    return app.onOpen(e);
}

function authorizeScript() {
    return app.authorizeScript();
}

function initSettings() {
    return app.initSettings();
}

function html(files, ext) {
    return app.html(files, ext);
}

function css(files) {
    return app.css(files);
}

function js(files) {
    return app.js(files);
}
