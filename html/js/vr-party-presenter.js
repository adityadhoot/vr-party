var _socket = io();
var _sessionId;
var _viewer;
var _last_distance_to_target;
var _view_data_bucket = 'vrparty';

var _modelPosition  = new THREE.Vector3(0, 1, 0);
var _modelTarget  = new THREE.Vector3(0, 1, 0);
var _modelUp  = new THREE.Vector3(0, 1, 0);
/*
var _modelPosition  = [0, 1, 0];
var _modelTarget = [0, 1, 0];
var _modelUp = [0, 1, 0];
*/
var _default_models = {

    /*'robot arm'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1JvYm90QXJtLmR3Zng=',
    'welding robot' : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9BQkJfcm9ib3QuZHdm',
    'ergon chair'   : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0VyZ29uLnppcA==',
    'differential'  : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0RpZmYuZHdmeA==',
    'suspension'    : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1N1c3BlbnNpb24uZHdm',
    'house'         : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2hvdXNlLmR3Zng=',
    'flyer one'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0ZseWVyT25lLmR3Zng=',
    'motorcycle'    : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL01vdG9yY3ljbGUuZHdmeA==',
    'V8 engine'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1Y4RW5naW5lLnN0cA==',
    //'aotea'         : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2FvdGVhMy5kd2Y=',
    //'dinghy'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2RpbmdoeS5mM2Q=',
    'column'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL3RhYmxldDIuemlw',
    'tablet'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2VneXB0NC56aXA=',
    //'trophy'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9Ucm9waHlfQW5nZWxIYWNrLmYzZA==',
    'cake'          : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9IQkM0LmR3Zng=',
    'movement'      : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9FVEFfNjQ5Ny0xX01vdmVtZW50X0NvcnJlY3RlZF8zLmR3Zg',
    */
    'Model 1'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9SRVQuZmJ4'},
    'Model 2'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9SRVRfcmhvLmZieA'},
    'Model 3'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9yaG9fbWV0YUlJX2NvbXBhcmlzb24xLmZieA'},
    'Model 4'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9yaG9fbWV0YUlJX2NvbXBhcmlzb24xLmZieA', 'position' : _modelPosition.set(1.070601310812627, 13.540546683603289, 34.15308925414119),'target' : _modelTarget.set(-24.600037229503926,-101.23622130485953, -176.37479949455445), 'up' : _modelUp.set(-0.05760814638944857,0.8794721478904365,-0.47245110070202395)},
    //'Model 4'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9yaG9fbWV0YUlJX2NvbXBhcmlzb24xLmZieA', 'position' : _modelPosition = [1.070601310812627, 13.540546683603289, 34.15308925414119],'target' : _modelTarget = [-24.600037229503926,-101.23622130485953, -176.37479949455445], 'up' : _modelUp = [-0.05760814638944857,0.8794721478904365,-0.47245110070202395]},
    'Model 5'       : {'urn': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9tZXRhbGxfR2FscGhhLmZieA'}
};

var _hosts = [ 'vr-party.herokuapp.com', 'www.vrok.it' ];

//
//  Initialize
//

function initialize() {
    
    _sessionId = getURLParameter('session');
    if (_sessionId) {        
        // Only generate the UI if a session ID was passed in via the URL

        // Populate our initial UI with a set of buttons, one for each function in the Buttons object
        var panel = document.getElementById('control');
        for (var name in _default_models) {
            var urn = _default_models[name].urn;
            if (_default_models[name].position && _default_models[name].target && _default_models[name].up) {
                var pos = _default_models[name].position;
                var tar = _default_models[name].target;
                var up = _default_models[name].up;
                addButton(panel, name, function(urn, pos, tar, up) { return function() { launchUrn(urn, pos, tar, up) } }(urn, pos, tar, up));
            }
            else
                addButton(panel, name, function(urn) { return function() { launchUrn(urn); } }(urn));
        }
    
        var base_url = window.location.origin;
        if (_hosts.indexOf(window.location.hostname) > -1) {
            // Apparently some phone browsers don't like the mix of http and https
            // Default to https on Heroku deployment
            base_url = 'https://' + window.location.hostname;
        }
    
        var url = base_url + '/participant.html?session=' + _sessionId;
        $('#url').attr('href', url);
        $('#qrcode').qrcode(url);
        $('#join').text(base_url+"/join?id=" + _sessionId);
        //$('#join').text("www.vrok.it/join?id=" + _sessionId);
        
        // If the provided session exists then load its data (right now just its URN)
        $.get(
            window.location.origin + '/api/getSession/' + _sessionId,
            function(req2, res2) {
                if (res2 === "success") {

                    readCookiesForCustomModel();
                    initializeSelectFilesDialog();

                    if (req2 !== "") {
                        Autodesk.Viewing.Initializer(getViewingOptions(), function() {
                            launchUrn(req2);
                        });
                    }
                    else {
                        // Otherwise we'll create a session with this name
                        // (we may want to disable this for security reasons,
                        // but it's actually a nice way to create sessions
                        // with custom names)
                        _socket.emit('create-session', { id: _sessionId });

                        // Initialize viewing but don't start a viewer                        
                        Autodesk.Viewing.Initializer(getViewingOptions(), function() {
                            showAbout();
                            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
                        });
	                }
                }
            }
        );
    }
    else {
        // If no session was provided, redirect the browser to a session
        // generated by the server
        $.get(
            window.location.origin + '/api/sessionId',
            function(res) {
                _sessionId = res;
                window.location.href = window.location.origin + "?session=" + _sessionId;
                //window.location.replace(window.location.origin + "?session=" + _sessionId);
            }
        );    
    }
}


//
//  Terminate
//

function terminate() {
    if (_sessionId) {
        _socket.emit('close-session', { id: _sessionId });
    }
}


function addButton(panel, buttonName, loadFunction) {
    var button = document.createElement('div');
    button.classList.add('cmd-btn-small');

    button.innerHTML = buttonName;
    button.onclick = loadFunction;

    panel.appendChild(button);
}


function launchUrn(urn,pos,tar,up) {

    var viewerToClose;
    
    // Uninitializing the viewer helps with stability
    if (_viewer) {
        viewerToClose = _viewer;
        _viewer = null;
    }
    
    if (urn) {
        
        $('#aboutDiv').hide();
        $('#3dViewDiv').show();
        
        _socket.emit('lmv-command', { session: _sessionId, name: 'load', value: urn });
    
        urn = urn.ensurePrefix('urn:');
        
        Autodesk.Viewing.Document.load(
            urn,
            function(documentData) {
                var model = getModel(documentData);
                if (!model) return;
    
                _viewer = new Autodesk.Viewing.Private.GuiViewer3D($('#3dViewDiv')[0]);
                _viewer.start();
                _viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onCameraChange);
                _viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, onIsolate);
                _viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, onHide);
                _viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, onShow);
                _viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, onExplode);
                _viewer.addEventListener(Autodesk.Viewing.CUTPLANES_CHANGE_EVENT,onSection);
                _viewer.addEventListener(Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT, onRenderOption);

                resetSize(_viewer.container);
                    
                if (viewerToClose) {
                    viewerToClose.finish();
                }
                
                if (pos && tar && up)
                    loadModelWithInitialView(_viewer, model, pos, tar, up);
                else {
                    loadModel(_viewer, model);
                }
            }
        );
    }
    else {
        // Create a blank viewer on first load
        _viewer = new Autodesk.Viewing.Private.GuiViewer3D($('#3dViewDiv')[0]);
        resetSize(_viewer.container);
    }
}


function resetSize(elem, fullHeight) {
    elem.style.width = window.innerWidth - 360 + 'px'; // subtract the left column
    if (fullHeight) {
        elem.style.height = '';
    }
    else {
        elem.style.height = (window.innerHeight - 40) + 'px'; // subtract the table padding
    }
}


//
//  Viewer3D events
//

function onCameraChange(event) {
    
    // With OBJ models the target moves to keep equidistant from the camera
    // So we just check the distance from the origin rather than the target
    // It seems to work, anyway!
    var distance_to_target = _viewer.navigation.getPosition().length(); //distanceTo(_viewer.navigation.getTarget());
    if (_last_distance_to_target === undefined || Math.abs(distance_to_target - _last_distance_to_target) > 0.1) {
        _socket.emit('lmv-command', { session: _sessionId, name: 'zoom', value: distance_to_target });
        _last_distance_to_target = distance_to_target;
    }
}

function setInitialView(pos, trg, up) {
    // Make sure our up vector is correct for this model
    //_viewer.navigation.setWorldUpVector(_upVector, true);
    _viewer.navigation.setView(pos, trg);
    _viewer.navigation.setCameraUpVector(up);
}

// Translate a list of objects (for R13 & R14) to a list of IDs
// Socket.io prefers not to have binary content to transfer, it seems
function getIdList(ids) {
    if (ids.length > 0 && typeof ids[0] === 'object') {
       ids = ids.map(function(obj) { return obj.dbId;});
    }
    return ids;
}

function onIsolate(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'isolate', value: getIdList(event.nodeIdArray) });
}


function onHide(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'hide', value: getIdList(event.nodeIdArray) });
}


function onShow(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'show', value: getIdList(event.nodeIdArray) });
}


function onExplode() {
    _socket.emit('lmv-command', { session: _sessionId, name: 'explode', value: _viewer.getExplodeScale() });
}


function onSection(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'section', value: _viewer.getCutPlanes() });
}


function onRenderOption(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'render', value: _viewer.impl.currentLightPreset() });
}


//
//  Models upload
//

function onFileSelect() {
    var el = document.getElementById('fileElem');
    if (el) {
        el.click();
    }
}


function cancel() {
    $(this).dialog('close');
    $('#upload-button').html('Upload file');
}


function upload() {

    $('#upload-button').html('Uploading...');
    
    var filteredForUpload = new Array();

    $(':checkbox').each(function() {
        if ($(this).is(':checked')) {
            // 'filesToUpload' seems to be not a regular array, 'filter()'' function is undefined
            for (var i = 0; i < filesToUpload.length; ++i) {
                var file = filesToUpload[i];
                if (file.name == $(this).val()) {
                    filteredForUpload.push(file);
                }
            }
        }
    });

    console.log("Filtered for upload");
    for (var i = 0; i < filteredForUpload.length; ++i) {
        var file = filteredForUpload[i];
        console.log('Selected file: ' + file.name + ' size: ' + file.size);
    }

    onUpload(filteredForUpload);

    $(this).dialog('close');
}


function deselectAllFiles() {
    $(':checkbox').prop('checked', false);
    $(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
}


function selectAllFiles() {
    $(':checkbox').prop('checked', true);
    $(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
}


function initializeSelectFilesDialog() {
    var dlg = document.getElementsByName("upload-files");

    if (dlg.length == 0) {

        var dlgDiv = document.createElement("div");
        dlgDiv.id = "upload-files";
        dlgDiv.title='Uploading files';
        document.getElementsByTagName("body")[0].appendChild(dlgDiv);

        $('#upload-files').append("<p>The following files are larger than 2MB. Are you sure you want to upload them?</p>");

        var buttons = {
            Cancel: cancel,
            'OK': upload,
            'Deselect All': deselectAllFiles,
            'Select All': selectAllFiles
        };

        $('#upload-files').dialog({ 
            autoOpen: false, 
            modal: true,
            buttons: buttons,
            width:"auto",
            resizable: false,
        });
    }
}


function clearCheckBoxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (checkboxes) {
        checkboxes.parentNode.removeChild(checkboxes);
    }

    checkboxes = document.createElement('div');
    checkboxes.id = "checkboxes";
    $('#upload-files').append(checkboxes);
}


function createCheckBox(fileName) {
    var id = "filename-checkbox-" + fileName;
    var checkbox = document.createElement('input');
    checkbox.id = id;
    checkbox.type = "checkbox";
    checkbox.name = "upload-files";
    checkbox.value = fileName;
    
    $("#upload-files").change(function() {
        var numberChecked = $("input[name='upload-files']:checked").size();
        if (numberChecked > 0) {
            $(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
        } else {
            $(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
        }
    });

    var label = document.createElement('label');
    label.htmlFor = id;
    label.appendChild(document.createTextNode(fileName));

    var br = document.createElement('br');

    $('#checkboxes').append(checkbox);
    $('#checkboxes').append(label);
    $('#checkboxes').append(br);
}


function resetSelectedFiles() {
   var fileElem = $("#fileElem");
    fileElem.wrap("<form>").closest("form").get(0).reset();
    fileElem.unwrap();
}


function onFilesDialogCalled(files) {
    filesToUpload = [];
    var sizeLimit = 2097152; // 2MB

    clearCheckBoxes();

    var numberFilesLargerThanLimit = 0;
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        if (file.size > sizeLimit) {
            ++numberFilesLargerThanLimit;
            createCheckBox(file.name);
        }

        filesToUpload.push(file);
    }

    // select all files in the confirmation dialog
    selectAllFiles();

    // reset FilesSet property of the input element
    resetSelectedFiles();

    if (numberFilesLargerThanLimit > 0) {
        $('#upload-files').dialog('open');
    } else {
        onUpload(filesToUpload);
    }
}


function onUpload(files) {
    $.get(
        window.location.origin + '/api/token',
        function(accessTokenResponse) {
            var viewDataClient = new Autodesk.ADN.Toolkit.ViewData.AdnViewDataClient(
                'https://developer.api.autodesk.com',
                accessTokenResponse
            );
            viewDataClient.getBucketDetailsAsync(
                _view_data_bucket,
                function(bucketResponse) {
                    //onSuccess
                    console.log('Bucket details successful:');
                    console.log(bucketResponse);
                    uploadFiles(viewDataClient, _view_data_bucket, files);
                },
                function(error) {
                    //onError
                    console.log("Bucket doesn't exist");
                    console.log('Attempting to create...');
                }
            );
        }
    );
}


function uploadFiles(viewDataClient, bucket, files) {
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        console.log('Uploading file: ' + file.name + ' ...');
        viewDataClient.uploadFileAsync(
            file,
            bucket,
            file.name.replace(/ /g,'_'), // Translation API cannot handle spaces...
            function(response) {
                //onSuccess
                console.log('File upload successful:');
                console.log(response);
                var fileId = response.objects[0].id;
                var registerResponse = viewDataClient.register(fileId);

                if (registerResponse.Result === 'Success' ||
                    registerResponse.Result === 'Created') {
                    console.log('Registration result: ' + registerResponse.Result);
                    console.log('Starting translation: ' + fileId);

                    checkTranslationStatus(
                        viewDataClient,
                        fileId,
                        1000 * 60 * 5, //5 mins timeout
                        function(viewable) {
                            //onSuccess
                            console.log('Translation successful: ' + response.file.name);
                            console.log('Viewable: ');
                            console.log(viewable);

                            var urn = viewable.urn;

                            // add new button
                            var panel = document.getElementById('control');
                            var name = truncateName(response.file.name);
                            addButton(panel, name, function(urn) { return function() { launchUrn(urn); } }(urn));

                            // open it in a viewer
                            launchUrn(urn);

                            // and store as a cookie
                            createCookieForCustomModel('custom_model_' + response.file.name, urn);
                        });
                }
            },

            //onError
            function (error) {
                console.log('File upload failed:');
                console.log(error);
            });
    }
}


function checkTranslationStatus(viewDataClient, fileId, timeout, onSuccess) {
    var startTime = new Date().getTime();
    var timer = setInterval(function() {
        var dt = (new Date().getTime() - startTime) / timeout;
        if (dt >= 1.0) {
            clearInterval(timer);
        } else {
            viewDataClient.getViewableAsync(
                fileId,
                function(response) {
                    console.log(response);
                    console.log('Translation Progress ' + fileId + ': ' + response.progress);
                    $('#upload-button').html(response.progress);

                    if (response.progress === 'complete') {
                        clearInterval(timer);
                        onSuccess(response);
                        $('#upload-button').html('Upload file');
                    }
                },
                function(error) {}
            );
        }
    }, 2000);
};


//
//  Models stored in cookies
//

function truncateName(name) {
    var dotIdx = name.lastIndexOf(".");
    if (dotIdx != -1) {
        var name = name.substring(0, dotIdx);

        if (name.length > 8) {
            name = name.substring(0, 8) + "...";
        }
    }

    return name;
}


function createCookieForCustomModel(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
    } else {
        var expires = '';
    }

    var urn = encodeURIComponent(value);
    document.cookie = name + '=' + urn + expires + '; path=/';
}


function readCookiesForCustomModel() {
    var prefix = 'custom_model_';
    var cookies = document.cookie.split(';');

    for (var i in cookies) {
        var c = cookies[i];
        if (c.indexOf(prefix) != -1) {
            c = c.replace(prefix, '');
            var nameValue = c.split('=');
            if (nameValue) {
                var panel = document.getElementById('control');
                addButton(panel, truncateName(nameValue[0]), function(urn) {
                    return function() { launchUrn(urn); }
                }(decodeURIComponent(nameValue[1])));
            }
        }
    }
}


function showAbout() {
    $('#aboutDiv').css('text-indent', 0);
    resetSize($('#layer2')[0], true);
    $('#3dViewDiv').hide();
    $('#aboutDiv').show();
}


// Prevent resize from being called too frequently
// (might want to adjust the timeout from 50ms)
var resize = debounce(function() {
    var div = $('#3dViewDiv');
    var viewing = div.is(':visible');
    resetSize(viewing ? _viewer.container : $('#layer2')[0], !viewing);
}, 50);