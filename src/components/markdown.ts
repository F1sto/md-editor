import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.text = function (_markdown) {
  let markdown = _markdown.text;

  // badge
  markdown = markdown.replace(/\{%\s*badge-(\w+)\s*(.*?)\s*%\}/g, (match, color, content) => {
      return `<span class="badge ${color}">${content}</span>`;
    });

  // accordion
  markdown = markdown
    .replace(/\{%\s*cut\s+(.*?)\s*%\}/g, (match, title) => {
      return `<div class="accordion-head">${title}</div><div class="accordion-body">`;
    })
    .replace(/\{%\s*endcut\s*%\}/g, '</div></div>'); // Закрываем body и head аккордеона

  return markdown;
};

marked.setOptions({ renderer });

export default marked;
