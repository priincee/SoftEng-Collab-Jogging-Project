/**
 * @module viewrun
 */
'use strict';

/**
 * These functions retrieve, load and show data on times tabs.
 *
 * @param{object} data - The data.json object
 * @param{element} here - Where selected data get added
 * @returns{element}
 */
//function appends data on selected element
export function showData(data, here){
  const d = document.querySelector('.activet').textContent;

  //shows data on appropriate page
   data.forEach((field, i) => {
     if(field.distance === d){

       const li = document.createElement('li');
           li.innerHTML =`${field.uid} ${field. name} <a id = "time">${field.time}</a> <a id = "share">Share</a>`
           here.appendChild(li);
      }
  });
  return "done";
}

//function gets data and passes it to another funtion to show the data
export async function loadData(){
    const here = document.querySelector('#data');
    const response = await fetch('alljogs');
    const data = await response.json();

  /*  const db = await database;
    const data = db.get('SELECT * FROM TABLENAME WHERE distance = ?', distance);*/
   showData(data, here);
   return "done";
}


//function selects where data will be displayed
export function pageLoaded(){
  loadData();
  return "done";
}
//event to get data as the page loads
window.addEventListener('load',pageLoaded);
