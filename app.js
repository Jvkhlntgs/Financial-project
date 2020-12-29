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
    containerDiv: ".container",
    expensePerLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  //Minii uuriin nodeList deer davtalt hiih function
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatNum = function (too, type) {
    too = "" + too;

    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) {
        y = y + ",";
      }
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ",") {
      z = z.substr(1, z.length - 1);
    }
    if (type === "inc") {
      z = "+ " + z;
    } else {
      z = "- " + z;
    }
    return z;
  };

  return {
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDesc +
          ", " +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function (el) {
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    displayDate: function () {
      var today = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        today.getFullYear() + " оны ";
    },

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

    displayPersentages: function (allPersentages) {
      // Zarlagiin nodelist oloh.
      var elements = document.querySelectorAll(DOMstrings.expensePerLabel);
      // elementuudin huvid zarlagiin huviig massivaas avj shivne
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPersentages[index] + "%";
      });
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
      var type;
      if (tusuv.tusuv > 0) {
        type = "inc";
      } else {
        type = "exp";
      }
      document.querySelector(DOMstrings.tusuvLabel).textContent =
        "Үлдэгдэл: " + formatNum(tusuv.tusuv + "₮", type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNum(
        tusuv.totalInc + "₮",
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNum(
        tusuv.totalExp + "₮",
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);

      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      //Orlogo zarlaga element aguulsan html beltgene
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Ter html dotor orlogo zarlaga utguudig replace ashiglan oorchilon
      html = html.replace("%id%", item.id);
      html = html.replace("%des%", item.description);
      html = html.replace("%value%", formatNum(item.value, type) + "₮");
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
    this.persentage = -1;
  };

  Expense.prototype.calcPersentage = function (totalInc) {
    if (totalInc > 0) {
      this.persentage = Math.round((this.value / totalInc) * 100);
    } else this.persentage = 0;
  };

  Expense.prototype.getPersentage = function () {
    return this.persentage;
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
      if (data.totals.inc > 0) {
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.huvi = 0;
      }
    },

    TusuvAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.allItems[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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

    calculatePersentages: function () {
      data.allItems.exp.forEach(function (el) {
        el.calcPersentage(data.totals.inc);
      });
    },
    getPersentages: function () {
      var allPersentages = data.allItems.exp.map(function (el) {
        return el.getPersentage();
      });
      return allPersentages;
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
      //Tusviig shineer tootsolon delgetsend gargah
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    // 4. Tosoviig tootsoolon bodno.
    financeController.TusuvTootsooloh();
    // 5. Etssiin uldegdel tootsoog bodoj delgetsend gargana.
    var tusuv = financeController.TusuvAvah();
    // 6. Delgetsend gargah
    uiController.tusuvUzuuleh(tusuv);
    // 7. Huviig delgetsend updateleh
    financeController.calculatePersentages();
    // 8. Elementuudiin huviig huleej avna
    var allPersentages = financeController.getPersentages();
    // 9. Edgeer huviudiig delgetsend gargah
    uiController.displayPersentages(allPersentages);
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

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          // zadlah
          var arr = id.split("-");
          var type = arr[0];
          var ItemId = parseInt(arr[1]);

          //sanhuu modulaas ustgana
          financeController.deleteItem(type, ItemId);
          //delgets deerees element ustgana
          uiController.deleteListItem(id);
          //uldegdel tootsoog shinchleh
          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      uiController.displayDate();
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
