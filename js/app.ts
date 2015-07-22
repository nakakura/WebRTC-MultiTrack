/// <reference path="typings/tsd.d.ts" />

module PeerJsSample{
    export class VideoSample{
        constructor(){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            var peer: PeerJs.Peer = new Peer({ key: 'f14a26a9-61af-4723-a3b2-3442f5c9cad5', debug: 3});
            peer.on('open', ()=>{
                console.log("openpeer");
                console.log(peer.id);
                $('#my-id').text(peer.id);
            });

            peer.on('call', (call)=>{
                // Answer the call automatically (instead of prompting user) for demo purposes
                call.answer((<any>window).localStream);
                this._step3(call);
            });

            peer.on('error', (err)=>{
                console.log(err.message);
                // Return to step 2 if error occurs
                this._step2();
            });

            $('#make-call').click(()=>{
                // Initiate a call!
                var call = peer.call($('#callto-id').val(), (<any>window).localStream);

                this._step3(call);
            });

            $('#end-call').click(()=>{
                (<any>window).existingCall.close();
                this._step2();
            });

            // Retry if getUserMedia fails
            $('#step1-retry').click(()=>{
                $('#step1-error').hide();
                this._step1();
            });

            // Get things started
            this._step1();
        }

        private _step1(){
            (<Navigator>navigator).getUserMedia({audio: true, video: true}, (stream)=>{
                // Set your video displays

                (<any>window).localStream = new webkitMediaStream();
                (<any>(<any>window).localStream).addTrack(stream.getVideoTracks()[0]);


                (<Navigator>navigator).getUserMedia({audio: true, video: true}, (stream2)=>{
                    (<any>(<any>window).localStream).addTrack(stream2.getVideoTracks()[0]);

                    // Set your video displays

                    this._step2();
                }, ()=>{ $('#step1-error').show(); });
            }, ()=>{ $('#step1-error').show(); });
        }

        private _step2 () {
            $('#step1, #step3').hide();
            $('#step2').show();
            console.log($("#step2"));
        }

        private _step3 (call) {
            // Hang up on an existing call if present
            if ((<any>window).existingCall) {
                (<any>window).existingCall.close();
            }

            // Wait for stream on the call, then set peer video display
            call.on('stream', (stream)=>{
                $('#their-video').prop('src', URL.createObjectURL(stream));
                var track = stream.getVideoTracks();
                var stream2 = new webkitMediaStream();
                (<any>stream2).addTrack(track[1]);
                $('#their-video2').prop('src', URL.createObjectURL(stream2));
            });

            // UI stuff
            (<any>window).existingCall = call;
            $('#their-id').text(call.peer);
            call.on('close', this._step2);
            $('#step1, #step2').hide();
            $('#step3').show();
        }
    }
}

