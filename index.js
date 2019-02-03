$(function() {
    $('.colorpicker').each(function(e) {
        let canvas = $(this).get(0);

        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect(); // Get the size of the canvas in CSS pixels.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        var context = canvas.getContext("2d");
        context.scale(dpr, dpr);

        var x = canvas.width/2/dpr;
        var y = canvas.height/2/dpr;
        var radius = (canvas.width > canvas.height) ? canvas.height/2/dpr : canvas.width/2/dpr;
        var thickness = 0.4;

        console.log(canvas.width, canvas.height);

        for (var angle=0; angle<=360; angle+=1) {
            var startAngle = (angle-2)*Math.PI/180;
            var endAngle = angle * Math.PI/180;
            context.beginPath();
            context.arc(x, y, (1-thickness/2)*radius, startAngle, endAngle, false);
            context.lineWidth = thickness*radius;
            context.strokeStyle = 'hsl('+angle+', 100%, 50%)';
            context.stroke();
        }

        context.beginPath();
        context.arc(x, y, radius*(1-thickness-0.1), 0, 2*Math.PI, false);
        context.closePath();
        context.fillStyle = 'hsl('+0+', 100%, 50%)';
        context.fill();
    });
});
