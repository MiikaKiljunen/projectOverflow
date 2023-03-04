//get all comments on site load from db
let hostContainer = document.getElementById("host-container");

fetch("http://localhost:3000/recipe/", {

        method: "get",
        headers: {
            "Content-type": "application/json"
        },
        })
    .then(response => response.json())
    .then(data => {
        //console.log(data)

        data.forEach(element => {

            //create new elements for the different parts of a post and append them to the element.
            let newSection = document.createElement("div");
            newSection.className = "section";

            let newTitle = document.createElement("h3");
            newTitle.className = "light-blue-text";
            newTitle.innerHTML = element.name;

            let newPostText = document.createElement("h5");
            newPostText.className = "";
            newPostText.innerHTML = element.question;

            newCommentSection = document.createElement("ul")

            element.comments.forEach(comment => {
                newCommentItem = document.createElement("li")
                newCommentItem.innerHTML = comment
                newCommentSection.appendChild(newCommentItem);
            });

            hostContainer.appendChild(newSection);
            newSection.appendChild(newTitle);
            newSection.appendChild(newPostText);
            newSection.appendChild(newCommentSection);

        });
    })
