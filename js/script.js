const globalCreatedQuizz ={
    title: "",
    image: "",
    questions: [],
    levels: []
}
let main = (page) => document.querySelectorAll(`main`)[page]
function quizzCreator(){
    main(0).classList.toggle(`active`)
    main(2).classList.toggle(`active`)
}
function homeButton(element){
    window.location.reload()
    requestRenderQuizzes();
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
            levelsGenerator(infosValidation())
        } else {
            alert(`Usuário, digite os dados corretamente`)
        }
    }if(el === "proceedToFinish"){
        if(levelValidation()){
            console.log(globalCreatedQuizz)
            const promisse = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",globalCreatedQuizz)
            promisse.then(function(postResponse){
                updateLocalQuizzes(postResponse.data.id)
                infosText.innerHTML = "Seu quizz está pronto!"
                quizzCreatorChangePages(2)
                quizzCreatorChangePages(3)
                renderQuizzCreationFinish(postResponse.data.id)
                globalCreatedQuizz.title=""
                globalCreatedQuizz.image=""
                globalCreatedQuizz.questions.length=0
                globalCreatedQuizz.levels.length=0
            })
            promisse.catch(catchError)

        } else {
            alert(`Usuário, digite os dados corretamente`)
        }
    }
}
function updateLocalQuizzes(quizzId){
    let localQuizzListUpdate =[];
    if(localStorage.getItem("localQuizzList")){
        localQuizzListUpdate=JSON.parse(localStorage.getItem("localQuizzList"))
    }
    localQuizzListUpdate.push(quizzId);
    localStorage.setItem("localQuizzList", JSON.stringify(localQuizzListUpdate));
    console.log(localQuizzListUpdate)
    console.log(localStorage.getItem("localQuizzList"))
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
    return {
        quizztitle: quizzTitle,
        questionamount: questionAmount,
        levelamount: levelsAmount,
    }
}
function questionsGenerator(infos){
    
   const questionNumbers = infos.questionamount
   let CreateQuestionsPage = document.querySelector(`.quizzCreationQuestions`)
   CreateQuestionsPage.innerHTML="";
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
                if(currentQuestionChecked[0].value.length<0){
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
            <input class="inputInfos" type="text" placeholder="% de acerto mínima">
            <input class="inputInfos" type="text" placeholder="URL da imagem do nível">
            <input class="inputInfos description" type="text" placeholder="Descrição do nível">
        </div>
    </section>
    `
}
function levelValidation(){
    const AllLevels = document.querySelectorAll(`.level`)
    for(let i = 0; i < AllLevels.length; i++){
        const AllLevelInputs = AllLevels[i].querySelectorAll(`.inputInfos`)
        const levelTitle = AllLevelInputs[0].value
        const levelPercentage = Number(AllLevelInputs[1].value)
        const levelURL = AllLevelInputs[2].value
        const levelDescription = AllLevelInputs[3].value
        if(levelTitle.length < 10){
            return false
        }if(levelPercentage < 0 || levelPercentage > 100){
            return false
        }if(levelURL.substring(0,8)!=="https://"){
            return false
        }if(levelDescription.length < 30){
            return false
        }
        globalCreatedQuizz.levels.push({
            title: levelTitle,
            image:  levelURL,
            text:   levelDescription,
            minValue: levelPercentage,
        })
    }
    return true
}
function catchError(error){
    alert("Ocorreu um erro! codigo "+error.response.status)
}
function requestRenderQuizzes(){
    promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
    promisse.then(renderQuizzes)
    promisse.catch(catchError)
}
function renderQuizzes(allQuizzes){
    const otherQuizzesRenders=document.querySelector(".otherQuizzes")
    const userQuizzesRenders=document.querySelector(".quizzByUser")
    console.log(allQuizzes)
    //esse filtro tem que ser atualizado para conter um for comparando a um array de ids
    const userIds=JSON.parse(localStorage.getItem("localQuizzList"))
    
    if(userIds){
        const allUserQuizzes =allQuizzes.data.filter(function(currentQuizz){
            for(let x=0;x<userIds.length;x++){
                if(currentQuizz.id===userIds[x]){
                    return true        
                }
            }
            return false;
        })
        
        //checa se há há algum quizz do usuario
        if(allUserQuizzes.length>0){
            document.querySelector(".userEmptyQuizzes").classList.remove("active")
            document.querySelector(".userAllQuizzes").classList.add("active")
        }
         //renderiza os quizzes do usuario
        userQuizzesRenders.innerHTML=""
        for(x=0;x<allUserQuizzes.length;x++){
        userQuizzesRenders.innerHTML+=`
        <li class="quizz" style="background-image: url('${allUserQuizzes[x].image}');"> 
            <div onclick="startQuizz(${allUserQuizzes[x].id})">
            <h2>${allUserQuizzes[x].title}</h2>
            </div>
        </li>`
        }
    }
   
    //renderiza os quizzes de todo mundo
    const allOtherQuizzes = allQuizzes.data.filter(function(currentQuizz){
        return userIds!==currentQuizz.id;
    })
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
}
function startQuizz(id){
    const quizzToPlayPromisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`) //Tem que mudar o Id do final para saber qual é o quizz.
    quizzToPlayPromisse.then(QuizzInfos)
    quizzToPlayPromisse.catch()
}
let thenQuizz;
const quizzPage = () => document.querySelector(`.quizzPage`)
function QuizzInfos(quizz){
    while(quizzPage().innerHTML === '\n    '){
        createQuizz(quizz)
        thenQuizz = quizz
        return false
    } 
    return thenQuizz
}
let arrayEmbaralhada = []
function createQuizz(quizz){
    const quizzInfos = quizz.data
    const quizzPage = document.querySelector(`.quizzPage`);//fazer as alteraçoes da tela 2
    quizzPage.setAttribute("id", quizzInfos.id) // Dizer qual é o jogo
    //Funcionando até
    quizzPage.innerHTML += sectionQuizzHeader(quizzInfos) //Cria o Header
    for(let i = 0; i < quizzInfos.questions.length; i++){
        quizzPage.innerHTML += sectionQuizzQuestion() //Cria a Section da Questão
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
    main(0).classList.remove(`active`)
    main(1).classList.add(`active`)
    document.querySelector(`html`).scrollIntoView(true)
}
function comparador() { 
	return Math.random() - 0.5; 
}
//Funções de criação do Quizz - Tela 2
function sectionQuizzHeader(quizz){
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
            if(i === 1){
                return setTimeout(function (){allQuestion()[i].scrollIntoView({behavior: "smooth",})}, 2000)
            }
        }
    }
}
function notAnswered(){
    for(let i = 0; i < allQuestion().length;i++){
        if(!allQuestion()[i].classList.contains(`answered`)){
            return allQuestion[i]
        }
    }
    return false
}
//Função para checar se o Quizz foi totalmente respondido!
function isQuizzFinished(){
    const AllLevels = QuizzInfos().data.levels
    const amountOfQuestions = document.querySelectorAll(`.quizzQuestion`)
    const allRightAnswers = document.querySelectorAll(`.rightAnswer`)
    if(amountOfQuestions.length === allRightAnswers.length){//Para saber se o jogo acabou
        console.log(AllLevels)
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
    quizzPage().innerHTML += sectionQuizzResult();
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
    const id = quizzPage().getAttributeNode("id").value
    quizzPage().innerHTML = '\n    '
    console.log(id)
    startQuizz(id)
}