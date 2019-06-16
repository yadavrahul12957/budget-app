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
        this.percentage = -1;
    };

    Expenses.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expenses.prototype.getPercentage = function() {
        return this.percentage;
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(data.totals.inc);
            });
            return allPerc;
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumbers = function(num, type) {
        var numSplit, num, int, dec, type;
        /**
        abs->absolute(removes the sign of the number) 
        
       */
        num = Math.abs(num);
        num = num.toFixed(2); //returns string

        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 2310 output 2,310
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (i = 0; i < list.length; i++) {
            callback(list[i], i);
        }

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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            //replace the placeolder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description); //use newHtml coz in html placeholder(id) is still there
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));


            //Insert the HTMl into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItems: function(selectotID) {

            var el = document.getElementById(selectotID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {

                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumbers(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumbers(obj.totalExp, 'exp');


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }

        },
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            nodeListForEach(fields, function(current, index) {
                //Do stuff
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });


        },

        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = year + ' ' + months[month];
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);


            nodeListForEach(fields, function(cur) {

                cur.classList.toggle('red-focus');

            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

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

        /**
        -----------------------------All the eventListners------------------------------------
        */

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. return Budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI.

        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        //1. calculate the percentages
        budgetCtrl.calculatePercentages();

        //2. read the percentage from the udget controller
        var percentages = budgetCtrl.getPercentages();

        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
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

            //6. calculate and update the percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from Datastructure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItems(itemID);

            // 3. Update & show the new budget
            updateBudget();

            //4. calculate and update the percentages
            updatePercentages();
        }
    };

    return {

        init: function() {
            console.log('App has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListners();
        }
    }

})(budgetController, UIController);


controller.init(); //used to call setupEventListners.
/** So we have a place where we want 
to put all the code that we want to execute */