class Control {
  constructor() {}
  setButtonEventAction(buttonId, event, action) {
    document.getElementById(buttonId).addEventListener(event, action);
  }
  setKeyboardEventAction(key, event, action) {
    window.addEventListener(event, function (e) {
      event.preventDefault();
      event.stopPropagation();
      
      if (e.code == key) action();
    });
  }
}
