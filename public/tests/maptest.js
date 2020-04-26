import {map, mapLoaded, onDistClick, onModeClick, startFollowing, stopFollowing} from './../javascript/index.js';

QUnit.module("jog");

// Test loading functions
// Load the map
QUnit.test("Map Load", function(assert) {
    assert.ok(mapLoaded, 0, "Passed!");
})

// Test the option modules
// Mode selection
QUnit.test("Mode Selection Test", function(assert)  {
    assert.ok(onModeClick, 0, "Passed!");
});
// Distance selection
QUnit.test("Distance Selection Test", function(assert)  {
    assert.ok(onDistClick, 0, "Passed!");
});
// Linear location selection
QUnit.test("Linear Destination Selection Test", function(assert)    {
    // Declare that 1 assertion is expected
    assert.expect(1);
    // Set a new click event on the map to test the click trigger
    map.getMap().on("click", function(e) {
        assert.ok(map.onClick, 0, "Passed!")
    });
    // Change mode to Linear
    document.querySelector("#circular").checked = false;
    document.querySelector("#linear").checked = true;
    onModeClick();
    // Trigger a click on the map
    map.getMap().getCanvas().click();
});

// Test the jog completion code
// Start a jog, wait a second, and end the jog
QUnit.test("Start and Stop Following Test", function(assert)    {
    assert.ok(startFollowing, 0, "startFollowing passed!");
    setTimeout(assert.ok(stopFollowing, 0, "stopFollowing passed!"), 2000);
});