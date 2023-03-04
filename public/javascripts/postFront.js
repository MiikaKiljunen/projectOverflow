const submit = document.getElementById("submit")
const addInsBtn = document.getElementById("add-instruction")
const addIngBtn = document.getElementById("add-ingredient")
const instructionsL = document.getElementById("instructions-list")
const ingredientsL = document.getElementById("ingredients-list")
const imageForm = document.getElementById("image-form")
const searchField = document.getElementById("search")
const imageDiv = document.getElementById("images")
const fetchDiv = document.getElementById("fetch-div")

// const instructionsFetchL = document.getElementById("instructions-fetch-list")
// const ingredientsFetchL = document.getElementById("ingredients-fetch-list")

let commentArray = [];

const recipeDiv = document.getElementById("recipe-div")

//get categories
fetch("http://localhost:3000/cat", {
    method: "get",
    headers: {
        "Content-type": "application/json"
    },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        const categoryDiv = document.getElementById("category-div")
    
        for (let i = 0; i<data.length;i++){
            let checkBox = document.createElement("input");
            let label = document.createElement("label")
            let br = document.createElement("br")
            let span = document.createElement("span")
            //following code is inspired by stackoverflow user Tejs: https://stackoverflow.com/questions/13033074/javascript-checkbox-create-element, Read 29.11.2022
            checkBox.type = "checkbox";
            checkBox.id = "category-" + i;
            checkBox.value = data[i].name
            checkBox.className = "filled-in";
            checkBox.boxId = data[i].id

            //console.log(data[i].id)
            //console.log("boxId: "+checkBox.boxId)

            span.textContent = data[i].name

            //label.textContent = data.res[i]

            categoryDiv.appendChild(label)
            label.appendChild(checkBox)
            label.appendChild(span)
            categoryDiv.appendChild(br)
        }
    })

searchField.addEventListener('keypress', function (e) {

    if (e.key === 'Enter'){

        e.preventDefault()

        console.log("trying to fetch http://localhost:3000/recipe/"+searchField.value)

        let recipeData

        fetch("http://localhost:3000/recipe/"+searchField.value, {
            method: "get",
            // headers: {
            //     "Content-type": "application/json"
            // },
            })
            .then(response => response.json())
            .then(data => {
                recipeData = data
                console.log(data)
            
                let nameh2 = document.createElement("h2");
                let instructionsFetchL = document.createElement("ul");
                let ingredientsFetchL = document.createElement("ul");
                nameh2.innerHTML = data.name
                fetchDiv.appendChild(nameh2)
                fetchDiv.appendChild(instructionsFetchL)
                fetchDiv.appendChild(ingredientsFetchL)
            
            let newListItem;
        
            for (let i = 0; i<data.instructions.length;i++){
                newListItem = document.createElement("li");
                newListItem.innerHTML = data.instructions[i]
                instructionsFetchL.appendChild(newListItem)
            }
            for (let i = 0; i<data.ingredients.length;i++){
                newListItem = document.createElement("li");
                newListItem.innerHTML = data.ingredients[i]
                ingredientsFetchL.appendChild(newListItem)
            }
        })

        //let imageIdArray = []

        setTimeout(() => {

            if (typeof(recipeData) != "undefined") {

            for(let i=0;i<recipeData.images.length;i++){
                //imageIdArray.push(data.images[i])
                console.log(recipeData.images[i])
            

            fetch("http://localhost:3000/images/"+recipeData.images[i], 
            {
                method: "get",
                headers: {
                    "Content-type": "image/png",
                    "Content-Disposition": "inline"
                },
                })
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    let imgElement = document.createElement("img");
                    let imgDiv = document.createElement("div")
                    imgDiv.id = "images"
                    imgDiv.className = "col"
                    fetchDiv.appendChild(imgDiv)

                    //let buf = data[0].buffer
                    //let convBuffer = buf.toString('base64')
                    //console.log(buf)

                    let buf = data.buffer
                    let mimetype = data.mimetype

                    imgElement.src='data:'+mimetype+';base64,'+buf;
                    console.log(imgElement)
                    imgDiv.appendChild(imgElement)

                })
            }

        }
        },200);

    }
})


submit.onclick = function(){

    //
    // POST IMAGES
    //

    //const form = document.getElementById("image-form")
    let formData = new FormData();
    const imageInput = document.getElementById("image-input")
    //let imagesArray = []

    for(let i = 0;i<imageInput.files.length;i++){
        //console.log(imageInput.files[i])
        //imagesArray.push(imageInput.files[i])
        formData.append("images", imageInput.files[i]);
    }
    //formData.append("images", imagesArray);

    console.log(formData)

    fetch("http://localhost:3000/images/", {
        method: "post",
        // headers: {
        // "Content-Type": "multipart/form-data"
        // },
        body: formData
        })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })

    //
    // GET IMAGE IDS
    //

    let data
    let imageIdArray = []
    
    let imgFileNameTiedToRecipe=[]
    for(let i=0; i<imageInput.files.length;i++){
        imgFileNameTiedToRecipe.push(imageInput.files.item(i).name)
    }

    for(let i=0; i<imgFileNameTiedToRecipe.length;i++){

        fetch("http://localhost:3000/imagenames/"+imgFileNameTiedToRecipe[i], {
            method: "get",
            headers: {
                "Content-type": "application/json"
            },
            })
            .then(response => response.json())
            .then(data => {
                for(let i=0;i<data.length;i++){
                    imageIdArray.push(data[i].id)
                }
                //console.log(imageIdArray)
            })
    }

    //
    // POST RECIPE WITH IMAGE IDS
    //
    
    setTimeout(() => {

    let name = document.getElementById("name-text").value

    let checkBoxArray = document.getElementsByClassName("filled-in")
    let IdArray = []

    for(let i=0;i<checkBoxArray.length;i++){
        if (checkBoxArray[i].checked){
            IdArray.push(checkBoxArray[i].boxId)
        }
    }
    console.log(IdArray)

    let questionBoxValue = document.getElementById("question-text").value
    let commentBoxValue = document.getElementById("comment-text").value

    commentArray.push(commentBoxValue);

    data = 
    {
        name: name,
        question: questionBoxValue,
        comments: commentArray,
        categories: IdArray,
        images: imageIdArray
    }

    console.log("imageIdArray at post:\n"+imageIdArray)

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
},200)
}









