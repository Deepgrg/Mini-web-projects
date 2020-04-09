//Collecting all the required DOM elements
const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionaireBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

// For dynamic data of the random person and their wealth
let data =[];

//fetch random user and add money
async function getRandomUser(){
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();
    const user = data.results[0];
    const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000),
    };

    addData(newUser);
}

// Add the newly created obj to the data array
function addData(obj){
    data.push(obj);
    updateDOM(); 
}

//update DOM
function updateDOM(providedData = data){
    // to clear the div
    main.innerHTML = `<h2><strong>Person</strong> Wealth</h2>`;

    //To populate the ui the data we have
    providedData.forEach((item)=> {
        const element = document.createElement('div');
        element.classList.add('person');
        element.innerHTML = `<strong>${item.name}</strong>${formatMoney(item.money)}`;
        main.appendChild(element);
    });

}

//format number as money
function formatMoney(number){
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Doubles everyones money
function doubleMoney(){
    data = data.map((current)=>{
        return {name:current.name, money:current.money * 2};
    });
    updateDOM();
}

// Sorts user by the amount of money they have
function sortByRichest(){
    data.sort( (a,b)=>b.money-a.money );
    updateDOM();
}

// dipslays millionaires only
function showMillionaireOnly(){
    data= data.filter( (user)=>{
        return user.money>1000000;
    } );
    updateDOM();
}

// Add all the wealth together and display
function getEntireWealth(){
    const total = data.reduce( (acc,user) => (acc += user.money), 0 );

    const wealthEl = document.createElement('div');
    wealthEl.innerHTML = `<h3>Total wealth <string>${formatMoney(total)}</string></h3>`
    main.appendChild(wealthEl);
}

// Initailizng the application
function init(){
    getRandomUser();
    getRandomUser();
    getRandomUser();
}


//Event Listeners
addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click',doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionaireBtn.addEventListener('click',showMillionaireOnly);
calculateWealthBtn.addEventListener('click',getEntireWealth);


//The app starts from here
init();