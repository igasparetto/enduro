class Control {
  constructor() {}
  setButtonEventAction(buttonId, event, action) {
    document.getElementById(buttonId).addEventListener(event, action);
  }
  setKeyboardEventAction(key, event, action) {
    window.addEventListener(event, function (e) {
      if (e.code == key) action(e);
    });
  }
}
