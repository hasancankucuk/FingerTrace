export const checkWebPSupport = (): object => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    
    const isWebPSupported = canvas.toDataURL && canvas.toDataURL("image/webp").startsWith("data:image/webp");
    
    return {
        isWebPSupported,
        canvas: isWebPSupported ? canvas.toDataURL("image/webp") : "WebP not supported"
    };
}