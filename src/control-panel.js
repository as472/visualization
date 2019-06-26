import React, {PureComponent} from 'react';
const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {

  constructor(props) {
    super(props)
    this.textt = React.createRef();
  }

render() {
    const Container = this.props.containerComponent || defaultContainer;
    
   

    return (
      <Container>
        <div>
        <h3 className="hero"> Vehicle Visualization</h3>
        <input className="form" type="text" placeholder="Enter Bus Number" ref={this.textt}></input>
        <input className="submit" type="submit" value="Submit" onClick={(e)=>{this.props.onn(27.12,77.033945,this.textt.current.value)}}></input>
        <hr className="tiktok"></hr>
        {/* <h4 className="driver"> Driver Name: Mr. XYZ</h4> */}
        {/* <h4 className="vehicle"> Vehicle Number:</h4> */}
        
        {(this.props.propp.expandedObjects!=null && <div className="busdetails">{[<h4>Driver Name: Mr. XYZ</h4>,<h4>Vehicle Number: {this.props.propp.expandedObjects[0].vehicle_number}</h4>,<h4>Latitude: {this.props.propp.expandedObjects[0].latitude}</h4>,<h4>Longitude: {this.props.propp.expandedObjects[0].longitude}</h4>]}</div>)}
        {/* {(this.props.propp.expandedObjects!=null && <h4 className="busdetails">{this.props.propp.expandedObjects[0].vehicle_number}</h4>)} */}
        </div>
        
        
      </Container>
    );
  }
}