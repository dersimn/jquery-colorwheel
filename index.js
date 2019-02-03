$(function() {
    $('.colorpicker').each(function(e) {
        const canvas = $(this).get(0);

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect(); // Get the size of the canvas in CSS pixels.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext('2d');
        context.scale(dpr, dpr);

        const offset = {
            x: canvas.width/2/dpr,
            y: canvas.height/2/dpr
        };
        const radius = (canvas.width > canvas.height) ? canvas.height/2/dpr : canvas.width/2/dpr;
        const thickness = 0.4;

        function drawColorwheel(startHue = 0) {
            // Color Wheel
            for (var angle = startHue; angle <= 360+startHue; angle++) {
                const startAngle = (angle - 2) * Math.PI/180;
                const endAngle = angle * Math.PI/180;
                context.beginPath();
                context.arc(offset.x, offset.y, (1-thickness/2)*radius, startAngle, endAngle, false);
                context.lineWidth = thickness*radius;
                context.strokeStyle = 'hsl('+(angle+startHue)+', 100%, 50%)';
                context.stroke();
            }

            // Inner color circle
            context.beginPath();
            context.arc(offset.x, offset.y, radius*(1-thickness-0.1), 0, 2*Math.PI, false);
            context.closePath();
            context.fillStyle = 'hsl('+startHue+', 100%, 50%)';
            context.fill();

            // Magnifying Arc
            let magnifierArc = 15;
            context.beginPath();
            context.arc(offset.x, offset.y, radius/2, -1*magnifierArc*Math.PI/180, magnifierArc*Math.PI/180, false);
            context.lineWidth = radius;
            context.strokeStyle = 'hsl('+startHue+', 100%, 50%)';
            context.stroke();

            // Black stroke enveloping inner circle and mag. arc
            context.lineWidth = radius/100;
            context.strokeStyle = 'hsl(0, 100%, 0%)';

            context.beginPath();
            // Around inner circle
            context.arc(offset.x, offset.y, radius*(1-thickness-0.1), magnifierArc*Math.PI/180, -1*magnifierArc*Math.PI/180, false);
            // Around outer circle
            context.arc(offset.x, offset.y, radius-context.lineWidth/2, -1*magnifierArc*Math.PI/180, magnifierArc*Math.PI/180, false);
            context.closePath(); // Close last piece
            context.stroke();
        }
        drawColorwheel();

        // Touch
        let dragging = false;
        let degreeOffset = 0;
        let lastDegree = 0;

        function calcRotation(x, y) {
            var mouse_x = x - offset.x;
            var mouse_y = y - offset.y;
            
            var radians = Math.atan2(mouse_x, mouse_y);
            var degree = radians * 180/Math.PI;

            return degree;            
        };

        function rotationBegin(x, y) {
            dragging = true;
            degreeOffset = calcRotation(x, y);
        }
        function rotationEnd(x, y) {
            let currentDegree = calcRotation(x, y);

            dragging = false;
            lastDegree = currentDegree-degreeOffset+lastDegree;
        }
        function rotationDo(x, y) {
            let currentDegree = calcRotation(x, y);
            let calc = currentDegree-degreeOffset+lastDegree;

            if (dragging) {
                drawColorwheel(calc);
            }

            $('#debug').text('degreeOffset: '+degreeOffset+'\nlastDegree: '+lastDegree+'\ncurrentDegree: '+currentDegree+'\ncalc: '+calc);
        }

        $(this).bind('mousedown', function(e) {
            rotationBegin(e.pageX, e.pageY);
        });
        $(document).bind('mouseup', function(e) {
            rotationEnd(e.pageX, e.pageY);
        });
        $(document).bind('mousemove', function(e) {
            rotationDo(e.pageX, e.pageY);
        });

        $(this).bind('touchstart', function(e) {
            rotationBegin(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
        });
        $(this).bind('touchend', function(e) {
            rotationEnd(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
        });
        $(this).bind('touchmove', function(e) {
            rotationDo(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
        });
    });
});
