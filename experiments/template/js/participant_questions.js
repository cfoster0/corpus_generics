var questions = [    
    {question: "Do you agree with the underlined statement?", dependent_measure: "binary"},
    {question: "What percent of [plural noun] would you say [verb phrase]?", dependent_measure: "slider"},
]

var extra_questions = [
    {question: "Are [plural noun] inanimate?", dependent_measure: "binary"},
    {question: "How many [plural noun] would you say [verb phrase]?", dependent_measure: "slider"},
    {question: "Can you empirically prove the underlined statement?", dependent_measure: "binary"},
    {question: "Is the underlined statement observable?", dependent_measure: "binary"},
    {question: "Are [plural noun] animals?", dependent_measure: "binary"},
    {question: "Around how many [plural noun] would you say there are?", dependent_measure: "textbox"},
    {question: "How many [plural noun] would you say [verb phrase]", dependent_measure: "slider"},
    {question: "Does [plural noun] pertain to a specific group of people? (lawyers, teachers, etc.)", dependent_measure: "binary"},
    {question: "Is the underlined statement debatable?", dependent_measure: "binary"},
]

var random_questions = [];
function  generate_random_questions(n) {
    var i = 0;
    while (i < n) {
	var rand = questions[Math.floor(Math.random() * questions.length)];
	random_questions.push(rand);
	i++
    }
}

