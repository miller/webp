var CanvasSize = {
    calc: function( canvas, type, success, error ) {
        this.canvas = canvas;
        this.type = type;
        this.success = success;
        this.error = error || function() {};

        if( !( 'webkitRequestFileSystem' in window ) &&
            !( 'requestFileSystem' in window ) ) {
            this.error();
            return;
        }

        var me = this;

        ( window.webkitRequestFileSystem || window.requestFileSystem )(
            window.TEMPORARY, 50*1024*1024 /*50MB*/, 
            function( fs ) {
                me.onInitFs( fs );
            }, me.error
        );
    },

    onInitFs: function( fs ) {
        var me = this;

        me.canvas.toBlob( function( blob ) {
            me.canvas.getContext('2d').clearRect( 0, 0, me.canvas.width, me.canvas.height );
            me.canvas.width = me.canvas.height = 0;

            fs.root.getFile( 'temp.' + (me.type.split('/'))[1], { create: true },
                function(fileEntry) {

                    // Create a FileWriter object for our FileEntry (log.txt).
                    fileEntry.createWriter(function(fileWriter) {

                      fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                        fileEntry.getMetadata(function(){
                            console.log( arguments );
                        });
                      };

                      fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                      };

                      fileWriter.write( blob );

                    }, me.error);

            }, me.error );

        }, this.type );
    }
};