/**
 * Player Controls Component
 * Custom overlay controls
 */
class PlayerControls {
    constructor(container) {
        this.container = container;
        this.visible = false;
    }

    render() {
        this.container.innerHTML = `
            <div class="player-controls-overlay">
                <button class="control-btn focusable" data-action="back" tabindex="0">Back</button>
                <button class="control-btn focusable" data-action="fullscreen" tabindex="0">Fullscreen</button>
            </div>
        `;
    }

    show() {
        this.visible = true;
        this.container.style.opacity = '1';
    }

    hide() {
        this.visible = false;
        this.container.style.opacity = '0';
    }

    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}
