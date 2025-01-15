// script.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            const groups = data.groups;
            const form = document.getElementById('questionnaire');
            
            const labels = {
                Forces: ["Pas du tout", "Un peu", "Assez", "Beaucoup", "Extrêmement"]
            };

            function updateLabel(value, id) {
                document.getElementById(id + 'Value').textContent = labels.Forces[value - 1];
            }

            groups.forEach(group => {
                const groupLabel = group.label;
                const groupQuestions = group.questions;
                
                const groupHeading = document.createElement('h2');
                groupHeading.textContent = groupLabel;
                form.appendChild(groupHeading);
                
                groupQuestions.forEach(question => {
                    const id = question.id;
                    const type = question.type;
                    let text = question.text;
                    const description = question.description;
                    
                    const label = document.createElement('label');
                    label.setAttribute('for', id);
                    label.textContent = text;
                    form.appendChild(label);

                    const desc = document.createElement('p');
                    desc.innerHTML = description; // Use innerHTML to render <br> tags
                    desc.classList.add('description');
                    form.appendChild(desc);

                    if (type === 'number') {
                        const container = document.createElement('div');
                        container.className = 'slider-container answer';

                        const input = document.createElement('input');
                        input.setAttribute('type', 'range');
                        input.setAttribute('id', id);
                        input.setAttribute('name', id);
                        input.setAttribute('min', '1');
                        input.setAttribute('max', '5');
                        input.setAttribute('value', '3'); // Set default value to 3 (Neutral)
                        input.oninput = function() {
                            updateLabel(this.value, id);
                        };

                        const span = document.createElement('span');
                        span.className = 'slider-value';
                        span.id = id + 'Value';
                        span.textContent = labels.Forces[2]; // Default to "Assez"

                        container.appendChild(input);
                        container.appendChild(span);
                        form.appendChild(container);
                    }
                    
                    if (type === 'text') {
                        const textarea = document.createElement('textarea');
                        textarea.setAttribute('id', id);
                        textarea.setAttribute('name', id);
                        textarea.required = true;
                        form.appendChild(textarea);
                    }
                });
            });
            
            const button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.textContent = 'Submit';
            button.onclick = generateSummary;
            form.appendChild(button);
        });
});

function generateSummary() {
    const questions = Array.from(document.querySelectorAll('input[type="number"]'));
    let Forcesspirituelles = '';
    let pdfText = [];
    
    // Collect question data
    const questionData = questions.map(question => {
        const value = parseInt(question.value);
        const id = question.id;
        const label = document.querySelector(`label[for="${id}"]`).textContent;
        
        return { id, label: label, value };
    });
    
    // Sort questions by value in descending order and get the top 5
    const topQuestions = questionData.sort((a, b) => b.value - a.value).slice(0, 5);
    
    // Generate summary text
    topQuestions.forEach(question => {
        Forcesspirituelles += `<li>${question.label} ${question.value}</li>`;
        pdfText.push(`${question.label} ${question.value}`);
    });
    
    document.getElementById('Forcesspirituelles').innerHTML = '<ul>' + Forcesspirituelles + '</ul>';
    document.getElementById('summary').style.display = 'block';
    document.getElementById('questionnaire').style.display = 'none';
    

}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

const sliders = [
    { id: 'Extraverti', label: 'Extraverti' },
    { id: 'Routinier', label: 'Routinier' },
    { id: 'Réservé', label: 'Réservé' },
    { id: 'Coopératif', label: 'Coopératif' }
];

const labels = {
    Extraverti: ["TRÈS Extraverti","Extraverti", "Peu", "Intoverti","TRÈS Intoverti"],
    Routinier: ["TRÈS Routinier","Routinier", "Peu", "Varié","TRÈS Varié"],
    Réservé: ["TRÈS Réservé","Réservé", "Peu", "Expressif","TRÈS Expressif"],
    Coopératif: ["TRÈS Coopératif","Coopératif", "Peu", "Compétitif","TRÈS Compétitif"],
    Forces:["Pas du tout","Un peu","Assez","Beaucoup","Extrêmement"]
};

function createSlider(slider) {
    const container = document.createElement('div');
    container.className = 'slider-container answer';

    const input = document.createElement('input');
    input.type = 'range';
    input.id = slider.id;
    input.name = slider.id;
    input.min = '1';
    input.max = '5';
    input.value = '2';
    input.oninput = function() {
        updateLabel(this.value, slider.id);
    };

    const span = document.createElement('span');
    span.className = 'slider-value';
    span.id = slider.id + 'Value';
    span.textContent = slider.label;

    container.appendChild(input);
    container.appendChild(span);

    return container;
}

function updateLabel(value, sliderType) {
    document.getElementById(sliderType + 'Value').textContent = labels[sliderType][value - 1];
}

const form = document.getElementById('perception');
sliders.forEach(slider => {
    form.appendChild(createSlider(slider));
});