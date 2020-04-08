// To control the budget and data
var budgetController= (function(){

    var Expense = function(id, description , value){
        this.id = id;
        this.description = description ;
        this.value = value;
    };

    var Income = function(id, description , value){
        this.id = id;
        this.description = description ;
        this.value = value;
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
        percentage : -1
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
        deleteItems : function(type , id){
            var index, idsArray;
            idsArray = data.allItems[type].map(function(current){
                return current.id;
            });
            index = idsArray.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        calcBudget : function(type, newValue){
            var allTotals;
            // Calculating the incomes
            data.totals.inc = 0;
            for( var i=0; i< data.allItems.inc.length ; i++){
                data.totals.inc += data.allItems.inc[i].value;
            }
            
            //Calculating the expenses
            data.totals.exp = 0;
            for( var i=0; i< data.allItems.exp.length ; i++){
                data.totals.exp += data.allItems.exp[i].value;
            }

            //Calculating the percentage
            if(data.totals.inc){
                data.percentage = parseInt(( data.totals.exp / data.totals.inc) * 100 );
            }
            else{
                data.percentage = -1;
            }
                

            allTotals = [data.totals.inc , data.totals.exp, data.percentage];
            return allTotals;
        },
        testing : function(){
            return data;
        }
    };

})();


//To control the user interface
var uiController = (function(){

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budget : '.budget__value',
        budgetIncome : '.budget__income--value',
        budgetExpenses : '.budget__expenses--value',
        budgetExpensesPercentage : '.budget__expenses--percentage',
        container : '.container'
    }

    return {
        getInput: function(){
                    return{
                        type:  document.querySelector(DOMstrings.inputType).value, //return inc or exp
                        description : document.querySelector(DOMstrings.inputDescription).value,
                        value  : parseFloat(document.querySelector(DOMstrings.inputValue).value),
                    } 
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
            newHtml = newHtml.replace('%value%', object.value);

            //Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);


        },
        deleteListItem : function(item){
            var el;
            el = document.getElementById(item);
            el.parentNode.removeChild(el);

        },
        getDOMstrings : function(){
                        return DOMstrings;
        },
        clearFields : function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current , index , array){
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        updateBudget : function(allTotals){
            document.querySelector(DOMstrings.budget).textContent = allTotals[0] - allTotals[1];
            document.querySelector(DOMstrings.budgetIncome).textContent = allTotals[0];
            document.querySelector(DOMstrings.budgetExpenses).textContent =allTotals[1];
            document.querySelector(DOMstrings.budgetExpensesPercentage).textContent =allTotals[2];
        }
    };

})();



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
        //when delete item buttom is clicked
        document.querySelector(DOM.container).addEventListener('click' , ctrlDeleteItem);

    }
    
    var myBudget = function(){
        var allTotals;
        //Calculate the budget
        allTotals= budgetController.calcBudget();
        
        //update the ui
        uiCtrl.updateBudget(allTotals);
    }

    var ctrlAddItem = function (){
        var input,newItem;
        // get the input field data
        input = uiCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type , input.description , input.value);

            //Add the item to ui
            uiCtrl.addListItem(newItem , input.type); 

            //Clear the fields
            uiController.clearFields();

            //Display budget
            myBudget();
        }
    }

    var ctrlDeleteItem = function(event){ 
        var item , splitItems ,itemType , itemId;

        //delete the item from the datastructure
        item = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(item){
            splitItems = item.split('-');
            itemType = splitItems[0];
            itemId = parseInt(splitItems[1]);
            budgetCtrl.deleteItems(itemType , itemId);
        }

        //delete the item from the ui
        uiCtrl.deleteListItem(item);

        //update and display the budget
        myBudget();
    }

    return {
        init: function(){
            console.log('The app has started');
            setupEventListeners();
        }
    }
})(budgetController , uiController);

controller.init();

