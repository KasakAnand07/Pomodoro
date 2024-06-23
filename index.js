document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.querySelector("#startbtn");
    const pauseBtn = document.querySelector("#pausebtn");
    const resetBtn = document.querySelector("#resetbtn");
    const progressbar = document.querySelector(".progressbar");
    const progressbarNumber = document.querySelector(".progressbar .progressbar-number");
    const pomodoroBtn = document.getElementById("pomodorobtn");
    const shortbrkBtn = document.getElementById("shortbrkbtn");
    const longbrkBtn = document.getElementById("longbrkbtn");
    const pomCount = document.querySelector(".pomodoro-count");
    const addTodoBtn = document.getElementById("add-todo");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const notesTextarea = document.getElementById("notes");
    const addNoteBtn = document.getElementById("add-note-btn");
    const notesList = document.getElementById("notes-list");

    let timerValue = 1500; // default to 25 minutes
    let pomodoroType = "POMODORO";
    let pomodoroCount = 0;
    let progressInterval;
    const pomodorotimer = 1500; // 25 minutes
    const shortbreaktimer = 300; // 5 minutes
    const longbreaktimer = 900; // 15 minutes
    const pomodorountilLongbrk = 4;
    let multipliervalue = 360 / timerValue;
    let isPomodoroSession = false; // Flag to track if current session is a pomodoro session

    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
    pomodoroBtn.addEventListener("click", () => setTimeType("POMODORO"));
    shortbrkBtn.addEventListener("click", () => setTimeType("SHORTBREAK"));
    longbrkBtn.addEventListener("click", () => setTimeType("LONGBREAK"));
    addTodoBtn.addEventListener("click", addTodo);
    addNoteBtn.addEventListener("click", addNote);

    function startTimer() {
        playBeepSound(); // play beep sound when starting

        // Check if it's a pomodoro session and update count accordingly
        if (pomodoroType === "POMODORO" && !isPomodoroSession) {
            isPomodoroSession = true;
            pomodoroCount++;
            pomCount.textContent = `Pomodoro Count: ${pomodoroCount}`;
        }

        progressInterval = setInterval(() => {
            timerValue--;
            setProgressInfo();
            if (timerValue === 0) {
                clearInterval(progressInterval);
                playBeepSound(); // play beep sound when pomodoro session ends
                if (pomodoroType === "POMODORO") {
                    isPomodoroSession = false; // Reset flag after pomodoro session ends
                }
                if (pomodoroCount % pomodorountilLongbrk === 0) {
                    longbrkBtn.style.display = "flex";
                }
                setTimeType(pomodoroType);
            }
        }, 1000);
    }

    function setProgressInfo() {
        progressbarNumber.textContent = `${NumbertoString(timerValue)}`;
        progressbar.style.background = `conic-gradient(rgb(243, 72, 109) ${timerValue * multipliervalue}deg, crimson 0deg)`;
    }

    function NumbertoString(number) {
        const minutes = Math.trunc(number / 60).toString().padStart(2, "0");
        const seconds = Math.trunc(number % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    function pauseTimer() {
        clearInterval(progressInterval);
    }

    function setTimeType(type) {
        pomodoroType = type;
        if (type === "POMODORO") {
            pomodoroBtn.classList.add("active");
            shortbrkBtn.classList.remove("active");
            longbrkBtn.classList.remove("active");
        } else if (type === "SHORTBREAK") {
            pomodoroBtn.classList.remove("active");
            shortbrkBtn.classList.add("active");
            longbrkBtn.classList.remove("active");
        } else {
            pomodoroBtn.classList.remove("active");
            shortbrkBtn.classList.remove("active");
            longbrkBtn.classList.add("active");
        }
        resetTimer();
    }

    function resetTimer() {
        clearInterval(progressInterval);
        timerValue = pomodoroType === "POMODORO" ? pomodorotimer :
            pomodoroType === "SHORTBREAK" ? shortbreaktimer : longbreaktimer;
        multipliervalue = 360 / timerValue;
        setProgressInfo();
        if (pomodoroType === "POMODORO") {
            isPomodoroSession = false; // Reset flag when timer is reset
        }
    }

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === "") return;

        const li = document.createElement("li");
        li.textContent = todoText;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-todo-btn"); // Add class for styling

        removeBtn.addEventListener("click", () => {
            li.remove();
        });

        li.appendChild(removeBtn);
        todoList.appendChild(li);
        todoInput.value = "";
    }

    function addNote() {
        const noteText = notesTextarea.value.trim();
        if (noteText === "") return;

        const note = document.createElement("div");
        note.textContent = noteText;
        note.classList.add("sticky-note");
        note.style.backgroundColor = getRandomColor();

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "";
        removeBtn.classList.add("remove-btn"); // Ensure correct class name

        removeBtn.addEventListener("click", () => {
            notesList.removeChild(note);
            saveNotes();
        });

        note.appendChild(removeBtn);
        notesList.appendChild(note);
        notesTextarea.value = "";
        saveNotes();
    }


    function getRandomColor() {
        const colors = ["#f4f4a1", "#f4b3a1", "#a1f4e5", "#f4a1e0", "#a1a9f4", "#a1f4a1"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function saveNotes() {
        const notes = [];
        notesList.querySelectorAll(".sticky-note").forEach(note => {
            notes.push(note.textContent.replace("Remove", "").trim());
        });
        localStorage.setItem("pomodoro-notes", JSON.stringify(notes));
    }

    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem("pomodoro-notes"));
        if (savedNotes) {
            savedNotes.forEach(noteText => {
                const note = document.createElement("div");
                note.textContent = noteText;
                note.classList.add("sticky-note");
                note.style.backgroundColor = getRandomColor();

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.classList.add("remove-note-btn"); // Add class for styling

                removeBtn.addEventListener("click", () => {
                    notesList.removeChild(note);
                    saveNotes();
                });

                note.appendChild(removeBtn);
                notesList.appendChild(note);
            });
        }
    }

    function playBeepSound() {
        const beep = new Audio('beep.mp3'); // replace 'path_to_beep_sound.mp3' with actual path
        beep.play();
    }

    loadNotes();
});
