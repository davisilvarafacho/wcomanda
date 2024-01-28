import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

function getElement(el) {
  return typeof el === 'string' ? document.querySelector('#' + el) : el;
}

function action(bootstrapClass, element, action = 'show') {
  const instance = bootstrapClass.getOrCreateInstance(element);
  action === 'show' ? instance.show() : instance.hide();
}

export function hideOffcanvas(element) {
  action(bootstrap.Offcanvas, getElement(element), 'hide');
}

export function hideModal(element) {
  action(bootstrap.Modal, getElement(element), 'hide');
}

export function hideDropdown(element) {
  action(bootstrap.Dropdown, getElement(element), 'hide');
}

export function showOffcanvas(element) {
  action(bootstrap.Offcanvas, getElement(element));
}

export function showModal(element) {
  action(bootstrap.Modal, getElement(element));
}

export function showDropdown(element) {
  action(bootstrap.Dropdown, getElement(element));
}

export function hideCollapse(element) {
  action(bootstrap.Collapse, getElement(element), 'hide');
}

export function showCollapse(element) {
  action(bootstrap.Collapse, getElement(element));
}
