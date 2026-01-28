import { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

export function Image({ src, alt, className = '', fallback = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', ...props }: ImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        const img = new window.Image();
        img.src = src;
        img.onload = () => setLoaded(true);
        img.onerror = () => {
            setLoaded(true);
            setError(true);
        };
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Skeleton / Placeholder background */}
            {!loaded && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
            )}

            <img
                src={error ? fallback : src}
                alt={alt}
                className={`
          transition-opacity duration-500 ease-in-out
          ${loaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
                loading="lazy"
                {...props}
            />
        </div>
    );
}
