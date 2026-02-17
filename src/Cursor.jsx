import { useEffect, useRef } from 'react';

const Cursor = () => {
    const canvasRef = useRef(null);
    const points = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            // Add point immediately on move for responsiveness
            points.current.push({
                x: e.clientX,
                y: e.clientY,
                age: 0
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        const update = () => {
            // Decaying tail effect
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add point if mouse is moving (optional, but handled by event listener)
            // We can also add points continuously if we want a trail even when static (growing)
            // But for this effect, input driven is better.

            // Filter dead points and update age
            points.current = points.current.filter(p => p.age < 50);
            points.current.forEach(p => p.age++);

            if (points.current.length > 1) {
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Draw multiple lines for "tubes" effect
                // Requested: "half the amount of tubes" -> simpler polyline

                for (let i = 0; i < points.current.length - 1; i++) {
                    const p1 = points.current[i];
                    const p2 = points.current[i + 1];

                    const alpha = 1 - p1.age / 50;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    // Desaturated colors: White/Grey
                    // Varying stroke width based on age
                    ctx.lineWidth = (1 - p1.age / 50) * 4;
                    ctx.strokeStyle = `rgba(252, 245, 229, ${alpha * 0.5})`; // Using our new cyber-yellow (pale cream)
                    ctx.stroke();

                    // Optional second line for "tube" feel
                    ctx.beginPath();
                    ctx.moveTo(p1.x - 2, p1.y - 2);
                    ctx.lineTo(p2.x - 2, p2.y - 2);
                    ctx.lineWidth = (1 - p1.age / 50) * 2;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(update);
        };
        update();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100] mix-blend-difference"
        />
    );
};

export default Cursor;
