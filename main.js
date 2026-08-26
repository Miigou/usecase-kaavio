const registerButton = document.querySelector('#registerButton');
const loginButton = document.querySelector('#loginButton');
const registerSection = document.querySelector('#registerSection');
const loginSection = document.querySelector('#loginSection');
const closeRegisterButton = document.querySelector('#closeRegisterButton');
const closeLoginButton = document.querySelector('#closeLoginButton');
const registerSubmitButton = document.querySelector('#registerSubmitButton');
const loginSubmitButton = document.querySelector('#loginSubmitButton');
const authControls = document.querySelector('#authControls');
const userControls = document.querySelector('#userControls');
const currentUser = document.querySelector('#currentUser');
const logoutButton = document.querySelector('#logoutButton');
const adminSection = document.querySelector('#adminSection');
const togglePollFormButton = document.querySelector('#togglePollFormButton');
const pollForm = document.querySelector('#pollForm');
const optionInputs = document.querySelector('#optionInputs');
const addOptionButton = document.querySelector('#addOptionButton');
const pollList = document.querySelector('#pollList');
const statusMessage = document.querySelector('#statusMessage');

const users = JSON.parse(localStorage.getItem('aanestys-users') || '[]');
const polls = JSON.parse(localStorage.getItem('aanestys-polls') || '[]');
let loggedInUser = JSON.parse(sessionStorage.getItem('aanestys-user') || 'null');

function savePolls() {
	localStorage.setItem('aanestys-polls', JSON.stringify(polls));
}

function showStatus(message) {
	statusMessage.textContent = message;
}

function updateAuthView() {
	const isLoggedIn = Boolean(loggedInUser);
	authControls.hidden = isLoggedIn;
	userControls.hidden = !isLoggedIn;
	adminSection.hidden = !isLoggedIn || loggedInUser.role !== 'admin';
	if (!isLoggedIn || loggedInUser.role !== 'admin') {
		pollForm.hidden = true;
		togglePollFormButton.textContent = 'Luo uusi äänestys';
	}
	currentUser.textContent = isLoggedIn ? `${loggedInUser.name} (${loggedInUser.role})` : '';
}

function createPollOption(poll, option, canVote, hasVoted, voteValues) {
	const label = document.createElement('label');
	const input = document.createElement('input');
	input.type = 'radio';
	input.name = `poll-${poll.id}`;
	input.value = option;
	input.disabled = !canVote;

	if (!hasVoted) {
		label.className = 'poll-option';
		label.append(input, ` ${option}`);
		return label;
	}

	const optionVotes = voteValues.filter((vote) => vote === option).length;
	const percentage = voteValues.length === 0 ? 0 : Math.round((optionVotes / voteValues.length) * 100);
	const bar = document.createElement('span');
	bar.className = 'poll-option__bar';
	bar.style.width = `${percentage}%`;
	const text = document.createElement('span');
	text.className = 'poll-option__text';
	text.textContent = `${option} - ${optionVotes} ääntä (${percentage} %)`;
	label.className = 'poll-option poll-option--result';
	label.append(input, bar, text);
	return label;
}

function handleVote(event, form, poll, canVote) {
	event.preventDefault();
	if (!canVote || poll.votes?.[loggedInUser.name]) {
		showStatus('Olet jo äänestänyt tässä äänestyksessä.');
		return;
	}
	const selectedOption = form.querySelector('input:checked')?.value;
	if (!selectedOption) {
		showStatus('Valitse yksi vaihtoehto ennen äänestämistä.');
		return;
	}
	poll.votes ??= {};
	poll.votes[loggedInUser.name] = selectedOption;
	savePolls();
	renderPolls();
	showStatus('Äänesi tallennettiin.');
}

function createDeleteButton(poll) {
	const deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.textContent = 'Poista äänestys';
	deleteButton.addEventListener('click', () => {
		const pollIndex = polls.findIndex((item) => item.id === poll.id);
		polls.splice(pollIndex, 1);
		savePolls();
		renderPolls();
		showStatus('Äänestys poistettiin.');
	});
	return deleteButton;
}

function renderPoll(poll) {
	const article = document.createElement('article');
	const heading = document.createElement('h3');
	heading.textContent = poll.question;
	article.append(heading);

	const hasVoted = loggedInUser && poll.votes?.[loggedInUser.name];
	const canVote = loggedInUser?.role === 'user' && !hasVoted;
	const voteValues = Object.values(poll.votes || {});
	const form = document.createElement('form');
	form.addEventListener('submit', (event) => handleVote(event, form, poll, canVote));
	poll.options.forEach((option) => form.append(createPollOption(poll, option, canVote, hasVoted, voteValues)));

	if (canVote) {
		const voteButton = document.createElement('button');
		voteButton.type = 'submit';
		voteButton.textContent = 'Äänestä';
		form.append(voteButton);
	} else if (hasVoted) {
		const voteStatus = document.createElement('p');
		voteStatus.textContent = `Olet äänestänyt: ${hasVoted}`;
		form.append(voteStatus);
	}
	article.append(form);

	if (hasVoted) {
		const results = document.createElement('section');
		const resultsHeading = document.createElement('h4');
		resultsHeading.textContent = 'Tulokset';
		results.append(resultsHeading);
		article.append(results);
	}
	if (loggedInUser?.role === 'admin') article.append(createDeleteButton(poll));
	return article;
}

function renderPolls() {
	pollList.replaceChildren();
	if (polls.length === 0) {
		pollList.textContent = 'Äänestyksiä ei ole vielä luotu.';
		return;
	}
	polls.forEach((poll) => pollList.append(renderPoll(poll)));
}

function renderOptionInputs() {
	const optionValues = [...optionInputs.querySelectorAll('input[name="pollOption"]')]
		.map((input) => input.value);
	optionInputs.replaceChildren();
	for (let index = 0; index < optionInputs.dataset.count; index += 1) {
		const input = document.createElement('input');
		input.type = 'text';
		input.name = 'pollOption';
		input.placeholder = `Vaihtoehto ${index + 1}`;
		input.required = true;
		input.maxLength = 100;
		input.value = optionValues[index] || '';
		optionInputs.append(input);
	}
	addOptionButton.disabled = optionInputs.dataset.count >= 5;
}

optionInputs.dataset.count = 2;
renderOptionInputs();

registerButton.addEventListener('click', () => registerSection.showModal());
loginButton.addEventListener('click', () => loginSection.showModal());
closeRegisterButton.addEventListener('click', () => registerSection.close());
closeLoginButton.addEventListener('click', () => loginSection.close());

togglePollFormButton.addEventListener('click', () => {
	pollForm.hidden = !pollForm.hidden;
	togglePollFormButton.textContent = pollForm.hidden ? 'Luo uusi äänestys' : 'Sulje lomake';
});

registerSubmitButton.addEventListener('click', (event) => {
	event.preventDefault();
	const name = document.querySelector('#register-name').value.trim();
	const password = document.querySelector('#register-password').value;
	const role = document.querySelector('input[name="register-role"]:checked').value;
	if (!name || !password || users.some((user) => user.name === name)) {
		showStatus('Anna nimi ja salasana. Nimen pitää olla uusi.');
		return;
	}
	users.push({ name, password, role });
	localStorage.setItem('aanestys-users', JSON.stringify(users));
	registerSection.close();
	showStatus('Rekisteröityminen onnistui. Voit nyt kirjautua sisään.');
});

loginSubmitButton.addEventListener('click', (event) => {
	event.preventDefault();
	const name = document.querySelector('#login-name').value.trim();
	const password = document.querySelector('#login-password').value;
	const role = document.querySelector('input[name="login-role"]:checked').value;
	const user = users.find((item) => item.name === name && item.password === password && item.role === role);
	if (!user) {
		showStatus('Kirjautuminen epäonnistui. Tarkista tiedot.');
		return;
	}
	loggedInUser = { name: user.name, role: user.role };
	sessionStorage.setItem('aanestys-user', JSON.stringify(loggedInUser));
	loginSection.close();
	updateAuthView();
	renderPolls();
	showStatus(`Tervetuloa, ${user.name}!`);
});

logoutButton.addEventListener('click', () => {
	loggedInUser = null;
	sessionStorage.removeItem('aanestys-user');
	updateAuthView();
	renderPolls();
	showStatus('Kirjauduit ulos.');
});

addOptionButton.addEventListener('click', () => {
	if (optionInputs.dataset.count < 5) {
		optionInputs.dataset.count = Number(optionInputs.dataset.count) + 1;
		renderOptionInputs();
	}
});

pollForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (loggedInUser?.role !== 'admin') return;
	const question = document.querySelector('#pollQuestion').value.trim();
	const options = [...document.querySelectorAll('input[name="pollOption"]')]
		.map((input) => input.value.trim())
		.filter(Boolean);
	if (!question || options.length < 2 || options.length > 5 || new Set(options).size !== options.length) {
		showStatus('Kysymys vaatii 2–5 yksilöllistä vaihtoehtoa.');
		return;
	}
	polls.push({ id: crypto.randomUUID(), question, options, votes: {} });
	savePolls();
	pollForm.reset();
	optionInputs.dataset.count = 2;
	renderOptionInputs();
	pollForm.hidden = true;
	togglePollFormButton.textContent = 'Luo uusi äänestys';
	renderPolls();
	showStatus('Äänestys luotiin.');
});

updateAuthView();
renderPolls();
