//BUDGET CONTROLLER

var budgetController = (function() {

    //Some code

})();


//UI CONTROLLER

var UIController = (function() {

    // DOmStrings will be helpful in case someone decided to chnge class names 
    // Just uppdate in DOMstings

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {

            return DOMstrings;
        }
    };



})();


// GLOBAL APP CONTROLLER

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

    var ctrlAddItem = function() {

        // 1. Get the field input data

        var input = UICtrl.getInput();


        // 2. Add the items to the budget controller

        // 3. Add the items to the UI

        // 4. Calculate the budget.

        // 5. Display the budget on UI.
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