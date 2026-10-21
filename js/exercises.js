export const exercises = {
    "/exercises/lobby": () =>
        import("../exercises/lobby.js").then(m=>m.renderLobby),
};