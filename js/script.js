let main = (page) => document.querySelectorAll(`main`)[page].classList.toggle(`active`)
function quizzCreator(){
    main(0) 
    main(2)
}
function homeButton(element){
    switch (element.parentNode.classList[0]){
        case "quizzPage":
            main(2)
            main(0)
            break;
        case "quizzCreationFinish":
            main(3)
            main(0)
            break;
    }
}





