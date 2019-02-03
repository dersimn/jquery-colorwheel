$(function() {
    $('.colorpicker').colorwheel({
        /* Defaults:
        rotatable: true,
        magnifyingArc: 15 * Math.PI/180, // 0 hides it
        wheelThickness: 0.4,
        emitEvents: true
        */
    }).on('colorChange', function(e, color, finished) {
        $('#debug').text('color: '+color+'\nfinished: '+finished);
    });
});
