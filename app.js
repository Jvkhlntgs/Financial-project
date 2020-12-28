// Delgetstei ajilah module
var uiController = (function () {})();

//Sanhuutei ajillah module
var financeController = (function () {})();

//Holbogch module
var appController = (function (ui, fn) {
  var controlItem = function () {
    // 1. Oruulah ogogdoliig delgetsees olj avna.
    alert("bolj bna");
    // 2. Olj avsan ogogdluudee sanhuu controld damjuulj tendee hadgalna.
    // 3. Olj avsan ogogdluudiig web deer tohiroh hesguuded gargana.
    // 4. Tosoviig tootsoolon bodno.
    // 5. Etssiin uldegdel tootsoog bodoj delgetsend gargana.
  };
  document.querySelector(".add__btn").addEventListener("click", function () {
    controlItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      controlItem();
    }
  });
})(uiController, financeController);
