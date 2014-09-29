
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: {
                title: 'Home data (maybe project title with image)'
            },
            sounds: {
                title: 'all recorded sounds ordered by datetime desc(list view)'
            },
            pictures: {
                title: 'all pictures ordered by datetime desc (grid view)'
            }
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {
        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        if (networkState === states[Connection.NONE]) {
            navigator.notification.alert('Active network connection is needed for this app');
        }

        window.everlive = new Everlive("DFFH77PjPzvO7vLe");
        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {

            // you can change the default transition (slide, zoom or fade)
            transition: 'slide',

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            //skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/home.html'
        });

    }, false);


}());