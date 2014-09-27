            // Audio player
            //
           var my_media = null;
           var mediaTimer = null;
           var mediaRec = null;
           var recInterval = null;

           function formatDate() {
               now = new Date();
               year = "" + now.getFullYear();
               month = "" + (now.getMonth() + 1);
               if (month.length == 1) {
                   month = "0" + month;
               }
               day = "" + now.getDate();
               if (day.length == 1) {
                   day = "0" + day;
               }
               hour = "" + now.getHours();
               if (hour.length == 1) {
                   hour = "0" + hour;
               }
               minute = "" + now.getMinutes();
               if (minute.length == 1) {
                   minute = "0" + minute;
               }
               second = "" + now.getSeconds();
               if (second.length == 1) {
                   second = "0" + second;
               }
               return year + "" + month + "" + day + "_" + hour + "" + minute + "" + second;
           }

            // Record audio
            //  
           function recordAudio() {
               var src = 'MyRecording_' + formatDate() + '.mp3';
               mediaRec = new Media(src, onSuccess, onError);

               // Record audio
               mediaRec.startRecord();

               var recTime = 0;
               recInterval = setInterval(function() {
                   recTime = recTime + 1;
                   setAudioPosition(recTime + " sec");
               }, 1000);
           }

            // Play audio
            //
           function playAudio() {
               var src = 'http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3'
                   // Create Media object from src
               my_media = new Media(src, onSuccess, onError);

               // Play audio
               my_media.play();

               // Update my_media position every second
               if (mediaTimer == null) {
                   mediaTimer = setInterval(function() {
                       // get my_media position
                       my_media.getCurrentPosition(
                           // success callback
                           function(position) {
                               if (position > -1) {
                                   setAudioPosition((position) + " sec");
                               }
                           },
                           // error callback
                           function(e) {
                               console.log("Error getting pos=" + e);
                               setAudioPosition("Error: " + e);
                           }
                       );
                   }, 1000);
               }
           }


            // Stop audio
            //
           function stopAudio() {
               if (mediaRec) {
                   mediaRec.stopRecord();
               }
               clearInterval(recInterval);
               recInterval = null;
               document.getElementById('media').innerHTML = '';
               document.getElementById('audio_position').innerHTML = '';
           }

            // onSuccess Callback
            //
           function onSuccess() {
               console.log("playAudio():Audio Success");
           }

            // onError Callback
            //
           function onError(error) {
               // alert('code: ' + error.code + '\n' +
               //     'message: ' + error.message + '\n');
           }

            // Set audio position
            //
           function setAudioPosition(position) {
               document.getElementById('media').innerHTML = 'Recording audio...';
               document.getElementById('audio_position').innerHTML = position;
           }
