/**
 * @param formName
 * @param values
 * @return {{select: HTMLSelectElement, wrapDiv: HTMLDivElement}}
 */
const createForm = (formName, values) => {
  const div = document.createElement('div');
  const form = document.createElement('form');
  form.name = formName;
  const select = document.createElement('select');
  form.appendChild(select);
  values.forEach(v => {
    const option = document.createElement('option');
    option.value = v;
    option.innerText = v;
    select.appendChild(option);
  });
  div.appendChild(form);
  return { select, wrapDiv: div };
};

export default createForm;
