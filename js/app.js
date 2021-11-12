class HandleEvents {
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

  static foreachWithEvent(items, happiningFN) {
    items.forEach((item) => {
      item.addEventListener("click", happiningFN);
    });
  }
}
// Variables
const typeQuestionsItems = document.querySelectorAll(
  ".quiz-page .wrap-all-content .wrap-content .question-type-item"
);

// Handle types of question
HandleEvents.foreachWithEvent(typeQuestionsItems, function (event) {
  // Variables
  const quizType = this.dataset.quizType;
  // Add active when click on type
  HandleEvents.addActive(event, typeQuestionsItems);
  // Change Link depend on your choice
  HandleEvents.changeHREFLink(".to-questions-btn", quizType);
});
