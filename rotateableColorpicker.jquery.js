(function( $ ) {
    $.fn.colorwheel = function(options) {
        const settings = $.extend({
            rotatable: true,
            magnifyingArc: 15 * Math.PI/180,
            wheelThickness: 0.4,
            emitEvents: true,
            startHue: 0
        }, options);

        return this.each(function() {
            const self = this;

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
            const thickness = settings.wheelThickness;

            function drawColorwheel(startHue = 0) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                
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
                if (settings.magnifyingArc) {
                    const arcSize = settings.magnifyingArc;

                    context.beginPath();
                    context.arc(offset.x, offset.y, radius/2, -1*arcSize, arcSize, false);
                    context.lineWidth = radius;
                    context.strokeStyle = 'hsl('+startHue+', 100%, 50%)';
                    context.stroke();

                    // Black stroke enveloping inner circle and mag. arc
                    context.lineWidth = radius/100;
                    context.strokeStyle = 'black';

                    context.beginPath();
                    context.arc(offset.x, offset.y, radius*(1-thickness-0.1), arcSize, -1*arcSize, false); // Around inner circle
                    context.arc(offset.x, offset.y, radius-context.lineWidth/2, -1*arcSize, arcSize, false); // Around outer circle
                    context.closePath(); // Close last piece
                    context.stroke();
                }
            }
            drawColorwheel(settings.startHue);

            if (settings.rotatable) {
                let dragging = false;
                let degreeOffset = 0;
                let lastDegree = 0;

                function absoluteAngle(ang) {
                    return ((ang%360 < 0) ? (360 + ang%360) : (ang%360))
                }

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

                    if (settings.emitEvents) $(self).trigger('colorChange', [absoluteAngle(lastDegree), true]);
                }
                function rotationDo(x, y) {
                    let currentDegree = calcRotation(x, y);
                    let calc = currentDegree-degreeOffset+lastDegree;

                    if (dragging) {
                        drawColorwheel(calc);
                        if (settings.emitEvents) $(self).trigger('colorChange', [absoluteAngle(calc), false]);
                    }
                }

                // Mouse
                $(this).bind('mousedown', function(e) {
                    rotationBegin(e.offsetX, e.offsetY);
                });
                $(this).bind('mouseup', function(e) {
                    rotationEnd(e.offsetX, e.offsetY);
                });
                $(this).bind('mousemove', function(e) {
                    rotationDo(e.offsetX, e.offsetY);
                });

                // Touch
                function recoverOffsetValues(e) {
                    // https://stackoverflow.com/a/11396681/1997890
                    var rect = e.target.getBoundingClientRect();
                    var bodyRect = document.body.getBoundingClientRect();
                    var x = e.originalEvent.changedTouches[0].pageX - (rect.left - bodyRect.left);
                    var y = e.originalEvent.changedTouches[0].pageY - (rect.top - bodyRect.top);

                    return [x, y];
                }
                $(this).bind('touchstart', function(e) {
                    [x, y] = recoverOffsetValues(e);
                    rotationBegin(x, y);
                });
                $(this).bind('touchend', function(e) {
                    [x, y] = recoverOffsetValues(e);
                    rotationEnd(x, y);
                });
                $(this).bind('touchmove', function(e) {
                    e.preventDefault();

                    [x, y] = recoverOffsetValues(e);
                    rotationDo(x, y);
                });
            }
        });
    };
}( jQuery ));