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
        console.log(data)

        data.slice().reverse().forEach(element => { //slice and reverse so newest posts are shown first

            //create new elements for the different parts of a post and append them to the host element.
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

            let newCardDiv = document.createElement("div");
            newCardDiv.className = "card-panel hoverable";

            newCardDiv.appendChild(newTitle);
            newCardDiv.appendChild(newPostText);
            newCardDiv.appendChild(newCommentSection);
            newSection.appendChild(newCardDiv);
            hostContainer.appendChild(newSection);

            //add a functionality to click a post, redirect the user to the post

            newCardDiv.onclick = function(){
                fetch("http://localhost:3000/posts/"+element.name, {
            method: "get",
            // headers: {
            //     "Content-type": "application/json"
            // },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            });
            }


        });
    })
