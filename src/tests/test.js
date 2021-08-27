import React , { useState, useEffect } from 'react'
import './test.css'
import { AnalogTime, DigitalTime } from '../components/ClockSelect/ClockSelect';
// import { AnalogTime, DigitalTime } from './../../dist/clock_select.esm';

var time_interval;

export default function Test() {
    const [ displayType, _displayType ] = useState("display");
    const [ selectorPosition, _selectorPosition ] = useState("bottom");
    const [format, _format] = useState(12);
    const [size, _size] = useState(1);
    const [clockType, _clockType] = useState("digital");
    const [timeValue, _timeValue] = useState("17:00:48"); 
    // const [timeValue, _timeValue] = useState("11:59:48"); 
    const [live, _live] = useState(false); 
 
    const onConfirm = (e,value,id) => {
        console.log("e",e)
        console.log("value",value)
        console.log("id",id)
    }
    
    return (    
        <div>
            <div className="test-action-buttons-style">
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
                <button
                    onClick={() => {
                        _live(!live)
                    }}
                >
                    Toggle Live Updater
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
                        // selectorPosition={selectorPosition}
                        hoursFormat={format}
                        // // value={timeValue}
                        // // value={""}
                        // // placeholder="hello"
                        size={size}
                        // // color={"crimson"}
                        liveUpdater={live}
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
                        liveUpdater={live}
                        onConfirm={(e,value)=>{ onConfirm(e,value,1)}}
                    />
                }
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
                        liveUpdater={live}
                        onConfirm={(e,value)=>{onConfirm(e,value,1)}}
                    />
                    :
                    <AnalogTime 
                        type={displayType}
                        selectorPosition={selectorPosition}
                        hoursFormat={format}
                        value={timeValue}
                        // value={""}
                        size={size}
                        // placeholder="hello"
                        // baseColor={"rgb(255,255,255)"}
                        // hourHandColor={"white"}
                        // minuteHandColor={"#FFFFFF"}
                        // secondHandColor={"#4d944e"}
                        liveUpdater={live}
                        onConfirm={(e,value)=>{onConfirm(e,value,1)}}
                    />
                }
            </div>    
        </div>
    )
}





                