$(function() {
    $('.colorpicker').each(function(e) {
        let canvas = $(this).get(0);
        var context = canvas.getContext("2d");
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var radius = (canvas.width > canvas.height) ? canvas.height/2 : canvas.width/2;
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
