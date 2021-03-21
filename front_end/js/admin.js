const putQuestion = async (question) => {
	let response =  await axios.put('/questions', question);
	return response;
}

const postQuestion = async (question) => {
	let response =  await axios.post('/questions', question);
	return response;
}

const getQuestions = async () => {
	const response = axios.get('/questions');
	return response;
}

const addQuestion = async () => {
	const select = document.getElementById('num-answers');
	const numAnswers = parseInt(select.value);
	let question = createEmptyQuestion(numAnswers);
	await postQuestion(question);
	updateQuestions();
};

const saveQuestion = (questionId) => {
	console.log(`saving question ${questionId}`);
	let question = document.getElementById(`question${questionId}`);
	let answers  = question.querySelectorAll(`.answer`);

	let questionText = question.querySelector('.question-text');
	let questiontoSave = {text: questionText.value, id: questionId, answers: []};

	for (let i = 0; i < answers.length; i++) {
		let answerText = answers[i].querySelector('.answer-desc');
		let answerRadio = answers[i].querySelector('.answer-radio');
		let a = {question_id: questionId, text: answerText.value, is_correct: answerRadio.checked };
		questiontoSave.answers.push(a);
	}

	putQuestion(questiontoSave);
};

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

		let questionIdField = document.querySelector(`#${uniqueId} .question-id`);
		questionIdField.value = questionData.id;

		let answersWrapper = document.querySelector(`#${uniqueId}`);
		for (answerIndex in questionData.answers) {
			let answerData = questionData.answers[answerIndex];

			let answerText = document.createElement("input");
			answerText.classList.add("answer-desc");
			answerText.type = "text";
			answerText.value = answerData.text;

			let answerRadio = document.createElement("input");
			answerRadio.classList.add("answer-radio");
			answerRadio.type = "radio";
			answerRadio.name = uniqueId + "-answer-text";
			answerRadio.checked = answerData.is_correct != 0;

			let answerDiv = document.createElement("div");
			answerDiv.classList.add("answer");
			answerDiv.appendChild(answerRadio);
			answerDiv.appendChild(answerText);

			answersWrapper.appendChild(answerDiv);
		}

		let saveButton = document.createElement("button");
		saveButton.innerHTML = "Save";
		saveButton.classList.add("btn-save");
		saveButton.setAttribute('onclick', `saveQuestion(${questionId})`);
		answersWrapper.appendChild(saveButton);

		answersWrapper.appendChild(document.createElement('hr'));
	}
};

updateQuestions();
