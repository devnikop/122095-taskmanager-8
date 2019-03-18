import {Component} from './component.js';

const Color = new Set([
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`,
]);

export default class TaskEdit extends Component {
  constructor(data) {
    super(data);
    this._dueDate = data.dueDate;
    this._color = data.color;

    this._saveButtonElement = null;
    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
  }

  get template() {
    return `
    <article class='card card--black card--edit ${this._isRepeated() ? `card--repeat` : ``}'>
      <form class='card__form' method='get'>
        <div class='card__inner'>
          ${this._renderControls()}
          ${this._renderColorBar()}
          ${this._renderTextarea()}
          ${this._renderSettings()}
          ${this._renderStatusButtons()}
        </div>
      </form>
    </article>`.trim();
  }

  _renderDates() {
    const date = new Date(this._dueDate);
    return `
    <div class="card__dates">
      <button class="card__date-deadline-toggle"
        type="button">date:<span class="card__date-status">no</span>
      </button>
      <fieldset class="card__date-deadline" disabled>
        <label class="card__input-deadline-wrap">
          <input class="card__date"
            type="text"
            placeholder="${date.getDay() + 1} ${date.toLocaleString(`en-us`, {month: `long`})}"
            name="date"
            />
        </label>
        <label class="card__input-deadline-wrap">
          <input class="card__time"
            type="text"
            placeholder="${date.toLocaleString(`en-US`, {hour: `numeric`, hour12: true})}"
            name="time"
            />
        </label>
      </fieldset>
      <button class="card__repeat-toggle"
        type="button">repeat:<span class="card__repeat-status">no</span>
      </button>
      <fieldset class="card__repeat-days" disabled>
        <div class="card__repeat-days-inner">
          ${Object.entries(this._repeatingDays).map(([day, value]) => `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}-1"
            name="repeat"
            value=${day}
            ${value ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-${day}-1">${day}</label>
          `).join(``)}
        </div>
      </fieldset>
    </div>`;
  }

  _renderDetails() {
    return `
    <div class='card__details'>
      ${this._renderDates()}
      ${this._renderHashtag()}
    </div>`;
  }

  _renderColors() {
    return `
    <div class='card__colors-inner'>
      <h3 class="card__colors-title">Color</h3>
      <div class='card__colors-wrap'>
        ${Array.from(Color).map((currentColor) => `<input
          type="radio" id="color-${currentColor}-1"
          class="card__color-input card__color-input--${currentColor} visually-hidden"
          name="color" value="${currentColor}"
          ${currentColor === this._color ? `checked` : ``}
        />
        <label for="color-${currentColor}-1" class="card__color card__color--${currentColor}">${currentColor}</label>
        `).join(``)}
      </div>
    </div>`;
  }

  _renderSettings() {
    return `
    <div class='card__settings'>
      ${this._renderDetails()}
      ${this._renderImage()}
      ${this._renderColors()}
    </div>`;
  }

  _renderStatusButtons() {
    return `
    <div class= 'card__status-btns'>
      <button class='card__save' type='button'>save</button>
      <button class='card__delete' type='button'>delete</button>
    </div>`;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onSubmit === `function` && this._onSubmit();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  bind() {
    this._saveButtonElement = this._element.querySelector(`.card__save`);
    this._saveButtonElement.addEventListener(`click`, this._onSubmitButtonClick);
  }

  unbind() {
    this._saveButtonElement.removeEventListener(`click`, this._onSubmitButtonClick);
  }
}
