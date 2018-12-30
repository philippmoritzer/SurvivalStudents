const HUNGER_RESOURCE_1 = new Resource(100, 1, 5);
const HUNGER_RESOURCE_2 = new Resource(25, 0.3, 5);
const HUNGER_RESOURCE_3 = new Resource(50, 0.5, 5);

const LIFE_RESOURCE_1 = new Resource(25, 0.3, 5);
const LIFE_RESOURCE_2 = new Resource(100, 1, 5);
const LIFE_RESOURCE_3 = new Resource(50, 0.5, 5);

const LEARN_RESOURCE_1 = new Resource(25, 0.3, 5);
const LEARN_RESOURCE_2 = new Resource(50, 1, 5);
const LEARN_RESOURCE_3 = new Resource(100, 0.5, 5);

//Declaring the starting values for different characters
//possibly easier to change and balance out
//First dimension:
//[0] = Justus
//[1] = Lisa
//[2] = Soeren
//Second Dimension:
//[0] = Money
//[1] = hunger: Resource (class)
//[2] = life: Resource (class)
//[3] = learn: Resource (class)
const STARTING_VALUES = [
  [1000, HUNGER_RESOURCE_1, LIFE_RESOURCE_1, LEARN_RESOURCE_1],
  [50, HUNGER_RESOURCE_2, LIFE_RESOURCE_2, LEARN_RESOURCE_2],
  [200, HUNGER_RESOURCE_3, LIFE_RESOURCE_3, LEARN_RESOURCE_3]
];

const NAME_INDEX_PAIR = [
  { index: 1, name: "Justus" },
  { index: 2, name: "Lisa" },
  { index: 3, name: "Sören" }
];

//pre-determined resourcebars
const RESOURCE_BARS = [
  {
    type: "hunger",
    color1: "rgba(27, 94, 32, 0.85)",
    color2: "#388E3C",
    color3: "#4CAF50",
    image: "hunger.png"
  },
  {
    type: "life",
    color1: "rgba(198, 40, 40, 0.85)",
    color2: "#e53935",
    color3: "#ef5350",
    image: "life.png"
  },
  {
    type: "learn",
    color1: "rgba(249, 168, 37, 0.85)",
    color2: "#FDD835",
    color3: "#FFEE58",
    image: "learn.png"
  }
];

const ACTIONS_PER_AREA = 3;
const MAX_TURN_COUNT = 3;

//HTML component for AreaChoiceItemPage in Modal Dialog
const AREA_CHOICE_ITEM_PAGE =
  "./components/modals/area-choice-modal/area-choice-item/area-choice-item.html";
