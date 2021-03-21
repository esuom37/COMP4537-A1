const updateQuestions = async () => {
	const response = await axios.get('/questions');
	const questionsJSON = response.data;
	const main = document.getElementById('main-content');
	main.innerHTML = '';
	const template = document.getElementById('template_question');

	for (questionIndex in questionsJSON) {
		const questionData = questionsJSON[questionIndex];
		const questionId = questionData.id;
		const uniqueId = 'question' + questionId;

		let clone = template.cloneNode(true);
		clone.setAttribute('id', uniqueId);

		main.appendChild(clone);
		let questionTitle = document.querySelector(`#${uniqueId} .question-title`);
		questionTitle.innerHTML = 'Question ' + (parseInt(questionIndex) + 1);
		let questionText = document.querySelector(`#${uniqueId} .question-text`);
		questionText.innerHTML = questionData.text;

		let answersWrapper = document.querySelector(`#${uniqueId}`);
		for (answerIndex in questionData.answers) {
			let answerData = questionData.answers[answerIndex];

			let answerText = document.createElement("span");
			answerText.classList.add("answer-desc");
			answerText.type = "text";
			answerText.innerHTML = answerData.text;

			let answerRadio = document.createElement("input");
			answerRadio.classList.add("answer-radio");
			answerRadio.type = "radio";
			answerRadio.name = uniqueId + "-answer-text";

			let answerDiv = document.createElement("div");
			answerDiv.classList.add("answer");
			answerDiv.appendChild(answerRadio);
			answerDiv.appendChild(answerText);

			answersWrapper.appendChild(answerDiv);
		}
	}
};

const getQuestions = async () => {
	const response = axios.get('/questions');
	return response;
}

const gradeQuestions = async () => {
	let questions = document.querySelectorAll(`.question-wrapper`);
	let score = 0;
	const response = await axios.get('/questions');
	const questionsBank = response.data;

	for (let i = 1; i < questions.length; i++) {
		let questionFromBank = questionsBank[i - 1];

		let answersQuery = questions[i].querySelectorAll('.answer');
		for (let j = 0; j < answersQuery.length; j++) {
			let answerText = answersQuery[j].querySelector('.answer-desc');
			let answerRadio = answersQuery[j].querySelector('.answer-radio');
			answerText.classList.remove('wrong');
			answerText.classList.remove('correct');
			if (questionFromBank.answers[j].is_correct && answerRadio.checked) {
				score++;
			}
			if (answerRadio.checked) {
				answerText.classList.add('wrong');
			}
			if (questionFromBank.answers[j].is_correct) {
				answerText.classList.add('correct');
			}
		}
	}

	// -1 to account for template question ;-)
	displayScore(score, questions.length - 1);
};

const displayScore = (achieved, maximum) => {
	let scoreDiv = document.getElementById('score');
	scoreDiv.innerHTML = `You got ${achieved} out of ${maximum}`;
};

updateQuestions();