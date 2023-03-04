const submit = document.getElementById("submit")
const email = document.getElementById("email")
const password = document.getElementById("password")

submit.onclick = function(){

    console.log("trying to do login ffs")

    // let formData = new FormData();
    // formData.append("email",email.value);
    // formData.append("password",password.value);

    let data = {
        password: password.value,
        email: email.value,
    }

    console.log(data)

    fetch("http://localhost:3000/user/login", {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}