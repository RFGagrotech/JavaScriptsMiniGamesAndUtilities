export const exercises = {
    "/exercises/lobby": () =>
        import("../exercises/lobby.js").then(m=>m.renderLobby),
    "/exercises/calculator": () =>
        import("../exercises/calculator.js").then(m=>m.calculator),
    "/exercises/formvalidation": () =>
        import("../exercises/formvalidation.js").then(m=>m.render),
    "/exercises/apiweather": () =>
        import("../exercises/apiweather.js").then(m=>m.render),
    "/exercises/randomnumber": () =>
        import("../exercises/randomnumber.js").then(m=>m.randomNumber),
    "/exercises/todolist": () =>
        import("../exercises/to-dolist.js").then(m=>m.render),
};