import React, { Component } from 'react'
import QRCode from 'qrcode.react';

export default class ComponentToPrint extends Component {

    limitStr = (str, limit) => {
        str = str.toString()
        return str.substring(0, limit)
    }

    renderPrintDetail = () => {
        if (this.props.data && this.props.data.modelDetail) {
            return (
                <div className="row" >
                    <div className="col-8">
                        <label>ชื่อ Model : {this.props.data.modelDetail.model}</label><br></br>
                        <label>น้ำหนักที่ชั่งได้ : {this.props.data.weight} Kg</label><br></br>
                        <label>จำนวนงานที่ชั่งได้ : {(this.props.data.weight - this.props.data.modelDetail.weight_tray) / this.props.data.modelDetail.weight_per_product < 0 ? 0 : ((this.props.data.weight - this.props.data.modelDetail.weight_tray) / this.props.data.modelDetail.weight_per_product).toFixed(0)} ชิ้น</label>
                    </div>
                    <div className="col-4">
                        <QRCode size={100} value={this.props.data.modelDetail.model + '\t' + this.props.data.weight + '\t' + (this.props.data.weight - this.props.data.modelDetail.weight_tray) / this.props.data.modelDetail.weight_per_product < 0 ? 0 : ((this.props.data.weight - this.props.data.modelDetail.weight_tray) / this.props.data.modelDetail.weight_per_product).toFixed(0)} />
                    </div>

                </div>
            )
        }
    }

    render() {
        return (
            <div className="print-container" style={{
                margin: "0mm",
                padding: "1mm",
                width: "100mm",
                height: "50mm",
                fontSize: "5mm",
                lineHeight: "5mm"
            }}>
                {this.renderPrintDetail()}
            </div>
        );
    }
}
