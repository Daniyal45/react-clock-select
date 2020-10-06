/*******
 Description:
    Analog Time Component.
    Creates Analog Clock OR Analog Time Selection with time inputs
 Programmed by: 
    Adnan ALi, Daniyal Hasan Shah
 Date:
    17/09/2020   
 *******/

import React, { Component } from 'react';
import './AnalogTime.css';

// Callback declaration for `onConfirm` prop
let onConfirm = () => { return; }


export default class AnalogTime extends Component {
    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
             size: 1,
             type: "picker",
             show_picker: false,
             hoursFormat: 12,
             hoursInDegree: 0,
             minutesInDegree: 270,
             secondsInDegree: 270,
             hours: date.getHours() % 12,
             minutes: date.getMinutes(),
             seconds: date.getSeconds(),    
             am_pm: "AM",         
             selectorPosition : "rcs-show-picker-bottom",             
             baseColor: "black",
             hourHandColor: "black",
             minuteHandColor: "black",
             secondHandColor: "#e62e2d",
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
        let size = this.props.size === undefined || new RegExp("[^0-9.]").test(this.props.size)? 
                1 
            : 
                Number(this.props.size)<=0?
                    1
                :
                    Number(this.props.size);
        let input_time_value = this.props.value === undefined ? hoursFormat === 12 ? "12:00:00" : "00:00:00" : this.props.value;
        let value = this.getValue(input_time_value,hoursFormat);
        let baseColor = this.props.baseColor === undefined ? "black" : this.props.baseColor;
        let hourHandColor = this.props.hourHandColor === undefined ? "black" : this.props.hourHandColor;
        let minuteHandColor = this.props.minuteHandColor === undefined ? "black" : this.props.minuteHandColor;
        let secondHandColor = this.props.secondHandColor === undefined ? "#e62e2d" : this.props.secondHandColor;
        onConfirm = this.props.onConfirm === undefined ? onConfirm : this.props.onConfirm;

        this.setState({
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds,
            am_pm: value.am_pm,
            hoursFormat: hoursFormat,
            selectorPosition: selectorPosition,
            type: type,
            size: size,
            baseColor: baseColor,
            hourHandColor: hourHandColor,
            minuteHandColor: minuteHandColor,
            secondHandColor: secondHandColor
        },()=>{
            this.manualUpdater();
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
          } 
          else {
              value = hoursFormat === 12 ? tempTime.toLocaleTimeString('en-US') : tempTime.toLocaleTimeString('it-IT');
              // converts 24 hours to 12 hours or vice versa
              let minutes = tempTime.getMinutes();
              let seconds = tempTime.getSeconds();
              let hours =
                hoursFormat === 12? 
                    tempTime.getHours() > 12 || tempTime.getHours() === 0? 
                        Math.abs(12 - tempTime.getHours())
                    : 
                        tempTime.getHours()
                  : 
                    tempTime.getHours();
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
          }
          else {
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
            console.warn("Invalid time string provided to 'value' prop");
        }
      }
      return value;
    }

    /* Rotates clock hands when input value changes */
    manualUpdater = () => {
        let hourOffset = this.state.minutes > 30 ?
            (this.state.minutes % 30) * 1
            : 0;
        let hoursInDegree = (((30 * (this.state.hours % 12)) + hourOffset) % 360);
        let minutesInDegree = ((270 + (6 * this.state.minutes)) % 360);
        let secondsInDegree = ((270 + (6 * this.state.seconds)) % 360);
        this.setState({ hoursInDegree, minutesInDegree, secondsInDegree });
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
                    this.setState({hours:e.target.value},()=>{this.manualUpdater();});
                } 
            }
            else if(e.target.name==="rcs-time-minutes"){
                e.target.value = Number(e.target.value)<0?0:e.target.value;
                if(onlyNumbers.test(e.target.value)){
                    e.target.value = Number(e.target.value)>59?59:e.target.value;
                    this.setState({minutes:e.target.value},()=>{this.manualUpdater();});
                } 
            }
            else if(e.target.name==="rcs-time-seconds"){
                e.target.value = Number(e.target.value)<0?0:e.target.value;
                if(onlyNumbers.test(e.target.value)){
                    e.target.value = Number(e.target.value)>59?59:e.target.value;
                    this.setState({seconds:e.target.value},()=>{this.manualUpdater();});
                } 
            }
            else{
                let am_pm = this.state.am_pm==="PM"? "AM" :"PM"
                this.setState({
                    am_pm: am_pm,
                    editHours: false,
                    editMinutes: false,
                    editSeconds: false,
                },()=>{this.manualUpdater();});
            }
        } 
    }

    /*Detects Up/Down key or Enter key on keyboard*/
    _handleStepChange = (e) => {
        if(e.keyCode === 38){ // When Up Key is pressed
            e.target.value = Number(e.target.value) + 1;
            this._handleTimeChange(e);
        }
        if(e.keyCode === 40){ // When Down Key is pressed
            e.target.value = Number(e.target.value) - 1;
            this._handleTimeChange(e);
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
            this.setState({[state]: empty_input_default});
            return;
        }
        if(this.state[state].length < 2){
            this.setState({[state]:"0" + this.state[state]});
            return;
        }
    }

    /*Show picker on time input field click*/
    _showAnalogPicker = () =>{        
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
            (this.state.am_pm === undefined ? "" : 
            " " +
            this.state.am_pm),
          hours: this.state.hours,
          minutes: this.state.minutes,
          seconds: this.state.seconds,
          am_pm: this.state.am_pm,
        });
        this._closeAnalogPicker();
    }

    /*Hide picker on time input field when ok clicked*/
    _closeAnalogPicker = () =>{
        this.setState({
            show_picker: false,
            editHours: false,
            editMinutes: false,
            editSeconds: false,
        });
    }
    
    /*Renders Clock only*/
    AnalogTimeDisplay = () => {
        return(            
            <div style={{ height: (this.state.size * 100) + "px" ,width:"unset"}} className="rcs-analog-clock-container">
                <i>
                     <svg style={{stroke: this.state.baseColor ,height: "calc(100px * "+ Number(this.state.size) +")"}} className="rcs-analog-clock-base rcs-analog-clock-base-custom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor" viewBox="0 0 254 254" > <defs> <path id="aUJAGqo4V" d="M235.25 189.53c-34.5 59.75-111.01 80.25-170.75 45.76-59.75-34.5-80.25-111.01-45.76-170.76C53.24 4.79 129.75-15.71 189.5 18.78c59.74 34.5 80.24 111.01 45.75 170.75z" ></path> <path id="d1FLjEz5Uu" d="M179.5 36.1l10-17.32"></path> <path id="c23V0rE8U" d="M65.04 234.34l10-17.32"></path> <path id="apoglLHVZ" d="M18.74 64.53l17.32 10"></path> <path id="a4URwC4Ix" d="M217.93 179.53l17.32 10"></path> <path id="aFTY2m6hr" d="M252 127c0 68.99-56.01 125-125 125C58.01 252 2 195.99 2 127 2 58.01 58.01 2 127 2c68.99 0 125 56.01 125 125z" ></path> <path id="amEykP3Ko" d="M127 27V2"></path> <path id="cM8Tg343h" d="M127 250.68v-25"></path> <path id="ej4tpkak9" d="M217.97 74.5l17.32-10"></path> <path id="b8XWuDDej" d="M19.73 188.95l17.32-10"></path> <path id="b34kukprTz" d="M64.53 18.74l10 17.32"></path> <path id="b2rU9F3Sfe" d="M179.53 217.93l10 17.32"></path> <path id="c3tOtCEwM9" d="M3.39 127.03h25"></path> <path id="b5O3YYA5CE" d="M226.63 127.03h25"></path> </defs> <use  fillOpacity="0" xlinkHref="#aUJAGqo4V"></use> <use fillOpacity="0" strokeWidth="2" xlinkHref="#aUJAGqo4V" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#d1FLjEz5Uu" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#c23V0rE8U" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#apoglLHVZ" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#a4URwC4Ix" ></use> <use  fillOpacity="0" xlinkHref="#aFTY2m6hr"></use> <use fillOpacity="0" strokeWidth="2" xlinkHref="#aFTY2m6hr" ></use> <use fillOpacity="0" strokeWidth="5" xlinkHref="#amEykP3Ko" ></use> <use fillOpacity="0" strokeWidth="5" xlinkHref="#cM8Tg343h" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#ej4tpkak9" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#b8XWuDDej" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#b34kukprTz" ></use> <use fillOpacity="0" strokeWidth="3" opacity="0.6" xlinkHref="#b2rU9F3Sfe" ></use> <g> <use fillOpacity="0" strokeWidth="5" xlinkHref="#c3tOtCEwM9" ></use> </g> <g> <use fillOpacity="0" strokeWidth="5" xlinkHref="#b5O3YYA5CE" ></use> </g> </svg>
                </i>
                <div 
                    style={{
                        width: "calc(2px * "+ Number(this.state.size) +")",
                        height: "calc(2px * "+ Number(this.state.size) +")",
                        border: "calc(0.8px * "+ Number(this.state.size) +") solid "+ this.state.secondHandColor
                    }}
                    className="rcs-analog-clock-center-pin"
                />
                <div
                    style={{transform: "translate(-50%, -50%) rotate("+ this.state.hoursInDegree +"deg)"}} 
                    className="rcs-analog-clock-hour-hand-container"
                >
                    <i>
                        <svg 
                            style={{
                                stroke: this.state.hourHandColor,
                                fill: this.state.hourHandColor,
                                width: "calc(6.172px * "+ Number(this.state.size) +")",
                                height: "calc(38px *  "+ Number(this.state.size) +")",
                                transform: "translate(-46%, calc(-50% - " + Number(( (9 * (this.state.size-1)) + 1 - 2 )) + "px))",
                            }} 
                            className="rcs-analog-hour-hand rcs-analog-hour-hand-custom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="322.538 142.862 19.43 99" > <defs> <path id="alc3TrnAS" d="M330.81 143.86l8.16 80.97-7.64 14.03-.52-95z" ></path> <path id="a1gvFtO6G2" d="M330.81 143.86l-7.27 81.06 7.79 13.94-.52-95z" ></path> </defs> <use fillOpacity="0.94" xlinkHref="#alc3TrnAS"></use> <use fillOpacity="0" xlinkHref="#alc3TrnAS"></use> <g> <use xlinkHref="#a1gvFtO6G2"></use> <use fillOpacity="0" xlinkHref="#a1gvFtO6G2"></use> </g> </svg>                        
                    </i>
                </div>                  
                <div 
                    style={{transform: "translate(-50%, -50%) rotate("+ this.state.minutesInDegree +"deg)"}}
                    className="rcs-analog-clock-minute-hand-container"
                >
                    <i>
                        <svg
                            style={{
                                stroke: this.state.minuteHandColor,
                                fill: this.state.minuteHandColor,
                                height: "calc(44px * " + Number(this.state.size) + ")",
                                width: "calc(20px * " + Number(this.state.size) + ")"
                            }}
                            className="rcs-analog-minute-hand rcs-analog-minute-hand-custom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="283.438 117.862 13.437 124" > <defs> <path id="f2phZLu8cf" d="M288.89 118.86l4.98 102.28-4.67 17.72-.31-120z" ></path> <path id="b1N58A8qX" d="M288.89 118.86l-4.45 102.39 4.76 17.61-.31-120z" ></path> </defs> <use fillOpacity="0.94" xlinkHref="#f2phZLu8cf"></use> <use fillOpacity="0" xlinkHref="#f2phZLu8cf"></use> <g> <use xlinkHref="#b1N58A8qX"></use> <use fillOpacity="0" xlinkHref="#b1N58A8qX"></use> </g>
                        </svg>
                    </i>
                </div>
                <div 
                    style={{transform: "translate(-51%, -50%) rotate("+ this.state.secondsInDegree +"deg)"}} 
                    className="rcs-analog-clock-seconds-hand-container"
                >
                    <i>
                        <svg
                            style={{
                                stroke: this.state.secondHandColor,
                                fill: this.state.secondHandColor,
                                height: "calc(44px * " + Number(this.state.size) + ")",
                                width: "calc(32px * " + Number(this.state.size) + ")",
                                left: Number(52.4 + (59 * this.state.size)) + "%",
                                top: Number(51.4 + (1 * this.state.size)) + "%"
                            }}
                            className="rcs-analog-seconds-hand rcs-analog-seconds-hand-custom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="139.112 129.864 9.23 167.476" > <defs> <path id="daURQxthF" d="M142.73 281.36v-150"></path> <path id="b3GLYiKlNF" d="M140.11 268.41l5.13-.02.1 25.93-5.12.02-.11-25.93z" ></path> </defs> <use fillOpacity="0" strokeWidth="3" xlinkHref="#daURQxthF" ></use> <use xlinkHref="#b3GLYiKlNF"></use> <use fillOpacity="0" strokeWidth="2" xlinkHref="#b3GLYiKlNF" ></use>
                        </svg>
                    </i>
                </div>                                                            
            </div>
        )
    }

    /*Renders time changing fields for hrs, mins & secnds*/
    AnalogTimePickerInput = () =>{
        return(
                <div className="rcs-analog-time-picker-form-container rcs-analog-time-picker-form-container-custom">                   
                    <div 
                        className={this.state.size <= 1.5 ?
                            "rcs-analog-time-input-field-parent rcs-analog-time-input-field-parent-custom no-selector"
                            :
                            "rcs-analog-time-input-field-parent rcs-analog-time-input-field-parent-custom "
                        }                     
                    >
                        <input
                            name="rcs-time-hours"                            
                            maxLength={2}
                            className="rcs-analog-time-input-field rcs-analog-time-input-field-custom" 
                            value={this.state.hours}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "hours")}
                        />
                        <input
                            name="rcs-time-minutes"                            
                            maxLength={2}
                            className="rcs-analog-time-input-field rcs-analog-time-input-field-custom"                       
                            value={this.state.minutes}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "minutes")}
                        />                                        
                        <input
                            name="rcs-time-seconds"                            
                            maxLength={2}
                            className="rcs-analog-time-input-field rcs-analog-time-input-field-custom"                         
                            value={this.state.seconds}
                            onFocus={e=>e.target.select()}
                            onKeyDown={this._handleStepChange.bind(this)}
                            onChange={this._handleTimeChange.bind(this)}
                            onBlur={this._validation.bind(this, "seconds")}
                        />
                        {Number(this.state.hoursFormat) === 12 ?                           
                            <span
                                onClick={this._handleTimeChange.bind(this)}
                                className={this.state.type === "picker" ?
                                    "rcs-analog-am-pm-toggle rcs-analog-am-pm-toggle-custom noselect"
                                    :                                
                                    ""
                                }
                            >
                                {this.state.am_pm}
                            </span>
                            : ''
                        }
                    </div>
                    <button
                        className="rcs-analog-time-picker-btn rcs-analog-time-picker-btn-custom" 
                        onClick={(e)=>{this._confirmTimeChange(e);}}
                    >
                        Ok
                    </button>   
                </div>
        )
    }
   
    /*Renders time picker container with both clock & time change inputs*/
    AnalogTimePicker = () =>{
        let selectorPosition = this.state.selectorPosition;     
        return(
            <div
                className={"rcs-analog-picker "+ selectorPosition +" rcs-analog-picker-custom"}
                style={{
                    width: "calc(100px * "+ Number(this.state.size) +")",
                }}
            >
                {this.AnalogTimeDisplay()}
                {this.AnalogTimePickerInput()}
            </div>
        );
    }

    /*Renders time input field, onClick will enable analog picker*/
    AnalogTimeInputField = () =>{           
        let time = this.state.hours + ":" + this.state.minutes + ":" + this.state.seconds
        if(this.state.hoursFormat === 12){
            time += " " + this.state.am_pm ;
        }
        return(
            <div className="rcs-analog-picker-field-parent">
                <input
                    type="text"  
                    placeholder="Time"
                    value={time}                 
                    className="rcs-analog-picker-input-custom" 
                    onChange={(e) => { e.preventDefault(); return; }}                    
                    onClick={this._showAnalogPicker.bind(this)}
                />
                {this.state.show_picker?
                    this.AnalogTimePicker()
                :
                    ''
                }
            </div>
        )
    }

    /*Renders clock only OR with time picker*/
    ShowComponent = () =>{
        return (
            <div>
                {this.state.type === "picker"?
                    this.AnalogTimeInputField()
                    :
                    this.AnalogTimeDisplay()
                }                 
            </div>
        )
    }    

    render(){
        return(
            <>                
                {this.ShowComponent()}
            </>
        )
    }
}
