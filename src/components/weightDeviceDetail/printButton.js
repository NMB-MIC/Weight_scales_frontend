import React, { Component } from 'react'
import ComponentToPrint from './componentToPrint'
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import './weightDeviceDetail.css'

export default class printButton extends Component {
    render() {
        return (
            <>
                <ReactToPrint content={() => this.componentRef}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <div onClick={handlePrint} className="card-header btn btn-primary btn-block">
                                <b>Print this out!</b>
                            </div>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>

                <div className="card-body">
                    <ComponentToPrint data={this.props.data} ref={el => (this.componentRef = el)} />
                </div>
            </>

        )
    }
}
