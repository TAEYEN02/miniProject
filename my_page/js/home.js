document.querySelector("#DATE").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /date.html로 이동
  });

  document.querySelector("#HOME").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /home.html로 이동
  });
  document.querySelector("#NOTE").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /note.html로 이동
  });

  document.querySelector("#TODO").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /todo.html로 이동
  });