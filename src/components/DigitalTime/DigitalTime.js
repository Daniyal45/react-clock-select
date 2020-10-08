/*******
 Description:
    Digital Time Component.
    Creates Digital Clock OR Digital Time Selection with time inputs
 Programmed by: 
    Adnan ALi, Daniyal Hasan Shah
 Date:
    14/09/2020   
 *******/


import React, { Component } from 'react'
import './DigitalTime.css';

// Callback declaration for `onConfirm` prop
let onConfirm = () => { return; }


export default class DigitalTime extends Component {
    constructor(props) {
        super(props)    
        this.state = {
            size: 1,
            type: "picker",
            show_picker: false,
            hoursFormat: 12,
            hours: '12',
            minutes: '00',
            seconds: '00',
            am_pm: "AM",
            editHours: false,
            editMinutes: false,
            editSeconds: false,
            selectorPosition: "rcs-show-picker-bottom",
            color: "rgba(24, 24, 24, 0.671)",
            useValue: false 
        }
    }

    componentDidMount = () => {
		this.getProps();
	}

	componentDidUpdate = (prevProps) => {
		if (prevProps !== this.props) {
			this.getProps();
		}
	}

    /*Get props & set into component's state*/
	getProps = () => {
        let hoursFormat = Number(this.props.hoursFormat) === 12 || this.props.hoursFormat === undefined ? 12 : 24;
        let selectorPosition = this.props.selectorPosition === undefined || this.props.selectorPosition.trim()==='' ? "rcs-show-picker-bottom" : "rcs-show-picker-" + this.props.selectorPosition.toLocaleLowerCase()
        let type = this.props.type === undefined ? "picker" : this.props.type.toLocaleLowerCase()
        let color = this.props.color === undefined ? "rgba(24, 24, 24, 0.671)" : this.props.color;
        let useValue = (this.props.value !== "" && this.props.value !== undefined)  
        onConfirm = this.props.onConfirm === undefined ? onConfirm : this.props.onConfirm;
        let size = this.props.size === undefined || new RegExp("[^0-9.]").test(this.props.size)? 
            1 
        : 
            Number(this.props.size)<=0?
                1
            :
                Number(this.props.size);
        let value = this.getValue(
            this.props.value === undefined ? hoursFormat === 12 ? "12:00:00" : "00:00:00" : this.props.value,
            hoursFormat
        );

        this.setState({
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds,
            am_pm: value.am_pm,
            hoursFormat: hoursFormat,
            selectorPosition: selectorPosition,
            type: type,
            color: color,
            size: size,
            placeholder: this.props.placeholder,
            useValue: useValue
        })
    }
    
    /* Converts value from `value` prop to valid time */
    getValue = (value, hoursFormat) => {
      let timeProp = value;
      /* if user passes a date STRING in `value` prop*/
      if (typeof timeProp === "string") {
        let tempTime;
        try {
          tempTime = new Date("01/01/2000 " + timeProp);
          if (isNaN(tempTime.getMonth())) {
            throw new Error("error");
          } else {
              value = hoursFormat === 12 ? tempTime.toLocaleTimeString('en-US') : tempTime.toLocaleTimeString('it-IT');
              // converts 24 hours to 12 hours or vice versa
              let hours =
                hoursFormat === 12
                  ? tempTime.getHours() > 12 || tempTime.getHours() === 0
                    ? Math.abs(12 - tempTime.getHours())
                    : tempTime.getHours()
                  : tempTime.getHours();
              let minutes = tempTime.getMinutes();
              let seconds = tempTime.getSeconds();
              let am_pm = hoursFormat === 12 ? tempTime.getHours() >= 12 ? "PM" : "AM" : undefined
              value = {
                  hours: hours < 10 ? "0" + hours : hours,
                  minutes: minutes < 10 ? "0" + minutes : minutes,
                  seconds: seconds < 10 ? "0" + seconds : seconds,
                  am_pm: am_pm
              }
          } 
        } catch (err) {
          value = {
            hours:  hoursFormat === 12 ? "12" : "00",
            minutes: "00",
            seconds: "00",
            am_pm: hoursFormat === 12 ? "AM" : undefined 
          };
          console.warn("Invalid Time String provided to 'value' prop");
        }
      } else {
      /* if user passes a date OBJECT in `value` prop*/
      try{
        if (isNaN(timeProp.getMonth())) {
            throw new Error("error");
          } else {
              value = hoursFormat === 12 ? timeProp.toLocaleTimeString('en-US') : timeProp.toLocaleTimeString('it-IT');
              // converts 24 hours to 12 hours or vice versa
              let hours =
                hoursFormat === 12
                  ? timeProp.getHours() > 12 || timeProp.getHours() === 0
                    ? Math.abs(12 - timeProp.getHours())
                    : timeProp.getHours()
                  : timeProp.getHours();
              let minutes = timeProp.getMinutes();
              let seconds = timeProp.getSeconds();
              let am_pm = hoursFormat === 12 ? timeProp.getHours() >= 12 ? "PM" : "AM" : undefined
              value = {
                hours: hours < 10 ? "0" + hours : hours,
                minutes: minutes < 10 ? "0" + minutes : minutes,
                seconds: seconds < 10 ? "0" + seconds : seconds,
                am_pm: am_pm
              }
          } 
        } catch (err) {
            value = {
                hours: hoursFormat === 12 ? "12" : "00",
                minutes: "00",
                seconds: "00",
                am_pm: hoursFormat === 12 ? "AM" : undefined
            };
            console.warn("Invalid Time String provided to 'value' prop");
        }
      }
      return value;
    }

    _handleTimeChange = (e) => {        
        if(this.state.type === "picker"){
            let onlyNumbers = /^[\d]*$/;
            if(e.target.name==="rcs-time-hours"){
                e.target.value = Number(e.target.value)<0?0:e.target.value;
                if(onlyNumbers.test(e.target.value)){
                    if (this.state.hoursFormat === 12) {
                        e.target.value =
                            Number(e.target.value) < 1
                            && e.target.value.trim() !== "" ?  1
                            :
                            e.target.value;
                        e.target.value = Number(e.target.value)>12?12:e.target.value;
                    } else {
                        e.target.value = Number(e.target.value)>23?23:e.target.value;
                    }
                    
                    this.setState({hours:e.target.value});
                } 
            }
            else if(e.target.name==="rcs-time-minutes"){
                e.target.value = Number(e.target.value)<0?0:e.target.value;
                if(onlyNumbers.test(e.target.value)){
                    e.target.value = Number(e.target.value)>59?59:e.target.value;
                    this.setState({minutes:e.target.value});
                } 
            }
            else if(e.target.name==="rcs-time-seconds"){
                e.target.value = Number(e.target.value)<0?0:e.target.value;
                if(onlyNumbers.test(e.target.value)){
                    e.target.value = Number(e.target.value)>59?59:e.target.value;
                    this.setState({seconds:e.target.value});
                } 
            }
            else{
                let am_pm = this.state.am_pm==="PM"? "AM" :"PM"
                this.setState({
                    am_pm: am_pm,
                    editHours: false,
                    editMinutes: false,
                    editSeconds: false,
                });
            }
        } 
    }

    /*Detects Up/Down key or Enter key on keyboard*/
    _handleStepChange = (e) => {
        if(e.keyCode === 38){ // When Up Key is pressed
            e.target.value = Number(e.target.value) + 1
            this._handleTimeChange(e)
        }
        if(e.keyCode === 40){ // When Down Key is pressed
            e.target.value = Number(e.target.value) - 1
            this._handleTimeChange(e)
        }
        if(e.keyCode === 13){ // When Enter is pressed
            this._confirmTimeChange(e);
            e.target.blur();
        }
    }    

    /* Appends 0 to hours if hour is `1-9` or if left empty then `00` or `12` */
    _validation = (state) => {
        let empty_input_default = this.state.hoursFormat ===12? "12":"00";
        if(this.state[state] === ""){
            this.setState({[state]:empty_input_default});
            return;
        }
        if(this.state[state].length < 2){
            this.setState({[state]:"0" + this.state[state]});
            return;
        }
    }
 
    /*Show picker on time input field click*/
    _showDigitalPicker = () => {        
        this.setState({show_picker :true});
    } 
    
    /*Function called on ok button*/ 
    _confirmTimeChange = (e) =>{
        onConfirm(e,{
          time_string:
            this.state.hours +
            ":" +
            this.state.minutes +
            ":" +
            this.state.seconds +
            " " +
            (this.state.am_pm === undefined ? "" : 
            " " +
            this.state.am_pm),
          hours: this.state.hours,
          minutes: this.state.minutes,
          seconds: this.state.seconds,
          am_pm: this.state.am_pm,
        });
        this._closeDigitalPicker();
        this.setState({ useValue: true });    
    }

    /*Hide picker on time input field when ok clicked*/
    _closeDigitalPicker = () =>{
        this.setState({
            show_picker: false,
            editHours: false,
            editMinutes: false,
            editSeconds: false,
        });
    }
    
    /* Changes hrs, min, secnds to editable fields onClick */
    _handleInputToggle = (state) =>{
        if (this.state.type === "picker") {
          this.setState({
            editHours: false,
            editMinutes: false,
            editSeconds: false,
          });
          this.setState({ [state]: true });
        }
    }

    /*Renders digital display, display is editable if `type` prop is `picker`*/ 
    DigitalSelection = () => {
        let style = {
            color: this.state.color,
            fontSize: 30 * this.state.size,
            width: 30 * this.state.size,
            height: 24 * this.state.size,
        }
        return (
            <div style={{ fontSize: 30 * this.state.size + "px" ,color: this.state.color}} className="noselect rcs-digital-picker rcs-digital-picker-custom">
                <div className="rcs-digital-picker-input-container">
                    {this.state.editHours && this.state.type==="picker"? 
                        <input
                            name="rcs-time-hours"
                            autoFocus
                            maxLength={2}
                            style={style}
                            className="digital-input-editable"                        
                            value={this.state.hours}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "hours")}
                        />
                        :
                        <span onClick={this._handleInputToggle.bind(this, "editHours")} >
                            {this.state.hours}
                        </span>
                    }
                    {':'}
                    {this.state.editMinutes && this.state.type==="picker"? 
                        <input
                            name="rcs-time-minutes"
                            autoFocus
                            maxLength={2}
                            style={style}
                            className="digital-input-editable"                        
                            value={this.state.minutes}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "minutes")}
                        />
                        :
                        <span onClick={this._handleInputToggle.bind(this, "editMinutes")} >
                            {this.state.minutes}
                        </span>
                    }
                    {':'}
                    {this.state.editSeconds && this.state.type==="picker"? 
                        <input
                            name="rcs-time-seconds"
                            autoFocus
                            maxLength={2}
                            style={style}
                            className="digital-input-editable"                        
                            value={this.state.seconds}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "seconds")}
                        />
                        :
                        <span onClick={this._handleInputToggle.bind(this, "editSeconds")} >
                            {this.state.seconds}
                        </span>
                    }
                         &nbsp;
                <span
                    className={this.state.type === "picker" ? "rcs-am-pm-toggle" : ""}
                    onClick={this._handleTimeChange.bind(this)}
                >
                    {this.state.am_pm}
                </span>
                </div>
                {this.state.type === "picker" ?
                    <div className="rcs-picker-button-container">
                        <button 
                            onClick={(e)=>{this._confirmTimeChange(e);}}
                            className="rcs-digital-time-picker-btn rcs-digital-time-picker-btn-custom"
                        > 
                            Ok
                        </button>
                    </div>
                :""}
            </div>
        )
    }

    /*Renders time input field, onClick will enable digital picker*/
    DigitalTimePicker = () => {
        let selectorPosition = this.state.selectorPosition;
        let time = this.state.hours + ":" + this.state.minutes + ":" + this.state.seconds
        if(this.state.hoursFormat === 12){
            time += " " + this.state.am_pm ;
        }
        time = this.state.useValue ? time : "";
        return(
            <div className="rcs-digital-picker-container">
                <input 
                    type="text"
                    placeholder={this.state.placeholder}
                    value={time}
                    className="rcs-digital-picker-input rcs-digital-picker-input-custom"                     
                    onChange={(e) => { e.preventDefault(); return; }}                    
                    onClick={this._showDigitalPicker.bind(this)}
                />
                <div 
                    className={"rcs-digital-parent rcs-digital-parent-custom " + selectorPosition}
                    style={this.state.show_picker ? { display: "block" } : { display: "none" }}                     
                >
                    {this.DigitalSelection()}
                </div>
            </div>
        )
    }    
    
    /*Renders Digital display only*/
    DigitalTimeDisplay(){
        let selectorPosition = this.state.selectorPosition;
        let className = this.state.type === "picker"? "rcs-digital-parent rcs-digital-parent-custom " + selectorPosition : "";
        return(
            <div className="rcs-digital-picker-container">
                <div 
                    className={className}
                >
                    {this.DigitalSelection()}
                </div>
            </div>
        )
    }
    
    /*Renders display only OR with time picker*/
    ShowComponent = () => {
        let component;
        if(this.state.type === "picker"){
            component = this.DigitalTimePicker();
        } else {
            component = this.DigitalTimeDisplay();
        }
        return component;
    }

    render() {
        return (
            <>
                {this.ShowComponent()}
            </>
        )
    }
}

