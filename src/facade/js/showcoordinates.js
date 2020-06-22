/**
 * @module M/plugin/ShowCoordinates
 */
import 'assets/css/showcoordinates';
import ShowCoordinatesControl from './showcoordinatescontrol';
import api from '../../api';

export default class ShowCoordinates extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(options) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Position of the Plugin
     * Posible values: TR | TL | BL | BR
     * @type {Enum}
     */
    this.position_ = options.position || 'TR';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.control_ = new ShowCoordinatesControl();
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelShowCoordinates', {
      collapsible: false,
      collapsed: false,
      position: M.ui.position[this.position_],
      className: 'showcoordinates-panel',
      tooltip: 'Obtener coordenadas',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    const aControl = [];
    aControl.push(this.controls_);
    return aControl;
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'showcoordinates';
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }
}
