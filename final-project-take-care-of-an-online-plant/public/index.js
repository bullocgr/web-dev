/*
 * Author: Ethan Duong
 * This is the client-side JS file for the plant site.
 *
*/


var allPlantsContainerNode = document.querySelectorAll('.plant-and-button'); // all plant posts
var allPlantsContainer = Array.prototype.slice.call(allPlantsContainerNode); // convert the node to an array; https://davidwalsh.name/nodelist-array
var currentPlantIndex = -1; // index for array of classes
var allPlantsContainerSection = document.getElementById('plants'); // section of plants

var waterButton = document.getElementsByClassName('water'); // array of water buttons
var fertButton = document.getElementsByClassName('fertilize'); // array of fertilize buttons
var sunButton = document.getElementsByClassName('sunlight'); // array of sunlight buttons
var renameButton = document.getElementsByClassName('rename'); // array of rename buttons
var aboutButton = document.getElementsByClassName('about'); // array of about button
var uprootButton = document.getElementsByClassName('uproot'); // array of uproot button

var allToolButtons = document.getElementsByClassName('tool-buttons'); // array of button toolbars

function updateCurrentIndex(event) { // checks to see which button was pressed
    for (var i = 0; i < allToolButtons.length; i++) { // loop for length of plants
        if (allToolButtons[i] == event.target.parentNode.parentNode.parentNode) { // if target is a button of this index
            return i; // return index number
        }
    }
}

function waterPlant() { // function for water button
    // unhide watering can
    currentPlantIndex = updateCurrentIndex(event);
    document.getElementsByClassName('plant-watered')[currentPlantIndex].classList.remove('hidden'); // show water icon
}

function fertilizePlant() { // function for fertilize button
    // unhide fertilizer bag
    currentPlantIndex = updateCurrentIndex(event);
    document.getElementsByClassName('plant-fert')[currentPlantIndex].classList.remove('hidden'); // show fertilize icon
}

function sunlightPlant() { // function for sunlight button
    // unhide sunlight
    currentPlantIndex = updateCurrentIndex(event);
    document.getElementsByClassName('plant-sun')[currentPlantIndex].classList.remove('hidden'); // show sun icon
}

function renamePlant() { // function for sunlight rename button
    currentPlantIndex = updateCurrentIndex(event);
    document.getElementById('modal-backdrop').classList.toggle('hidden'); // unhide modal
    document.getElementById('rename-plant-modal').classList.toggle('hidden'); // unhide modal
}

function acceptRename() { // function for accepting rename
    // client side stuff
    var plantNewName = document.getElementById('flower-newname-input').value; // get user input
    var plantOldName = document.getElementsByClassName('plant-name');
    if (!plantNewName) { // if field is blank
        alert("New name must be filled out."); //send an alert saying this
    }
    else {
        // mongoDB stuff
        // console.log(plantOldName)
        // console.log(currentPlantIndex)
        var postRequest = new XMLHttpRequest();
        var requestURL = '/plants/' + plantOldName[currentPlantIndex].textContent + '/renamePlant';
        console.log(requestURL)
        postRequest.open('POST', requestURL)
        var requestBody = JSON.stringify({
            name: plantNewName
        });
        console.log(requestBody);
        postRequest.setRequestHeader('Content-Type', 'application/json');
        postRequest.send(requestBody);

        plantOldName[currentPlantIndex].textContent = plantNewName; // change plant name to user input
        closeRename(); // close rename modal
    }
}

function closeRename() {
    document.getElementById('modal-backdrop').classList.toggle('hidden'); // hide modal
    document.getElementById('rename-plant-modal').classList.toggle('hidden'); // hide modal

    document.getElementById('flower-newname-input').value = ''; // reset input value
}

function aboutPlant() { // about button function
    // show description
    currentPlantIndex = updateCurrentIndex(event);
    document.getElementsByClassName('talk-bubble')[currentPlantIndex].classList.toggle('hidden-bubble'); // unhide text bubble
}

function uprootPlant() { // delete the plant
    currentPlantIndex = updateCurrentIndex(event);

    // mongoDB stuff -----
    var plantOldName = document.getElementsByClassName('plant-name');
    var postRequest = new XMLHttpRequest();
    var requestURL = '/plants/deletePlant';
    postRequest.open('POST', requestURL);
    var requestBody = JSON.stringify({
        name: plantOldName[currentPlantIndex].textContent
    });
    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    // client side stuff
    var allPlantsContainerNode2 = document.querySelectorAll('.plant-and-button');
    var allPlantsContainer2 = Array.prototype.slice.call(allPlantsContainerNode2); // convert the node to an array; https://davidwalsh.name/nodelist-array
    allPlantsContainer2[currentPlantIndex].parentNode.removeChild(allPlantsContainer2[currentPlantIndex]); // remove from DOM
    allPlantsContainer.splice(currentPlantIndex, 1); // remove from array
}

function addPlantButton() { // calls when add plant button is clicked
    document.getElementById('modal-backdrop').classList.toggle('hidden'); //unhide backdrop
    document.getElementById('add-plant-modal').classList.toggle('hidden'); //unhide modal
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.toggle('hidden'); //hide backdrop
    document.getElementById('add-plant-modal').classList.toggle('hidden'); //hide modal

    // reset inputs
    document.getElementById('flower-name-input').value = '';
    document.getElementById('flower-photo-input').value = '';
    document.getElementById('flower-about-input').value = '';
}

function acceptModal() {
    // get user inputs
    var plantName = document.getElementById('flower-name-input').value;
    var plantImageSource = document.getElementById('flower-photo-input').value;
    var plantAboutMeInfo = document.getElementById('flower-about-input').value;

    if ((!plantName) || (!plantImageSource) || (!plantAboutMeInfo)) { // if fields are blank
        alert("All fields must be filled out."); //send an alert saying this
    }
    else {
        addPlant(plantName, plantImageSource, plantAboutMeInfo);
        closeModal();
    }
}

function addPlant(plantName, plantImageSource, plantAboutMeInfo) { // new plant
    var plantInfo = { // create plant info
        name: plantName,
        photoURL: plantImageSource,
        about: plantAboutMeInfo
    };

    // mongoDB stuff -----
    var postRequest = new XMLHttpRequest();
    var requestURL = '/plants/addPlant';
    postRequest.open('POST', requestURL);
    var requestBody = JSON.stringify({
        name: plantName,
        photoURL: plantImageSource,
        about: plantAboutMeInfo
    });
    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    // client side stuff -----
    var postHTML = Handlebars.templates.plant(plantInfo); // turn into dom element
    allPlantsContainerSection.insertAdjacentHTML('beforeend', postHTML);

    allPlantsContainer.push(plantInfo);
    // allPlantsContainer.push(postHTML);
    // console.log(allPlantsContainer)

    // add functions to new buttons
    indexNum = allPlantsContainer.length - 1;
    waterButton[indexNum].addEventListener('click', waterPlant);
    fertButton[indexNum].addEventListener('click', fertilizePlant);
    sunButton[indexNum].addEventListener('click', sunlightPlant);
    renameButton[indexNum].addEventListener('click', renamePlant);
    aboutButton[indexNum].addEventListener('click', aboutPlant);
    uprootButton[indexNum].addEventListener('click', uprootPlant);


    // // plant and button div
    // var plantAndButtonContainer = document.createElement('div');
    // plantAndButtonContainer.classList.add('plant-and-button');

    // // plant image div
    // var plantImageContainer = document.createElement('div');
    // var plantImage = document.createElement('img');
    // plantImageContainer.classList.add('plant-image');
    // plantImage.setAttribute('src', plantImageSource);
    // plantImage.setAttribute('alt', plantName);
    // plantImageContainer.appendChild(plantImage);
    // plantAndButtonContainer.appendChild(plantImageContainer);

    // // buttons section
    // var buttonSection = document.createElement('section');
    // buttonSection.classList.add('tool-buttons')
    // plantAndButtonContainer.appendChild(buttonSection);

    // // water
    // var outterButtonDiv1 = document.createElement('div');
    // var innerButtonDiv1 = document.createElement('div');
    // var button1  = document.createElement('button');
    // outterButtonDiv1.classList.add('button');
    // innerButtonDiv1.classList.add('button-contents');
    // button1.classList.add('water');
    // button1.textContent = "Water";
    // innerButtonDiv1.appendChild(button1);
    // outterButtonDiv1.appendChild(innerButtonDiv1);
    // buttonSection.appendChild(outterButtonDiv1);

    // // fertilize
    // var outterButtonDiv2 = document.createElement('div');
    // var innerButtonDiv2 = document.createElement('div');
    // var button2  = document.createElement('button');
    // outterButtonDiv2.classList.add('button');
    // innerButtonDiv2.classList.add('button-contents');
    // button2.classList.add('fertilize');
    // button2.textContent = "Fertilize";
    // innerButtonDiv2.appendChild(button2);
    // outterButtonDiv2.appendChild(innerButtonDiv2);
    // buttonSection.appendChild(outterButtonDiv2);

    // // sunlight
    // var outterButtonDiv3 = document.createElement('div');
    // var innerButtonDiv3 = document.createElement('div');
    // var button3  = document.createElement('button');
    // outterButtonDiv3.classList.add('button');
    // innerButtonDiv3.classList.add('button-contents');
    // button3.classList.add('sunlight');
    // button3.textContent = "Sunlight";
    // innerButtonDiv3.appendChild(button3);
    // outterButtonDiv3.appendChild(innerButtonDiv3);
    // buttonSection.appendChild(outterButtonDiv3);

    // // rename
    // var outterButtonDiv4 = document.createElement('div');
    // var innerButtonDiv4 = document.createElement('div');
    // var button4  = document.createElement('button');
    // outterButtonDiv4.classList.add('button');
    // innerButtonDiv4.classList.add('button-contents');
    // button4.classList.add('rename');
    // button4.textContent = "Rename";
    // innerButtonDiv4.appendChild(button4);
    // outterButtonDiv4.appendChild(innerButtonDiv4);
    // buttonSection.appendChild(outterButtonDiv4);

    // // about
    // var outterButtonDiv5 = document.createElement('div');
    // var innerButtonDiv5 = document.createElement('div');
    // var button5  = document.createElement('button');
    // outterButtonDiv5.classList.add('button');
    // innerButtonDiv5.classList.add('button-contents');
    // button5.classList.add('about');
    // button5.textContent = "About";
    // innerButtonDiv5.appendChild(button5);
    // outterButtonDiv5.appendChild(innerButtonDiv5);
    // buttonSection.appendChild(outterButtonDiv5);

    // // uproot
    // var outterButtonDiv6 = document.createElement('div');
    // var innerButtonDiv6 = document.createElement('div');
    // var button6  = document.createElement('button');
    // outterButtonDiv6.classList.add('button');
    // innerButtonDiv6.classList.add('button-contents');
    // button6.classList.add('uproot');
    // button6.textContent = "Uproot";
    // innerButtonDiv6.appendChild(button6);
    // outterButtonDiv6.appendChild(innerButtonDiv6);
    // buttonSection.appendChild(outterButtonDiv6);

    // var plantTitleLink = document.createElement('a')
    // plantTitleLink.textContent = plantName;
    // plantTitleLink.setAttribute('href', "#");
    // plantTitleLink.classList.add('plant-title');
    // // currentPlantIndex = 4;
    // document.body.appendChild(plantAndButtonContainer);
    // allPlantsTitle.appendChild(plantTitleLink);
    // document.body.appendChild(plantTitleLink);
    // allPlantsContainerSection.appendChild(plantAndButtonContainer);
}

// when page loads add click listeners to plant names
window.addEventListener('DOMContentLoaded', function () {
    // Opening the modal
    document.getElementById('add-plant').addEventListener('click', addPlantButton);
    // Cancelling the modal
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    // Accepting the modal
    document.getElementById('modal-accept').addEventListener('click', acceptModal);

    // accepting rename modal
    document.getElementById('modal-name-accept').addEventListener('click', acceptRename);
    // cancelling rename modal
    document.getElementById('modal-name-cancel').addEventListener('click', closeRename);

    // add functions to buttons
    for (var i = 0; i < allToolButtons.length; i++) { // loop for number of plants
        waterButton[i].addEventListener('click', waterPlant);
        fertButton[i].addEventListener('click', fertilizePlant);
        sunButton[i].addEventListener('click', sunlightPlant);
        renameButton[i].addEventListener('click', renamePlant);
        aboutButton[i].addEventListener('click', aboutPlant);
        uprootButton[i].addEventListener('click', uprootPlant);
    }
});
