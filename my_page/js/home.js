document.querySelector("#DATE").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /date.html로 이동
  });

  document.querySelector("#HOME").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /date.html로 이동
  });
  document.querySelector("#NOTE").addEventListener("click", function () {
    const url = this.getAttribute("data-src");
    window.location.href = url; // 클릭하면 /date.html로 이동
  });