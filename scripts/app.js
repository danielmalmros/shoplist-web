// Using ES6 classes to add some extra syntax suger
// Everything is scoped to this.root since the #app is passed over.
class ShopList {
  constructor(domNode) {
    if (domNode) {
      this.root = domNode;
      this.databaseRef = firebase.database().ref("items");
      
      this.init();
    } else {
      console.log("Error! - Missing domNode!");
    }
  }

  // Find all nods from this.root
  findNodes() {
    this.formSubmit = this.root.querySelector('.shoplist-form');
    this.shoppingListTabel = this.root.querySelector('.js-shopping-list')
    this.snackbarContainer = this.root.querySelector('.js-shopping-list-snackbar');
    this.showSnackbarButton = this.root.querySelector('.js-shopping-list-clear');
  }

  // Attacth all events for this class
  attacthEvents() {
    this.formSubmit.addEventListener("submit", (e) => this.saveToFirebase(e));
    this.showSnackbarButton.addEventListener('click', () => this.removeAllItems());
  }

  snackBarHandler() {
    console.log('UNDO');
  }

  removeAllItems() {
    this.databaseRef.remove();
    var data = {
      message: 'Deleted all items in list.',
      timeout: 2000,
      actionHandler: this.snackBarHandler,
      actionText: 'Undo'
    };
    this.snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

  // Save the new data to firebase
  postNewItem(name, quantity, variant) {
    // Add entry
    let dataEntry = {
      name: name,
      quantity: quantity,
      variant: variant
    };

    // Get a key for a new item.
    let newItemKey = firebase.database().ref().child('items').push().key;

    // Write the new item data simultaneously in the shopping list.
    let updates = {};
    updates['/items/' + newItemKey] = dataEntry;

    return firebase.database().ref().update(updates);
  }

  // get data from input fields and store format it
  saveToFirebase(e) {
    e.preventDefault();
    let name = e.target[0].value.trim();
    let quantity = parseInt(e.target[1].value);
    let variant = e.target[2].value.trim();

    if (name.length > 0 && quantity && variant.length > 0) {
      this.postNewItem(name, quantity, variant)
    }
    // this.formSubmit.reset()
  }

  // RefreshUI when getting data from firebase
  // Using E6 Template literals for better markup syntax
  refreshUI(list) {
    let html = '';
    for (var i = 0; i < list.length; i++) {
      html += `
      <tr>
        <td class="mdl-data-table__cell--non-numeric">${ list[i].name }</td>
        <td>${ list[i].quantity }</td>
        <td>${ list[i].variant }</td>
      </tr>
      `
    }
    this.shoppingListTabel.innerHTML = html;
  }

  // Get data from firebase
  getShoppingList() {

    this.databaseRef.on("value", (snapshot) => {
      let list = [];
      snapshot.forEach((childSnapshot) => {
        let childData = childSnapshot.val();
        list.push({
          name: childData.name,
          quantity: childData.quantity,
          variant: childData.variant
        })
      });
      this.refreshUI(list)
    })
  }

  // Collect all fuctions that should be called when the class is initialized
  // this.init() is called in the constructor
  init() {
    this.findNodes();
    this.attacthEvents();
    this.getShoppingList();
  }
}

// Initialize ShopList class with it's root element for better scoping.
let shopList = new ShopList(document.querySelector("#app"));