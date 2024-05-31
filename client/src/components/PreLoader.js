import { useState, useEffect } from 'react';


const PreLoader = (src) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.src = src;

        const onLoad = () => setLoaded(true);
        const onError = () => setLoaded(true); // Consider loaded even on error for this example

        img.onload = onLoad;
        img.onerror = onError;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    console.log('laoded', loaded)

    return loaded;
}

export default PreLoader
