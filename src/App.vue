<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import marked from './components/markdown.ts';

const inputVal = ref('{% cut Bear {%badge-green cool badge%} %}\n' +
    'body\n' +
    '{% endcut %}\n' +
    '\n' +
    '{%badge-green green badge%}\n' +
    '\n' +
    '{%badge-red I\'m red badge%}\n' +
    '\n' +
    '{%badge-orange Orange badge%}\n' +
    '\n' +
    '{% cut Vodka {%badge-red bad badge%} %}\n' +
    'body\n' +
    '{% endcut %}');


onMounted(() => {
  document.getElementById('textarea').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const textarea = event.target;
      const cursorPosition = textarea.selectionStart;

      // Найти текущую строку, где находится курсор
      let lastLine = inputVal.value.substring(0, cursorPosition).split("\n").pop();

      // Проверить, есть ли у текущей строки порядковый номер
      const numberMatch = lastLine.match(/^(\d+)\./);
      if (numberMatch) {
        const nextNumber = parseInt(numberMatch[1]) + 1;
        const beforeCursor = inputVal.value.substring(0, cursorPosition);
        const afterCursor = inputVal.value.substring(cursorPosition);

        // Вставить следующий порядковый номер после переноса строки
        inputVal.value = beforeCursor + "\n" + nextNumber + ". " + afterCursor;

        // Переместить курсор на новое место
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + nextNumber.toString().length + 2;

        // Остановить стандартное поведение переноса строки
        event.preventDefault();

        return
      }


      const bulletMatch = lastLine.match(/^\-\s/);  // Маркерный список
      if(bulletMatch) {
        // Если строка начинается с маркера "-", добавляем новый маркер "-"
        const beforeCursor = text.substring(0, cursorPosition);
        const afterCursor = text.substring(cursorPosition);

        // Вставляем новый маркер "-" после переноса строки
        inputVal.value = beforeCursor + "\n- " + afterCursor;

        // Перемещаем курсор на новое место
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3;  // Длина "- " = 3 символа

        // Останавливаем стандартное поведение переноса строки
        event.preventDefault();
      }
    }
  });

  initToggleListeners();
})

watch(
() => inputVal.value,
    () => setTimeout(() => initToggleListeners())
)

function initToggleListeners() {
  const accordionList = document.getElementsByClassName('accordion-head');

  for (let accordion of accordionList) {
    const content = accordion.nextElementSibling;
    content.style.display = 'none';


    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');

      if (!accordion.classList.contains('active')) {
        collapseChildAccordions(content);
      }

      content.style.display === 'block' ? content.style.display = 'none' : content.style.display = 'block';
    });
  }
}


const addList = (type: 'numeric' | 'doted') => {
  const textarea = document.getElementById("textarea");
  const cursorPosition = textarea.selectionStart;

  const beforeCursor = textarea.value.substring(0, cursorPosition);
  const afterCursor = textarea.value.substring(cursorPosition);

  let lines = beforeCursor.split("\n");

  // Модифицируем последнюю строку перед кареткой, добавляя маркер
  lines[lines.length - 1] = `${type === 'doted' ? '- ' : '1. '} ${lines[lines.length - 1].trim()}`;

  // Собираем текст обратно: модифицированная часть до каретки и остальная часть после неё
  inputVal.value = lines.join("\n") + afterCursor;

  // Возвращаем каретку на прежнюю позицию
  textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2; // Учитываем добавленные символы "- "
}

const onClick = (leftSymbol: string, rightSymbol?: string) => {
  // Получаем выделенный пользователем текст
  let selection = window.getSelection();
  let selectedText = selection.toString();  // Сам выделенный текст

  // Если текст был выделен
  if (selectedText) {
    let symbol = leftSymbol;  // Символ для добавления
    const endSymbol = rightSymbol ?? leftSymbol

    // Получаем начальную и конечную позиции выделения
    let start = inputVal.value.indexOf(selectedText);
    let end = start + selectedText.length;

    // Изменяем текст, добавляя символы перед и после выделенной части
    inputVal.value = inputVal.value.substring(0, start) + symbol + selectedText + endSymbol + inputVal.value.substring(end);
  }
}

function addElement(type: 'badge' | 'accordion') {
  if (type === 'badge') {
    inputVal.value = inputVal.value + ' \n\n{%badge state badge%}'
  }

  if (type === 'accordion') {
    inputVal.value = inputVal.value + ' \n\n{% cut head%}\ncontent here\n{% endcut %}'
  }
}

</script>

<template>
  <div class="app">
    <div id="editor"></div>

    <div class="buttons">
      <button @click="onClick('*')">italic</button>
      <button @click="onClick('**')">bold</button>
      <button @click="onClick('~')">strike</button>
      <button @click="addList('numeric')">list 1</button>
      <button @click="addList('doted')">list .</button>
      <button @click="addElement('badge')">Badge</button>
      <button @click="addElement('accordion')">Accordion</button>
    </div>

    <textarea v-model="inputVal" id="textarea" />


    <div class="output" v-html="marked.parse(inputVal)"></div>
  </div>
</template>


<style>
.app {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.app input{
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.output {
  width: 100%;
  min-width: 500px;
  min-height: 100px;
  color: white;
  background: #787878;
  border: 1px solid #454545;
  border-radius: 10px;
}

textarea {
  min-height: 300px;
}

.badge {
  background: #000000;
  border-radius: 10px;
  color: white;
  padding: 6px 20px;
}

.badge.red {
  background: red;
}

.badge.green {
  background: green;
}

.badge.orange {
  background: orange;
}

.accordion-head {
  background: #1a1a1a;
  border: 1px solid #2937e6;
  border-radius: 10px;
  padding: 10px 20px;
}

.accordion-body {
  background: #2b2b2b;
}
</style>
