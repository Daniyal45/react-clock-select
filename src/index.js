import React from "react";
import ReactDOM from "react-dom";
import Test from './tests/test';

class Main extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       time: new Date()
    }
  }
  
  componentDidMount(){
    // this.clockTimer();
  }

  clockTimer = () => {
    setInterval(()=>{
      this.setState({time: new Date()})
    },1000)
  }

  render() {
    return (
      <div>
         <Test />
      </div>
    )
  }
}


ReactDOM.render(<Main />, document.getElementById("root"));
