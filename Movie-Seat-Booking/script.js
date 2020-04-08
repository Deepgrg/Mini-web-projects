// Collecting all the required DOM elements
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

// getting varying ticket price and the + symbol converts string into the number
let ticketPrice = +movieSelect.value;

// To populate the user interface with the local storagae data
populateUI();

//save selected movie price and index to the local storage
function setMovieData(movieIndex, moviePrice){
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

//updating the selection of the seats and updating the data in the local storage
function updateSelectCount(){
    //collecting the seats selected by the user
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatsIndex = [...selectedSeats].map((seat)=> [...seats].indexOf(seat));

    // setting the data to the local storage of selected seats
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    //updating the ticket price and seats count in the user interface
    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

//get data from local stprage and populate the ui
function populateUI(){
    //updating seats from local storage
    const selectedSeats =JSON.parse(localStorage.getItem('selectedSeats'));
    if(selectedSeats !== null && selectedSeats.length>0){
        seats.forEach((seat,index)=>{
            if(selectedSeats.indexOf(index) > -1){
                seat.classList.add('selected');
            }
        });
    }
    //updating the movie form the local storage
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
    if(selectedMovieIndex !==null){
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

//Movie select event
movieSelect.addEventListener('change', (e)=>{
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectCount();
})


//Seat click event 
container.addEventListener('click', (e)=>{
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')){
        e.target.classList.toggle('selected');
        updateSelectCount();
    }
});

//Initial count and total ticket price set
updateSelectCount();