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
    addListItem: function (item, type) {
      //Orlogo zarlaga element aguulsan html beltgene
      var html, list;
      if (type === "inc") {
        list = ".income__list";
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = ".expenses__list";
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Ter html dotor orlogo zarlaga utguudig replace ashiglan oorchilon
      html = html.replace("%id%", item.id);
      html = html.replace("%des%", item.description);
      html = html.replace("%value%", item.value);
      //Beltgesen html ee DOM ruu hiij ogno
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
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
    addItem: function (type, description, value) {
      var item, id;

      if (data.allItems[type].length === 0) id = 1;
      else {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, description, value);
      } else {
        item = new Expense(id, description, value);
      }

      data.allItems[type].push(item);
      return item;
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
    var item = financeController.addItem(
      input.type,
      input.description,
      input.value
    );
    // 3. Olj avsan ogogdluudiig web deer tohiroh hesguuded gargana.
    uiController.addListItem(item, input.type);
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
