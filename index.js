$(function() {
    $('.colorpicker').each(function(e) {
        const canvas = $(this).get(0);

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect(); // Get the size of the canvas in CSS pixels.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext("2d");
        context.scale(dpr, dpr);

        const offset = {
            x: canvas.width/2/dpr,
            y: canvas.height/2/dpr
        };
        const radius = (canvas.width > canvas.height) ? canvas.height/2/dpr : canvas.width/2/dpr;
        const thickness = 0.4;

        function drawColorwheel(startHue = 0) {
            for (var angle = startHue; angle <= 360+startHue; angle++) {
                const startAngle = (angle - 2) * Math.PI/180;
                const endAngle = angle * Math.PI/180;
                context.beginPath();
                context.arc(offset.x, offset.y, (1-thickness/2)*radius, startAngle, endAngle, false);
                context.lineWidth = thickness*radius;
                context.strokeStyle = 'hsl('+(angle+startHue)+', 100%, 50%)';
                context.stroke();
            }

            context.beginPath();
            context.arc(offset.x, offset.y, radius*(1-thickness-0.1), 0, 2*Math.PI, false);
            context.closePath();
            context.fillStyle = 'hsl('+startHue+', 100%, 50%)';
            context.fill();
        }
        drawColorwheel();

        // Touch
        let dragging = false;

        var MouseDown = function(e) {
            dragging = true;
        };
        var MouseUp = function() {
            dragging = false;  
        };
        var MouseMove = function(e) {
            var mouse_x = e.pageX - offset.x;
            var mouse_y = e.pageY - offset.y;
            
            var radians = Math.atan2(mouse_x, mouse_y);
            var degree = radians * 180/Math.PI;
            
            $("#debug").text("X: "+mouse_x+"\nY: "+mouse_y+"\nrad: "+radians+"\ndeg: "+degree);

            if (dragging) {
                drawColorwheel(degree-90);
            }
        };

        $(this).bind("mousedown", MouseDown);
        $(document).bind("mouseup", MouseUp);
        $(document).bind("mousemove", MouseMove);
    });
});
