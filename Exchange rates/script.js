//collecting the nrequired DOM elements
const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

//Functions:
//fetch exchange rate and update the dom
async function calculate(){
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;
    const result = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`);
    const data = await result.json();
    const rate = data.rates[currency_two];
    amountEl_two.value = (amountEl_one.value * rate).toFixed(2);

    rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
}

// Event listeners:
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

//to swap the value of currency-Elements with the swap button
swap.addEventListener('click', ()=>{
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value=temp;
    calculate();
})

//Initializng the project
calculate();