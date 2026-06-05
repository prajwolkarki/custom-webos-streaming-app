/**
 * Video Player Component
 * Embeds VidSrc iframe
 */
class VideoPlayer {
    constructor(container, embedUrl) {
        this.container = container;
        this.embedUrl = embedUrl;
    }

    render() {
        this.container.innerHTML = `
            <iframe 
                id="video-player-iframe"
                src="${this.embedUrl}"
                frameborder="0"
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
        `;
    }

    destroy() {
        const iframe = document.getElementById('video-player-iframe');
        if (iframe) {
            iframe.src = '';
        }
    }
}
