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
            // {id: 0, name: "Steak Dinner", calories: 1200},
            // {id: 1, name: "Cookie", calories: 300},
            // {id: 2, name: "Eggs", calories: 400}
        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        getData: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //Create new Item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;

        },

        logData: function(){
            return data;
        }
    }
})();



//UI Controller 
const UICtrl = (function(){
    let UIselectors = {
        item: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UIselectors.itemNameInput).value,
                calories: document.querySelector(UIselectors.itemCaloriesInput).value,
            }
        },

        addListItem: function(item){
            // Show the list
            document.querySelector(UIselectors.item).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            //Insert item
            document.querySelector(UIselectors.item).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = '';
            document.querySelector(UIselectors.itemCaloriesInput).value = '';
        },

        hideList: function () {
            document.querySelector(UIselectors.item).style.display = 'none';
        },
        getUISelectors: function(){
            return UIselectors;
        }
    }
})();



//App Controller
const App = (function(ItemCtrl, UICtrl){
    //Load event listeners
    const loadEventListeners = function(){
        //Get UI selectors 
        const UIselectors = UICtrl.getUISelectors();
        document.querySelector(UIselectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    const itemAddSubmit = function(e){
        e.preventDefault();
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        //Check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }
    }
    //Public methods
    return {
        init: function(){
            //Fetch items from data structure 
            const items = ItemCtrl.getData();

            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);

            }
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

// Init App
App.init();