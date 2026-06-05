/**
 * Navigation Integration Tests
 */

function testSpatialNavigation() {
    console.log('Testing Spatial Navigation...');

    // Create test container
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="focusable" id="item1" tabindex="0">Item 1</div>
        <div class="focusable" id="item2" tabindex="0">Item 2</div>
        <div class="focusable" id="item3" tabindex="0">Item 3</div>
    `;
    document.body.appendChild(container);

    // Add focusables
    spatialNavigation.addFocusables(container);

    // Test initial focus
    const firstFocusable = spatialNavigation.getFirstFocusable();
    console.assert(firstFocusable !== null, 'First focusable not found');

    // Test focus manager
    focusManager.setFocus(firstFocusable);
    console.assert(focusManager.getCurrentFocus() === firstFocusable, 'Focus not set correctly');

    // Cleanup
    document.body.removeChild(container);

    console.log('Navigation tests passed!');
}

function testKeyHandler() {
    console.log('Testing Key Handler...');

    let keyPressed = false;
    keyHandler.on('test', KEY_CODES.OK, () => {
        keyPressed = true;
    });

    // Simulate key press
    const event = new KeyboardEvent('keydown', { keyCode: KEY_CODES.OK });
    document.dispatchEvent(event);

    console.assert(keyPressed === true, 'Key handler callback not triggered');

    keyHandler.off('test', KEY_CODES.OK);

    console.log('Key Handler tests passed!');
}

if (typeof window !== 'undefined') {
    console.log('Running integration tests...');
    testSpatialNavigation();
    testKeyHandler();
    console.log('All integration tests completed!');
}
