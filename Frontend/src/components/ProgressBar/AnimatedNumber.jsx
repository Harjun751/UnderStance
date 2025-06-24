import { useEffect, useState, useRef } from "react";

export default function AnimatedNumber({ from, to, text, className, style }) {
    from = Number.isFinite(from) ? from : 0;
    to = Number.isFinite(to) ? to : 0;
    const [value, setValue] = useState(from);
    const ref = useRef(null);

    useEffect(() => {
        let startTime = null;
        const duration = 1000; // 1s update
        const totalSteps = Math.abs(to - from);
        if (totalSteps === 0) return;

        // decide on increment value based on pos/neg
        const incrementPolarity = to > from ? 1 : -1;

        const animate = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            const elapsed = timestamp - startTime;

            const progress = Math.min(elapsed / duration, 1);
            const currentStep =
                Math.round(progress * totalSteps) * incrementPolarity;
            const newValue = from + currentStep;
            setValue(newValue);

            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        };

        ref.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(ref.current);
    }, [from, to]);

    return (
        <span style={style} className={className}>
            {value}
            {text}
        </span>
    );
}
