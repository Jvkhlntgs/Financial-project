// Delgetstei ajilah module....................................................
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getDomStrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDesc + " ," + DOMstrings.inputValue
      );

      //Convert list to Array
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      fieldsArr[0].focus();
    },

    tusuvUzuuleh: function (tusuv) {
      document.querySelector(DOMstrings.tusuvLabel).textContent =
        tusuv.tusuv + "₮";
      document.querySelector(DOMstrings.incomeLabel).textContent =
        tusuv.totalInc + "₮";
      document.querySelector(DOMstrings.expenseLabel).textContent =
        tusuv.totalExp + "₮";
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },

    addListItem: function (item, type) {
      //Orlogo zarlaga element aguulsan html beltgene
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
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

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
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

    tusuv: 0,

    huvi: 0,
  };
  return {
    TusuvTootsooloh: function () {
      // niit orlogo niilber
      calculateTotal("inc");
      //niit zarlaga niilber
      calculateTotal("exp");
      //tusuviig shineer tootsooloh
      data.tusuv = data.totals.inc - data.totals.exp;
      // orlogo zarlagiin huvichlal
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    TusuvAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

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

    if (input.description !== "" && input.value !== "") {
      // 2. Olj avsan ogogdluudee sanhuu controld damjuulj tendee hadgalna.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Olj avsan ogogdluudiig web deer tohiroh hesguuded gargana.
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      // 4. Tosoviig tootsoolon bodno.
      financeController.TusuvTootsooloh();
      // 5. Etssiin uldegdel tootsoog bodoj delgetsend gargana.
      var tusuv = financeController.TusuvAvah();
      // 6. Delgetsend gargah
      uiController.tusuvUzuuleh(tusuv);
    }
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
      uiController.tusuvUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
