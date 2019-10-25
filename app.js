// Storage Controller 

// Item Controller 
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        items: [
            {id: 0, name: "Steak Dinner", calories: 1200},
            {id: 1, name: "Cookie", calories: 300},
            {id: 2, name: "Eggs", calories: 400}
        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        getData: function(){
            return data.items;
        },
        logData: function(){
            return data;
        }
    }
})();



//UI Controller 
const UICtrl = (function(){
    let UIselectors = {
        item: '#item-list'
    }
    //Public methods
    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
                `;
            });
            // Insert Items to the DOM
            document.querySelector(UIselectors.item).innerHTML = html;
        }
    }
})();



//App Controller
const App = (function(ItemCtrl, UICtrl){

    //Public methods
    return {
        init: function(){
            //Fetch items from data structure 
            const items = ItemCtrl.getData();

            // Populate list with items
            UICtrl.populateItemList(items);
        }
    }
})(ItemCtrl, UICtrl);

// Init App
App.init();