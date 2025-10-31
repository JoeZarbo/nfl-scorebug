const canvas = document.getElementById('bug');
const ctx = canvas.getContext("2d");
const logoCache = {};
let isBusy = false;
let phase = "normal";

window.onload = start;