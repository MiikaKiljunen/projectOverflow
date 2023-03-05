const submit = document.getElementById("submit")
const addInsBtn = document.getElementById("add-instruction")
const addIngBtn = document.getElementById("add-ingredient")
const instructionsL = document.getElementById("instructions-list")
const ingredientsL = document.getElementById("ingredients-list")
const imageForm = document.getElementById("image-form")
const searchField = document.getElementById("search")
const imageDiv = document.getElementById("images")
const fetchDiv = document.getElementById("fetch-div")


submit.onclick = function(){
 

    let name = document.getElementById("name-text").value

    let questionBoxValue = document.getElementById("question-text").value
    let codeBoxValue = document.getElementById("code-text").value

    data = 
    {
        name: name,
        question: questionBoxValue,
        code: codeBoxValue
    }

    fetch("http://localhost:3000/recipe/", {

        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
        })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

