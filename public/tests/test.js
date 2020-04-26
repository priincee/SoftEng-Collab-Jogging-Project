import {map, mapLoaded, onDistClick, onModeClick, startFollowing, stopFollowing} from './../javascript/index.js';

// Test loading functions
QUnit.module("Loading");
// Load the map
QUnit.test("Map Load", function(assert) {
    assert.ok(mapLoaded, 0, "Passed!");
})

// Test the option modules
QUnit.module("Option Selection");
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
QUnit.module("Jog");
// Start a jog, wait a second, and end the jog
QUnit.test("Start and Stop Following Test", function(assert)    {
    assert.ok(startFollowing, 0, "startFollowing passed!");
    setTimeout(assert.ok(stopFollowing, 0, "stopFollowing passed!"), 2000);
});

import {loadData, showData, pageLoaded} from './../javascript/viewrun.js';
QUnit.module("viewrun");

// Testing veiwrun functions
QUnit.test("pageLoaded test",
    function(assert) {
        assert.expect( 2 );
        assert.ok(typeof pageLoaded === "function", "It's a function");
        //test that pageLoaded does not return anything
        assert.ok(pageLoaded, "done", "function has loaded page");
      });

QUnit.test("loadData test",
    function(assert) {
        assert.expect( 2 );
        assert.ok(typeof loadData === "function", "It's a function");
        //test that loadData does not return anything
        assert.ok(loadData, "done", "funtion has loaded data");
      });

QUnit.test("showData test",
    function(assert) {
        assert.expect( 2 );

        assert.ok(typeof showData === "function", "It's a function");
        //test that showData adds data to selected place
        assert.ok(showData, "done", "function has shown data" );
      });
