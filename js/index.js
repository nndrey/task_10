// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.getElementById('one'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13, "fonColor": "fruit_violet"},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35, "fonColor": "fruit_green"},
  {"kind": "Личи", "color": "розово-красный", "weight": 17, "fonColor": "fruit_carmazin"},
  {"kind": "Карамбола", "color": "желтый", "weight": 28, "fonColor": "fruit_yellow"},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22, "fonColor": "fruit_lightbrown"}
]`;
// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let copyFruits = fruits.slice(); //для сравнения исходного массива,и перемешанного

/*** ОТОБРАЖЕНИЕ ***/
// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = '';
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {
    const newLi = document.createElement('li');
    fruitsList.appendChild(newLi);
    newLi.classList.add('fruit__item');
    newLi.innerHTML = `<div class="fruit__info"><div>index:${i}</div>kind:${fruits[i].kind}
    <div>color:${fruits[i].color}</div><div>weight (кг):${fruits[i].weight}</div></div>`
    newLi.classList.add(`${fruits[i].fonColor}`);
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
}

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
let randomElem;
// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  while (fruits.length >0) {
      randomElem = getRandomInt(0,fruits.length-1);
      let elem = fruits.splice(randomElem,1);
      result.push(elem[0]);
  }

  fruits = result;
  if (JSON.stringify(fruits) === JSON.stringify(copyFruits)) {
    alert('Внимание! Порядок элементов не изменился!');
  };
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    let maxWeig = document.querySelector('.maxweight__input');
    let minWeig = document.querySelector('.minweight__input');
    let valMin = minWeig.value;
    let valMax = maxWeig.value;
    let filtWeigh = fruits.filter(({weight}) => weight >= valMin && weight <= valMax);
    if ((valMin === '') || (valMax === '')) {
      alert('Одно или несколько полей не заполнены!')
      location.reload ()
    }
    fruits = filtWeigh;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {    //функция сравнения двух элементов
  return (a.color > b.color) ? true : false;
};

function swap(fruits, firstIndex, secondIndex) {  //Функция обмена элементов
  const temp = fruits[firstIndex];
  fruits[firstIndex] = fruits[secondIndex];
  fruits[secondIndex] = temp;
};

function partition(fruits, left, right) {   //функция разделитель
  let pivot = fruits[Math.floor((right + left) / 2)],
    i = left,
    j = right;
  while (i <= j) {
    while (fruits[i] < pivot) {
      i++;
    }
    while (fruits[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(fruits, i, j);
      i++;
      j--;
    }
  }
  return i;
};


const sortAPI = {
  bubbleSort(fruits, comparationColor) {  //функция пузырьковой сортировки
    const n = fruits.length;
    for (let i = 0; i < n-1; i++) { 
  for (let j = 0; j < n-1-i; j++) { 
    if (comparationColor(fruits[j], fruits[j+1])) { 
    let temp = fruits[j+1]; 
    fruits[j+1] = fruits[j]; 
    fruits[j] = temp;}
    }
  }
},

  quickSort(fruits, left, right) {  // функция быстрой сортировки
    let index;
  if (parseInt(fruits.length) > 1) {
    left = typeof left != "number" ? 0 : left;
    right = typeof right != "number" ? fruits.length - 1 : right;
    index = partition(fruits, left, right);
    if (left < index - 1) {
      sortAPI.quickSort(fruits, left, index - 1);
    }
    if (index < right) {
      sortAPI.quickSort(fruits, index, right);
    }
  }
  return fruits;
  },

  // выполняет сортировку и производит замер времени
    startSort(sort, fruits, bubbleSort) {
    const start = new Date().getTime();
    sort(fruits, bubbleSort);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind === 'bubbleSort' ) {
    sortKind = 'quickSort';
    sortKindLabel.textContent = sortKind;
    sortTimeLabel.textContent = '-';
  } else {
      sortKind = 'bubbleSort';
      sortKindLabel.textContent = sortKind;
  }
  //переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  if (sortKind === 'bubbleSort') {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    display();
    sortTimeLabel.textContent = sortTime;
  } else {
    sortTimeLabel.textContent = 'sorting...';
    sortAPI.quickSort(fruits, 0, fruits.length - 1);
    sortTimeLabel.textContent = sortTime;
    display();
  }
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  if ((kindInput.value === '') || (weightInput.value === '') || (colorInput.value === '')) {
    alert('Не заполнено одно из полей')
  } else {
    let randomColorElem = Math.floor(Math.random()*fruits.length);
    fruits.push({
      "kind": kindInput.value,
      "color": colorInput.value,
      "weight": weightInput.value,
      "fonColor": `${fruits[randomColorElem].fonColor}`
    })
    display();
  }
});
