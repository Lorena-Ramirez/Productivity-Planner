$(document).ready(() => {
  // Getting a reference to the input field where user adds a new todo
  const newNoteInput = $("#new-note");
  // Added reference to the input where a new schedule item is entered
  const newScheduleInput = $(".new-schedule-item");

  //Run function when user clicks to save new note
  $("#note-save-btn").on("click", saveNote);
  //Run function when user clicks to save new schedule item
  $("#save-schedule").on("click", saveSchedule);

  const dateID = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );

  //Run these functions when the planner page loads
  getNote();
  getSchedule();

  // This function grabs notes from the database
  function getNote() {
    $.get("/api/notes", data => {
      note = data;
      if (note.length === 0) {
        console.log("NO DATA SO WE QUIT FUNCTION");
        return;
      }
      renderNotes();
    });
  }

  //upload Notes onto page
  function renderNotes() {
    newNoteInput.empty();
    console.log("RENDER NOTES HAS RUN!");
    for (let i = 0; i < note.length; i++) {
      if (dateID === note[i].date) {
        console.log(note[i]);
        newNoteInput.val(note[i].text);
        console.log(note);
      }
    }
  }

  function saveNote() {
    console.log("CLICKED!");
    //grab notes table
    $.get("/api/notes", data => {
      note = data;
    });
    if (note.length === 0) {
      insertNote();
    } else {
      for (let i = 0; i < note.length; i++) {
        if (dateID === note[i].date) {
          const savedNote = note[i];

          console.log(
            "FOUND A MATCH!!: Date - " +
              savedNote.dateId +
              " Text - " +
              savedNote.Id
          );
          savedNote.text = newNoteInput.val();
          console.log(
            "Updated Note!: Date - " +
              savedNote.dateId +
              " Text - " +
              savedNote.Id
          );
          //runs update note function
          updateNote(savedNote);
        } else {
          console.log("NO matching date so INSERTING NEW NOTE INTO TABLE");
          insertNote();
        }
      }
    }
  }

  function updateNote(note) {
    console.log("UPDATE NOTE HAS RUN");
    //uses put method the take in saved not and runs route using saved note
    $.ajax({
      method: "PUT",
      url: "/api/notes",
      data: note
    }).then(getNote);
  }

  function insertNote() {
    console.log("INSERT NOTE RUN");
    const note = {
      date: dateID,
      text: newNoteInput.val().trim()
    };
    console.log(note);
    $.post("/api/notes", note);
  }

  //Handle the schedule input on the planner page

  // Grab schedule info from the database
  function getSchedule() {
    $.get("/api/schedules", data => {
      schedule = data;
      if (schedule.length === 0) {
        console.log("no saved schedules");
        return;
      }
      renderSchedule();
    });
  }

  //show the schedules on the page
  function renderSchedule() {
    newScheduleInput.empty();
    console.log("rendering the schedule");
    for (let i = 0; i < schedule.length; i++) {
      console.log(schedule);
      if (dateID === schedule[i].date) {
        console.log(schedule[i]);
        $("#schedule-for-" + schedule[i].time).val(schedule[i].text);
        console.log(schedule);
      }
    }
  }

  function saveSchedule() {
    console.log("CLICKED!");
    insertScheduleItem();
    //grab the schedule table
    // $.get("/api/schedules", data => {
    //   schedule = data;
    // });
    // if (schedule.length === 0) {
    //   insertScheduleItem();
    // } else {
    //   for (let i = 0; i < schedule.length; i++) {
    //     if (dateID === schedule[i].date) {
    //       const savedScheduleItem = schedule[i];

    //       console.log(
    //         "FOUND A MATCH!!: Date - " +
    //           savedScheduleItem.dateId +
    //           " Text - " +
    //           savedScheduleItem.Id
    //       );
    //       savedScheduleItem.text = newScheduleInput.val();
    //       console.log(
    //         "Updated Schedule!: Date - " +
    //           savedScheduleItem.dateId +
    //           " Text - " +
    //           savedScheduleItem.Id
    //       );
    //       //runs update schedule function
    //       updateSchedule(savedScheduleItem);
    //     } else {
    //       console.log("NO matching date so inserting schedule item into table");
    //       insertScheduleItem();
    //     }
    //   }
    // }
  }

  // eslint-disable-next-line no-unused-vars
  function updateSchedule(schedule) {
    console.log("updating schedule");
    //uses put method the take in saved schedule and runs route using saved schedule
    $.ajax({
      method: "PUT",
      url: "/api/schedules",
      data: schedule
    }).then(getSchedule);
  }

  function insertScheduleItem() {
    console.log("insert new schedule item");
    const scheduleItems = Array.from(
      document.querySelectorAll(".new-schedule-item")
    );
    const items = scheduleItems.map(item => {
      return {
        date: item.dataset.date,
        time: item.dataset.time,
        text: item.value
      };
    });
    const data = items.filter(item => item.text);
    $.post("/api/schedules/" + data[0].date, { data });
  }

  $("#newGoal").on("submit", function(event) {
    event.preventDefault();
    const newGoalText = {
      text: $("#goalText")
        .val()
        .trim(),
      date: dateID,
      complete: false
    };
    $.post("/api/goal", newGoalText).then(() => location.reload());
  });
  $(".goals-checkboxes").click(function() {
    const goalId = $(this).attr("data-id");
    const newState = $(this).attr("data-completed") === "true" ? false : true;
    $(this).attr("data-completed", newState);
    const goalState = { state: newState };
    console.log(goalId, goalState);
    $.ajax({
      method: "PUT",
      url: "/api/goal/" + goalId,
      data: goalState
    }).then(results => console.log(results));
  });
  const objectives = [
    { className: "checkbox1", checked: null, goal: null },
    { className: "checkbox2", checked: null, goal: null },
    { className: "checkbox3", checked: null, goal: null },
    { className: "checkbox4", checked: null, goal: null }
  ];

  const goals = [
    { className: "checkbox2", checked: "checked", goal: "Workout Today!" },
    { className: "checkbox4", checked: "checked", goal: "Finish Project!" }
  ];

  const newGoals = objectives.map(objectives => {
    for (let i = 0; i < goals.length; i++) {
      if (objectives.className === goals[i].className) {
        return goals[i];
      }
    }
    return objectives;
  });
  console.log(newGoals);
});

module.exports = {
  newGoals: newGoals
};
