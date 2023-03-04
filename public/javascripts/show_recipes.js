let nameh1 = document.getElementById("recipe-name")
let instructionsL = document.getElementById("instructions-list")
let ingredientsL = document.getElementById("ingredients-list")



fetch("http://localhost:3000/recipe/", {
method: "get",
headers: {
    "Content-type": "application/json"
},
})
.then(response => response.json())
.then(data => {
    console.log(data)
    // nameh1.innerHTML = data.name
    // let newListItem;
    // for (let i = 0; i<data.instructions.length;i++){
    //     newListItem = document.createElement("li");
    //     newListItem.innerHTML = data.instructions[i]
    //     instructionsL.appendChild(newListItem)
    // }
    // for (let i = 0; i<data.ingredients.length;i++){
    //     newListItem = document.createElement("li");
    //     newListItem.innerHTML = data.ingredients[i]
    //     ingredientsL.appendChild(newListItem)
    // }
})



