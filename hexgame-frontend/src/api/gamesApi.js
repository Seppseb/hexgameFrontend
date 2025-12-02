import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/games",
  withCredentials: true,
});

export const listGames = () => API.get("");
export const createGame = () => API.post("/create");
export const joinGame = (gameId, name) => API.post(`/${gameId}/join?name=${name}`);
export const startGame = (gameId) => API.post(`/${gameId}/start`);
export const sendReady = (gameId) => API.post(`/${gameId}/ready`);
export const build = (gameId, row, col) => API.post(`/${gameId}/build/${row}/${col}`);
export const buildRoad = (gameId, row, col) => API.post(`/${gameId}/buildRoad/${row}/${col}`);
export const bankTrade = (gameId, wood, clay, wheat, wool, stone) => API.post(`/${gameId}/bankTrade/${wood}/${clay}/${wheat}/${wool}/${stone}`);
export const endTurn = (gameId) => API.post(`/${gameId}/endTurn`);
export const getGame = (gameId) => API.get(`/${gameId}`);
