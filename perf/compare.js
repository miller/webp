window.URL = window.URL || window.webkitURL;

var Compare = {
    qualities: [ 90 ],
    run: function( file, callback, options ) {
        this.prepare( file, callback, options );
        this.compress();
    },

    prepare: function( file, callback, options ) {
        this.file = file;
        this.callback = callback;
        this.options = options;
    },

    resize: function( img, type, maxWidth, maxHeight, quality ) {
        var w = img.width,
            h = img.height,
            r = w / h,
            size,
            targetWidth,
            targetHeight,
            result;

        if ( !maxWidth ) {
            targetHeight = Math.min( maxHeight, h );
            targetWidth = targetHeight * r;
        }
        else if ( !maxHeight ) {
            targetWidth = Math.min( maxWidth, w );
            targetHeight = targetWidth / r;
        }

        var canvas = document.createElement( 'canvas' );
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        var ctx = canvas.getContext( '2d' );
        ctx.drawImage( img, 0, 0, targetWidth, targetHeight );

        result = canvas.toDataURL( type, quality/100 );

        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        canvas.width = canvas.height = 0;
        canvas = null;
        img = null;
        ctx = null;

        return {
            content: result,
            size: result.length
        };
    },

    resizeWithQualites: function( img, type ) {
        var results = {},
            opt = this.options,
            me = this;

        this.qualities.forEach( function( q ){
            var rlt = {},
                start = Date.now();
            results[ q ]  = rlt;

            var resizeRlt = me.resize( img, type, opt.maxWidth, opt.maxHeight, q );
            rlt.content = resizeRlt.content;
            rlt.size = resizeRlt.size;
            rlt.time = Date.now() - start;
        } );

        return results;
    },

    compress: function() {
        var img = new Image(),
            me = this;

        img.onload = function() {
            URL.revokeObjectURL( img.src );

            me.file.jpegs = me.resizeWithQualites( img, 'image/jpeg' );
            me.file.webps = me.resizeWithQualites( img, 'image/webp' );

            me.callback && me.callback( me.file );

            console.log( me.file );
        };

        img.src = URL.createObjectURL( this.file );
    }
};