let scenes = [
  "summer day",
  "summer sunset",
  "summer night",
  "summer sunrise",
  "autumn day",
  "autumn day white-mountains",
  "winter day",
  "winter sunset",
  "winter night",
  "winter night fog",
  "winter sunrise",
  "winter day",
  "spring day",
  "spring sunset",
  "spring night",
  "spring sunrise",
  "summer day desert",
  "summer desert sunset",
  "summer desert night",
  "summer desert sunrise",
  "summer day desert",
];
let sceneChangeInterval = 10000;
let $scene = document.getElementById("scene");
let $phase = document.getElementById("phase");
let $currentScene = document.getElementById("currentScene");
let currentScene = 0;
let years = 1;
let changeScenes = setInterval(function () {
  currentScene++;
  if (currentScene == scenes.length) {
    currentScene = 0;
    years++;
    $phase.innerHTML = years;
  }
  $scene.setAttribute("class", scenes[currentScene]);
  $currentScene.innerHTML = scenes[currentScene];
}, sceneChangeInterval);
