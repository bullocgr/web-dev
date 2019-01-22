/*
 * Write your JS code in this file.  Don't forget to include your name and
 * @oregonstate.edu email address below.
 *
 * Name: Grace Bullock
 * Email: bullocgr@oregonstate.edu
 */


var sellButton = document.getElementById('sell-something-button');
var closeModal = document.getElementById('modal-close');
var modalCancel = document.getElementById('modal-cancel');
var modalBackdrop = document.getElementById('modal-backdrop');
var modal = document.getElementById('sell-something-modal');
var emptyModalAlert = document.getElementById('modal-accept'); //the alert that should pop up if the box is empty
var update = document.getElementById('filter-update-button'); 
var postSection = document.getElementById('posts');
var lastItem = postSection.lastChild;
var createPost = document.getElementById('modal-accept');
// console.log("createPost: ", createPost);
var originalPosts = document.getElementById('posts');
// console.log("original posts: ", originalPosts);

sellButton.addEventListener('click', function(event) {
    modal.style.display = "block";
    modalBackdrop.style.display = "block";
});

function exitModal() {
    modal.style.display = "none";
    modalBackdrop.style.display = "none";
    document.getElementById('post-text-input').value = "";
    document.getElementById('post-photo-input').value = "";
    document.getElementById('post-price-input').value = "";
    document.getElementById('post-city-input').value = "";
    document.getElementById('post-condition-fieldset').value = "";
}

closeModal.addEventListener('click', exitModal);
modalCancel.addEventListener('click', exitModal); //this calls the function made from above and uses it for the chosen fucntion

function emptyModalCheck() {
    if (document.getElementById('post-text-input').value === "" || document.getElementById('post-photo-input').value === "" || document.getElementById('post-price-input').value === "" || document.getElementById('post-city-input').value === "") {
        return true;
    }
    return false;
}

function searchPosts() {
    var posting = document.getElementsByClassName("post");
    var textSearch = document.getElementById("filter-text").value;
    var lowerPrice = parseInt(document.getElementById("filter-min-price").value);
    var upperPrice = parseInt(document.getElementById("filter-max-price").value);
    var children = postSection.children;
    var city = document.getElementById("filter-city").value;
    var textInput = document.getElementById("filter-text").value;
    var conditions = getConditions();


    checkPrice(upperPrice, lowerPrice, posting);
    checkCity(posting, city);
    checkCondition(posting, conditions);
    checkText(posting, textInput);
    // restorePosts(upperPrice, lowerPrice, city, conditions, textInput);

}

function checkPrice(upperPrice, lowerPrice, post) {
    for(var i = 0; i < post.length; i++) {
        var childDataPrice = parseInt(post[i].getAttribute('data-price'));
        if (childDataPrice > upperPrice || childDataPrice < lowerPrice) {
            document.getElementById('posts').removeChild(post[i]);
            i--;
        }
    }
}

function checkCity(post, selectedCity) {
    for(var i = 0; i < post.length; i++) {
        var childCity = post[i].getAttribute('data-city');
        if(selectedCity !== childCity && selectedCity !== "") {
            document.getElementById('posts').removeChild(post[i]);
            i--;
        }
    }
}

function checkCondition(post, selectedCondition) {
    if(selectedCondition.length === 0){
        return false;
    }
    for(var i = 0; i < post.length; i++) {
        var wantedCondition = post[i].getAttribute("data-condition");
        var clicked = false;
        for(var j = 0; j < selectedCondition.length; j++) {
            if(selectedCondition[j] === wantedCondition) {
                clicked = true;
            }
        }
        if(clicked === false) {
            document.getElementById('posts').removeChild(post[i]);
            i--;
        }
    }
}

function checkText(post, textSearch) {
    for(var i = 0; i < post.length; i++) {
        var title = post[i].getElementsByTagName("a")[0].innerText;
        // console.log("title: ", title);
        var lowerCase = title.toLowerCase();
        if(lowerCase.search(textSearch) == -1) {
            document.getElementById('posts').removeChild(post[i]);
            i--;
        }
    }
}

update.addEventListener('click', searchPosts);

var descriptionInput = document.getElementById('post-text-input');
console.log("descriptionInput: ", descriptionInput);
var imgURLInput = document.getElementById('post-photo-input');
console.log("photo url: ", imgURLInput);
var priceInput = document.getElementById('post-price-input');
console.log("post price: ", priceInput);
var cityInput = document.getElementById('post-city-input');
console.log("city: ", cityInput);

function selectButton(){
    var selectedCondition = document.querySelector('input[name="post-condition"]:checked');
    return selectedCondition.value;
}

function addItem() {
    var itemSection = document.createElement('div');
    itemSection.classList.add("post");
    
    itemSection.setAttribute("data-price", priceInput.value);
    // console.log("price p2: ", price);
    itemSection.setAttribute("data-city", cityInput.value);
    itemSection.setAttribute("data-condition", selectButton());


    var itemContents = document.createElement('div');
    itemContents.classList.add("post-contents");
    itemSection.appendChild(itemContents);

    var itemPhoto = document.createElement('div');
    itemPhoto.classList.add("post-image-container");
    itemContents.appendChild(itemPhoto);

    var actualPhoto = document.createElement('img');
    actualPhoto.src = imgURLInput.value;
    itemPhoto.appendChild(actualPhoto);

    var sectionInfo = document.createElement('div');
    sectionInfo.classList.add("post-info-container");
    itemContents.appendChild(sectionInfo);

    var sectionTitle = document.createElement('a');
    sectionTitle.setAttribute('href', '#');
    sectionTitle.classList.add("post-title");
    sectionTitle.textContent = descriptionInput.value;
    // sectionTitle.src = descriptionInput;
    sectionInfo.appendChild(sectionTitle);

    var sectionPrice = document.createElement('span');
    sectionPrice.classList.add("post-price");
    sectionPrice.textContent = '$' + priceInput.value;
    // sectionPrice.src = price;
    sectionInfo.appendChild(sectionPrice);

    var sectionCity = document.createElement('span');
    sectionCity.classList.add("post-city");
    sectionCity.textContent = '(' + cityInput.value + ')';
    sectionInfo.appendChild(sectionCity);

    postSection.appendChild(itemSection);
    addCity(cityInput.value);

}

createPost.onclick = function() {
    if(emptyModalCheck()){
        alert("Please fill in empty sections");
        return false;
    }

    addItem();
    exitModal();
    return true;
}

function getConditions() {
    var conditions = document.getElementsByName("filter-condition");
    var conditionsWanted = [];

    for(var i = 0; i < conditions.length; i++) {
        if(conditions[i].checked){
            conditionsWanted.push(conditions[i].value);
        }
    }
    return conditionsWanted;
}

function addCity(city) {
    var cityList = document.getElementById('filter-city');
    var newCity = document.createElement('option');

    console.log("City List: ", cityList);
    for(var i = 0; i < cityList.length; i++) {
        var availableCity = cityList[i];
        if(city !== availableCity) {
            newCity.textContent = city;
            cityList.appendChild(newCity);
            
        }
    }
}