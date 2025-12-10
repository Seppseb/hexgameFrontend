import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL:  API_BASE + "/api/games",
  withCredentials: true,
});

export const listGames = () => API.get("");
export const createGame = () => API.post("/create");
export const joinGame = (gameId, name) => API.post(`/${gameId}/join?name=${name}`);
export const startGame = (gameId) => API.post(`/${gameId}/start`);
export const sendReady = (gameId) => API.post(`/${gameId}/ready`);
export const build = (gameId, row, col) => API.post(`/${gameId}/build/${row}/${col}`);
export const buildRoad = (gameId, row, col) => API.post(`/${gameId}/buildRoad/${row}/${col}`);
export const buyDevelopment = (gameId) => API.post(`/${gameId}/buyDevelopment`);
export const playDevelopment = (gameId, type) => API.post(`/${gameId}/playDevelopment/${type}`);
export const bankTrade = (gameId, wood, clay, wheat, wool, stone) => API.post(`/${gameId}/bankTrade/${wood}/${clay}/${wheat}/${wool}/${stone}`);
export const askPlayerTrade = (gameId, wood, clay, wheat, wool, stone) => API.post(`/${gameId}/askPlayerTrade/${wood}/${clay}/${wheat}/${wool}/${stone}`);
export const acceptPlayerTrade = (gameId, wood, clay, wheat, wool, stone) => API.post(`/${gameId}/acceptPlayerTrade/${wood}/${clay}/${wheat}/${wool}/${stone}`);
export const declinePlayerTrade = (gameId, wood, clay, wheat, wool, stone) => API.post(`/${gameId}/declinePlayerTrade/${wood}/${clay}/${wheat}/${wool}/${stone}`);
export const finishPlayerTrade = (gameId, partnerId) => API.post(`/${gameId}/finishPlayerTrade/${partnerId}`);
export const cancelPlayerTrade = (gameId) => API.post(`/${gameId}/cancelPlayerTrade`);
export const endTurn = (gameId) => API.post(`/${gameId}/endTurn`);
export const getGame = (gameId) => API.get(`/${gameId}`);
export const getUserInfo = () => API.get(`/whoAmI`);
