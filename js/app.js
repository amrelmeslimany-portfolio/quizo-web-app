import { HandlQuestions, HandleEvents } from "./Classes/Quiz.js";
// Variables
const typeQuestionsItems = document.querySelectorAll(
  ".quiz-page .wrap-all-content .wrap-content .question-type-item"
);

// Home Page
window.onload = () => {
  if (document.querySelector("#showModal")) {
    document.querySelector("#showModal").click();
  }
};

// Handle types of question (Quiz Page)
if (typeQuestionsItems.length > 0) {
  HandleEvents.foreachWithEvent(typeQuestionsItems, function (event) {
    // Variables
    const quizType = this.dataset.quizType;
    // Add active when click on type
    HandleEvents.addActive(event, typeQuestionsItems);
    // Change Link depend on your choice
    HandleEvents.changeHREFLink(".to-questions-btn", quizType);
  });
}

// Handle Questions Page (Questions Page)
if (location.pathname.includes("questions.html")) {
  HandleEvents.getResult("https://amrelmeslimany-portfolio.github.io/quizo-web-app/js/data.json").then((data) => {
    let { quiz } = data[0];
    let elements = {
      questionsWrapContentTag: ".quiz-page .wrap-all-content .wrap-content",
      questionTag: ".question-instructions .question h4",
      notesTag: ".question-instructions .question .note",
      timerTag: ".question-instructions .instructions .inst-timer",
      typeQuizTag: ".question-instructions .instructions .inst-type-question",
      choicesWrapUlTag: ".choices-wrap .choices-wrap-ul",
      currentQuestionsNumberTag: ".choices-wrap .current-question-number",
      questionsNumberTag: ".choices-wrap .questions-number",
      correctAnswerNumberTag: ".choices-wrap .correct-asnwers-number",
      emotionFaceTag: ".choices-wrap .result-emotion",
      wrongAnswersNumberTag: ".choices-wrap .wrong-answers-number",
      showAnswerBTN: ".to-next-questions-btn",
      modalTags: {
        btnOpenModal: "button.show-result",
        faceEmotion: "#showResult .face-emotion",
        correctedAnswers: "#showResult .correct-result-number",
        wrongAnswers: "#showResult .wrong-result-number",
        allQuestions: "#showResult .allquestion-result-number",
      },
    };
    let quizInstance = new HandlQuestions(elements);

    // Iniit Quiz
    quizInstance.initTheQuiz(quiz);
  });
}
