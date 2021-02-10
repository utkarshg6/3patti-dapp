import web3 from "./web3";
import GameFactory from "./build/GameFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(GameFactory.interface),
    "0x9E8f844dc81e212461096EA557C41d4d93c3504f"
);

export default instance;
