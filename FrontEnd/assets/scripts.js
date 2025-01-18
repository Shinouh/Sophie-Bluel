document.addEventListener ("DOMContentLoaded",async function(){
    const gallery = document.querySelector (".gallery")
    if (!loggedIn()){
        //Affichage des catégories
        async function findallcategories () {
            return new Promise (function(resolve,reject){
                fetch ("http://localhost:5678/api/categories")
                .then ((response)=>response.json())
                .then ((response)=>resolve(response))
                .catch ((error)=>reject(error))
            })
        }
        
        const categories =await findallcategories ()
        const portfolio = document.querySelector ("#portfolio")
        if (portfolio){
        const buttons = document.createElement ("div")
        const buttonAll = document.createElement ("button")
            buttons.classList.add ("buttons-flags") // A copier pour ajouter su style
            buttonAll.classList.add ("button-flags")
            buttonAll.innerText = "Tous"
            buttons.append (buttonAll)
            buttonAll.addEventListener ("click",function (){
                displayWorks ()
            })
        for (const category of categories){
            const button = document.createElement ("button")
            button.classList.add ("button-flags")
            button.innerText = category.name
            buttons.append (button)
            button.addEventListener ("click", function (){
                displayWorks (category.name)
            })
        }
        portfolio.insertBefore (buttons,gallery)
        }
    }
    //Affichage des travaux
    async function findallworks () {
        return new Promise (function(resolve,reject){
            fetch ("http://localhost:5678/api/works")
            .then ((response)=>response.json())
            .then ((response)=>resolve(response))
            .catch ((error)=>reject(error))
        })
    }
    
    async function displayWorks (categoryname) {
        let works =await findallworks ()
        if (categoryname){
            works = works.filter(work=>work.category.name===categoryname)
        }
    if (gallery) {
    let html = ""
    for (const work of works) {
        html +=`
        <figure>
				<img src="${work.imageUrl}" alt ="${work.title}">
				<figcaption>${work.title}</figcaption>
			</figure>
        `
    }
    gallery.innerHTML =html
    }
    }
    await displayWorks ()
    //Formulaire d'autentification
    async function login (email,password) {
        return new Promise (function(resolve,reject){
            fetch ("http://localhost:5678/api/users/login", {
                method:"post",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password})
            })
            .then ((response)=>response.json())
            .then ((response)=>resolve(response))
            .catch ((error)=>reject(error))
        })
    }
    const loginForm = document.querySelector ("#login-form")
    const email = document.querySelector ("#email")
    const password = document.querySelector ("#password")
    if (loginForm) {
        if (loggedIn ()){
            redirectToHome ()
        }
    loginForm.addEventListener ("submit",async function (event){
        event.preventDefault ()
        const response=await login (email.value,password.value)
        if (response.token)  {
            localStorage.setItem ("token",response.token)
            redirectToHome ()
        } else {
            alert ("Identifiant incorrect")
        }
    })
    }
    function loggedIn () {
        return localStorage.getItem ("token")
    }
    function redirectToHome () {
        window.location.href="./index.html"
        }
        //Affichage Mode connecté
        if (!loggedIn()) {
            const editorMode=document.querySelector ("#editor-mode")
            if (editorMode) {
                editorMode.style.display="none"
            }
        }
        //Lien de déconnexion
        const logout=document.querySelector ("#logout")
        if (logout) {
        if (!loggedIn()) {
                logout.style.display="none"
        }
        else {
            logout.addEventListener ("click",function(){
                localStorage.removeItem("token")
                redirectToHome ()
            })
        }
    }
    //Lien de connection
    if (loggedIn()){
        const loginLink=document.querySelector ("#login")
        if (loginLink) {
            loginLink.style.display="none"
        }
    }
    //Bouton de modification
    const EditButton=document.querySelector ("#edit-button")
    if (!loggedIn()){
        
        if (EditButton) {
            EditButton.style.display="none"
        }
    }
    //Ouverture et fermeture première modale
    const modaleContent=document.querySelector ("#modale-content")
    const modaleCloseContent=document.querySelector ("#modale-content #close-button")
        if (modaleContent) {
            modaleContent.style.display="none"
        }
        if (loggedIn()){
            if (EditButton){
                EditButton.addEventListener ("click",function(){
                modaleContent.style.display="flex"
                })
            }
            if (modaleCloseContent) {
                modaleCloseContent.addEventListener ("click",function(){
                modaleContent.style.display="none"
                })
            }
    }
    //Contenu de la première modale
    const miniModale=document.querySelector ("#mini-gallery")
    if (miniModale) {
        const works =await findallworks ()
    let html = ""
    for (const work of works) {
        html +=`
        <figure>
				<img src="${work.imageUrl}" alt ="${work.title}">
			</figure>
        `
    }
    miniModale.innerHTML =html
    }
    })
