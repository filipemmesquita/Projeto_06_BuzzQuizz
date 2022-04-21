const globalCreatedQuizz ={
    title: "",
    image: "",
    questions: [{}]
}
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
let quizzCreatorChangePages = (pages) => document.querySelectorAll(".quizzCreation > section")[pages].classList.toggle("active")
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
        if(el === "proceedToLevels"){
            if(questionsValidation()){
                infosText.innerHTML = "Agora, decida os níveis"
                quizzCreatorChangePages(1)
                quizzCreatorChangePages(2)
                levelGenerator(questionsValidation())
            } else {
                alert(`Usuário, digite os dados corretamente`)
            }
        }
}
function infosValidation(){
    const allInfoInputs = document.querySelectorAll(`.quizzCreationGeneralInfos .inputInfos`)
    const quizzTitle = allInfoInputs[0].value
    const questionAmount = Number(allInfoInputs[2].value)
    const levelsAmount = Number(allInfoInputs[3].value)
    if(quizzTitle.length < 20 || quizzTitle.length > 65){
        return false
    }
    if(questionAmount < 3){
        return false
    }
    if(levelsAmount < 2){
        return false
    } 
    globalCreatedQuizz.title=quizzTitle
    globalCreatedQuizz.image=allInfoInputs[1]
    return {
        quizztitle: quizzTitle,
        questionamount: questionAmount,
        levelamount: levelsAmount,
    }
}
function questionsGenerator(infos){
   const questionNumbers = infos.questionamount
   let CreateQuestionsPage = document.querySelector(`.quizzCreationQuestions`)
   for(let i = 1; i < questionNumbers + 1; i++){
        CreateQuestionsPage.innerHTML += questionSection(i)
   }
   CreateQuestionsPage.querySelector(`.quizzCreationInfos`).classList.add(`active`)
   CreateQuestionsPage.querySelector(`.open-icon`).classList.toggle(`active`)
   CreateQuestionsPage.innerHTML += `<button class="proceedToLevels btn" onclick="quizzCreatorProceed(this)">Prosseguir para criar níveis</button>`
}
function questionSection(i){
    return `
    <section class="question box">
        <div class="questionTitle">
            <h1>Pergunta ${i}</h1>
            <ion-icon class="open-icon active" name="open-outline" onclick="descriptionToggle(this)"></ion-icon>
        </div>
        <div class="quizzCreationInfos">
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Texto da pergunta">
                <input class="inputInfos" type="text" placeholder="Cor de fundo da pergunta">
            </div>
            <h1>Resposta correta</h1>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta correta">
                <input class="inputInfos" type="text" placeholder="URL da imagem">
            </div>
            <h1>Respostas incorretas</h1>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 1">
                <input class="inputInfos" type="text" placeholder="Url da imagem 1">
            </div>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 2">
                <input class="inputInfos" type="text" placeholder="Url da imagem 2">
            </div>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 3">
                <input class="inputInfos" type="text" placeholder="Url da imagem 3">
            </div> 
        </div>
    </section>
    ` //Nas repostas incorretas as vezes da para fazer um loop
}
function descriptionToggle(element){
    const identifier = element.parentNode
    let allElementIcons;
    let minimize;
    let inputDiv;
    switch (identifier.classList[0]){
        case "questionTitle":
            allElementIcons = document.querySelectorAll(`.quizzCreationQuestions .open-icon`);
            minimize = document.querySelectorAll(`.quizzCreationInfos`);
            inputDiv = identifier.parentNode.querySelector(`.quizzCreationInfos`)
            break;
        case "levelTitle":
            allElementIcons = document.querySelectorAll(`.quizzCreationLevels .open-icon`);
            minimize = document.querySelectorAll(`.levels`);
            inputDiv = identifier.parentNode.querySelector(``)
            break;
    }
    for(let i = 0; i < allElementIcons.length; i++){
        if(allElementIcons[i].classList.contains("active")){
        } else {
            allElementIcons[i].classList.toggle(`active`)
            minimize[i].classList.toggle(`active`)
        }
    }
    inputDiv.classList.toggle(`active`)
    element.classList.toggle(`active`)
    inputDiv.scrollIntoView({block: 'start', behavior: 'smooth', inline: 'start'});
}
function isHexColor(str){
    const validChars=["1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","A","B","C","D","E","F"];
    console.log("testando" +str)
    if(str.substring(0,1)!=="#" && str.length!==7){
        console.log(" # ou length deu ruim")
        return false
    }
    
    for(let x=1;x<7;x++){
        let check=false;    
        for(let i=0;i<validChars.length;i++){
            if(str.charAt(x)===validChars[i]){
                check=true;
            }
        }
        if(!check){
            console.log("retorna false")
            return false
        }
    }
    console.log("é cor")
    return true
}
function questionsValidation(){
    console.log("questions validation ativado")
    const allQuestion= document.querySelectorAll(".question");
    for(let y=0;y<allQuestion.length;y++){
        const allQuestionInput = allQuestion[y].querySelectorAll(`.quizzCreationInputBox`)
        const questionTitle = allQuestionInput[0]
        let wrongAnswerAmount=0;
        console.log(questionTitle)
        if(questionTitle.querySelectorAll(".inputInfos")[0].value.length < 20 ){
            console.log("titulo menor que 20 caracteres em y"+y)
            return false
        }
        if(!isHexColor(questionTitle.querySelectorAll(".inputInfos")[1].value)){
            console.log("não é cor em y"+y)
            return false
        }
        for(let x=1;x<allQuestionInput.length;x++){
            const currentQuestionChecked = allQuestionInput[x].querySelectorAll(".inputInfos")
            if(currentQuestionChecked[0].value!=="" ){
                if(currentQuestionChecked[0].value.length<20){
                    console.log("texto da pergunta "+x + " muito curto em y"+y)
                    return false
                }
                if(currentQuestionChecked[1].value.substring(0,8)!=="https://")
                {
                    console.log("erro na url da pergunta "+x +" em y"+y)
                    return false
                }
                if(x>1){
                    wrongAnswerAmount++;
                }
            }
        }
        if (wrongAnswerAmount===0){
            console.log("0 respostas erradas em y"+y)
            return false
        }
        globalCreatedQuizz.questions=[
            {
                title:questionTitle.querySelectorAll(".inputInfos")[0].value,
                color:questionTitle.querySelectorAll(".inputInfos")[1].value,
                answers:[{}]
            }
        ]
        globalCreatedQuizz.questions.answers=[
            {
                text: allQuestionInput[1].querySelectorAll(".inputInfos")[0].value,
                image: allQuestionInput[1].querySelectorAll(".inputInfos")[1].value,
                isCorrectAnswer:true
            }
        ]
        for(let x=2;x<wrongAnswerAmount;x++){
            globalCreatedQuizz.questions.answers=[
                {
                    text: allQuestionInput[x].querySelectorAll(".inputInfos")[0].value,
                    image: allQuestionInput[x].querySelectorAll(".inputInfos")[1].value,
                    isCorrectAnswer:false
                }
            ]
        }  
    }
    console.log(globalCreatedQuizz)
}
function levelGenerator(infos){
    const questionNumbers = infos.questionamount
    let CreateQuestionsPage = document.querySelector(`.quizzCreationQuestions`)
    for(let i = 1; i < questionNumbers + 1; i++){
         CreateQuestionsPage.innerHTML += questionSection(i)
    }
    CreateQuestionsPage.querySelector(`.quizzCreationInfos`).classList.add(`active`)
    CreateQuestionsPage.querySelector(`.open-icon`).classList.toggle(`active`)
    CreateQuestionsPage.innerHTML += `<button class="proceedToLevels btn">Prosseguir para criar níveis</button>`
 }
