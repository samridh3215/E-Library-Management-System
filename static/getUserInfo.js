const divElement = document.createElement("div");
divElement.id = "user-info";


// Create the button element
const buttonElement = document.createElement("button");
buttonElement.id = "logout-button";
buttonElement.classList= ["btn-success","btn"]

buttonElement.textContent = "Logout";

// Append the button to the div
divElement.appendChild(buttonElement);

// Insert the div with the button inside the body of the document
document.body.appendChild(divElement);


function getUserInfo(){return(localStorage.getItem('userData'))}

$('#logout-button').on('click', ()=>{
    localStorage.removeItem('userData')
    window.location.href='/auth/login'
})

try{
    if(JSON.parse(getUserInfo())['type']==1 && window.location.href.split('/').includes('admin'))
        $('#user-info').prepend(JSON.parse(getUserInfo())['email'])
    else if(JSON.parse(getUserInfo())['type']==0 && window.location.href.split('/').includes('student')){
        $('#user-info').prepend(JSON.parse(getUserInfo())['email'])
    }
    else{
        alert("INVALID LOGIN")
        $('#logout-button').click()
    }
}
catch{
    alert("LOGIN FIRST")
    window.location.href = '/auth/login'
}
