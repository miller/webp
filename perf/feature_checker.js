var FeatureChecker = {

    testImages: {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    },

    check: function(feature, callback) {
        var kTestImages = this.testImages;
        var img = new Image();
        img.onload = function () {
            var result = (img.width > 0) && (img.height > 0);
            callback(feature, result);
        };
        img.onerror = function () {
            callback(feature, false);
        };
        img.src = "data:image/webp;base64," + kTestImages[feature];
    },

    checkAllAndDisplay: function( container ) {
        var table = [ '<table class="table table-bordered"><tr>' ],
            count = 0,
            support = false,
            html = [];
        for( var feature in this.testImages ) {
            this.check( feature, function( ft, rlt ) {
                support = support || rlt;
                var rltTxt = rlt ? 'ok' : 'remove';

                html.push( '<td>' + ft + '</td>' );
                html.push( '<td><span class="glyphicon glyphicon-' + rltTxt + '"></span></td>' );

                if( html.length === 8 ) {
                    html.push( '</tr></table>');
                    $( container ).html( table.join('') + html.join('') );

                    if( !support ) {
                        $( 'body' ).addClass( 'notsupport' );
                        $(　'#start_btn' ).attr( 'disabled', 'disabled' );
                    }
                }
            } );
        }
    }
};