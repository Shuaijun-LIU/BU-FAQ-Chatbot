document.addEventListener('DOMContentLoaded', () => {
    const questionsTableBody = document.querySelector('tbody');
    const addFaqButton = document.querySelector('.add-faq-btn');
    const addFaqWindow = document.getElementById('add-faq-window');
    const confirmAddFaqButton = document.getElementById('confirm-add-faq');
    const cancelAddFaqButton = document.getElementById('cancel-add-faq');
    const addFaqSuccessMessage = document.getElementById('add-faq-success');
    const newFaqQuestionInput = document.getElementById('new-faq-question');
    const newFaqAnswerInput = document.getElementById('new-faq-answer');
    const newFaqModuleInput = document.getElementById('new-faq-module');
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button:nth-child(2)');
    const downloadButton = document.querySelector('.search-container button:nth-child(3)');
    const backButton = document.createElement('button');
    let questionsData = [];

    backButton.textContent = 'Back';
    backButton.classList.add('back-btn');
    backButton.style.display = 'none';
    document.querySelector('.search-container').appendChild(backButton);

    // Fetch and display questions and answers
    async function loadFAQs() {
        try {
            const response = await fetch('/questions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const questions = await response.json();
            questionsData = questions; // Store questions data for search functionality

            questionsTableBody.innerHTML = ''; // Clear existing rows

            questions.forEach((item, index) => {
                const categoryClass = item.module.toLowerCase().replace(/\s+/g, '_');
                const categoryRow = document.querySelector(`.category[data-category="${categoryClass}"]`);
                if (!categoryRow) {
                    const newCategoryRow = createCategoryRow(item.module);
                    questionsTableBody.appendChild(newCategoryRow);
                }

                const questionRow = createQuestionRow(item, index);
                questionsTableBody.appendChild(questionRow);
            });

            addCategoryClickListeners();
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please try again later.');
        }
    }

    function createCategoryRow(category) {
        const categoryClass = category.toLowerCase().replace(/\s+/g, '_');
        const row = document.createElement('tr');
        row.classList.add('category');
        row.setAttribute('data-category', categoryClass);
        row.innerHTML = `
            <td>${category}</td>
            <td></td>
            <td></td>
        `;
        return row;
    }

    function createQuestionRow(item, index) {
        const categoryClass = item.module.toLowerCase().replace(/\s+/g, '_');
        const row = document.createElement('tr');
        row.classList.add(categoryClass);
        row.innerHTML = `
            <td>${item.question}</td>
            <td class="answer-cell">${item.answer}</td>
            <td>
                <button class="edit-btn" data-index="${index}">edit</button>
                <button class="delete-btn" data-index="${index}">delete</button>
            </td>
        `;
        return row;
    }

    function addCategoryClickListeners() {
        const categoryRows = document.querySelectorAll('.category');
        categoryRows.forEach(row => {
            row.addEventListener('click', () => {
                const category = row.getAttribute('data-category');
                const relatedRows = document.querySelectorAll(`.${category}`);
                relatedRows.forEach(relatedRow => {
                    relatedRow.classList.toggle('hidden');
                });
                row.classList.toggle('expanded');
            });
        });
    }

    // Show Add FAQ Window
    addFaqButton.addEventListener('click', () => {
        addFaqWindow.style.display = 'block';
    });

    // Hide Add FAQ Window
    cancelAddFaqButton.addEventListener('click', () => {
        addFaqWindow.style.display = 'none';
        clearAddFaqForm();
    });

    // Add new FAQ
    confirmAddFaqButton.addEventListener('click', async () => {
        const newQuestion = newFaqQuestionInput.value.trim();
        const newAnswer = newFaqAnswerInput.value.trim();
        const newModule = newFaqModuleInput.value.trim();

        if (newQuestion && newAnswer && newModule) {
            const newFAQ = { question: newQuestion, answer: newAnswer, module: newModule };
            try {
                const response = await fetch('/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newFAQ)
                });

                if (response.ok) {
                    loadFAQs();
                    addFaqSuccessMessage.classList.remove('hidden');
                    setTimeout(() => {
                        addFaqSuccessMessage.classList.add('hidden');
                        addFaqWindow.style.display = 'none';
                        clearAddFaqForm();
                    }, 2000);
                } else {
                    throw new Error('Failed to save the new FAQ');
                }
            } catch (error) {
                console.error('Error saving new FAQ:', error);
                alert('Failed to save the new FAQ. Please try again later.');
            }
        } else {
            alert('All fields are required to add a new FAQ.');
        }
    });

    // Edit FAQ
    questionsTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const index = event.target.dataset.index;
            const questionRow = event.target.closest('tr');
            const questionCell = questionRow.querySelector('td:nth-child(1)');
            const answerCell = questionRow.querySelector('td:nth-child(2)');

            // Show full answer
            answerCell.style.whiteSpace = 'normal';
            answerCell.style.overflow = 'visible';
            answerCell.style.textOverflow = 'clip';

            // Replace the edit button with a save button
            event.target.textContent = 'save';
            event.target.classList.remove('edit-btn');
            event.target.classList.add('save-btn');

            // Make the question and answer cells editable
            questionCell.contentEditable = 'true';
            answerCell.contentEditable = 'true';
        } else if (event.target.classList.contains('save-btn')) {
            const index = event.target.dataset.index;
            const questionRow = event.target.closest('tr');
            const questionCell = questionRow.querySelector('td:nth-child(1)');
            const answerCell = questionRow.querySelector('td:nth-child(2)');

            const updatedFAQ = {
                question: questionCell.textContent.trim(),
                answer: answerCell.textContent.trim(),
                module: questionsData[index].module
            };

            try {
                const response = await fetch(`/questions/${index}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedFAQ)
                });

                if (response.ok) {
                    loadFAQs();
                } else {
                    throw new Error('Failed to update the FAQ');
                }
            } catch (error) {
                console.error('Error updating FAQ:', error);
                alert('Failed to update the FAQ. Please try again later.');
            }
        }
    });

    // Delete FAQ
    questionsTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const index = event.target.dataset.index;
            const confirmed = confirm('Are you sure you want to delete this FAQ?');

            if (confirmed) {
                try {
                    const response = await fetch(`/questions/${index}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        loadFAQs();
                    } else {
                        throw new Error('Failed to delete the FAQ');
                    }
                } catch (error) {
                    console.error('Error deleting FAQ:', error);
                    alert('Failed to delete the FAQ. Please try again later.');
                }
            }
        }
    });

    // Search FAQ
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            loadFAQs();
            return;
        }

        const filteredQuestions = questionsData.filter(item =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query) ||
            item.module.toLowerCase().includes(query)
        );

        questionsTableBody.innerHTML = ''; // Clear existing rows

        if (filteredQuestions.length > 0) {
            filteredQuestions.forEach((item, index) => {
                console.log('Appending row:', item);
                const questionRow = createQuestionRow(item, index);
                questionsTableBody.appendChild(questionRow);
            });
        } else {
            questionsTableBody.innerHTML = '<tr><td colspan="3">No results found</td></tr>';
        }

        backButton.style.display = 'block';
    });

    // Back to original FAQ list
    backButton.addEventListener('click', () => {
        loadFAQs();
        backButton.style.display = 'none';
    });

    // Download JSON
    downloadButton.addEventListener('click', () => {
        window.location.href = '/questions/download';
    });

    // Utility function to clear Add FAQ form
    function clearAddFaqForm() {
        newFaqQuestionInput.value = '';
        newFaqAnswerInput.value = '';
        newFaqModuleInput.value = '';
    }

    // Load FAQs on page load
    loadFAQs();
});