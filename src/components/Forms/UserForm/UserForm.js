import './UserForm.css';

export const UserForm = (parentElement, formName, fields) => {
  const form = document.createElement('form');
  form.classList.add('flex-container', 'user-form');
  const title = document.createElement('h2');
  title.textContent = formName;
  form.append(title);
for (const field of fields) {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');

  let input;

  if (field.type === 'textarea') {
    input = document.createElement('textarea');
  } else if (field.type === 'select') {
    input = document.createElement('select');
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Selecciona...';
    emptyOption.disabled = true;
    emptyOption.selected = true;
    input.append(emptyOption);
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.required = true;
  input.autocomplete = 'off';
  input.classList.add('input');
  input.id = field.id;
  input.name = field.name || field.id;
  const label = document.createElement('label');
  label.classList.add('iLabel');
  label.htmlFor = field.id;
  label.textContent = field.label || field.name || field.id;

  inputContainer.append(input, label);
  form.append(inputContainer);
}
};