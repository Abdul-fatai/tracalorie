// Storage Controller 
const StorageCtrl = (function(){
    //Public methods
    return {
        storeItem: function(item){
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);

                //Set to LS
                localStorage.setItem('items', JSON.stringify(items));

            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }
    }
})();

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
        // items: [
        //     // {id: 0, name: "Steak Dinner", calories: 1200},
        //     // {id: 1, name: "Cookie", calories: 300},
        //     // {id: 2, name: "Eggs", calories: 400}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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

        getItemById: function(id){
            let found = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);
            
            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
             return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach((item) => {
                total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories;
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        showTotalCalories: '.total-calories'
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UIselectors.listItems);

            //Turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = '';
            document.querySelector(UIselectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UIselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UIselectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UIselectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UIselectors.item).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UIselectors.showTotalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UIselectors.updateBtn).style.display = 'none';
            document.querySelector(UIselectors.deleteBtn).style.display = 'none';
            document.querySelector(UIselectors.backBtn).style.display = 'none';
            document.querySelector(UIselectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UIselectors.updateBtn).style.display = 'inline';
            document.querySelector(UIselectors.deleteBtn).style.display = 'inline';
            document.querySelector(UIselectors.backBtn).style.display = 'inline';
            document.querySelector(UIselectors.addBtn).style.display = 'none';
        },

        getUISelectors: function(){
            return UIselectors;
        }
    }
})();



//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load event listeners
    const loadEventListeners = function(){
        //Get UI selectors 
        const UIselectors = UICtrl.getUISelectors();

        //Add Event
        document.querySelector(UIselectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable Enter key
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit Icon click event
        document.querySelector(UIselectors.item).addEventListener('click', itemEditClick);

        //Item update submit event
        document.querySelector(UIselectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Item Delete submit event
        document.querySelector(UIselectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button
        document.querySelector(UIselectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Clear button
        document.querySelector(UIselectors.clearBtn).addEventListener('click', clearAllItemClick);
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

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Add items to localStorage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }
    }

    //Edit item click 
    const itemEditClick = function(e){
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
    }

    //Update Item submit
    const itemUpdateSubmit = function(e){
        e.preventDefault();
        //Get item input
        const input = UICtrl.getItemInput();
        //Update Item
        const updateItem = ItemCtrl.updateItem(input.name, input.calories);
        //Add updated Item to UI
        UICtrl.updateListItem(updateItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Clear edit state
        UICtrl.clearEditState();
    }

    //Item Delete Method
    const itemDeleteSubmit = function(e){
        e.preventDefault();
        //Get Current Item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete from Datastructure
        ItemCtrl.deleteItem(currentItem.id);
        //Delete Item from UI
        UICtrl.deleteListItem(currentItem.id);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //Clear edit state
        UICtrl.clearEditState();
    }

    //Clear items event
    const clearAllItemClick = function(){
        //Delete all items from data strucure
        ItemCtrl.clearAllItems();
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //Remove items from data structure
        UICtrl.removeItems();
        //UL hide
        UICtrl.hideList();
    }

    //Public methods
    return {
        init: function(){
            //Clear Edit State
            UICtrl.clearEditState();

            //Fetch items from data structure 
            const items = ItemCtrl.getData();

            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);
            }
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Init App
App.init();