const globalCreatedQuizz ={
    title: "",
    image: "",
    questions: [],
    levels: []
}
function homeButton(element){
    window.location.reload()
    requestRenderQuizzes();
}
const mainPage = () => document.querySelector(`.mainPage`);
const cleanMainPage = () => mainPage().innerHTML = '\n   ';
const loadingScreen = () => {
    mainPage().innerHTML += `
    <section class="loadingScreen">
        <img class="loading" src="imagens/loading.gif" alt="loading...">
        <p>Carregando</p>
    </section>
    `;
}
const removeLoading = () => document.querySelector(`.loadingScreen`).remove();
//Tela 1 - Tela Principal
function requestRenderQuizzes(){
    loadingScreen()
    promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
    promisse.then(renderQuizzes)
    promisse.catch(catchError)
}
function renderQuizzes(allQuizzes){
    mainPage().innerHTML += `
    <div class= "mainPageContainer">
        <div class="userQuizzes">
        </div>
    </div>
    `;
    let userQuizzes = document.querySelector(`.userQuizzes`);
    userQuizzes.innerHTML += userEmptyQuizzesSection()
    userQuizzes.innerHTML += userAllQuizzesSection()
    document.querySelector(`.mainPageContainer`).innerHTML += allQuizzesSection()
    const otherQuizzesRenders=document.querySelector(".otherQuizzes")
    const userQuizzesRenders=document.querySelector(".quizzByUser")
    console.log(allQuizzes)
    //esse filtro tem que ser atualizado para conter um for comparando a um array de ids
    const userIds=JSON.parse(localStorage.getItem("localQuizzList"))
    const userKeys=JSON.parse(localStorage.getItem("localQuizzKeyList"))
    if(userIds&&userIds.length>0){
        const allUserQuizzes =allQuizzes.data.filter(function(currentQuizz){
            for(let x=0;x<userIds.length;x++){
                if(currentQuizz.id===userIds[x]){
                    return true        
                }
            }
            return false;
        })
    }
    if(localStorage.length>0){
        console.log(`Oi`)
        loadingUserQuizzes(userIds, userKeys)
        document.querySelector(`.userEmptyQuizzes`).remove()
    } else{
        console.log(`Coé`)
        document.querySelector(`.userAllQuizzes`).remove()
    }
    //renderiza os quizzes de todo mundo
    let allOtherQuizzes = allQuizzes.data
    console.log(allOtherQuizzes)
    if(userIds&&userIds.length>0){
        allOtherQuizzes = allQuizzes.data.filter(function(currentQuizz){
            
            for(let x=0;x<userIds.length;x++){
                if(userIds[x]===currentQuizz.id){
                    return false;
                }
            }
            return true;
        })
    }
    console.log(allOtherQuizzes)
    otherQuizzesRenders.innerHTML="";
    for(x=0;x<allOtherQuizzes.length;x++){
    otherQuizzesRenders.innerHTML+=`
    <li class="quizz"  style="background-image: url('${allOtherQuizzes[x].image}');"> 
        <div onclick="startQuizz(${allOtherQuizzes[x].id})">
        <h2>${allOtherQuizzes[x].title}</h2>
        </div>
    </li>`
    }
    if(!userQuizzesRenders.innerHTML === '\n            '){
        document.querySelector(`userEmptyQuizzes`).remove()
    }
    removeLoading()
}
function loadingUserQuizzes(userIds, userKeys){
    const userQuizzesRenders=document.querySelector(".quizzByUser")
    for(let i = 0; i < userIds.length;i++){
        const userQuizzesPromisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${userIds[i]}`)
        userQuizzesPromisse.then(function(response){
            const allUserQuizzes = response.data
            userQuizzesRenders.innerHTML+=`
                <li class="quizz" style="background-image: url('${allUserQuizzes.image}');"> 
                    <div onclick="startQuizz(${allUserQuizzes.id})">
                    <h2>${allUserQuizzes.title}</h2>
                        <div class="sideButtons">
                        <div class="sideB" onclick="editQuizz(${allUserQuizzes.id}, '${userKeys[i]}')"><ion-icon name="create-outline"></ion-icon></div>
                        <div class="sideB" onclick="deleteQuizz(${allUserQuizzes.id}, '${userKeys[i]}')"><ion-icon name="trash-outline"></ion-icon></div>
                        </div>
                    </div>
                </li>`
            //bubbling
            const allSideB = document.querySelectorAll(".sideButtons")
            allSideB.forEach((element) => element.addEventListener("click", stopEvent, false))
        })
        
    }

}


function userEmptyQuizzesSection(){
    return `
    <section class="userEmptyQuizzes">
        <h2 class="emptyText">Você não criou nenhum quizz ainda :(</h2>
        <button class="createQuizz" onclick="quizzCreator()">Criar Quizz</button>
    </section>
    `
}
function userAllQuizzesSection(){
        return `
        <section class="userAllQuizzes "> <!--Quando usuário tiver 1 quizz-->
            <nav class="navContainer">
                <h1>Seus Quizzes</h1>
                <ion-icon class="createQuizzIcon" name="add-circle" onclick="quizzCreator()"></ion-icon>
            </nav>
            <ul class="quizzByUser">
            </ul>
        </section>
        `
}
function allQuizzesSection(){
        return `
        <section class="allQuizzes">
            <h1>Todos os Quizzes</h1>
            <ul class="otherQuizzes">
            </ul>
        </section>
        `
}
//Tela 2 - Jogando o Quizz
function startQuizz(id){
    cleanMainPage()
    loadingScreen()
    const quizzToPlayPromisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`) //Tem que mudar o Id do final para saber qual é o quizz.
    quizzToPlayPromisse.then(QuizzInfos)
    quizzToPlayPromisse.catch()
}
let thenQuizz;
function QuizzInfos(quizz){
    createQuizz(quizz)
    thenQuizz = quizz
}
let arrayEmbaralhada = []
function createQuizz(quizz){
    const quizzInfos = quizz.data
    mainPage().setAttribute("id", quizzInfos.id) // Dizer qual é o jogo
    //Funcionando até
    mainPage().style.margin ="0 auto";
    mainPage().innerHTML += sectionQuizzHeaderAndContainer(quizzInfos) //Cria o Header
    for(let i = 0; i < quizzInfos.questions.length; i++){
        mainPage().innerHTML += sectionQuizzQuestion() //Cria a Section da Questão
        const section = document.querySelectorAll(`.quizzQuestion`)[i] //Pega a Questão
        section.innerHTML = sectionQuizzQuestionContent(quizzInfos.questions[i]) //Criar o conteudo de cada Questão.
        const alternatives = document.querySelectorAll(`.allAlternatives`)[i]//Pegar todas as alternativas
        const answers = []
        for(let j = 0; j < quizzInfos.questions[i].answers.length;j++){ //Pegar quantidade de perguntas, e poder embaralhar seus objetos(img e texto não!)
            answers.push(quizzInfos.questions[i].answers[j])
        }
        answers.sort(comparador)
        arrayEmbaralhada.push(answers)
        for(let x = 0; x < answers.length; x++){
            alternatives.innerHTML += liQuizzQuestionAlternatives(answers[x]);
        }
    }
    document.querySelector(`html`).scrollIntoView(true)
    removeLoading()
}
function comparador() { 
	return Math.random() - 0.5; 
}
//Funções de criação do Quizz - Tela 2
function sectionQuizzHeaderAndContainer(quizz){
    return `
    <section class="quizzPageHeader" style="background-image: url(${quizz.image});">
        <h1>${quizz.title}</h1>
    </section>
    `
}
function sectionQuizzQuestion(){
    return`
    <section class="quizzQuestion quizzBox">
    </section>
    `
}
function sectionQuizzQuestionContent(question){
    return `
    <div class="quizzQuestionTitle" style="background-color: ${question.color};">
        <h1 class="quizzTopTitle">${question.title}</h1>
    </div>
    <ul class="allAlternatives">
    </ul>
    `
}
function liQuizzQuestionAlternatives(answers){
    return `
    <li class="quizzAlternative" onclick="answeringQuestion(this)">
        <div class="answerImg" style="background-image: url(${answers.image});"></div>
        <h2>${answers.text}</h2>
    </li>
    `
}
//Função dos Onclicks -> Respondendo o Quizz!
const allQuestion = () => document.querySelectorAll(`.quizzQuestion`)
function answeringQuestion(element){
    const alternatives = element.parentNode.querySelectorAll(`.quizzAlternative`)//Selecionar todas as alternativas da Questão
    for(let i = 0; i < alternatives.length; i++){
        alternatives[i].removeAttribute(`onclick`)//Não poder interagir novamente
        if(alternatives[i] !== element){//Se for diferente do interagido, ganha opacity
            alternatives[i].classList.add(`opacity`) 
        }
        const alternativesText = alternatives[i].querySelector(`h2`)//Pega o texto especifico
        const isAnswerRight = arrayEmbaralhada[questionClick(element)]
        if(isAnswerRight[i].isCorrectAnswer){//Se for true recebe a cor, caso contrario recebe a cor vermelha
            alternativesText.classList.add(`rightAnswer`)
        } else {
            alternativesText.classList.add(`wrongAnswer`)
        }
        allQuestion()[questionClick(element)].classList.add(`answered`)
    }
    scrollTo()
    //Se jogo finalizou
    if(isQuizzFinished()){
        const object = isQuizzFinished()
        createQuizzResult(object.level, object.percentageByUser)
        setTimeout(function(){document.querySelector(`.quizzResult`).scrollIntoView({behavior: "smooth"})}, 2000)
    }
}
function questionClick(element){
    const questionClicked = element.parentNode.parentNode;
    for(let i = 0; i < allQuestion().length; i++){
        if(allQuestion()[i] === questionClicked){
            return i
        }
    }
}
function scrollTo(){
    for(let i = 0; i < allQuestion().length; i++){
        if(!allQuestion()[i].classList.contains(`answered`)){
            return setTimeout(function (){allQuestion()[i].scrollIntoView({behavior: "smooth",})}, 2000)
        }
    }
}
//Função para checar se o Quizz foi totalmente respondido!
function isQuizzFinished(){
    const AllLevels = thenQuizz.data.levels
    const amountOfQuestions = document.querySelectorAll(`.quizzQuestion`)
    const allRightAnswers = document.querySelectorAll(`.rightAnswer`)
    if(amountOfQuestions.length === allRightAnswers.length){//Para saber se o jogo acabou
        let rightAnswerByUser = 0 //Quantidade de Acertos!
        for(let x = 0; x < allRightAnswers.length; x++){//Para saber se o usuario acertou ou não
            if(allRightAnswers[x].parentNode.classList.contains(`opacity`)){//quer dizer que errou a questão, pois se ele acerta a reposta não ganha opacidade!
            } else {
                rightAnswerByUser++
            }
        }
        const percentageByUser = ((rightAnswerByUser / allRightAnswers.length) * 100)
        let zIndice;
        for(let z = 0; z < AllLevels.length; z++){//Saber quantos niveis tem/saber qual o usuario se encaixa
            if(AllLevels[z].minValue <= percentageByUser){
                zIndice = z 
            }
        }
        return {
            level: AllLevels[zIndice],
            percentageByUser: percentageByUser
        }
    }
    return false
}
//Funções de Criação do Resultado do Quizz -> Tela-2
function createQuizzResult(level, percentageByUser){
    mainPage().innerHTML += sectionQuizzResult();
    const resultContent = document.querySelector(`.quizzResult .quizzBox`);
    resultContent.innerHTML = quizzResultContent(level, percentageByUser);
    document.querySelector(`.quizzResult`).classList.add(`active`);
}
function sectionQuizzResult(){
    return `
    <section class="quizzResult">
            <div class="quizzBox">
            </div>
            <button class="restartQuizz btn" onclick="restartQuizz()">Reiniciar Quizz</button>
            <button class="homeButton" onclick="homeButton()">Voltar Home</button>
    </section>
    `
}
function quizzResultContent(level, percentageByUser){
    return `
    <div class="quizzResultTitle">
        <h1 class="quizzTopTitle">${percentageByUser.toFixed(0)}% de acerto: ${level.title}</h1>
    </div>
    <div class="resultDescription">
        <img src="${level.image}" alt="">
        <h2>${level.text}</h2>
    </div>
    `
}
function restartQuizz(){
    const id = mainPage().getAttributeNode("id").value
    arrayEmbaralhada = []
    startQuizz(id)
}
//Tela 3
function quizzCreator(){
    cleanMainPage()
    loadingScreen()
    //add os eventos de checagem dos campos aqui
    mainPage().innerHTML += quizzCreationHeader("Comece pelo começo")
    mainPage().innerHTML += quizzCreationAllInfosSection()
    eventCheck()
    removeLoading()
}
function eventCheck(){
    const allInfoInputs= document.querySelectorAll(`.quizzCreationGeneralInfos .inputInfos`)
    for(let x=0;x<allInfoInputs.length;x++){
        allInfoInputs[x].addEventListener('input', infosValidationEvent)
    }
}
function infosValidationEvent(inputInfo){
    const allInfoInputs = document.querySelectorAll(`.quizzCreationGeneralInfos .inputInfos`)
    const allInfoWarnings = document.querySelectorAll(`.quizzCreationGeneralInfos h3`)
    const quizzTitle = allInfoInputs[0].value
    const imageUrl = allInfoInputs[1].value
    const questionAmount = Number(allInfoInputs[2].value)
    const levelsAmount = Number(allInfoInputs[3].value)
    if(quizzTitle.length < 20 || quizzTitle.length > 65){
        allInfoWarnings[0].innerText="O título deve ter pelo menos 20 caracteres"
        allInfoInputs[0].classList.add("invalid")
    }
    else{
        allInfoWarnings[0].innerText=""
        allInfoInputs[0].classList.remove("invalid")
    }
    if(imageUrl.substring(0,8)!=="https://"){
        allInfoWarnings[1].innerText="A URL precisa ser válida!"
        allInfoInputs[1].classList.add("invalid")
    }
    else{
        allInfoWarnings[1].innerText=""
        allInfoInputs[1].classList.remove("invalid")
    }
    if(questionAmount < 3){
        allInfoWarnings[2].innerText="O quizz deve ter no mínimo 3 perguntas"
        allInfoInputs[2].classList.add("invalid")
    }
    else{
        allInfoWarnings[2].innerText=""
        allInfoInputs[2].classList.remove("invalid")
    }
    if(levelsAmount < 2){
        allInfoWarnings[3].innerText="O quizz deve ter no mínimo 2 níveis"
        allInfoInputs[3].classList.add("invalid")
    }
    else{
        allInfoWarnings[3].innerText=""
        allInfoInputs[3].classList.remove("invalid")
    }

}
function quizzCreationHeader(title){
    return `
    <h1 class="infos">
        ${title}
    </h1>
    `
}
function quizzCreationAllInfosSection(){
    return `
    <section class="quizzCreationGeneralInfos">
        <div class="generalInfos box">
            <input class="inputInfos" type="text" placeholder="Título do seu quizz">
            <h3></h3>
            <input class="inputInfos" type="text" placeholder="URL da imagem do seu quizz">
            <h3></h3>
            <input class="inputInfos" type="number" placeholder="Quantidade de perguntas do quizz">
            <h3></h3>
            <input class="inputInfos" type="number" placeholder="Quantidade de níveis do quizz">
            <h3></h3>
        </div>
        <button class="proceedToQuestions btn" onclick="quizzCreatorProceed(this)">Prosseguir para criar perguntas</button>
    </section>
    `
}
function quizzCreatorProceed(element){
    const el = element.classList[0]
    if(el === "proceedToQuestions"){
        if(infosValidation()){
            cleanMainPage()
            loadingScreen()
            mainPage().innerHTML += quizzCreationHeader("Crie suas perguntas")
            mainPage().innerHTML += `
            <section class="quizzCreationQuestions">
            </section>
            `
            questionsGenerator(values)
            removeLoading()
        }
    }
    if(el === "proceedToLevels"){
        if(questionsValidation()){
            cleanMainPage()
            loadingScreen()
            mainPage().innerHTML += quizzCreationHeader("Agora, decida os níveis")
            mainPage().innerHTML += `
            <section class="quizzCreationLevels">
            </section>
            `
            levelsGenerator(values)
            removeLoading()
        }
    }if(el === "proceedToFinish"){
        if(levelValidation()){
            console.log(globalCreatedQuizz)
            const promisse = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",globalCreatedQuizz)
            promisse.then(function(postResponse){
                console.log(postResponse)
                cleanMainPage()
                loadingScreen()
                updateLocalQuizzes(postResponse.data.id, postResponse.data.key)
                mainPage().innerHTML += quizzCreationHeader("Seu quizz está pronto!")
                mainPage().innerHTML += `
                <section class="quizzCreationFinish">
                </section>
                `
                renderQuizzCreationFinish(postResponse.data.id)
                globalCreatedQuizz.title=""
                globalCreatedQuizz.image=""
                globalCreatedQuizz.questions.length=0
                globalCreatedQuizz.levels.length=0
                removeLoading()
            })
            promisse.catch(catchError)
        }
    }
}
function updateLocalQuizzes(quizzId,quizzKey){
    //as ids dos quizzes
    let localQuizzListUpdate =[];
    if(localStorage.getItem("localQuizzList")){
        localQuizzListUpdate=JSON.parse(localStorage.getItem("localQuizzList"))
    }
    localQuizzListUpdate.push(quizzId);
    localStorage.setItem("localQuizzList", JSON.stringify(localQuizzListUpdate));
    console.log(localQuizzListUpdate)
    console.log(localStorage.getItem("localQuizzList"))
    //as keys dos quizzes
    let localQuizzListKeyUpdate =[];
    if(localStorage.getItem("localQuizzKeyList")){
        localQuizzListKeyUpdate=JSON.parse(localStorage.getItem("localQuizzKeyList"))
    }
    localQuizzListKeyUpdate.push(quizzKey);
    localStorage.setItem("localQuizzKeyList", JSON.stringify(localQuizzListKeyUpdate));
    console.log(localQuizzListKeyUpdate)
    console.log(localStorage.getItem("localQuizzKeyList"))
}
function renderQuizzCreationFinish(quizzId){
    document.querySelector(".quizzCreationFinish").innerHTML=`
        <li class="quizz"  style="background-image: url('${globalCreatedQuizz.image}');"> 
            <div>
            <h2>${globalCreatedQuizz.title}</h2>
            </div>
        </li>
        <button class="quizzAccess btn" onclick="startQuizz(${quizzId})">Acessar Quizz</button>
        <button class="homeButton" onclick="homeButton(this)">Voltar para home</button>`
}
let values;
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
    globalCreatedQuizz.image=allInfoInputs[1].value
    values = {
        quizztitle: quizzTitle,
        questionamount: questionAmount,
        levelamount: levelsAmount,
    }
    return true
}
function questionsGenerator(infos){
    console.log(mainPage().innerHTML)
   let CreateQuestionsPage = document.querySelector(`.quizzCreationQuestions`)
   for(let i = 1; i < infos.questionamount + 1; i++){
        CreateQuestionsPage.innerHTML += questionSection(i)
   }

   CreateQuestionsPage.querySelector(`.quizzCreationInfos`).classList.add(`active`)
   CreateQuestionsPage.querySelector(`.open-icon`).classList.toggle(`active`)
   CreateQuestionsPage.innerHTML += `<button class="proceedToLevels btn" onclick="quizzCreatorProceed(this)">Prosseguir para criar níveis</button>`
   const allInfoInputs= document.querySelectorAll(`.question .inputInfos`)
   for(let x=0;x<allInfoInputs.length;x++){
       allInfoInputs[x].addEventListener('input', questionsValidationEvent)
   }
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
                <h3></h3>
                <input class="inputInfos" type="text" placeholder="Cor de fundo da pergunta">
                <h3></h3>
            </div>
            <h1>Resposta correta</h1>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta correta">
                <h3></h3>
                <input class="inputInfos" type="text" placeholder="URL da imagem">
                <h3></h3>
            </div>
            <h1>Respostas incorretas</h1>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 1">
                <h3></h3>
                <input class="inputInfos" type="text" placeholder="Url da imagem 1">
                <h3></h3>
            </div>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 2">
                <h3></h3>
                <input class="inputInfos" type="text" placeholder="Url da imagem 2">
                <h3></h3>
            </div>
            <div class="quizzCreationInputBox">
                <input class="inputInfos" type="text" placeholder="Resposta incorreta 3">
                <h3></h3>
                <input class="inputInfos" type="text" placeholder="Url da imagem 3">
                <h3></h3>
            </div> 
        </div>
    </section>
    ` //Nas repostas incorretas as vezes da para fazer um loop
}
function descriptionToggle(element){
    const identifier = element.parentNode;
    let allElementIcons;
    let minimize;
    let inputDiv;
    switch (identifier.classList[0]){
        case "questionTitle":
            allElementIcons = document.querySelectorAll(`.quizzCreationQuestions .open-icon`);
            minimize = document.querySelectorAll(`.question`);
            inputDiv = identifier.parentNode.querySelector(`.quizzCreationInfos`);
            break;
        case "levelTitle":
            allElementIcons = document.querySelectorAll(`.quizzCreationLevels .open-icon`);
            minimize = document.querySelectorAll(`.level`);
            inputDiv = identifier.parentNode.querySelector(`.quizzCreationInfos`);
            break;
    }
    for(let i = 0; i < allElementIcons.length; i++){
        if(allElementIcons[i].classList.contains("active")){
        } else {
            allElementIcons[i].classList.toggle(`active`);
            minimize[i].querySelector(`.quizzCreationInfos`).classList.toggle(`active`);
        }
    }
    inputDiv.classList.toggle(`active`);
    element.classList.toggle(`active`);
    inputDiv.scrollIntoView({block: 'start', behavior: 'smooth', inline: 'start'});
}
function isHexColor(str){
    const validChars=["1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","A","B","C","D","E","F"];
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
                if(currentQuestionChecked[0].value.length<=0){
                    console.log("texto da resposta "+x + " muito curto em y"+y)
                    return false
                }
                if(currentQuestionChecked[1].value.substring(0,8)!=="https://")
                {
                    console.log("erro na url da resposta "+x +" em y"+y)
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
        globalCreatedQuizz.questions[y]={
                title:questionTitle.querySelectorAll(".inputInfos")[0].value,
                color:questionTitle.querySelectorAll(".inputInfos")[1].value,
                answers:[]
            }
        globalCreatedQuizz.questions[y].answers[0]={
                text: allQuestionInput[1].querySelectorAll(".inputInfos")[0].value,
                image: allQuestionInput[1].querySelectorAll(".inputInfos")[1].value,
                isCorrectAnswer:true
            }
        for(let x=2;x<wrongAnswerAmount+2;x++){
            globalCreatedQuizz.questions[y].answers.push({
                    text: allQuestionInput[(x)].querySelectorAll(".inputInfos")[0].value,
                    image: allQuestionInput[(x)].querySelectorAll(".inputInfos")[1].value,
                    isCorrectAnswer:false
                })
            
        }  
    }
    console.log(globalCreatedQuizz)
    return true
}
function questionsValidationEvent(inputInfo){
    const allQuestion= document.querySelectorAll(".question");
    for(let y=0;y<allQuestion.length;y++){
        const allQuestionInput = allQuestion[y].querySelectorAll(`.quizzCreationInputBox`)
        const questionTitle = allQuestionInput[0]
        const rightAnswer = allQuestionInput[1]
        let wrongAnswerAmount=0;
        if(questionTitle.querySelectorAll(".inputInfos")[0].value.length < 20 ){
            questionTitle.querySelectorAll("h3")[0].textContent="O texto da pergunta deve ser maior que 20 caracteres"
            questionTitle.querySelectorAll(".inputInfos")[0].classList.add("invalid")
        }
        else{
            questionTitle.querySelectorAll("h3")[0].textContent=""
            questionTitle.querySelectorAll(".inputInfos")[0].classList.remove("invalid")
        }
        if(!isHexColor(questionTitle.querySelectorAll(".inputInfos")[1].value)){
           questionTitle.querySelectorAll("h3")[1].innerText="A cor precisa ser valida no formato RGB hexadecimal!"
           questionTitle.querySelectorAll(".inputInfos")[1].classList.add("invalid")
        }
        else{
            questionTitle.querySelectorAll("h3")[1].textContent=""
           questionTitle.querySelectorAll(".inputInfos")[1].classList.remove("invalid")
        }
        if(rightAnswer.querySelectorAll(".inputInfos")[0].value==""){
            rightAnswer.querySelectorAll("h3")[0].textContent="É necessario ao menos uma resposta correta!"
            rightAnswer.querySelectorAll(".inputInfos")[0].classList.add("invalid")
        }
        else{
            rightAnswer.querySelectorAll("h3")[0].textContent=""
            rightAnswer.querySelectorAll(".inputInfos")[0].classList.remove("invalid")
        }
        if(rightAnswer.querySelectorAll(".inputInfos")[0].value!=="" ){
            if(rightAnswer.querySelectorAll(".inputInfos")[1].value.substring(0,8)!=="https://"){
                rightAnswer.querySelectorAll("h3")[1].innerText="Preencha uma URL válida!"
                rightAnswer.querySelectorAll(".inputInfos")[1].classList.add("invalid")
            }
            else{
                rightAnswer.querySelectorAll("h3")[1].innerText=""
                rightAnswer.querySelectorAll(".inputInfos")[1].classList.remove("invalid")
            }
        }
        for(let x=2;x<allQuestionInput.length;x++){
            const currentQuestionChecked = allQuestionInput[x].querySelectorAll(".inputInfos")
            const currentWarningsChecked = allQuestionInput[x].querySelectorAll("h3")
            console.log(currentQuestionChecked)
            console.log(currentWarningsChecked)
            if(x===2&&currentQuestionChecked[0].value===""){
                currentWarningsChecked[0].innerText="É necessário pelo menos uma resposta errada!"
                currentQuestionChecked[0].classList.add("invalid")
            }
            else{
                currentWarningsChecked[0].innerText=""
                currentQuestionChecked[0].classList.remove("invalid")

            }
            if(currentQuestionChecked[0].value!=="" ){
                if(currentQuestionChecked[1].value.substring(0,8)!=="https://"){
                    currentWarningsChecked[1].innerText="Preencha uma URL válida!"
                    currentQuestionChecked[1].classList.add("invalid")
                }
                else{
                    currentWarningsChecked[1].innerText=""
                    currentQuestionChecked[1].classList.remove("invalid")

                }
            }
        }
    }
}
//Cria os Levels
function levelsGenerator(infos){
    const levelNumbers = infos.levelamount
    let CreateLevelPage = document.querySelector(`.quizzCreationLevels`)
    CreateLevelPage.innerHTML=""
    for(let i = 1; i < levelNumbers + 1; i++){
        CreateLevelPage.innerHTML += levelSection(i)
    }
    CreateLevelPage.querySelector(`.quizzCreationInfos`).classList.add(`active`)
    CreateLevelPage.querySelector(`.open-icon`).classList.toggle(`active`)
    CreateLevelPage.innerHTML += `<button class="proceedToFinish btn" onclick="quizzCreatorProceed(this)">Finalizar Quizz</button>`
    const allLevelInputs= document.querySelectorAll(`.quizzCreationLevels .inputInfos`)
    for(let x=0;x<allLevelInputs.length;x++){
        allLevelInputs[x].addEventListener('input', levelsValidationEvent)
    }
 }
 function levelsValidationEvent(){
    const allLevels = document.querySelectorAll(`.level`)
    const allLevelsPercentages = [];
    for(let i = 0; i < allLevels.length; i++){
        const AllLevelInputs = allLevels[i].querySelectorAll(`.inputInfos`)
        const AllLevelWarnings=allLevels[i].querySelectorAll("h3")
        const levelTitle = AllLevelInputs[0].value
        const warningTitle = AllLevelWarnings[0];
        const levelPercentage = AllLevelInputs[1].value
        const warningPercentage = AllLevelWarnings[1]
        const levelURL = AllLevelInputs[2].value
        const warningURL=AllLevelWarnings[2]
        const levelDescription = AllLevelInputs[3].value
        const warningDescription = AllLevelWarnings[3]
        if(levelTitle.length < 10){
            warningTitle.innerText="É necessário ao menos 10 caracteres!"
            AllLevelInputs[0].classList.add("invalid")
        }
        else{
            warningTitle.innerText=""
            AllLevelInputs[0].classList.remove("invalid")
        }
        if(Number(levelPercentage) < 0 || Number(levelPercentage) > 100){
            warningPercentage.innerText = "Insira um valor igual ou maior que zero e menor que 100!"
            AllLevelInputs[1].classList.add("invalid")
        }
        else{
            warningPercentage.innerText = ""
            allLevelsPercentages[i]=parseInt(AllLevelInputs[1].value)
            AllLevelInputs[1].classList.remove("invalid")
        }
        if(levelURL.substring(0,8)!=="https://"){
            warningURL.innerText="Insira uma URL válida!"
            AllLevelInputs[2].classList.add("invalid")
        } 
        else{
            warningURL.innerText=""
            AllLevelInputs[2].classList.remove("invalid")
        }
        if(levelDescription.length < 30){
            warningDescription.innerText = "A descrição precisa ter ao menos 30 caracteres!"
            AllLevelInputs[3].classList.add("invalid")
        }
        else{
            warningDescription.innerText = ""
            AllLevelInputs[3].classList.remove("invalid")
        }
    }
    console.log(allLevelsPercentages);
    if(!allLevelsPercentages.includes(0)){
        for(let x =0; x<allLevels.length;x++){
            allLevels[x].querySelectorAll("h3")[1].innerText="Pelo menos um nível precisa ser a partir de 0% acertos!"
            allLevels[x].querySelectorAll(".inputInfos")[1].classList.add("invalid")
        }
    }
}
 function levelSection(i){
    return `
    <section class="level box">
        <div class="levelTitle">
            <h1>Nivel ${i}</h1>
            <ion-icon class="open-icon active" name="open-outline" onclick="descriptionToggle(this)"></ion-icon>
        </div>
        <div class="quizzCreationInfos">
            <input class="inputInfos" type="text" placeholder="Título do nível">
            <h3></h3>
            <input class="inputInfos" type="text" placeholder="% de acerto mínima">
            <h3></h3>
            <input class="inputInfos" type="text" placeholder="URL da imagem do nível">
            <h3></h3>
            <textarea class="inputInfos description" placeholder="Descrição do nível"></textarea>
            <h3></h3>
        </div>
    </section>
    `
}
function levelValidation(){
    const AllLevels = document.querySelectorAll(`.level`)
    const allLevelsPercentages = [];
    for(let i = 0; i < AllLevels.length; i++){
        const AllLevelInputs = AllLevels[i].querySelectorAll(`.inputInfos`)
        const levelTitle = AllLevelInputs[0].value
        const levelURL = AllLevelInputs[1].value
        const levelPercentage = Number(AllLevelInputs[2].value)
        const levelDescription = AllLevelInputs[3].value
        //.classList.add(`.inputWrongValue`)
        if(levelTitle.length < 10){
            console.log(`false title`)
            return false
        }if(levelPercentage < 0 || levelPercentage > 100){
            console.log(`levelpercentage`)
            return false
        }
        if(levelURL.substring(0,8)!=="https://"){
            console.log(`levelpercentage`)
            return false
        }if(levelDescription.length < 30){
            console.log(`levelDescription`)
            return false
        }

        globalCreatedQuizz.levels.push({
            title: levelTitle,
            image:  levelURL,
            text:   levelDescription,
            minValue: levelPercentage,
        })
    }
    console.log(`Foi`)
    return true
}
//Bonus
const getEditPromisse = (quizzId) => promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${quizzId}`);
function editQuizz(quizzId,quizzKey){
    getEditPromisse(quizzId)
    mainPage().classList.add(quizzKey)
    promisse.then(editInfosQuizz);
}
function editInfosQuizz(response){
    cleanMainPage();
    loadingScreen();
    mainPage().setAttribute("id", response.data.id)
    mainPage().innerHTML += quizzCreationHeader("Comece editando pelo começo")
    mainPage().innerHTML += quizzCreationAllInfosSection()
    document.querySelector(`.proceedToQuestions`).setAttribute("onclick", "editProceedBtn(this)")
    callBackInfos(response)
    eventCheck()
    removeLoading()
}
function editProceedBtn(element){
    const el = element.classList[0]
    const id = mainPage().getAttributeNode("id").value
    if(el === "proceedToQuestions"){
        if(infosValidation()){
            cleanMainPage()
            console.log(globalCreatedQuizz)
            loadingScreen()
            mainPage().innerHTML += quizzCreationHeader("Edite suas perguntas")
            mainPage().innerHTML += `
            <section class="quizzCreationQuestions">
            </section>
            `
            questionsGenerator(values)
            getEditPromisse(id)
            promisse.then(callBackQuestions)
            document.querySelector(`.proceedToLevels`).setAttribute("onclick","editProceedBtn(this)")
            removeLoading()
        }
    }
    if(el === "proceedToLevels"){
        if(questionsValidation()){
            cleanMainPage()
            console.log(globalCreatedQuizz)
            loadingScreen()
            mainPage().innerHTML += quizzCreationHeader("Agora, edite seus níveis")
            mainPage().innerHTML += `
            <section class="quizzCreationLevels">
            </section>
            `
            levelsGenerator(values)
            getEditPromisse(id)
            promisse.then(callBackLevels)
            document.querySelector(`.proceedToFinish`).setAttribute("onclick","editProceedBtn(this)")
            console.log(mainPage().classList[1])
            removeLoading()
        }
    }
    if(el === "proceedToFinish"){
        console.log(`Oi`)
        if(levelValidation()){
            console.log(`Oi`)
            console.log(globalCreatedQuizz)
            const config = {
                headers:{
                  "Secret-Key": mainPage().classList[1]
                }
            }
            const editpromisse = axios.put(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`,globalCreatedQuizz, config);
            editpromisse.then(function(){
                cleanMainPage()
                loadingScreen()
                updateLocalQuizzes(id, mainPage().classList[1])
                mainPage().innerHTML += quizzCreationHeader("Seu quizz foi editado com sucesso!")
                mainPage().innerHTML += `
                <section class="quizzCreationFinish">
                </section>
                `
                renderQuizzCreationFinish(postResponse.data.id)
                globalCreatedQuizz.title=""
                globalCreatedQuizz.image=""
                globalCreatedQuizz.questions.length=0
                globalCreatedQuizz.levels.length=0
                removeLoading()
            })
            editpromisse.catch(catchError)
    
        } else {
            console.log(`AlgoErrado`)
        }
    }
}
function callBackInfos(response){
    const infos = response.data
    const allInputs = document.querySelectorAll(`.inputInfos`);
    allInputs[0].value = infos.title 
    allInputs[1].value = infos.image
    allInputs[2].value = infos.questions.length
    allInputs[3].value = infos.levels.length
}
function callBackQuestions(response){
    const questions = response.data.questions
    const allQuestion = document.querySelectorAll(`.question`);
    for(let i = 0; i < allQuestion.length; i++){
        let responseSize = 2 + (questions[i].answers.length * 2);
        let jumperText = 0;
        let jumperImg = 0;
        console.log(responseSize)
        const allInputs = allQuestion[i].querySelectorAll(`.inputInfos`);
        allInputs[0].value = questions[i].title;
        allInputs[1].value = questions[i].color;
        for(let j = 2; j < responseSize; j+=2){
            allInputs[j].value = questions[i].answers[jumperText].text;
            jumperText++;
        }
        for(let x = 3; x < responseSize; x+=2){
            allInputs[x].value = questions[i].answers[jumperImg].image;
            jumperImg++;
        }
    }
}
function callBackLevels(response){
    const levels = response.data.levels;
    const allLevels = document.querySelectorAll(`.level`); 
    for(let i = 0; i < allLevels.length; i++){
        const allInputs = allLevels[i].querySelectorAll(`.inputInfos`);
        allInputs[0].value = levels[i].title
        allInputs[1].value = levels[i].image
        allInputs[2].value = Number(levels[i].minValue)
        allInputs[3].value = levels[i].text
    }
}
function deleteQuizz(quizzId,quizzKey){
    if (confirm("Tem certeza que deseja deletar este quizz?") == true){
        const config = {
            headers:{
              "Secret-Key": quizzKey
            }
        }
        const promisse = axios.delete("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/"+quizzId, config)
        promisse.then(function (response){
            deleteFromLocalStorage(quizzId)
            alert("Quizz deletado!")
            window.location.reload()
        })
        promisse.catch(catchError)
    }
}
function deleteFromLocalStorage(quizzId){
    const userIds=JSON.parse(localStorage.getItem("localQuizzList"))
    const userKeys=JSON.parse(localStorage.getItem("localQuizzKeyList"))
    quizzIndex=userIds.indexOf(quizzId)
    userIds.splice(quizzIndex,1)
    userKeys.splice(quizzIndex,1)
    localStorage.setItem("localQuizzList",JSON.stringify(userIds))
    localStorage.setItem("localQuizzKeyList",JSON.stringify(userKeys))
}
function stopEvent(event) {
    event.stopPropagation();
}
/*Erros*/
function catchError(error){
    loadingScreen()
    alert("Ocorreu um erro! codigo "+error.response.status)
    removeLoading()
}

