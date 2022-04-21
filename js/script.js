const globalCreatedQuizz ={
    title: "",
    image: "",
    questions: [],
    levels: []
}
let main = (page) => document.querySelectorAll(`main`)[page].classList.toggle(`active`)
function quizzCreator(){
    main(0) 
    main(2)
}
function homeButton(element){
    const home = element.parentNode.classList[0];
    if(home === "quizzpage"){
        main(2);
        main(0);
    }
    if(home === "quizzCreationFinish"){
        main(2);
        main(0);
    }
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
            const promisse = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",globalCreatedQuizz)
            promisse.then(function(){
            infosText.innerHTML = "Seu quizz está pronto!"
            quizzCreatorChangePages(2)
            quizzCreatorChangePages(3)
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
        globalCreatedQuizz.levels.push={
            title: levelTitle,
            image:  levelURL,
            text:   levelDescription,
            minValue: levelPercentage,
        }
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
    const userQuizzesRenders=document.querySelector(".userAllQuizzes")
    console.log(allQuizzes)
    //esse filtro tem que ser atualizado para conter um for comparando a um array de ids
    const userIds=4;
    const allUserQuizzes =allQuizzes.data.filter(function(currentQuizz){
        return userIds===currentQuizz.id;
    })
    //checa se há há algum quizz do usuario
    if(allUserQuizzes.length>0){
        document.querySelector(".userEmptyQuizzes").classList.remove("active")
        userQuizzesRenders.classList.add("active")
    }
    //renderiza os quizzes do usuario
    userQuizzesRenders.innerHTML=""
    for(x=0;x<allUserQuizzes.length;x++){
    userQuizzesRenders.innerHTML+=`
    <li class="quizz" style="background-image: url('${allUserQuizzes[x].image}');"> 
        <div id="${allUserQuizzes[x].id}" onclick="quizzProceed(this)">
        <h2>${allUserQuizzes[x].title}</h2>
        </div>
    </li>`
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
    <div id="${allOtherQuizzes[x].id}" onclick="startQuizz(this)">
    <h2>${allOtherQuizzes[x].title}</h2>
    </div>
</li>`
    }
}
function startQuizz(element){
    const quizzId = element.id //Scopar o ID do Elemento
    const quizzToPlayPromisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${quizzId}`) //Tem que mudar o Id do final para saber qual é o quizz.
    quizzToPlayPromisse.then(QuizzInfos)
    quizzToPlayPromisse.catch()
}
let data;
function QuizzInfos(quizz){
    const quizzPage = document.querySelector(`.quizzPage`) //Se tiver Vazio, faz somente 1 vez o quizz, caso não esteja consigo acessar as infos do then, sem precissar puxar dnv!
    while(quizzPage.innerHTML === '\n    '){
        console.log(`Minha Primeira vez criando o Quizz`)
        createQuizz(quizz)
        data = quizz
        return false
    } 
    console.log(`Estou somente pegando as informaçoes`)
    return data
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
    main(0)
    main(1)
    quizzPage.scrollIntoView(true)
    console.log(arrayEmbaralhada)
}

function comparador() { 
	return Math.random() - 0.5; 
}
function sectionQuizzHeader(quizz){ //Feito
    return `
    <section class="quizzPageHeader" style="background-image: url(${quizz.image});">
        <h1>${quizz.title}</h1>
    </section>
    `
}
function sectionQuizzQuestion(){//Cria as Questions
    return`
    <section class="quizzQuestion quizzBox">
    </section>
    `
}
function sectionQuizzQuestionContent(question){ //Cria o Content de cada Questão
    return `
    <div class="quizzQuestionTitle" style="background-color: ${question.color};">
        <h1 class="quizzTopTitle">${question.title}</h1>
    </div>
    <ul class="allAlternatives">
    </ul>
    `
}
function liQuizzQuestionAlternatives(answers){//Cria cada 
    return `
    <li class="quizzAlternative" onclick="isRight(this)">
        <div class="answerImg" style="background-image: url(${answers.image});"></div>
        <h2>${answers.text}</h2>
    </li>
    `
}
//Erros dessa parte que precisam ser corrigidos!!!!!!!!
//1 - Para saber se a resposta é correta ele precisa verificar a array embaralhada!
//2 - Para saber se a reposta é correta ele tem que de alguma forma verificar a array de acordo com o número da questo que ele clicou
function isRight(element){
    const alternatives = element.parentNode.querySelectorAll(`.quizzAlternative`)//Selecionar todas as alternativas da Questão
    questionClick(element)
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
    }
    const infos = QuizzInfos().data
    //Teoricamente seria a função do game, porém como o resultado varia de acordo com % de acertos, a section Resultado só pode ser criada quando o Quizz é totalmente respondido!!!!
    //Possivelmente da para fazer isso como uma função separada!!
    const amountOfQuestions = document.querySelectorAll(`.quizzQuestion`) //Saber quantas questões tem
    const allRightAnswers = document.querySelectorAll(`.rightAnswer`) //Saber se todas as questões foram respondias, pois apenas 1 alternativa está certa por SectionQuestion, logo da para usar como comparação! Obs: da tbm para usar o atributo como comparação tbm, pois o mesmo fica zerado quando todas respostas foram respondidas!
    if(amountOfQuestions.length === allRightAnswers.length){//Para saber se o jogo acabou
        console.log(`apareci`)
        let rightAnswerByUser = 0 //Quantidade de Acertos!
        for(let x = 0; x < allRightAnswers.length; x++){//Para saber se o usuario acertou ou não
            if(allRightAnswers[x].parentNode.classList.contains(`opacity`)){//quer dizer que errou a questão, pois se ele acerta a reposta não ganha opacidade!
            } else {//Se não tiver opacity, aumenta a quantidade de acertos!
                rightAnswerByUser++
            }
        }
        //Porcentagem de Acerto!
        const percentageByUser = (rightAnswerByUser / allRightAnswers.length) * 100
        const AllLevels = infos.levels
        console.log(AllLevels)
        let zIndice;
        for(let z = 0; z < AllLevels.length; z++){//Saber quantos niveis tem/saber qual o usuario se encaixa
            console.log(AllLevels[z].minValue)
            console.log(AllLevels.length)
            console.log(percentageByUser)
            if(AllLevels[z].minValue <= percentageByUser){
                console.log(AllLevels[z].minValue <= percentageByUser)
                zIndice = z //Armazena em qual level o jogador ficou!
            }
        }
        
        const quizzPage = document.querySelector(`.quizzPage`)
        quizzPage.innerHTML += sectionQuizzResult() //Falta colocar os onclick!!!
        const resultContent = document.querySelector(`.quizzResult .quizzBox`);
        resultContent.innerHTML = quizzResultContent(AllLevels[zIndice], percentageByUser);
        document.querySelector(`.quizzResult`).classList.add(`active`)
        

    }
}


function questionClick(element){
    const questionClicked = element.parentNode.parentNode;
    const allQuestion = document.querySelectorAll(`.quizzQuestion`)
    for(let i = 0; i < allQuestion.length; i++){
        if(allQuestion[i] === questionClicked){
            return i
        }
    }
}
function sectionQuizzResult(){
    return `
    <section class="quizzResult">
            <div class="quizzBox">
            </div>
            <button class="restartQuizz btn">Reiniciar Quizz</button>
            <button class="homeButton">Voltar Home</button>
    </section>
    `
}
function quizzResultContent(levels, percentageByUser){
    const userPercentage = percentageByUser.toFixed(0);
    return `
    <div class="quizzResultTitle">
        <h1 class="quizzTopTitle">${userPercentage}% de acerto: ${levels.title}</h1>
    </div>
    <div class="resultDescription">
        <img src="${levels.image}" alt="">
        <h2>${levels.text}</h2>
    </div>
    `
}