const createForm = (formName, values, cb) => {
  const div = document.createElement('div');
  const form = document.createElement('form');
  const select = document.createElement('select');
  form.appendChild(select);
  values.forEach(v => {
    const option = document.createElement('option');
    option.value = v;
    option.innerText = v;
    select.appendChild(option);
  });
  const button = document.createElement('button');
  button.innerText = formName;
  button.onclick = () => {
    const num = select.selectedIndex;
    cb(select.options[num].value);
  };
  div.appendChild(form);
  div.appendChild(button);
  document.body.appendChild(div);
};

export default createForm;
