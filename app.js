// Delgetstei ajilah module....................................................
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDomStrings: function () {
      return DOMstrings;
    },
  };
})();

//Sanhuutei ajillah module....................................................................
var financeController = (function () {
  //private datas
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Private datas
  var data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
  };
  return {
    addItem: function (type, desc, val) {
      var item, id;

      if (data.item[type].length === 0) id = 1;
      else {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.allItems[type].push(item);
    },
    seeData: function () {
      return data;
    },
  };
})();

//Holbogch module...............................................................
var appController = (function (uiController, financeController) {
  var controlItem = function () {
    // 1. Oruulah ogogdoliig delgetsees olj avna.
    var input = uiController.getInput();
    // 2. Olj avsan ogogdluudee sanhuu controld damjuulj tendee hadgalna.
    financeController.addItem(input.type, input.desc, input.val);
    // 3. Olj avsan ogogdluudiig web deer tohiroh hesguuded gargana.
    // 4. Tosoviig tootsoolon bodno.
    // 5. Etssiin uldegdel tootsoog bodoj delgetsend gargana.
  };

  var setupEventListeners = function () {
    var DOM = uiController.getDomStrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      controlItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        controlItem();
      }
    });
  };

  return {
    init: function () {
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
