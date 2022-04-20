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
let quizzCreatorChangePages = (pages) => document.querySelector(`.quizzCreation`).querySelectorAll(`section`)[pages].classList.toggle(`active`)
function quizzCreatorProceed(element){
    let infosText = document.querySelector(`.infos`)
    const el = element.classList[0]
        if(el === "proceedToQuestions"){
            if(infosValidation()){
                infosText.innerHTML = "Crie suas perguntas"
                quizzCreatorChangePages(0)
                quizzCreatorChangePages(1)
                questionsGenerator(infosValidation())
            } else {
                alert(`Usuário, digite os dados corretamente`)
            }
        }
}




