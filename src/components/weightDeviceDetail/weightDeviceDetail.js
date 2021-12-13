import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { OK, server, key } from '../../constants'
import { httpClient } from '../../utils/HttpClient'
import WeightGauge from '../weightGauge'
import QRCode from 'qrcode.react';
import './weightDeviceDetail.css'
import PrintButton from './printButton'

export default function WeightDeviceDetail(props) {
  const [device_id, setdevice_id] = useState(null)
  const [device_ip, setdevice_ip] = useState(null)
  const [device_name, setdevice_name] = useState('')
  const [device_detail, setdevice_detail] = useState('')
  const [running_model, setrunning_model] = useState('')

  const [modelList, setmodelList] = useState([])
  const [weight, setweight] = useState(0)
  const [modelDetail, setmodelDetail] = useState(null)

  const [decimalDigit, setdecimalDigit] = useState(4)

  useEffect(() => {
    doGetWeightScaleDeviceMaster(props.match.params.device_id)
    doGetModelList()
  }, [])

  const doGetModelList = async () => {
    const response = await httpClient.get(server.WEIGHT_MODELS_URL)
    if (response.data.api_result === OK) {
      setmodelList(response.data.result)
    }
  }

  const doGetWeightScaleDeviceMaster = async (_device_id) => {
    const response = await httpClient.get(server.FIND_WEIGHT_DEVICE_URL + '/' + _device_id)
    console.log(response.data);

    setdevice_id(_device_id)
    setdevice_ip(response.data.result.device_ip)
    setdevice_name(response.data.result.device_name)
    setdevice_detail(response.data.result.device_detail)
    setrunning_model(response.data.result.running_model)
    setmodelDetail(response.data.result.weightModelMaster)
  }

  const eventhandler = data => {
    setweight(data.toFixed(decimalDigit))
  }

  const doUpdateModel = async (value) => {
    setrunning_model(value)

    const response = await httpClient.put(server.WEIGHT_DEVICES_URL, { device_id, running_model: value, updater: localStorage.getItem(key.USER_NAME), })
    if (response.data.api_result !== OK) {
      Swal.fire(
        'Error!',
        'Update model failed!',
        'error'
      )
    } else {
      doGetWeightScaleDeviceMaster(props.match.params.device_id)
    }
  }

  const renderModelOption = () => {
    if (modelList.length > 0) {
      return modelList.map((item) => (
        <option value={item.model}>{item.model_name}</option>
      ))
    }
  }

  const renderWeightModeldetails = () => {
    if (modelDetail != null) {
      return (
        <div className="card card-primary card-outline">
          <div className="card-body box-profile">
            <div className="text-center">
              {device_ip != null ? <WeightGauge onChange={eventhandler} name={device_name} targetWeight={(modelDetail.target_product_count * modelDetail.weight_per_product) + modelDetail.weight_tray} ip={device_ip} /> : <></>}
            </div>
            {/* <h3 className="profile-username text-center">Nina Mcintire</h3> */}
            <p className="text-muted text-center">{device_detail}</p>
            <ul className="list-group list-group-unbordered mb-3">
              <li className="list-group-item">
                <b>Run model:</b>
                <select onChange={(e) => {
                  doSendMQttUpdateTargetWeight(device_ip, 8080)
                  doUpdateModel(e.target.value)
                }} value={running_model} className="form-control">
                  <option value="">--Select model--</option>
                  {renderModelOption()}
                </select>
              </li>
              <li className="list-group-item">
                <b>Target weight:</b> <labels className="float-right">{((modelDetail.target_product_count * modelDetail.weight_per_product) + modelDetail.weight_tray).toFixed(decimalDigit)} Kg</labels>
              </li>
              <li className="list-group-item">
                <b>Tray weight:</b> <labels className="float-right">{(modelDetail.weight_tray).toFixed(decimalDigit)} Kg</labels>
              </li>
              <li className="list-group-item">
                <b>Weight per product:</b> <labels className="float-right">{modelDetail.weight_per_product} Kg</labels>
              </li>
              <li className="list-group-item">
                <b>Target product count:</b> <labels className="float-right">{modelDetail.target_product_count}</labels>
              </li>
              <li className="list-group-item">
                <b>Current product count:</b> <labels className="float-right">{(weight - modelDetail.weight_tray) / modelDetail.weight_per_product < 0 ? 0 : ((weight - modelDetail.weight_tray) / modelDetail.weight_per_product).toFixed(0)}</labels>
              </li>
            </ul>

          </div>
          {/* /.card-body */}
        </div>



      )
    }
  }

  const renderPrintButton = () => {
    if (modelDetail) {
      if (((weight - modelDetail.weight_tray) / modelDetail.weight_per_product).toFixed(0) == modelDetail.target_product_count) {
        const data = {
          device_id,
          modelDetail,
          weight,
        }
        return <PrintButton data={data} />
      }
      // const data = {
      //   device_id,
      //   modelDetail,
      //   weight,
      // }
      // return <PrintButton data={data} />
    }
  }

  const doSendMQttUpdateTargetWeight = (ip, ws_port) => {
    try {
      const mqtt = require('mqtt')
      var client = mqtt.connect('http://' + ip + ':' + ws_port + '/');
      var topic_p = "target_weight";
      client.publish(topic_p, 'nodejs mqtt test', { qos: 2 })
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Weight device detail</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">

              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              {/* Profile Image */}
              {renderWeightModeldetails()}
              {/* /.card */}
            </div>
            <div className="col-md-6">

            </div>
            <div className="col-md-12">
              <div className="card card-primary">
                {renderPrintButton()}
                {/* <PrintButton data={{
                  device_id,
                  running_model,
                  modelDetail,
                  weight,
                }} /> */}
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
