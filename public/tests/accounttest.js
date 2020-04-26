import {loginAccount, newAccount} from './../javascript/account.js';

QUnit.module("account");
// Login section
QUnit.test("login", function(assert) {
    assert.expect(2);
    assert.ok(loginAccount, 0, "Passed!");
    assert.ok(loginAccount(),"Function returns something");
});
// Creating account section
QUnit.test("Creation", function(assert) {
    assert.expect(2);
    assert.ok(newAccount,0,"Passed!");
    assert.ok(newAccount(),"Function returns something");
});

