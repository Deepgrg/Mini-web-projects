
///////////////////////////////////////////
//////Budget Controller
///////////////////////////////////////////

// To control the budget and data
var budgetController= (function(){

    var Expense = function(id, description , value){
        this.id = id;
        this.description = description ;
        this.value = value;
        this.percentage = -1;
    };

    var Income = function(id, description , value){
        this.id = id;
        this.description = description ;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
            this.percentage = Math.round((this.value / totalIncome)*100);           
        }
        else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var calcuateTotal = function (type){
        var sum =0 ;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp : [],
            inc : []
        },
        totals: {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1,
    };

    return {
        addItem : function(type , des , val){
            var newItem,ID;

            // New unique id for each item
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id +1;
            }
            else{
                ID = 0;
            }        

            // Create new item based on the type 
            if (type === 'exp'){
                newItem = new Expense(ID , des , val);
            }
            else if(type === 'inc'){
                newItem = new Income(ID, des ,val);
            }

            //push the newly created item to the data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                // map method traverses through the given array and returns an array of specific values that we can alter using the following line of code
                //eg. return 2; -> gives [2,2,2,2] if the given array length is 4
                // eg. return current.id -> gives id of every element while travesring through it
                return current.id;
            });
            index = ids.indexOf(id);
            // indexOf() returns the index of the arguement in the array if present else return -1

            if(index !== -1){
                data.allItems[type].splice(index, 1);
                //splice() returns the original array deleting the selected elements from the array and thus changing the original array
                //parameters : -> deleteFromHere , delete__N__numbers
            }
        },
        calculateBudget : function(){
            
            //calculate total incomes and expenses
            calcuateTotal('inc');
            calcuateTotal('exp');

            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            //calcuate the percentage
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }
            else{
                data.percentage = -1;
            }            
        },
        calculatePercentages : function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages : function(){
            var allPercentages = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPercentages;
        },
        getBudget : function(){
            return{
                budget : data.budget,
                totalIncome : data.totals.inc,
                totalExpenses : data.totals.exp,
                percentage : data.percentage
            }
        },
        testing: function(){
            console.log(data);
        }
    };

})();


///////////////////////////////////////////
//////User Interface Controller
///////////////////////////////////////////

//To control the user interface
var uiController = (function(){
    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel : '.item__percentage',
        dateLabel : '.budget__title--month'
    }
    var formatNumber = function(num,type){
        var numSplit, int , dec,sign;

        /*
            Add '+' or '-' before incomes and expenses respectively
            get exactly 2 decimal points
            seperate the thousands with commas
        */

        num= Math.abs(num);
        //Math.abs() returns the absolute value regardless of positive or negative
        num = num.toFixed(2);
        // .toFixed() returns number with exactly two decimal numbers by rounding it if required
        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length>3){
            int.substr(0 , int.length-3)+ ',' + int.substr(int.length -3 ,3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-': '+') + ' ' + int + '.' + dec;
    };
    var nodeListForEach = function(list, callback){
        for( var i=0; i<list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
                    return{
                        type:  document.querySelector(DOMstrings.inputType).value, //return inc or exp
                        description : document.querySelector(DOMstrings.inputDescription).value,
                        value  : parseFloat(document.querySelector(DOMstrings.inputValue).value),
                    } 
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields , function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },
        addListItem: function(object , type){
            var html,newHtml,element;

            //Create Html string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';

            }
            else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the place holder text with some actual data
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%',formatNumber(object.value, type) );

            //Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
        },
        deleteListItem : function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        clearFields : function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            //slice() return the selected elements in an array without cahnging the original array

            fieldsArray.forEach(function(current , index , array){
                current.value = "";
            })

            fieldsArray[0].focus();
        },
        displayBudget : function(obj){
            var type;
            obj.budget>0 ? type = 'inc' : type= 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent =formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpenses,'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages : function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
            nodeListForEach(fields , function(current,index){
                if (percentages[index]>0){
                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent = '---';
                }
            });
        },
        displayMonth : function(){
            var now,year,month,months;

            now = new Date(); //gives the current date
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February' , 'March', 'April', 'May' , 'June' , 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month ] + ' ' + year; 

        },
        getDOMstrings : function(){
            return DOMstrings;
        }
    };

})();



///////////////////////////////////////////
//////App Controller
///////////////////////////////////////////

//To control the app
var controller = (function(budgetCtrl , uiCtrl){

    var setupEventListeners = function(){
        var DOM = uiCtrl.getDOMstrings();
        //when button is clicked
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        //when enter is pressed
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
    }
    
    var updateBudget = function(){
        //calculate the budget
        budgetCtrl.calculateBudget();

        //return the budget
        var budget = budgetCtrl.getBudget();
        //update the ui

        uiCtrl.displayBudget(budget);
    }

    var updatePercentages = function(){

        //Calculate the percentages
        budgetCtrl.calculatePercentages();

        //Read the percentages form the budget controller
        var percentages = budgetCtrl.getPercentages();

        //update the percentage in the ui
        uiCtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function (){
        var input,newItem;
        // get the input field data
        input = uiCtrl.getInput();

        //validating the input
        if(input.description !== "" && !isNaN(input.value) && input.value>0){
            //Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type , input.description , input.value);
            
            //To clear the fields
            uiCtrl.clearFields();

            //Add the item to ui
            uiCtrl.addListItem(newItem , input.type); 

            //calculate and update budget
            updateBudget();

            //calculate and update the percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event){
        var itemId, splitId, type, id;

        // getting to the item-id from the delete button using parentNode
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){
            splitId = itemId.split('-');
            //split return array of strings where it splitted
            type = splitId[0];
            id = parseInt(splitId[1]);

            //Delete the item from the data structure
            budgetCtrl.deleteItem(type , id);

            //Delete the item from the ui
            uiCtrl.deleteListItem(itemId);

            //update and display the new budget
            updateBudget();

            //calculate and update the percentages
            updatePercentages();
        }
    }

    return {
        init: function(){
            console.log('The app has started');
            setupEventListeners();
            uiCtrl.displayBudget({
                budget : 0,
                totalIncome : 0,
                totalExpenses : 0,
                percentage : -1
            });
            uiCtrl.displayMonth();
        }
    }
})(budgetController , uiController);

//Initializing the application
controller.init();
