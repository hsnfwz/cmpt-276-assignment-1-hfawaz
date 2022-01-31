/* DOM Functions */

const createFormNameElement = () => {
  const formNameElement = document.querySelector('#form-name');
  const formNameElementChildCount = formNameElement.children.length;

  const newFormNameElement = document.createElement('div');
  newFormNameElement.className = 'form-activity';
  newFormNameElement.innerHTML = `Activity ${formNameElementChildCount}`;

  formNameElement.appendChild(newFormNameElement);
}

const createFormShortNameElement = () => {
  const formShortNameElement = document.querySelector('#form-short-name');
  const formShortNameElementChildCount = formShortNameElement.children.length;

  const newFormShortNameElement = document.createElement('div');
  newFormShortNameElement.className = 'form-activity';
  newFormShortNameElement.innerHTML = `A${formShortNameElementChildCount}`;

  formShortNameElement.appendChild(newFormShortNameElement);
}

const createFormWeightElement = () => {
  const formWeightElement = document.querySelector('#form-weight');
  const formWeightElementChildCount = formWeightElement.children.length;

  const newFormWeightElementChild = document.createElement('input');
  newFormWeightElementChild.id = `form-weight-${formWeightElementChildCount}`;
  newFormWeightElementChild.className = 'form-weight-input';
  newFormWeightElementChild.type = 'number';
  newFormWeightElementChild.min = '0';

  const newFormWeightElementParent = document.createElement('div');
  newFormWeightElementParent.className = 'form-activity-weight';
  newFormWeightElementParent.appendChild(newFormWeightElementChild);

  formWeightElement.appendChild(newFormWeightElementParent);
}

const createFormGradeElement = () => {
  const formGradeElement = document.querySelector('#form-grade');
  const formGradeElementChildCount = formGradeElement.children.length;

  const newFormGradeElementChild1 = document.createElement('input');
  newFormGradeElementChild1.id = `form-grade-numerator-${formGradeElementChildCount}`;
  newFormGradeElementChild1.className = 'form-grade-numerator-input';
  newFormGradeElementChild1.type = 'number';
  newFormGradeElementChild1.min = '0';
  newFormGradeElementChild1.oninput = () => calculatePercent(formGradeElementChildCount);
  
  const newFormGradeElementChild2 = document.createTextNode(' / ');

  const newFormGradeElementChild3 = document.createElement('input');
  newFormGradeElementChild3.id = `form-grade-denominator-${formGradeElementChildCount}`;
  newFormGradeElementChild3.className = 'form-grade-denominator-input';
  newFormGradeElementChild3.type = 'number';
  newFormGradeElementChild3.min = '0';
  newFormGradeElementChild3.oninput = () => calculatePercent(formGradeElementChildCount);

  const newFormGradeElementParent = document.createElement('div');
  newFormGradeElementParent.className = 'form-activity-grade';
  newFormGradeElementParent.append(newFormGradeElementChild1, newFormGradeElementChild2, newFormGradeElementChild3);

  formGradeElement.appendChild(newFormGradeElementParent);
}

const createFormPercentElement = () => {
  const formPercentElement = document.querySelector('#form-percent');
  const formPercentElementChildCount = formPercentElement.children.length;

  const newFormPercentElement = document.createElement('div');
  newFormPercentElement.id = `form-percent-${formPercentElementChildCount}`;
  newFormPercentElement.className = 'form-activity-percent-empty';

  formPercentElement.appendChild(newFormPercentElement);
}

const createActivityElement = () => {
  createFormNameElement();
  createFormShortNameElement();
  createFormWeightElement();
  createFormGradeElement();
  createFormPercentElement();
}

/* Calculation Functions */

const calculatePercent = (formGradeElementChildCount) => {
  const formGradeNumeratorInputElement = document.querySelector(`#form-grade-numerator-${formGradeElementChildCount}`);
  const formGradeDenominatorInputElement = document.querySelector(`#form-grade-denominator-${formGradeElementChildCount}`);

  let gradeNumeratorValue = formGradeNumeratorInputElement.valueAsNumber;
  let gradeDenominatorValue = formGradeDenominatorInputElement.valueAsNumber;

  const formPercentElement = document.querySelector(`#form-percent-${formGradeElementChildCount}`);

  if (isNaN(gradeNumeratorValue) && isNaN(gradeDenominatorValue)) {
    formPercentElement.innerHTML = '';
    formPercentElement.className = 'form-activity-percent-empty';
    return;
  }

  if (isNaN(gradeNumeratorValue)) gradeNumeratorValue = 0;
  if (isNaN(gradeDenominatorValue)) gradeDenominatorValue = 0;

  if ((gradeNumeratorValue >= 0) && (gradeDenominatorValue > 0)) {
    const percent = ((gradeNumeratorValue / gradeDenominatorValue) * 100).toFixed(2);
    formPercentElement.innerHTML = `${percent}%`;
    formPercentElement.className = 'form-activity-percent-filled';
  } else if ((gradeNumeratorValue > 0) && (gradeDenominatorValue === 0)) {
    formPercentElement.innerHTML = 'NaN';
    formPercentElement.className = 'form-activity-percent-filled';
    return;
  } else if ((gradeNumeratorValue === 0) && (gradeDenominatorValue === 0)) {
    formPercentElement.innerHTML = '0.00%';
    formPercentElement.className = 'form-activity-percent-filled';
    return;
  }
}

const calculateWeightedGrade = () => {
  const formWeightInputElements = document.querySelectorAll('.form-weight-input');
  const formGradeNumeratorInputElements = document.querySelectorAll('.form-grade-numerator-input');
  const formGradeDenominatorInputElements = document.querySelectorAll('.form-grade-denominator-input');

  const inputElementsLength = formWeightInputElements.length;

  const resultElement = document.querySelector('#result');

  let i = 0;
  let weightedGradeNumerator = 0;
  let weightedGradeDenominator = 0;

  while (i < inputElementsLength) {
    let weightValue = formWeightInputElements[i].valueAsNumber;
    let gradeNumeratorValue = formGradeNumeratorInputElements[i].valueAsNumber;
    let gradeDenominatorValue = formGradeDenominatorInputElements[i].valueAsNumber;

    if (isNaN(weightValue)) weightValue = 0;
    if (isNaN(gradeNumeratorValue)) gradeNumeratorValue = 0;
    if (isNaN(gradeDenominatorValue)) gradeDenominatorValue = 0;

    if (gradeDenominatorValue > 0) {
      weightedGradeNumerator += weightValue * (gradeNumeratorValue / gradeDenominatorValue);
      weightedGradeDenominator += weightValue;
    } else if ((gradeNumeratorValue > 0) && (gradeDenominatorValue === 0)) {
      resultElement.innerHTML = 'NaN (Empty fields default to 0)';
      return;
    }

    i++;
  }

  if (weightedGradeNumerator === 0 && weightedGradeDenominator === 0) {
    resultElement.innerHTML = '0.00% (Empty fields default to 0)';
    return;
  }

  const weightedGrade = ((weightedGradeNumerator / weightedGradeDenominator) * 100).toFixed(2);
  resultElement.innerHTML = `${weightedGrade}% (Empty fields default to 0)`;
}

const calculateMeanGrade = () => {
  const formGradeNumeratorInputElements = document.querySelectorAll('.form-grade-numerator-input');
  const formGradeDenominatorInputElements = document.querySelectorAll('.form-grade-denominator-input');

  const inputElementsLength = formGradeNumeratorInputElements.length;

  const resultElement = document.querySelector('#result');

  let i = 0;
  let meanGradeNumerator = 0;
  let meanGradeDenominator = 0;

  while (i < inputElementsLength) {
    let gradeNumeratorValue = formGradeNumeratorInputElements[i].valueAsNumber;
    let gradeDenominatorValue = formGradeDenominatorInputElements[i].valueAsNumber;

    if (isNaN(gradeNumeratorValue)) gradeNumeratorValue = 0;
    if (isNaN(gradeDenominatorValue)) gradeDenominatorValue = 0;

    if (gradeDenominatorValue > 0) {
      meanGradeNumerator += gradeNumeratorValue / gradeDenominatorValue;
      meanGradeDenominator++;
    } else if ((gradeNumeratorValue > 0) && (gradeDenominatorValue === 0)) {
      resultElement.innerHTML = 'NaN (Empty fields default to 0)';
      return;
    }

    i++;
  }

  if (meanGradeNumerator === 0 && meanGradeDenominator === 0) {
    resultElement.innerHTML = '0.00% (Empty fields default to 0)';
    return;
  }

  const meanGrade = ((meanGradeNumerator / meanGradeDenominator) * 100).toFixed(2);
  resultElement.innerHTML = `${meanGrade}% (Empty fields default to 0)`;
}

/* Events */

const btnAddActivity = document.querySelector('#btn-add-activity');
btnAddActivity.addEventListener('click', (e) => createActivityElement());

const btnCalculateWeightedGrade = document.querySelector('#btn-weighted');
btnCalculateWeightedGrade.addEventListener('click', (e) => calculateWeightedGrade());

const btnCalculateMeanGrade = document.querySelector('#btn-mean');
btnCalculateMeanGrade.addEventListener('click', (e) => calculateMeanGrade());

/* Document */

document.body.onload = () => {
  let i = 0;
  const limit = 4

  while (i < limit) {
    createActivityElement();

    i++;
  }
};