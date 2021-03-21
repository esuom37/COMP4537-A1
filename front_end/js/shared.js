class Question {
    constructor(questionText, answersArray) {
        this.text = questionText;
        this.answers = answersArray;
    }
}

// Creates and returns an empty question with 4 empty answers
function createEmptyQuestion(numAnswers) {
    let answers = [];
    
    for (let i = 0; i < numAnswers; i++) {
        let emptyAnswer = { text : "", is_correct : false };
        answers.push(emptyAnswer);
    }
    
    return new Question("", answers);
}