import React , { useState, useEffect } from 'react'
import './test.css'
import { AnalogTime, DigitalTime } from '../components/ClockSelect/ClockSelect';

var time_interval;

export default function Test() {
    const [ displayType, _displayType ] = useState("picker");
    const [ selectorPosition, _selectorPosition ] = useState("bottom");
    const [format, _format] = useState(12);
    const [size, _size] = useState(1);
    const [clockType, _clockType] = useState("digital");
    const [timeValue, _timeValue] = useState("17:00:48"); 
    const [timer, _timer] = useState(false); 
    const liveUpdater = () => {          
        if(timer) {               
            time_interval = setInterval(() => {
                let date = new Date();
                _timeValue(date);
            }, 1000);    
        }
        else{
            clearInterval(time_interval);
        }    
    }
 
    const onConfirm = (e,value,id) => {
        console.log("e",e)
        console.log("value",value)
        console.log("id",id)
    }

    useEffect(liveUpdater,[timer,format]);

    
    return (    
        <div>
            <div className="test-action-buttons-style">
            <button
                    onClick={() => { _timer(!timer) }}
                >
                    Toggle Timer
                </button>
                <button
                    onClick={() => {
                        displayType === "picker" ?
                            _displayType("display")
                            :
                            _displayType("picker")
                    }}
                >
                    Toggle Display Type
                </button>
                <button
                    onClick={() => {
                        clockType === "analog" ?
                            _clockType("digital")
                            :
                            _clockType("analog")
                    }}
                >
                    {clockType}
                </button>
                <button onClick={() => {
                    format === 12 ?
                        _format(24)
                        :
                        _format(12)
                }}>
                    Toggle {format} Hours
                </button>
                <button
                    onClick={() => {
                        _timeValue(document.getElementById("custom-time").value)
                    }}
                >
                    Change Time
                </button>
            </div>  
            <div className="test-action-buttons-style">
                <select onChange={(e) => { _selectorPosition(e.target.value) }}>
                    <option value="bottom"> Bottom </option>
                    <option value="top"> Top </option>
                    <option value="modal"> Modal </option>
                </select>
                <input id="custom-time" placeholder="set time " />
                <input 
                    id="custom-size"
                    placeholder="set size"
                    type="number"
                    onChange={(e)=>{
                        _size(e.target.value)
                    }}
                    value={size} 
                />
            </div>

            <div className="test-root">
                {clockType === "digital" ?
                    <DigitalTime 
                        type={displayType}
                        selectorPosition={selectorPosition}
                        hoursFormat={format}
                        value={timeValue}
                        // value={""}
                        // placeholder="hello"
                        size={size}
                        // color={"crimson"}
                        onConfirm={(e,value)=>{onConfirm(e,value,1)}}
                    />
                    :
                    <AnalogTime 
                        type={displayType}
                        selectorPosition={selectorPosition}
                        hoursFormat={format}
                        // value={timeValue}
                        // value={""}
                        size={size}
                        // placeholder="hello"
                        // baseColor={"rgb(255,255,255)"}
                        // hourHandColor={"white"}
                        // minuteHandColor={"#FFFFFF"}
                        // secondHandColor={"#4d944e"}
                        onConfirm={(e,value)=>{onConfirm(e,value,1)}}
                    />
                }
            </div>    
        </div>
    )
}





                