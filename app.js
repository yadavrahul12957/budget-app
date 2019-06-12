/** 

------------------------------------------------------------------------------------------------

//BUDGET CONTROLLER

-------------------------------------------------------------------------------------------------
*/

var budgetController = (function() {

    var Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
            //cur represent either Income or Expenses object that is stored at current position
        });

        data.totals[type] = sum;

    };

    //data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                //create new ID
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;
            }

            //create new items based on type(inc or exp)
            if (type === 'exp') {
                newItem = new Expenses(ID, des, val);
            } else {
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            return newItem; //So other modules have acess to it

        },

        calculateBudget: function() {
            // calculate total expenses and income

            calculateTotal('inc');
            calculateTotal('exp');

            // calculate budget : income-expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of expenses
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },


        testing: function() {
            console.log(data);
        }



    }

})();




/** 

------------------------------------------------------------------------------------------------

//UI CONTROLLER

-------------------------------------------------------------------------------------------------
*/



var UIController = (function() {

    // DOmStrings will be helpful in case someone decided to chnge class names 
    // Just uppdate in DOMstings

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItems: function(obj, type) {

            //create a HTML string with placeholder
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            //replace the placeolder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description); //use newHtml coz in html placeholder(id) is still there
            newHtml = newHtml.replace('%value%', obj.value);


            //Insert the HTMl into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {

                current.value = "";
                // current.description = "";
            });
            fieldsArr[0].focus();
        },

        getDOMstrings: function() {

            return DOMstrings;
        }
    };



})();



/** 

------------------------------------------------------------------------------------------------

// GLOBAL APP CONTROLLER

-------------------------------------------------------------------------------------------------
*/



var controller = (function(budgetCtrl, UICtrl) {



    var setupEventListners = function() {

        var DOM = UICtrl.getDOMstrings(); //contains DOM strings

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

    };

    var updateBudget = function() {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. return Budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI.

        console.log(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the items to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the items to the UI
            UICtrl.addListItems(newItem, input.type);

            //4.Clear the fields
            UICtrl.clearFields();

            //5. calculate and update budget
            updateBudget();
        }



    };

    return {

        init: function() {
            console.log('App has started.');
            setupEventListners();
        }
    }

})(budgetController, UIController);


controller.init(); //used to call setupEventListners.
/** So we have a place where we want 
to put all the code that we want to execute */