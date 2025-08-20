import { DocumentChecker } from "../../helpers/index";

export const getCanvasHash = (): number => {
    let hash = 0;

    if (DocumentChecker()) {
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            // Skip DOM operations in test environment
            if (!process.env.NODE_ENV?.includes('test')) {
                canvas.style.visibility = 'hidden';
                const context = canvas.getContext('2d');

                if (context) {
                    const text = 'i9asdm..$#po((^@KbXrww!~cz';
                    context.textBaseline = "alphabetic";
                    context.font = "16px 'Arial'";
                    context.rotate(0.05);
                    context.fillStyle = "#f60";
                    context.fillRect(125, 1, 62, 20);
                    context.fillStyle = "#069";
                    context.fillText(text, 2, 15);
                    context.fillStyle = "rgba(102, 200, 0, 0.7)";
                    context.fillText(text, 4, 17);
                    context.shadowBlur = 10;
                    context.shadowColor = "blue";
                    context.fillRect(-20, 10, 234, 5);
                }

                const dataUrl = canvas.toDataURL();
                document.body.appendChild(canvas);

                if (!dataUrl) {
                    return 0;
                }

                for (let i = 0; i < dataUrl.length; i++) {
                    const char = dataUrl.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
            }
        } catch (e) {
            console.error('Canvas operations failed:', e);
        }
    }

    return hash;
};
