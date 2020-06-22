/**
 * @module M/control/ShowCoordinatesControl
 */

import ShowCoordinatesImplControl from 'impl/showcoordinatescontrol';
import template from 'templates/showcoordinates';
import modal from 'templates/modal';

export default class ShowCoordinatesControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(ShowCoordinatesImplControl)) {
      M.exception('La implementación usada no puede crear controles ShowCoordinatesControl');
    }
    // 2. implementation of this control
    const impl = new ShowCoordinatesImplControl();
    super(impl, 'ShowCoordinates');
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.html = html;
      // Add DOM dependent code here
      html.querySelector('#activateshowcoordinates').addEventListener(
        'click',
        this.activateDeactivate.bind(this),
      );
      map.on(M.evt.CLICK, (e) => { this.showCoordinates(e); });
      success(html);
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    // calls super to manage de/activation
    super.activate();
    this.getImpl().activateClick(this.map_);
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    // calls super to manage de/activation
    super.deactivate();

    this.getImpl().deactivateClick(this.map_);
  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-showcoordinates button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof ShowCoordinatesControl;
  }

  // Add your own functions

  /**
   * This function adds modal view to html
   *
   * @private
   * @param html - HTML template of the view
   */
  activateModal(pointCoordinates) {
    if (this.activated) {
      const dialog = M.template.compileSync(modal, {
        vars: { myVar: 2 },
      });
      const message = dialog.querySelector('#m-plugin-showcoordinates-message');
      const okButton = dialog.querySelector('#m-plugin-showcoordinates-button>button');
      const copyButton = dialog.querySelector('#m-plugin-showcoordinates-copybutton');
      const input = message.querySelector('input');

      const mapeaContainer = document.querySelector('div.m-mapea-container');
      okButton.addEventListener('click', () => this.removeElement(dialog));
      copyButton.addEventListener('click', () => {
        this.copyCoords(input);
        this.beginShade(message.querySelector('#m-plugin-showcoordinates-tooltip'));
      });
      input.value = `${pointCoordinates[0]}, ${pointCoordinates[1]}`;
      mapeaContainer.appendChild(dialog);
    }
  }

  /**
   * This function activates or deactivates control on click on control button
   * @private
   * @function
   */
  activateDeactivate() {
    if (this.activated) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  /**
   * This function shows a box with coordinates and copy button
   * after click on a point in the map
   * @private
   * @function
   * @param e - event
   */
  showCoordinates(e) {
    this.activateModal(e.coord);
  }

  /**
   * This function copies the text input in clipboard
   *
   * @function
   * @private
   * @param input - input value with coordinates
   */
  copyCoords(input) {
    const inputVar = input;
    inputVar.disabled = false;
    inputVar.select();
    document.execCommand('copy');
    inputVar.disabled = true;
    document.getSelection().removeAllRanges();
  }

  /**
   * This function adds the animation shade class.
   *
   * @function
   * @private
   * @param element - element that receives the animation
   */
  beginShade(element) {
    element.classList.add('m-plugin-showcoordinates-shade');
  }

  /**
   * This function removes the html element from DOM.
   *
   * @function
   * @private
   * @param element - element to delete
   */
  removeElement(element) {
    const parent = element.parentElement;
    parent.removeChild(element);
  }
}
