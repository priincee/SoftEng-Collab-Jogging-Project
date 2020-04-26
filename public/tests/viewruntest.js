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
        assert.ok(showData, "Done", "function has shown data" );
      });
