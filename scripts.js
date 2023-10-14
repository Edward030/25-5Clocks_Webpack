//import React from 'react';
//import React, {Component} from 'react';
//You should use a frontend framework (like React for example) 

//Note: Autoplay functionality may not work inside the codepen but it will work if you save the code as html and open it 
playMusic = () => {
    const audio = document.getElementById("beep");
    //console.log(value, Number.isInteger(parseInt(value)));
      audio.play();
      const t = setTimeout(() => audio.load(), 5000); 
  /*
      audio.pause();
      audio.load();
    */
  }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      times: {
        break : 5,
        session : 25,
        time : 1500 //可以省略sec，想想看不搞time能不能寫出來
      },
      type : "session",
      isRunning : false
      //time1 : this.state.times[this.state.type]
    };
    this.handleBreaktime = this.handleBreaktime.bind(this);
    this.handleSessiontime = this.handleSessiontime.bind(this);
    this.timer = this.timer.bind(this);
  }
  
  handleBreaktime(ButtonValue) {
    //console.log("ButtonValue: ", ButtonValue);
    const {times, type, isRunning} = this.state;
    //console.log((times.break + ButtonValue) > -1, times.break + parseInt(ButtonValue)); type problem
    // must add ButtonValue to control the correct result
    if(!isRunning && times.break + parseInt(ButtonValue) > 0 && times.break + parseInt(ButtonValue) < 61) {
      this.setState({
      times: {
        ...this.state.times,
        break : times.break + parseInt(ButtonValue),
        time : type === "break" ? times.time + parseInt(ButtonValue)*60 : times.time
      }
    });
    }
  }
  
  handleSessiontime(ButtonValue) {
    const {times, type, isRunning} = this.state;
    //console.log(isRunning);
    if(!isRunning && times.session + parseInt(ButtonValue) > 0 && times.session + parseInt(ButtonValue) < 61) {
    this.setState({
      times : {
        ...this.state.times,
        session: times.session + parseInt(ButtonValue),
        time : type === "session" ? times.time + parseInt(ButtonValue)*60 : times.time
      } 
    });
    }
  }
  
  timer(value) {
    const {times, type, isRunning} = this.state;
    if (value === 1 && !isRunning) {
      //time start
      this.setState({isRunning : true});
      //console.log(isRunning); setState is Asynchronous
      this.t = setInterval(this.tick, 1000);
    }
    else if (value === 1 && isRunning) {
      //time stop
      this.setState({isRunning : false});
      clearInterval(this.t);
    }
    else if (value === -1) {
      //time reset
      clearInterval(this.t);
      this.setState({
        times: {
          break : 5,
          session : 25,
          time : 1500
        },
        type: "session",
        isRunning : false
      })
    }
  }
  //在進行tick之前，就要把time設定好
  tick = () => {
    const {times, type} = this.state;
    
    if (times.time === 0) {
      //現在有個問題是倒數時候會改變session值?
      //when time is up, time keep going by breaktime, and ring for 3 secs. 
      playMusic();
      const newtype = type === "session" ? "break" : "session";
      //console.log("1. type: ", type, newtype, newtype, times[newtype]);
      this.setState({
        type : newtype,
        //can't set here because time still 0 
      })
      //setTimeout can make this, actual time: 0 -1(instant) 5:00 
      setTimeout(() =>{
        this.setState({
          times: { 
            ...this.state.times,
            time : times[newtype] * 60
          }
        })
         //console.log("6. type: ", type, newtype, times[newtype]);
      }, 0); 
      //console.log("2. type: ", type, newtype, times[newtype]);
    }  
      //console.log("3. type: ", type, "times[time]: ",times.time);
      this.setState({
        times: {
          ...this.state.times,
        //problem is here, time still 0, my way is after that change as break time
          time : times.time - 1 
        }
      })
      //console.log("5. type: ", type);
  }
  
  render() {
    const {times, type, isRunning} = this.state;
    //console.log("4. type: ", type);
    return (
      <div id="panel">
        <div id="title">25 + 5 Clock</div>

        <div id="combined-panel">
          <div id="break-panel">
            <div id="break-label">Break Length</div>
            <div id="break-decrement">
              <Ibutton 
                className="fa-solid fa-arrow-down" 
                value="-1"  
                timeChange={this.handleBreaktime}
                /></div>
            <div id="break-length" value={times.break}>{times.break}</div>
            <div id="break-increment">
              <Ibutton 
                className="fa-solid fa-arrow-up" 
                value="1"
                timeChange={this.handleBreaktime}
                /></div>
          </div>

          <div id="session-panel">
            <div id="session-label">Session Length</div>
            <div id="session-decrement">
              <Ibutton 
                className="fa-solid fa-arrow-down" 
                value="-1" 
                timeChange={this.handleSessiontime}
                /></div>
            <div id="session-length" value={times.session}>{times.session}</div>
            <div id="session-increment">
              <Ibutton 
                className="fa-solid fa-arrow-up" 
                value="1"
                timeChange={this.handleSessiontime}
                /></div>
            </div>
         </div>

        {/*<TimerPanel value={this.state.session_mins} playValue={this.state.play_value}/> */}
        <div id="timer-panel">
          <div id="timer-label">{type === "session" ? "Session" : "Break"}</div>
          <div 
            id="time-left" 
            value={`${String(Math.floor(times.time/60)).padStart(2, "0")}:${String(times.time%60).padStart(2, "0")}`}>{String(Math.floor(times.time/60)).padStart(2, "0")}:{String(times.time%60).padStart(2, "0")}</div>
        </div>

        <div id="play-panel">
          <div 
            id="start_stop"
            onClick={() => this.timer(1)}>
            <i className="fa-regular fa-circle-play"/>
            <i className="fa-regular fa-circle-pause"/>
          </div> 
          <div id="reset">
            <i 
              className="fa-solid fa-clock-rotate-left"
              onClick={() => this.timer(-1)}
              /></div>      
          <audio id="beep" src="https://audio.jukehost.co.uk/hyDuDWJRJaBOUv6n604wVmsfQEivCHme.mp3" type="audio" >
          </audio>
        </div>
    </div>
    );
  }
}

//time setting, 4, 
class Ibutton extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  
  handleButtonClick() {
    //((prevState) => {return ();}) or ({})
    //console.log(this.props.disable);
    this.props.timeChange(this.props.value);
  }
 
  render() {
    //console.log(this.props.disable);
    return (
      <i
        className={this.props.className}
        value={this.props.value}
        onClick={this.handleButtonClick}
        /*disabled={this.props.disable} lack of disable mehtod*/
      />
    );
  }
  
}

ReactDOM.render(
  <React.StrictMode>
  <App/>
  </React.StrictMode>
  , document.getElementById("app"));