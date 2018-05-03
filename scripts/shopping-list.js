// Post to database
function postNewItem(name, quantity, variant) {
  // A post entry.
  var postData = {
    name: name,
    quantity: quantity,
    variant: variant
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/items/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function saveToFirebase(e) {
  e.preventDefault();
  let name = e.target[0].value.trim();
  let quantity = parseInt(e.target[1].value);
  let variant = e.target[2].value.trim();

  if (name.length > 0 && quantity && variant.length > 0) {
    postNewItem(name, quantity, variant)
  }
}

// // Refrash UI
function refreshUI(list) {
  var lis = '';
  for (var i = 0; i < list.length; i++) {
    lis += '<li>' + list[i].name + list[i].quantity + list[i].variant +'</li>';
  };
  document.querySelector('.shopping-list').innerHTML = lis;
};


// Get data
var ref = firebase.database().ref("items");

ref.on("value", function (snapshot) {
  var list = [];
  snapshot.forEach(function (childSnapshot) {
    var childData = childSnapshot.val();
    // var id = childData.id;
    list.push({
        name: childData.name,
        quantity: childData.quantity,
        variant: childData.variant
    })
  });
  refreshUI(list)
});