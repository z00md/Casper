/*  Author: z00md
    Copyright: https://cybercafe.dev
    License: MIT License
    Script to run a browser based simple click game with responsive style using highcharts
    to draw the field.
    Full code is availabe and can be used for demo and learning. 
    I have not used any module system to manage the scripts. Instead have put in 
    all the code in one script.
    Since this is just for learning purpose, there is no such design pattern too. 
    But in real world you might consider using a framework for DOM management.
*/

// Do everything only when the DOM is loaded
$(document).ready(function () {
    // Convert data to suitable format
    var mapPositions = (position) => [String(position.id), position.value];
    var game_data = null;

    // Create data
    var data = {
        short: position_data
            .filter((item) => item.type == "short")
            .map(mapPositions),
        mid: position_data
            .filter((item) => item.type == "mid")
            .map(mapPositions),
        long: position_data
            .filter((item) => item.type == "long")
            .map(mapPositions),
    };

    // Number of questions for every game
    var QUESTIONS_COUNT = 5;

    // Using highcharts to draw the field
    // Refer https://www.highcharts.com/ for more info
    Highcharts.chart("chart-container", {
        credits: {
            enabled: false,
        },
        chart: {
            height: "100%",
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: '<div class="pitch"><div>',
            useHTML: true,
            align: "center",
            verticalAlign: "middle",
        },
        tooltip: {
            enabled: false,
            pointFormat: "<b>?</b>",
        },
        accessibility: {
            point: {
                valueSuffix: "%",
            },
        },
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
            },
            pie: {
                cursor: "pointer",
                events: {
                    click: (e) => {
                        onChartClick(e);
                    },
                },
                dataLabels: {
                    enabled: false,
                    distance: -50,
                    style: {
                        fontWeight: "bold",
                        color: "white",
                    },
                },
                states: {
                    hover: {
                        halo: null,
                    },
                },
                startAngle: 0,
                endAngle: 360,
                size: "100%",
            },
        },
        series: [
            {
                type: "pie",
                colors: ["#6cb269"],
                size: "100%",
                center: ["50%", "50%"],
                name: "Long",
                innerSize: "62%",
                data: data.long,
            },
            {
                type: "pie",
                colors: ["#4b8548"],
                size: "60%",
                center: ["50%", "50%"],
                name: "Mid",
                innerSize: "60%",
                data: data.mid,
            },
            {
                type: "pie",
                colors: ["#386440"],
                size: "25%",
                center: ["50%", "45%"],
                name: "Short",
                innerSize: "30%",
                data: data.short,
            },
        ],
    });

    setupGame();

    // Initally setup game parameters
    function setupGame() {
        var container = document.getElementById("score-container");
        container.innerHTML = "";
        setupGameData();
        renderStartScreen(container);
    }

    // Initialize game data with default values
    function setupGameData() {
        game_data = {
            started: false,
            questions: setupQuestions(QUESTIONS_COUNT),
            incorrect_questions: [],
            current_question: null,
            score: 0,
        };
    }

    // Pick random questions from the available set
    function setupQuestions(num) {
        var all_positions = position_data.map((i) => ({
            id: i.id,
            name: i.name,
        }));
        var randomNumber;
        var questions = [];
        var ques;
        for (var i = 0; i < num; i++) {
            randomNumber = Math.floor(Math.random() * all_positions.length);
            ques = all_positions.splice(randomNumber, 1);
            questions.push(ques[0]);
        }
        return questions;
    }

    // Calculate score when user clicks on the chart
    function onChartClick(e) {
        if (game_data.started) {
            if (
                e.point.name ==
                game_data.questions[game_data.current_question].id
            ) {
                game_data.score = game_data.score + 1;
            } else {
                game_data.incorrect_questions.push(
                    game_data.questions[game_data.current_question]
                );
            }

            if (game_data.current_question < game_data.questions.length - 1) {
                nextQuestion();
            } else {
                endQuiz();
            }
        }
    }

    // Show start screen
    function renderStartScreen(container) {
        var startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.innerText = "Start";
        startButton.addEventListener("click", onStartClick);
        container.appendChild(startButton);
    }

    // Reset data on clicking start
    function startQuiz() {
        game_data.current_question = 0;
        game_data.started = true;
        game_data.score = 0;
        game_data.questions = setupQuestions(QUESTIONS_COUNT);
        game_data.incorrect_questions = [];
        renderQuestion();
    }

    // Goto next question
    function nextQuestion() {
        game_data.current_question = game_data.current_question + 1;
        renderQuestion();
    }

    // Show question
    function renderQuestion() {
        var container = document.getElementById("score-container");
        container.innerHTML = "";
        var title = document.createElement("div");
        var subTitle = document.createElement("div");
        var wrapper = document.createElement("div");
        wrapper.classList.add("question-wrapper");
        title.classList.add("question-title");
        subTitle.classList.add("question-subtitle");
        title.innerHTML = "Select area for a right handed batsman";
        subTitle.innerHTML =
            game_data.questions[game_data.current_question].name;
        wrapper.appendChild(title);
        wrapper.appendChild(subTitle);
        container.appendChild(wrapper);
    }

    // Start game on user input
    function onStartClick() {
        startQuiz();
    }

    // Show result with score
    function endQuiz() {
        var container = document.getElementById("score-container");
        container.innerHTML = "";
        var title = document.createElement("div");
        var subTitle = document.createElement("div");
        var wrapper = document.createElement("div");
        wrapper.classList.add("question-wrapper");
        title.classList.add("question-title");
        subTitle.classList.add("question-subtitle");
        title.innerHTML = "Your scored";
        subTitle.innerHTML = game_data.score + "/" + QUESTIONS_COUNT;
        wrapper.appendChild(title);
        wrapper.appendChild(subTitle);
        container.appendChild(wrapper);

        var startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.innerText = "Restart";
        startButton.addEventListener("click", onStartClick);
        container.appendChild(startButton);

        var resultsText = document.createElement("div");
        resultsText.classList.add("results-text");
        resultsText.innerHTML = getResultsText();
        container.appendChild(resultsText);

        var results = document.createElement("ul");
        results.classList.add("results");
        for (var i = 0; i < game_data.incorrect_questions.length; i++) {
            var el = document.createElement("li");
            el.innerHTML = game_data.incorrect_questions[i].name;
            results.appendChild(el);
        }

        game_data.started = false;
        container.appendChild(results);
    }

    // Evaluate message as per the score
    function getResultsText() {
        if (game_data.incorrect_questions.length == 0) {
            return "Well done. You know everything!";
        } else if (
            game_data.incorrect_questions.length == game_data.questions.length
        ) {
            return "You can play only ludo, all were wrong.";
        } else if (game_data.incorrect_questions.length == 1) {
            return "Just missed one!";
        } else if (
            game_data.incorrect_questions.length > 1 &&
            game_data.incorrect_questions.length <
                game_data.questions.length / 2
        ) {
            return "You got a few wrong!";
        } else if (
            game_data.incorrect_questions.length >
            game_data.questions.length / 2
        ) {
            return "You need training for";
        }
    }
});
