import { shuffle } from "./shuffle.js";

// Fresh order on every visit; without JS the list keeps its HTML order
const list = document.querySelector(".demo-list");
if (list) shuffle([...list.children]).forEach((li) => list.appendChild(li));
