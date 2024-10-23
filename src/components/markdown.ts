import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.text = function (_markdown) {
  let markdown = _markdown.text;

  if (markdown.match('{%badge')) {
    if (markdown.match('{%badge-green')) {
      markdown = markdown.replace('{%badge-green', '<span class="badge green">');
    }

    if (markdown.match('{%badge-red')) {
      markdown = markdown.replace('{%badge-red', '<span class="badge red">');
    }

    if (markdown.match('{%badge-orange')) {
      markdown = markdown.replace('{%badge-orange', '<span class="badge orange">');
    }

    markdown = markdown.replace('{%badge', '<span class="badge">');
  }

  if (markdown.match('badge%}')) {
    markdown = markdown.replace('badge%}', '</span>');
  }

  if (markdown.match('{% endcut %}')) {
    markdown = markdown.replace('{% endcut %}', '</div>');
  }

  if (markdown.match('{% cut')) {
    markdown = markdown.replace('{% cut', '<div class="accordion-head">');
  }

  if (markdown.match('%}')) {
    markdown = markdown.replace('%}', '</div><div class="accordion-body">');
  }

  return markdown;
};

marked.setOptions({ renderer });

export default marked;
