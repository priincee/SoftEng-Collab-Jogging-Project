/**
 * @module challenge
 */
'use strict';

// to fetch friend data from the server 
async function fetchData() {
    const users = await fetch('userlist')
}

// to create the list of friends to challenge 
function createFriendsList(users) {
    for (var i = 0; i <= (users.length/6) - 1; i++) {
        // creates the html elemts to put friends names in 
        let i = document.createElement('div')
        let textarea = document.createElement('textarea')
        let nameIndex = (6*i) + 1
        let name = document.createTextNode(users[nameIndex] + " " + users[(nameIndex + 1)])
        let button = document.createElement('button')
        button.addEventListener('click', createChallenge)
        i.appendChild(textbox)
        i.appendChild(button) 
    }
}

function createChallenge(){

}

