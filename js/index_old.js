let controller = new Controller({
  snackColor: "#008B00",
  foodColor: "#FFD700",
});

(function main() {
  controller.initialize();
  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        controller.direction('up');
        e.returnValue = false;
      case 40:
      case 83:
        controller.direction('down');
        e.returnValue = false;
        break;
      case 37:
      case 65:
        controller.direction('left');
        e.returnValue = false;
        break;
      case 39:
      case 68:
        controller.direction('right');
        e.returnValue = false;
        break;
      case 80:
      case 32:
      case 13:
        spButton.click();
        e.returnValue = false;
        break;
      case 82:
        resetButton.click();
        e.returnValue = false;
    }
  });

  up.addEventListener('click', function () {
    controller.direction('up');
  });
  right.addEventListener('click', function () {
    controller.direction('right');
  });
  down.addEventListener('click', function () {
    controller.direction('down');
  });
  left.addEventListener('click', function () {
    controller.direction('left');
  });

  spButton.addEventListener('click', function () {
    controller.pause();
  })
  resetButton.addEventListener('click', function () {
    window.location.reload();
  })
})();

(function dev() {
  let li = document.querySelectorAll('li');
  li.forEach(function (value, index) {
    if (index !== 0) {
      value.addEventListener('click', function () {
        alert('开发中!\n敬请期待');
      })
    }
  })
})();