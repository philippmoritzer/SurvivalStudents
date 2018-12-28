class GameStateManager {
  constructor() {
    if (this.instance) {
      throw new Error(
        "Constructor call is private, please use GameStateManager.getInstance()"
      );
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new GameStateManager();
    }
    return this.instance;
  }

  setLoaded() {
    this.loaded = true;
  }

  setCharacter(character) {
    this.character = character;
  }

  startGame() {
    this.day = 0;
    this.turnCount = 0;
    this.character.items = [];
    this.character.items.push(this.items[0]);
  }

  changeArea(index) {
    this.area = this.getAreaByIndex(index);

    execAreaChange(this.area);
  }

  setNavigationItemsLoaded() {
    this.navigationItemsLoaded = true;
  }

  changeDay() {
    this.changeAreaTasks();
    if (this.day !== 0) {
      this.executeLoss();
    }
    this.checkLosingCondition();
    if (this.day < 30) {
      this.day++;
      this.turnCount = 0;
      changeUIDay(this.area);
    }
  }

  /**
   * inits the game data stored as json in data-folder
   * asynchronous request -> returns a promise
   */
  initGameData() {
    let initPromise = new Promise((resolve, reject) => {
      let items = [];
      jQuery.getJSON("./data/items/items.json", data => {
        items = data;
        console.log(data);
        GameStateManager.getInstance().items = items;
      });

      let hungerActions = [];
      jQuery.getJSON("./data/actions/all/hunger-actions.json", data => {
        hungerActions = data;
        GameStateManager.getInstance().hungerActions = hungerActions;
      });

      let lifeActions = [];
      jQuery.getJSON("./data/actions/all/life-actions.json", data => {
        lifeActions = data;
        GameStateManager.getInstance().lifeActions = lifeActions;
      });

      let learnActions = [];
      jQuery.getJSON("./data/actions/all/learn-actions.json", data => {
        learnActions = data;
        GameStateManager.getInstance().learnActions = learnActions;
      });

      const actions = [hungerActions, lifeActions, learnActions];

      let areas = [];
      jQuery.getJSON("./data/area/areas.json", data => {
        areas = data;
        GameStateManager.getInstance().areas = areas;
        //FIX ME, fragt den letzten ab und resolvt dann
        resolve();
      });
    });

    this.initPromise = initPromise;
  }

  loadCharacterSpecificActions() {
    console.log("hi");
    let characterSpecificActionFolder = "character" + this.character.id;
    console.log(characterSpecificActionFolder);
    return new Promise((resolve, reject) => {
      jQuery.getJSON(
        "./data/actions/" +
          characterSpecificActionFolder +
          "/hunger-actions.json",
        data => {
          console.log(data);
          this.hungerActions = this.hungerActions.concat(data);
        }
      );
      jQuery.getJSON(
        "./data/actions/" +
          characterSpecificActionFolder +
          "/learn-actions.json",
        data => {
          this.learnActions = this.learnActions.concat(data);
        }
      );
      jQuery.getJSON(
        "./data/actions/" +
          characterSpecificActionFolder +
          "/life-actions.json",
        data => {
          this.lifeActions = this.lifeActions.concat(data);
          resolve();
        }
      );
    });
  }

  getAreaByIndex(index) {
    for (let i = 0; i < this.areas.length; i++) {
      const area = this.areas[i];
      if (area.index === index) {
        return area;
      }
    }
  }
  /**
   * Method that inits the Tasks in a certain Area
   * needs to be called once the game starts (on day one)
   * and on every day change
   */
  changeAreaTasks() {
    for (let area of this.areas) {
      area.actions = [];
      switch (area.name) {
        case "Home":
          for (let i = 0; i < ACTIONS_PER_AREA; i++) {
            switch (i) {
              case 0:
                area.actions.push(
                  this.hungerActions[
                    Math.floor(Math.random() * this.hungerActions.length)
                  ]
                );
                break;
              case 1:
                area.actions.push(
                  this.learnActions[
                    Math.floor(Math.random() * this.learnActions.length)
                  ]
                );
                break;
              case 2:
                area.actions.push(
                  this.lifeActions[
                    Math.floor(Math.random() * this.lifeActions.length)
                  ]
                );
                break;
            }
          }

          break;
        case "Foodcourt":
          for (let i = 0; i < ACTIONS_PER_AREA; i++) {
            area.actions.push(
              this.hungerActions[
                Math.floor(Math.random() * this.hungerActions.length)
              ]
            );
          }
          break;
        case "Hochschule":
          for (let i = 0; i < ACTIONS_PER_AREA; i++) {
            area.actions.push(
              this.learnActions[
                Math.floor(Math.random() * this.learnActions.length)
              ]
            );
          }
          break;
        case "Partymeile":
          for (let i = 0; i < ACTIONS_PER_AREA; i++) {
            area.actions.push(
              this.lifeActions[
                Math.floor(Math.random() * this.lifeActions.length)
              ]
            );
          }
          break;
        case "Natur":
          for (let i = 0; i < ACTIONS_PER_AREA; i++) {
            area.actions.push(
              this.learnActions[
                Math.floor(Math.random() * this.learnActions.length)
              ]
            );
          }
          break;
      }
    }
    return this.areas;
  }

  /**
   * Loses predefined Value each day
   * call in changeDay()-Method
   */
  executeLoss() {
    this.character.hunger.value =
      this.character.hunger.value - this.character.hunger.lossPerDay;
    this.character.life.value =
      this.character.life.value - this.character.life.lossPerDay;
    this.character.learn.value =
      this.character.learn.value - this.character.learn.lossPerDay;
    updateAllResourceBars();
  }

  checkLosingCondition() {
    //TODO
  }

  /**
   * adds an item to a character
   * @param {item-id} id
   */
  addItem(id) {
    const item = this.getItemById(id);
    this.character.items.push(item);
    addItemUI(item);
  }

  sellItem(item) {
    for (let i = 0; i < this.character.items.length; i++) {
      const element = this.character.items[i];
      if (item.id === element.id) {
        this.character.items.splice(i, 1);
        break;
      }
    }
    this.character.money = this.character.money + item.sellfor;
    updateMoneyUI(this.character.money);
  }

  /**
   * gets item by id
   * @param {*} id
   */
  getItemById(id) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.id === id) {
        return item;
      }
    }
  }

  playMusic() {
    var audio = new Audio("../assets/audio/background-music.mp3");
    audio.loop = true;
    audio.volume = 0.2;
    audio.play();
  }
}
