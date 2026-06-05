/**
 * Subtitle Settings Component
 */
class SubtitleSettings {
    constructor(container) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="subtitle-settings">
                <h3>Subtitle Settings</h3>
                <div class="setting-item">
                    <label>Language</label>
                    <select class="focusable">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                    </select>
                </div>
            </div>
        `;
    }
}
