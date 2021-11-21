export class HandleEvents {
  // Handle Active Siblings Event
  static addActive(event, [...list]) {
    event.preventDefault();
    list.forEach((node) => {
      node.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
  }

  // Change "HREF" of links
  static changeHREFLink(linkName, query) {
    const link = document.querySelector(linkName);
    link.href = `questions.html?quizType=${query}`;
  }

  // Foreach with event
  static foreachWithEvent(items, happiningFN, eventType = "click") {
    items.forEach((item) => {
      item.addEventListener(eventType, happiningFN);
    });
  }

  // fetch FN return result or error
  static async getResult(link) {
    try {
      const response = await fetch(link);
      const data = await response.json();
      return data;
    } catch (error) {
      return console.log(error);
    }
  }

  // Remove the placeholder
  static removePlaceholder(item) {
    item.classList.remove("placeholder-glow");
  }

  // Hanlde Zero before numbers
  static hanldeNumbers(number) {
    return number != 0 && number < 10 ? `0${number}` : number;
  }

  // Handle Two classes Remove with add
  static addWithRemoveClasses(item, remove, add) {
    item.classList.remove(remove);
    item.classList.add(add);
  }

  // Create Icon
  static createIcon(classN) {
    let icon = document.createElement("i");
    icon.className = classN;

    return icon;
  }
}

export class HandlQuestions {
  // Elements
  #questionsWrapContentTag;
  #questionTag;
  #notesTag;
  #timerTag;
  #typeQuizTag;
  #choicesWrapUlTag;
  #currentQuestionsNumberTag;
  #questionsNumberTag;
  #correctAnswerNumberTag;
  #emotionFaceTag;
  #wrongAnswersNumberTag;
  #showAnswerBTN;
  #questionResults;
  #modalResultTag = {
    btnOpenModal: null,
    faceEmotion: null,
    correctedAnswers: null,
    wrongAnswers: null,
    allQuestions: null,
  };
  #btnStartQuiz;
  // Numbers
  #questionCount = 0;
  #resultData = {
    questionsNumber: 0,
    itemSelected: HTMLInputElement,
    correctItem: HTMLLabelElement,
    userChoice: "0",
    correctChoice: "0",
    correctNumbers: 0,
    wrongNumbers: 0,
  };
  #timerINT;
  constructor({
    questionsWrapContentTag,
    questionTag,
    notesTag,
    timerTag,
    typeQuizTag,
    choicesWrapUlTag,
    currentQuestionsNumberTag,
    questionsNumberTag,
    correctAnswerNumberTag,
    emotionFaceTag,
    wrongAnswersNumberTag,
    showAnswerBTN,
    modalTags,
  }) {
    this.#questionsWrapContentTag = document.querySelector(
      questionsWrapContentTag
    );
    this.#questionTag = document.querySelector(questionTag);
    this.#notesTag = document.querySelector(notesTag);
    this.#timerTag = document.querySelector(timerTag);
    this.#typeQuizTag = document.querySelector(typeQuizTag);
    this.#choicesWrapUlTag = document.querySelector(choicesWrapUlTag);
    this.#currentQuestionsNumberTag = document.querySelector(
      currentQuestionsNumberTag
    );
    this.#questionsNumberTag = document.querySelector(questionsNumberTag);
    this.#correctAnswerNumberTag = document.querySelector(
      correctAnswerNumberTag
    );
    this.#emotionFaceTag = document.querySelector(emotionFaceTag);
    this.#wrongAnswersNumberTag = document.querySelector(wrongAnswersNumberTag);
    this.#showAnswerBTN = document.querySelector(showAnswerBTN);
    this.#btnStartQuiz = document.querySelector(
      ".overflow-bg-startbtn button.btn-start"
    );
    // modal tags
    this.#modalResultTag.btnOpenModal = document.querySelector(
      modalTags.btnOpenModal
    );
    this.#modalResultTag.correctedAnswers = document.querySelector(
      modalTags.correctedAnswers
    );
    this.#modalResultTag.wrongAnswers = document.querySelector(
      modalTags.wrongAnswers
    );
    this.#modalResultTag.faceEmotion = document.querySelector(
      modalTags.faceEmotion
    );
    this.#modalResultTag.allQuestions = document.querySelectorAll(
      modalTags.allQuestions
    );
  }
  // Message UI Html if somthing happend
  #htmlMessage(emotion = "sad", message) {
    return `
      <div class="text-center">
      <i class="mdi mdi-emoticon-${emotion}-outline display-4 text-warning mb-sm-5 d-block"></i>
      <h2 class="display-lg1 mb-5 text-capitalize text-secondary">${message}</h2>
      <p class="mt-sm-5 mb-sm-5">You can go to our quiz types to select type of quiz from this link <a href="quiz.html" class="text-primary">Quiz Types</a></p>
      </div>
      `;
  }
  // Filter The Question depend on the params
  #filterQuestions(questions) {
    const params = new URLSearchParams(location.search);
    let filterdQuestions = [];
    let returendValue = {
      code: "",
      questionsResult: [],
      questionsNumber: 0,
    };
    // Check If Url is working good and exists
    if (params.has("quizType")) {
      filterdQuestions = questions.filter(
        (currentQuestion) =>
          currentQuestion.questionType.toLowerCase() ===
          params.get("quizType").toLowerCase()
      );

      if (filterdQuestions.length > 0) {
        returendValue = {
          code: "success",
          questionsResult: filterdQuestions,
          questionsNumber: filterdQuestions.length,
        };
      } else {
        returendValue = {
          code: "fail",
          questionsResult: this.#htmlMessage(
            "sad",
            "this type dosn't have questions now"
          ),
        };
      }
    } else {
      returendValue = {
        code: "fail",
        questionsResult: this.#htmlMessage(
          "sad",
          "Wrong URL,Go to our site again"
        ),
      };
    }

    return returendValue;
  }

  // Handle Display Data and Information in page
  initTheQuiz(questions) {
    let { code, questionsNumber, questionsResult } =
      this.#filterQuestions(questions);
    let that = this;

    // Check if there are questions or not
    if (code === "success") {
      // Display the question when user click start
      this.#btnStartQuiz.addEventListener("click", function () {
        that.#hideStartReady();
        that.#questionResults = questionsResult;
        that.#resultData.questionsNumber = questionsNumber;
        that.#displayDataOfTheQuestion(questionsResult, that.#questionCount);
      });
    } else if (code === "fail") {
      this.#hideStartReady();
      this.#questionsWrapContentTag.innerHTML = questionsResult;
      this.#showAnswerBTN.remove();
    }
  }

  // Display The Question with their data in page
  #displayDataOfTheQuestion(questionsItems, currentNumber) {
    let {
      question,
      notice,
      questionType,
      choices,
      correctAnswer,
      questionDuration,
    } = questionsItems[currentNumber];
    // Remove Placeholders
    HandleEvents.removePlaceholder(this.#questionTag);
    HandleEvents.removePlaceholder(this.#notesTag);
    HandleEvents.removePlaceholder(this.#typeQuizTag);
    // init
    this.#clickButtonAnswer();
    this.#handleTimer(questionDuration);
    // Change Content Of Question
    this.#questionTag.innerHTML = question;
    // Change Content Of Notice
    this.#notesTag.innerHTML = notice
      ? Array.isArray(notice)
        ? notice.join(" - ")
        : notice
      : "Please select one choice and click show answer";
    // Change Content Of Type Of Quiz
    this.#typeQuizTag.innerHTML = questionType;
    // ---- save correct answer to public var in this class called : correctChoice
    this.#resultData.correctChoice = correctAnswer;
    // Change Content Of Choices
    this.#createChoices(choices);
    // Set Premenet Result in side
    this.#changeSidResults();
  }

  // Timer
  // Create Countdown Timer
  #startTimer(duration, display, duringTimerFN, finishedTimerFN) {
    let that = this;
    let timer = duration,
      minutes,
      seconds;
    this.#timerINT = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      timer--;

      if (timer < 0) {
        clearInterval(that.#timerINT);
        finishedTimerFN(that);
      } else {
        duringTimerFN(timer);
      }
    }, 1000);
  }
  // Lunch warning music with time
  #stillingWork(timer) {
    if (timer <= 8) {
      new Audio("../../assets/Sounds/timer.mp3").play();
    }
  }
  // Handle Timer
  #handleTimer(durationData) {
    let that = this;
    let { durationByMinute, durationNumber } = durationData;
    let timerCount = durationByMinute ? durationNumber * 60 : durationNumber;
    function finishedTimer(that) {
      that.#handleAvticeAnswerButton();
      that.#showAnswerBTN.click();
      that.#clickButtonAnswer();
    }
    this.#startTimer(
      timerCount,
      that.#timerTag,
      this.#stillingWork,
      finishedTimer
    );
  }
  // Change Results Of Sidebar of result
  #changeSidResults() {
    // ---- set the current number of question
    this.#currentQuestionsNumberTag.innerHTML = HandleEvents.hanldeNumbers(
      this.#questionCount + 1
    );

    // ---- set the all number of question
    this.#questionsNumberTag.innerHTML = HandleEvents.hanldeNumbers(
      this.#resultData.questionsNumber
    );

    // ---- set correct answer and (good or bad result)
    this.#handleBadGood(
      this.#resultData.questionsNumber,
      this.#resultData.correctNumbers
    );
    // ---- set correct and wrong answers number
    this.#correctAnswerNumberTag.innerHTML = HandleEvents.hanldeNumbers(
      this.#resultData.correctNumbers
    );
    this.#wrongAnswersNumberTag.innerHTML = HandleEvents.hanldeNumbers(
      this.#resultData.wrongNumbers
    );
  }
  // Create Html Choices and Handle them
  #createChoices(choices) {
    this.#choicesWrapUlTag.innerHTML = "";
    choices.forEach(({ choiceNumber, choiceText }) => {
      let label = document.createElement("label");
      label.className = "list-group-item list-group-item-action  border-light";
      label.innerHTML = `
        <input class="form-check-input me-1" type="radio" name="choice" value="${choiceNumber}"
            aria-label="...">
        <span class="display-md2">${choiceText}</span>
        `;

      this.#choicesWrapUlTag.append(label);

      this.#handleChangeChoice(label);
    });
  }

  // Handle Click on choice
  #handleChangeChoice(item) {
    let that = this;
    item.querySelector("input").onchange = function ({ currentTarget }) {
      that.#resultData.itemSelected = currentTarget;
      that.#resultData.userChoice = currentTarget.value.toString();
      // Active Show answer
      that.#handleAvticeAnswerButton();
    };

    if (that.#resultData.correctChoice === item.querySelector("input").value) {
      that.#resultData.correctItem = item;
    }
  }

  // Bad or good method
  #handleBadGood(
    questionsNumber,
    correctAnswersNumber = 0,
    emotionIconTag = this.#emotionFaceTag
  ) {
    let halfAllNumber =
      questionsNumber % 2 == 0
        ? questionsNumber / 2
        : Math.round(questionsNumber / 2);

    // If it good
    if (
      correctAnswersNumber == questionsNumber ||
      correctAnswersNumber >= halfAllNumber
    ) {
      HandleEvents.addWithRemoveClasses(
        emotionIconTag,
        "mdi-emoticon-sad-outline",
        "mdi-emoticon-happy-outline"
      );
    } else if (correctAnswersNumber < halfAllNumber) {
      HandleEvents.addWithRemoveClasses(
        emotionIconTag,
        "mdi-emoticon-happy-outline",
        "mdi-emoticon-sad-outline"
      );
    }
  }

  // Active Show Answer Button
  #handleAvticeAnswerButton() {
    this.#showAnswerBTN.classList.remove("disabled");
  }

  // Check If Correct Is Answer Or not
  #isSelectedCorrect() {
    // Vars
    let {
      userChoice: choiced,
      correctChoice: correct,
      itemSelected,
    } = this.#resultData;
    let parentSelectedITem = itemSelected.parentElement;

    console.log(choiced);

    if (choiced == correct) {
      // Lunch Voice
      new Audio("../assets/Sounds/mixkit-correct-answer-reward-952.wav").play();

      // Add Class
      parentSelectedITem.classList.add("correct-answer");
      // Add Icon With Green BG
      parentSelectedITem.append(
        HandleEvents.createIcon(
          "float-end mdi mdi-check-bold align-middle text-primary"
        )
      );

      // Increase Correct Answer Number
      this.#resultData.correctNumbers++;
    } else if (choiced != correct || choiced == 0) {
      // Lunch Voice
      new Audio(
        "../assets/Sounds/mixkit-wrong-answer-fail-notification-946.wav"
      ).play();

      // Add Classes
      if (parentSelectedITem) {
        parentSelectedITem.classList.add("wrong-answer");
      }
      // Add Right Mark to right answer
      this.#resultData.correctItem.classList.add("correct-answer");
      this.#resultData.correctItem.append(
        HandleEvents.createIcon(
          "float-end mdi mdi-check-bold align-middle text-primary"
        )
      );
      // Append To Html
      if (parentSelectedITem) {
        parentSelectedITem.append(
          HandleEvents.createIcon(
            "float-end mdi mdi-close align-middle text-white"
          )
        );
      }

      // Increase wrong number
      this.#resultData.wrongNumbers++;
    }
  }

  // Change modal to final result
  #handleModal() {
    this.#modalResultTag.correctedAnswers.innerHTML =
      HandleEvents.hanldeNumbers(this.#resultData.correctNumbers);
    this.#modalResultTag.wrongAnswers.innerHTML = HandleEvents.hanldeNumbers(
      this.#resultData.wrongNumbers
    );
    this.#modalResultTag.allQuestions.forEach(
      (item) => (item.innerHTML = "/" + this.#resultData.questionsNumber)
    );

    this.#handleBadGood(
      this.#resultData.questionsNumber,
      this.#resultData.correctNumbers,
      this.#modalResultTag.faceEmotion
    );

    this.#modalResultTag.btnOpenModal.style.display = "inline-block";
    this.#modalResultTag.btnOpenModal.addEventListener("click", () => {
      new Audio(
        "../../assets/Sounds/mixkit-musical-alert-notification-2309.wav"
      ).play();
    });
  }

  // handle button click
  #clickButtonAnswer() {
    const counterPlused1 = this.#questionCount + 1;
    let { btnRole } = this.#showAnswerBTN.dataset;
    let that = this;
    if (that.#resultData.questionsNumber >= counterPlused1) {
      this.#showAnswerBTN.onclick = function (event) {
        if (btnRole === "showAnswer") {
          // Clear Timer Intrval
          clearInterval(that.#timerINT);
          that.#isSelectedCorrect();
          // Remove check inputs when user show the answer
          that.#choicesWrapUlTag
            .querySelectorAll("label input")
            .forEach((item) => {
              let label = item.parentElement;
              label.style.cursor = "auto";
              label.classList.remove("list-group-item-action");
              item.remove();
            });
          // If the question is the last show all result in modal
          if (that.#resultData.questionsNumber != counterPlused1) {
            // change dataset btnRole to do next question funcion
            this.dataset.btnRole = "nextQuestion";
            btnRole = "nextQuestion";
            this.innerHTML = "Next Question";
          } else {
            // lunch modal with final result if last question answered and remove btn
            that.#handleModal();
            setTimeout(() => {
              that.#modalResultTag.btnOpenModal.click();
            }, 1000);
            that.#changeSidResults();
            this.remove();
            return false;
          }
        } else if (btnRole === "nextQuestion") {
          // Next Question
          that.#questionCount++;
          // Disable btn when click next question for starting new question
          this.classList.add("disabled");
          this.innerHTML = "Show The Answer";
          this.dataset.btnRole = "showAnswer";
          btnRole = "showAnswer";
          // Change Data to new Question Data
          that.#displayDataOfTheQuestion(
            that.#questionResults,
            that.#questionCount
          );
        }
      };
    } else {
      // Remove btn when arrive to last question
      this.#showAnswerBTN.remove();
      return false;
    }
  }

  // Hide Start Ready Page
  #hideStartReady() {
    document.body.classList.remove("ready-page");
    document.querySelector(".overflow-bg-startbtn").remove();
  }
}
