// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2020  DygmaLab SE.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import Styled from "styled-components";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

import RangeSlider from "react-bootstrap-range-slider";

import Focus from "../../../api/focus";
import Backup from "../../../api/backup";

import ConfirmationDialog from "../../components/ConfirmationDialog";
import SaveChangesButton from "../../components/SaveChangesButton";
import i18n from "../../i18n";

import settings from "electron-settings";
import { Spinner } from "react-bootstrap";

const Styles = Styled.div`
  .slider{
    width: 100%;
  }
  .greytext{
    color: ${({ theme }) => theme.colors.subtext}
  }
  .dropdownMenu{
    position: absolute;
  }
  .overflowFix{
    overflow: inherit;
  }
`;

class KeyboardSettings extends React.Component {
  constructor(props) {
    super(props);

    this.bkp = new Backup();

    this.state = {
      keymap: {
        custom: [],
        default: [],
        onlyCustom: false
      },
      ledBrightness: 255,
      ledIdleTimeLimit: 0,
      defaultLayer: 126,
      qukeysHoldTimeout: 0,
      qukeysOverlapThreshold: 0,
      SuperTimeout: 0,
      SuperRepeat: 0,
      SuperWaitfor: 0,
      SuperHoldstart: 0,
      SuperOverlapThreshold: 0,
      mouseSpeed: 0,
      mouseSpeedDelay: 0,
      mouseAccelSpeed: 0,
      mouseAccelDelay: 0,
      mouseWheelSpeed: 0,
      mouseWheelDelay: 0,
      mouseSpeedLimit: 0,
      modified: false,
      showDefaults: false,
      working: false,
      selectedLanguage: "",
      backupFolder: ""
    };

    this.ChooseBackupFolder = this.ChooseBackupFolder.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
    this.GetBackup = this.GetBackup.bind(this);
  }
  delay = ms => new Promise(res => setTimeout(res, ms));

  async componentDidMount() {
    const focus = new Focus();
    focus.command("keymap").then(keymap => {
      this.setState({ keymap: keymap });
    });
    focus.command("settings.defaultLayer").then(layer => {
      layer = layer ? parseInt(layer) : 126;
      this.setState({ defaultLayer: layer <= 126 ? layer : 126 });
    });

    focus.command("led.brightness").then(brightness => {
      brightness = brightness ? parseInt(brightness) : -1;
      this.setState({ ledBrightness: brightness });
    });

    focus.command("idleleds.time_limit").then(limit => {
      limit = limit ? parseInt(limit) : -1;
      this.setState({ ledIdleTimeLimit: limit });
    });

    this.setState({
      backupFolder: settings.getSync("backupFolder")
    });

    this.setState({
      selectedLanguage: settings.getSync("keyboard.language")
    });

    this.setState({
      showDefaults: settings.getSync("keymap.showDefaults")
    });

    // QUKEYS variables commands
    focus.command("qukeys.holdTimeout").then(holdTimeout => {
      holdTimeout = holdTimeout ? parseInt(holdTimeout) : 250;
      this.setState({ qukeysHoldTimeout: holdTimeout });
    });

    focus.command("qukeys.overlapThreshold").then(overlapThreshold => {
      overlapThreshold = overlapThreshold ? parseInt(overlapThreshold) : 80;
      this.setState({ qukeysOverlapThreshold: overlapThreshold });
    });

    // SuperKeys variables commands
    focus.command("superkeys.timeout").then(timeout => {
      timeout = timeout ? parseInt(timeout) : 250;
      this.setState({ SuperTimeout: timeout });
    });

    focus.command("superkeys.repeat").then(repeat => {
      repeat = repeat ? parseInt(repeat) : 20;
      this.setState({ SuperRepeat: repeat });
    });

    focus.command("superkeys.waitfor").then(waitfor => {
      waitfor = waitfor ? parseInt(waitfor) : 500;
      this.setState({ SuperWaitfor: waitfor });
    });

    focus.command("superkeys.holdstart").then(holdstart => {
      holdstart = holdstart ? parseInt(holdstart) : 200;
      this.setState({ SuperHoldstart: holdstart });
    });

    // focus.command("superkeys.overlap").then(overlapThreshold => {
    //   overlapThreshold = overlapThreshold ? parseInt(overlapThreshold) : 20;
    //   this.setState({ SuperOverlapThreshold: overlapThreshold });
    // });

    // MOUSE variables commands
    focus.command("mouse.speed").then(speed => {
      speed = speed ? parseInt(speed) : 1;
      this.setState({ mouseSpeed: speed });
    });

    focus.command("mouse.speedDelay").then(speedDelay => {
      speedDelay = speedDelay ? parseInt(speedDelay) : 6;
      this.setState({ mouseSpeedDelay: speedDelay });
    });

    focus.command("mouse.accelSpeed").then(accelSpeed => {
      accelSpeed = accelSpeed ? parseInt(accelSpeed) : 1;
      this.setState({ mouseAccelSpeed: accelSpeed });
    });

    focus.command("mouse.accelDelay").then(accelDelay => {
      accelDelay = accelDelay ? parseInt(accelDelay) : 64;
      this.setState({ mouseAccelDelay: accelDelay });
    });

    focus.command("mouse.wheelSpeed").then(wheelSpeed => {
      wheelSpeed = wheelSpeed ? parseInt(wheelSpeed) : 1;
      this.setState({ mouseWheelSpeed: wheelSpeed });
    });

    focus.command("mouse.wheelDelay").then(wheelDelay => {
      wheelDelay = wheelDelay ? parseInt(wheelDelay) : 128;
      this.setState({ mouseWheelDelay: wheelDelay });
    });

    focus.command("mouse.speedLimit").then(speedLimit => {
      speedLimit = speedLimit ? parseInt(speedLimit) : 127;
      this.setState({ mouseSpeedLimit: speedLimit });
    });
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (this.props.inContext && !nextProps.inContext) {
      this.componentDidMount();
      this.setState({ modified: false });
    }
  };

  setOnlyCustom = event => {
    const checked = event.target.checked;
    this.setState(state => ({
      modified: true,
      keymap: {
        custom: state.keymap.custom,
        default: state.keymap.default,
        onlyCustom: checked
      }
    }));
    this.props.startContext();
  };

  selectDefaultLayer = value => {
    this.setState({
      defaultLayer: value,
      modified: true
    });
    this.props.startContext();
  };

  selectIdleLEDTime = value => {
    this.setState({
      ledIdleTimeLimit: value,
      modified: true
    });
    this.props.startContext();
  };

  setShowDefaults = event => {
    this.setState({
      showDefaults: event.target.checked,
      modified: true
    });
    this.props.startContext();
  };

  setBrightness = event => {
    const value = event.target.value;

    this.setState({
      ledBrightness: value,
      modified: true
    });
    this.props.startContext();
  };

  setHoldTimeout = event => {
    const value = event.target.value;
    this.setState({
      qukeysHoldTimeout: value,
      modified: true
    });
    this.props.startContext();
  };

  setOverlapThreshold = event => {
    const value = event.target.value;

    this.setState({
      qukeysOverlapThreshold: value,
      modified: true
    });
    this.props.startContext();
  };

  setSuperTimeout = event => {
    const value = event.target.value;
    this.setState({
      SuperTimeout: value,
      modified: true
    });
    this.props.startContext();
  };

  setSuperRepeat = event => {
    const value = event.target.value;
    this.setState({
      SuperRepeat: value,
      modified: true
    });
    this.props.startContext();
  };

  setSuperWaitfor = event => {
    const value = event.target.value;
    this.setState({
      SuperWaitfor: value,
      modified: true
    });
    this.props.startContext();
  };

  setSuperHoldstart = event => {
    const value = event.target.value;
    this.setState({
      SuperHoldstart: value,
      modified: true
    });
    this.props.startContext();
  };

  // setSuperOverlapThreshold = event => {
  //   const value = event.target.value;

  //   this.setState({
  //     SuperOverlapThreshold: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  setSpeedDelay = event => {
    const value = event.target.value;

    this.setState({
      mouseSpeedDelay: value,
      modified: true
    });
    this.props.startContext();
  };

  setAccelSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseAccelSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  setAccelDelay = event => {
    const value = event.target.value;

    this.setState({
      mouseAccelDelay: value,
      modified: true
    });
    this.props.startContext();
  };

  setWheelSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseWheelSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  setWheelDelay = event => {
    const value = event.target.value;

    this.setState({
      mouseWheelDelay: value,
      modified: true
    });
    this.props.startContext();
  };

  setSpeedLimit = event => {
    const value = event.target.value;

    this.setState({
      mouseSpeedLimit: value,
      modified: true
    });
    this.props.startContext();
  };

  saveKeymapChanges = async () => {
    const focus = new Focus();

    const {
      keymap,
      defaultLayer,
      showDefaults,
      ledBrightness,
      ledIdleTimeLimit,
      qukeysHoldTimeout,
      qukeysOverlapThreshold,
      SuperTimeout,
      SuperRepeat,
      SuperWaitfor,
      SuperHoldstart,
      SuperOverlapThreshold,
      mouseSpeed,
      mouseSpeedDelay,
      mouseAccelSpeed,
      mouseAccelDelay,
      mouseWheelSpeed,
      mouseWheelDelay,
      mouseSpeedLimit
    } = this.state;

    await focus.command("keymap.onlyCustom", keymap.onlyCustom);
    await focus.command("settings.defaultLayer", defaultLayer);
    await focus.command("led.brightness", ledBrightness);
    if (ledIdleTimeLimit >= 0)
      await focus.command("idleleds.time_limit", ledIdleTimeLimit);
    settings.setSync("keymap.showDefaults", showDefaults);
    // QUKEYS
    await focus.command("qukeys.holdTimeout", qukeysHoldTimeout);
    await focus.command("qukeys.overlapThreshold", qukeysOverlapThreshold);
    // SUPER KEYS
    await focus.command("superkeys.timeout", SuperTimeout);
    await focus.command("superkeys.repeat", SuperRepeat);
    await focus.command("superkeys.waitfor", SuperWaitfor);
    await focus.command("superkeys.holdstart", SuperHoldstart);
    // await focus.command("superkeys.overlap", SuperOverlapThreshold);
    // MOUSE KEYS
    await focus.command("mouse.speed", mouseSpeed);
    await focus.command("mouse.speedDelay", mouseSpeedDelay);
    await focus.command("mouse.accelSpeed", mouseAccelSpeed);
    await focus.command("mouse.accelDelay", mouseAccelDelay);
    await focus.command("mouse.wheelSpeed", mouseWheelSpeed);
    await focus.command("mouse.wheelDelay", mouseWheelDelay);
    await focus.command("mouse.speedLimit", mouseSpeedLimit);

    const commands = await this.bkp.Commands();
    const backup = await this.bkp.DoBackup(commands);
    this.bkp.SaveBackup(backup);

    this.setState({ modified: false });
    this.props.cancelContext();
  };

  changeLanguage = language => {
    this.setState({ selectedLanguage: language });
    settings.setSync("keyboard.language", `${language}`);
  };

  ChooseBackupFolder() {
    let options = {
      title: i18n.keyboardSettings.backupFolder.title,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowButton,
      properties: ["openDirectory"]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showOpenDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePaths);
          this.setState({
            backupFolder: resp.filePaths[0]
          });
          settings.setSync("backupFolder", `${resp.filePaths[0]}`);
        } else {
          console.log("user closed backup folder dialog");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async GetBackup() {
    let options = {
      title: i18n.keyboardSettings.backupFolder.restoreTitle,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowRestore,
      defaultPath: this.state.backupFolder,
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: i18n.dialog.allFiles, extensions: ["*"] }
      ]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showOpenDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePaths);
          let backup;
          try {
            backup = JSON.parse(require("fs").readFileSync(resp.filePaths[0]));
            console.log("loaded backup", backup[0].command, backup[0].data);
          } catch (e) {
            console.error(e);
            alert("The file is not a valid macros backup");
            return;
          }
          this.restoreBackup(backup);
        } else {
          console.log("user closed SaveDialog");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async restoreBackup(backup) {
    let focus = new Focus();
    try {
      for (let i = 0; i < backup.length; i++) {
        let val = backup[i].data;
        // Boolean values need to be sent as int
        if (typeof val === "boolean") {
          val = +val;
        }
        console.log(`Going to send ${backup[i].command} to keyboard`);
        await focus.command(`${backup[i].command} ${val}`.trim());
      }
      console.log("Restoring all settings");
      console.log("Firmware update OK");
      return true;
    } catch (e) {
      console.log(`Restore settings: Error: ${e.message}`);
      return false;
    }
  }

  render() {
    const {
      keymap,
      defaultLayer,
      modified,
      showDefaults,
      ledBrightness,
      ledIdleTimeLimit,
      qukeysHoldTimeout,
      qukeysOverlapThreshold,
      SuperTimeout,
      SuperRepeat,
      SuperWaitfor,
      SuperHoldstart,
      SuperOverlapThreshold,
      mouseSpeed,
      mouseSpeedDelay,
      mouseAccelSpeed,
      mouseAccelDelay,
      mouseWheelSpeed,
      mouseWheelDelay,
      mouseSpeedLimit,
      selectedLanguage,
      backupFolder
    } = this.state;

    const onlyCustomSwitch = (
      <Form.Check
        type="switch"
        checked={keymap.onlyCustom}
        onChange={this.setOnlyCustom}
      />
    );
    const showDefaultLayersSwitch = (
      <Form.Check
        type="switch"
        checked={showDefaults}
        onChange={this.setShowDefaults}
      />
    );
    let languages = [
      "english",
      "spanish",
      "german",
      "french",
      "swedish",
      "danish",
      "norwegian",
      "icelandic",
      "japanese"
    ].map((item, index) => {
      return (
        <Dropdown.Item eventKey={item} key={index}>
          {item[0].toUpperCase() + item.slice(1)}
        </Dropdown.Item>
      );
    });
    const selectLanguage = (
      <Dropdown onSelect={this.changeLanguage} value={selectedLanguage}>
        <Dropdown.Toggle className="toggler">{`${selectedLanguage}`}</Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">{languages}</Dropdown.Menu>
      </Dropdown>
    );
    let layers;
    if (keymap.onlyCustom) {
      layers = keymap.custom.map((_, index) => {
        return (
          <Dropdown.Item eventKey={index} key={index}>
            {i18n.formatString(i18n.components.layer, index)}
          </Dropdown.Item>
        );
      });
    } else {
      layers = keymap.default.concat(keymap.custom).map((_, index) => {
        return (
          <Dropdown.Item eventKey={index} key={index}>
            {i18n.formatString(i18n.components.layer, index)}
          </Dropdown.Item>
        );
      });
    }
    const defaultLayerSelect = (
      <Dropdown onSelect={this.selectDefaultLayer} value={defaultLayer}>
        <Dropdown.Toggle className="toggler">{`Layer ${defaultLayer}`}</Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">
          <Dropdown.Item key={"no-default"} eventKey={126}>
            {i18n.keyboardSettings.keymap.noDefault}
          </Dropdown.Item>
          {layers}
        </Dropdown.Menu>
      </Dropdown>
    );
    const idleControl = (
      <Dropdown onSelect={this.selectIdleLEDTime} value={ledIdleTimeLimit}>
        <Dropdown.Toggle className="toggler">
          {ledIdleTimeLimit}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">
          <Dropdown.Item key={"no-idle"} eventKey={0}>
            {i18n.keyboardSettings.led.idleDisabled}
          </Dropdown.Item>
          <Dropdown.Item key={"oneMinute"} eventKey={60}>
            {i18n.keyboardSettings.led.idle.oneMinute}
          </Dropdown.Item>
          <Dropdown.Item key={"twoMinutes"} eventKey={120}>
            {i18n.keyboardSettings.led.idle.twoMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"threeMinutes"} eventKey={180}>
            {i18n.keyboardSettings.led.idle.threeMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fourMinutes"} eventKey={240}>
            {i18n.keyboardSettings.led.idle.fourMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fiveMinutes"} eventKey={300}>
            {i18n.keyboardSettings.led.idle.fiveMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"tenMinutes"} eventKey={600}>
            {i18n.keyboardSettings.led.idle.tenMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fifteenMinutes"} eventKey={900}>
            {i18n.keyboardSettings.led.idle.fifteenMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"twentyMinutes"} eventKey={1200}>
            {i18n.keyboardSettings.led.idle.twentyMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"thirtyMinutes"} eventKey={1800}>
            {i18n.keyboardSettings.led.idle.thirtyMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"oneHour"} eventKey={3600}>
            {i18n.keyboardSettings.led.idle.oneHour}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    const brightnessControl = (
      <RangeSlider
        min={0}
        max={255}
        value={ledBrightness}
        className="slider"
        onChange={this.setBrightness}
        marks={[{ value: 255, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const holdT = (
      <RangeSlider
        min={0}
        max={1000}
        value={qukeysHoldTimeout}
        className="slider"
        onChange={this.setHoldTimeout}
        marks={[{ value: 250, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const overlapT = (
      <RangeSlider
        min={0}
        max={100}
        value={qukeysOverlapThreshold}
        className="slider"
        onChange={this.setOverlapThreshold}
        marks={[{ value: 80, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const superT = (
      <RangeSlider
        min={0}
        max={1000}
        value={SuperTimeout}
        className="slider"
        onChange={this.setSuperTimeout}
        marks={[{ value: 250, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const superR = (
      <RangeSlider
        min={0}
        max={250}
        value={SuperRepeat}
        className="slider"
        onChange={this.setSuperRepeat}
        marks={[{ value: 20, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const superW = (
      <RangeSlider
        min={0}
        max={1000}
        value={SuperWaitfor}
        className="slider"
        onChange={this.setSuperWaitfor}
        marks={[{ value: 500, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const superH = (
      <RangeSlider
        min={0}
        max={1000}
        value={SuperHoldstart}
        className="slider"
        onChange={this.setSuperHoldstart}
        marks={[{ value: 200, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    // const SuperO = (
    //   <RangeSlider
    //     min={0}
    //     max={100}
    //     value={SuperOverlapThreshold}
    //     className="slider"
    //     onChange={this.setSuperOverlapThreshold}
    //     marks={[{ value: 20, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const mSpeed = (
      <RangeSlider
        min={0}
        max={254}
        value={mouseSpeed}
        className="slider"
        onChange={this.setSpeed}
        marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const mSpeedD = (
      <RangeSlider
        min={0}
        max={1000}
        value={mouseSpeedDelay}
        className="slider"
        onChange={this.setSpeedDelay}
        marks={[{ value: 6, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const mAccelS = (
      <RangeSlider
        min={0}
        max={254}
        value={mouseAccelSpeed}
        className="slider"
        onChange={this.setAccelSpeed}
        marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const maccelD = (
      <RangeSlider
        min={0}
        max={1000}
        value={mouseAccelDelay}
        className="slider"
        onChange={this.setAccelDelay}
        marks={[{ value: 64, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const mWheelS = (
      <RangeSlider
        min={0}
        max={254}
        value={mouseWheelSpeed}
        className="slider"
        onChange={this.setWheelSpeed}
        marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const mWheelD = (
      <RangeSlider
        min={0}
        max={1000}
        value={mouseWheelDelay}
        className="slider"
        onChange={this.setWheelDelay}
        marks={[{ value: 200, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const mSpeedL = (
      <RangeSlider
        min={0}
        max={254}
        value={mouseSpeedLimit}
        className="slider"
        onChange={this.setSpeedLimit}
        marks={[{ value: 127, label: i18n.keyboardSettings.defaultLabel }]}
      />
    );
    const backupFolderButton = (
      <Button onClick={this.ChooseBackupFolder}>
        {i18n.keyboardSettings.backupFolder.selectButtonText}
      </Button>
    );
    const restoreBackupButton = (
      <Button onClick={this.GetBackup}>
        {i18n.keyboardSettings.backupFolder.restoreButtonText}
      </Button>
    );

    return (
      <Styles>
        {this.state.working && <Spinner role="status" />}
        <Form>
          <Card.Header>{i18n.keyboardSettings.keymap.title}</Card.Header>
          <Card className="overflowFix">
            <Card.Body>
              {/* <Form.Group controlId="showHardcoded" className="formGroup">
                <Form.Label>
                  {i18n.keyboardSettings.keymap.showHardcoded}
                </Form.Label>
                {showDefaultLayersSwitch}
              </Form.Group>
              <Form.Group controlId="onlyCustom" className="formGroup">
                <Form.Label>
                  {i18n.keyboardSettings.keymap.onlyCustom}
                </Form.Label>
                {onlyCustomSwitch}
              </Form.Group> */}
              <Form.Group controlId="selectLanguage" className="formGroup">
                <Form.Label>{i18n.preferences.language}</Form.Label>
                {selectLanguage}
              </Form.Group>
              <Form.Group controlId="defaultLayer" className="formGroup">
                <Form.Label>
                  {i18n.keyboardSettings.keymap.defaultLayer}
                </Form.Label>
                {defaultLayerSelect}
              </Form.Group>
              <Form.Group controlId="backupFolder" className="mb-3">
                <Form.Label>
                  {i18n.keyboardSettings.backupFolder.title}
                </Form.Label>
                <div>
                  {backupFolderButton}
                  {"  "}
                  {backupFolder}
                </div>
              </Form.Group>
              <Form.Group controlId="restoreBackup" className="mb-3">
                <div>{restoreBackupButton}</div>
              </Form.Group>
            </Card.Body>
          </Card>
          <Card.Header>{i18n.keyboardSettings.led.title}</Card.Header>
          <Card className="overflowFix">
            <Card.Body>
              {ledIdleTimeLimit >= 0 && (
                <Form.Group controlId="idleTimeLimit" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.led.idleTimeLimit}
                  </Form.Label>
                  {idleControl}
                </Form.Group>
              )}
              {ledBrightness >= 0 && (
                <Form.Group controlId="brightnessControl" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.led.brightness}
                    <i className="greytext">
                      {i18n.keyboardSettings.led.brightnesssub}
                    </i>
                  </Form.Label>
                  {brightnessControl}
                </Form.Group>
              )}
            </Card.Body>
          </Card>
          <Card.Header>{i18n.keyboardSettings.qukeys.title}</Card.Header>
          <Card className="overflowFix">
            <Card.Body>
              {qukeysHoldTimeout >= 0 && (
                <Form.Group controlId="holdTimeout" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.qukeys.holdTimeout}
                    <i className="greytext">
                      {i18n.keyboardSettings.qukeys.holdTimeoutsub}
                    </i>
                  </Form.Label>
                  {holdT}
                </Form.Group>
              )}
              {qukeysOverlapThreshold >= 0 && (
                <Form.Group controlId="overlapThreshold" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.qukeys.overlapThreshold}
                    <a href="https://kaleidoscope.readthedocs.io/en/latest/plugins/Kaleidoscope-Qukeys.html#setoverlapthreshold-percentage">
                      {" - More info"}
                    </a>
                    <i className="greytext">
                      {i18n.keyboardSettings.qukeys.overlapThresholdsub}
                    </i>
                  </Form.Label>
                  {overlapT}
                </Form.Group>
              )}
            </Card.Body>
          </Card>
          <Card.Header>{i18n.keyboardSettings.superkeys.title}</Card.Header>
          <Card className="overflowFix">
            <Card.Body>
              {SuperTimeout >= 0 && (
                <Form.Group controlId="superTimeout" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.superkeys.timeout}
                    <i className="greytext">
                      {i18n.keyboardSettings.superkeys.timeoutsub}
                    </i>
                  </Form.Label>
                  {superT}
                </Form.Group>
              )}
              {SuperRepeat >= 0 && (
                <Form.Group controlId="superRepeat" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.superkeys.repeat}
                    <i className="greytext">
                      {i18n.keyboardSettings.superkeys.repeatsub}
                    </i>
                  </Form.Label>
                  {superR}
                </Form.Group>
              )}
              {SuperWaitfor >= 0 && (
                <Form.Group controlId="superWaitfor" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.superkeys.waitfor}
                    <i className="greytext">
                      {i18n.keyboardSettings.superkeys.waitforsub}
                    </i>
                  </Form.Label>
                  {superW}
                </Form.Group>
              )}
              {SuperHoldstart >= 0 && (
                <Form.Group controlId="superHoldstart" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.superkeys.holdstart}
                    <i className="greytext">
                      {i18n.keyboardSettings.superkeys.holdstartsub}
                    </i>
                  </Form.Label>
                  {superH}
                </Form.Group>
              )}
              {/* {SuperOverlapThreshold >= 0 && (
                <Form.Group
                  controlId="SuperOverlapThreshold"
                  className="formGroup"
                >
                  <Form.Label>
                    {i18n.keyboardSettings.superkeys.overlap}
                    <i className="greytext">
                      {i18n.keyboardSettings.superkeys.overlapsub}
                    </i>
                  </Form.Label>
                  {SuperO}
                </Form.Group>
              )} */}
            </Card.Body>
          </Card>
          <Card.Header>{i18n.keyboardSettings.mouse.title}</Card.Header>
          <Card className="overflowFix">
            <Card.Body>
              <h4>{i18n.keyboardSettings.mouse.subtitle1}</h4>
              {mouseSpeed >= 0 && (
                <Form.Group controlId="mouseSpeed" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.speed}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.speedsub}
                    </i>
                  </Form.Label>
                  {mSpeed}
                </Form.Group>
              )}
              {mouseSpeedDelay >= 0 && (
                <Form.Group controlId="mouseSpeedD" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.speedDelay}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.speedDelaysub}
                    </i>
                  </Form.Label>
                  {mSpeedD}
                </Form.Group>
              )}
              {mouseSpeedLimit >= 0 && (
                <Form.Group controlId="mouseSpeedL" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.speedLimit}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.speedLimitsub}
                    </i>
                  </Form.Label>
                  {mSpeedL}
                </Form.Group>
              )}
              <Dropdown.Divider />
              <h4>{i18n.keyboardSettings.mouse.subtitle2}</h4>
              {mouseAccelSpeed >= 0 && (
                <Form.Group controlId="mousemAccelS" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.accelSpeed}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.accelSpeedsub}
                    </i>
                  </Form.Label>
                  {mAccelS}
                </Form.Group>
              )}
              {mouseAccelDelay >= 0 && (
                <Form.Group controlId="mousemAccelD" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.accelDelay}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.accelDelaysub}
                    </i>
                  </Form.Label>
                  {maccelD}
                </Form.Group>
              )}
              <Dropdown.Divider />
              <h4>{i18n.keyboardSettings.mouse.subtitle3}</h4>
              {mouseWheelSpeed >= 0 && (
                <Form.Group controlId="mousemWheelS" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.wheelSpeed}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.wheelSpeedsub}
                    </i>
                  </Form.Label>
                  {mWheelS}
                </Form.Group>
              )}
              {mouseWheelDelay >= 0 && (
                <Form.Group controlId="mousemWheelD" className="formGroup">
                  <Form.Label>
                    {i18n.keyboardSettings.mouse.wheelDelay}
                    <i className="greytext">
                      {i18n.keyboardSettings.mouse.wheelDelaysub}
                    </i>
                  </Form.Label>
                  {mWheelD}
                </Form.Group>
              )}
            </Card.Body>
          </Card>
        </Form>
        <SaveChangesButton
          onClick={this.saveKeymapChanges}
          disabled={!modified}
        >
          {i18n.components.save.saveChanges}
        </SaveChangesButton>
      </Styles>
    );
  }
}

class AdvancedKeyboardSettings extends React.Component {
  state = {
    EEPROMClearConfirmationOpen: false
  };

  clearEEPROM = async () => {
    const focus = new Focus();

    await this.setState({ working: true });
    this.closeEEPROMClearConfirmation();

    let eeprom = await focus.command("eeprom.contents");
    eeprom = eeprom
      .split(" ")
      .filter(v => v.length > 0)
      .map(() => 255)
      .join(" ");
    await focus.command("eeprom.contents", eeprom);
    this.setState({ working: false });
  };
  openEEPROMClearConfirmation = () => {
    this.setState({ EEPROMClearConfirmationOpen: true });
  };
  closeEEPROMClearConfirmation = () => {
    this.setState({ EEPROMClearConfirmationOpen: false });
  };

  render() {
    return (
      <Styles>
        {this.state.working && <Spinner variant="query" />}
        <Card.Header>{i18n.keyboardSettings.advancedOps}</Card.Header>
        <Card>
          <Card.Footer>
            <Button
              disabled={this.state.working}
              variant="contained"
              color="secondary"
              onClick={this.openEEPROMClearConfirmation}
            >
              {i18n.keyboardSettings.resetEEPROM.button}
            </Button>
          </Card.Footer>
        </Card>
        <ConfirmationDialog
          title={i18n.keyboardSettings.resetEEPROM.dialogTitle}
          open={this.state.EEPROMClearConfirmationOpen}
          onConfirm={this.clearEEPROM}
          onCancel={this.closeEEPROMClearConfirmation}
        >
          {i18n.keyboardSettings.resetEEPROM.dialogContents}
        </ConfirmationDialog>
      </Styles>
    );
  }
}

export { KeyboardSettings, AdvancedKeyboardSettings };
