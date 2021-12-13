import React, { useEffect, useState } from 'react'
import WeightGauge from '../../weightGauge'
import { key, server, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import moment from 'moment'
import Swal from 'sweetalert2';

export default function Model_calibration(props) {
  const [model, setmodel] = useState(null)
  const [modelData, setmodelData] = useState(null)
  const [device, setdevice] = useState(null)
  const [devicesList, setdevicesList] = useState([])

  const [productCount, setproductCount] = useState(0)
  const [weight, setweight] = useState(0)

  const [calibrateResultList, setcalibrateResultList] = useState([])
  const [calibrateTrayResultList, setcalibrateTrayResultList] = useState([])

  const [state, setstate] = useState(0)
  const [decimalDigit, setdecimalDigit] = useState(4)

  useEffect(() => {
    setmodel(props.match.params.model)
    doGetModelData(props.match.params.model)
    doGetWeightScaleDevices()
  }, [])

  const doGetModelData = async (model) => {
    let result = await httpClient.get(server.FIND_WEIGHT_MODEL_URL + '/' + model)
    console.log(result.data.result);
    if (result.data.api_result === OK) {
      setmodelData(result.data.result)
    }
  }

  const doGetWeightScaleDevices = async () => {
    let result = await httpClient.get(server.WEIGHT_DEVICES_URL + 's')
    if (result.data.api_result === OK) {
      setdevicesList(result.data.result)
    }
  }

  const renderDevicesOption = () => {
    if (devicesList.length > 0) {
      return devicesList.map((item) => (
        <option value={item.device_id}>{item.device_name}</option>
      ))
    }
  }

  const renderWeightGauge = () => {
    if (device != null && device != '') {
      return <WeightGauge onChange={eventhandler} name={device.device_name}
        targetWeight={device.weightModelMaster.target_product_count || device.weightModelMaster.weight_per_product ? (device.weightModelMaster.target_product_count * device.weightModelMaster.weight_per_product) + device.weightModelMaster.weight_tray : 0} ip={device.device_ip} />
    }
  }

  const doGetDevicesDetail = async (_device_id) => {
    if (_device_id != null && _device_id != '') {
      const response = await httpClient.get(server.FIND_WEIGHT_DEVICE_URL + '/' + _device_id)
      if (response.data.api_result === OK) {
        if (props.match.params.model !== response.data.result.running_model) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'This weight device running model dose not matching with this weight calculation',
          })
        }
        setdevice(response.data.result)
      } else {
        setdevice(null)
      }
    } else {
      setdevice(null)
    }

  }

  const eventhandler = data => {
    setweight(data.toFixed(decimalDigit))
  }

  //calibration
  const doResetCalibration = () => {
    setcalibrateResultList([])
    setcalibrateTrayResultList([])
    setdevice(null)
    setproductCount(0)
    setstate(state - 1)
  }
  const doCalibrate = () => {
    if (weight <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Weight should not be less than Zero(0)',
      })
    } else {
      if (parseFloat(weight) - parseFloat(modelData.weight_tray) <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Please put your product into the weight device',
        })
      } else {
        const result = {
          productCount: parseInt(productCount),
          weight: parseFloat(weight),
          product_weight: parseFloat(weight) - parseFloat(modelData.weight_tray),
          weight_per_product: (parseFloat(weight) - parseFloat(modelData.weight_tray)) / productCount
        }
        let _calibrateResultList = []
        _calibrateResultList = calibrateResultList
        _calibrateResultList.push(result)
        setcalibrateResultList(_calibrateResultList)
        setstate(state + 1)
      }

    }

  }
  const doCalibrateTray = () => {
    if (weight <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Weight should not be less than Zero(0)',
      })
    } else {
      const result = parseFloat(weight)
      let _calibrateTrayResultList = []
      _calibrateTrayResultList = calibrateTrayResultList
      _calibrateTrayResultList.push(result)
      setcalibrateTrayResultList(_calibrateTrayResultList)
      console.log(_calibrateTrayResultList);
      setstate(state + 1)
    }
  }

  //render calibration
  const renderCalibrationOptions = () => {
    return (
      <div className="card card-primary">
        <div className="card-header">

        </div>
        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              doCalibrate()
            }}
          >
            <div className="form-group">
              <label>Select devices for weight calculation</label>
              <select required onChange={async (e) => {
                doGetDevicesDetail(e.target.value)
              }} className="form-control">
                <option value={''}>---Select devices for weight calculation---</option>
                {renderDevicesOption()}
              </select>
            </div>
            {renderWeightGauge()}
            <div className="form-group">
              <label >Product count (จำนวนงานที่ทำมาชั่ง) :</label>
              <input onChange={(e) => {
                setproductCount(e.target.value)
              }} type="number" required className="form-control" placeholder="Enter your product count" />
            </div>
            <div className="form-group">
              <label > Tray weight : {modelData ? modelData.weight_tray : 0} Kg</label>
            </div>
            <button type='submit' className="btn btn-primary" style={{ width: '100%', }}>Product weight calculation </button>
            <button onClick={(e) => {
              doCalibrateTray()
            }} type='button' className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>Tray weight calculation</button>
            <button onClick={(e) => {
              doResetCalibration()
            }} type="reset" className="btn btn-danger" style={{ width: '100%', marginTop: 10 }}>Reset</button>
          </form >
        </div>
      </div>
    )
  }
  const renderCalibrationResult = () => {
    const renderCalibrateResult = () => {
      if (calibrateResultList.length > 0) {
        return calibrateResultList.map((item, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{item.productCount}</td>
            <td>{item.weight}</td>
            <td>{item.product_weight}</td>
            <td>{item.weight_per_product.toFixed(decimalDigit)} Kg</td>
          </tr>
        ))
      }
    }
    const renderTotalResult = () => {
      if (calibrateResultList.length > 0) {
        let sumCalibrateResultList = 0
        for (let index = 0; index < calibrateResultList.length; index++) {
          const element = calibrateResultList[index];
          sumCalibrateResultList += element.weight_per_product
        }

        const submitChangeWeightTray = () => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              let response = await httpClient.put(server.WEIGHT_MODELS_URL, {
                model,
                weight_per_product: (sumCalibrateResultList / calibrateResultList.length).toFixed(decimalDigit),
                updater: localStorage.getItem(key.USER_NAME)
              })
              if (response.data.api_result === OK) {
                doGetDevicesDetail(device.device_id)
                setcalibrateResultList([])
                Swal.fire(
                  'product weight calibrated!',
                  'model ' + model + ' weight product has been update.',
                  'success'
                )
              } else {
                Swal.fire(
                  'error!',
                  'model ' + model + ' weight product update error , please try again',
                  'error'
                )
              }

            }
          })
        }

        return (
          <>
            <tr>
              <td>Average</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{(sumCalibrateResultList / calibrateResultList.length).toFixed(decimalDigit)} Kg</td>
            </tr>
            <tr >
              <td colspan={5}>
                <button onClick={() => {
                  submitChangeWeightTray()
                }} style={{ width: '100%' }} className='btn btn-success'>Submit </button>
              </td>
            </tr>
          </>
        )
      }

    }
    return (
      <div className={calibrateTrayResultList.length > 0 ? 'col-sm-4' : 'col-sm-8'}>
        <div className='card card-success'>
          <div className='card-header'>
            <h1 className='card-title'>Product weight calculation result</h1>
          </div>
          <div className='card-body table-responsive p-0'>

            <table className="table table-hover text-nowrap" role="grid">
              <thead>
                <tr role="row">
                  <th>index</th>
                  <th>Product count</th>
                  <th>Weight</th>
                  <th>Product weight</th>
                  <th>Weight per product</th>
                </tr>
              </thead>
              <tbody>
                {renderCalibrateResult()}
                {renderTotalResult()}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    )
  }
  const renderCalibrateTray = () => {

    const renderCalibrateTrayResult = () => {
      if (calibrateTrayResultList.length > 0) {
        return calibrateTrayResultList.map((item, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{item.toFixed(decimalDigit)} Kg</td>
          </tr>
        ))
      }

    }
    const renderTotalTrayResult = () => {
      if (calibrateTrayResultList.length > 0) {
        let sumCalibrateTrayResultList = 0
        for (let index = 0; index < calibrateTrayResultList.length; index++) {
          const element = calibrateTrayResultList[index];
          sumCalibrateTrayResultList += element
        }

        const submitChangeWeightTray = () => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              let response = await httpClient.put(server.WEIGHT_MODELS_URL, {
                model,
                weight_tray: (sumCalibrateTrayResultList / calibrateTrayResultList.length).toFixed(decimalDigit),
                updater: localStorage.getItem(key.USER_NAME)
              })
              if (response.data.api_result === OK) {
                doGetDevicesDetail(device.device_id)
                setcalibrateTrayResultList([])
                Swal.fire(
                  'Tray calibrated!',
                  'model ' + model + ' weight tray has been update.',
                  'success'
                )
              } else {
                Swal.fire(
                  'error!',
                  'model ' + model + ' weight tray update error , please try again',
                  'error'
                )
              }

            }
          })
        }

        return (
          <>
            <tr>
              <td>Average</td>
              <td>{(sumCalibrateTrayResultList / calibrateTrayResultList.length).toFixed(decimalDigit)} Kg</td>
            </tr>
            <tr >
              <td colspan={2}>
                <button onClick={() => {
                  submitChangeWeightTray()
                }} style={{ width: '100%' }} className='btn btn-success'>Submit </button>
              </td>
            </tr>
          </>
        )
      }

    }

    return (
      <div className={calibrateResultList.length > 0 ? 'col-sm-4' : 'col-sm-8'}>
        <div className='card card-warning'>
          <div className='card-header'>
            <h1 className='card-title'>Tray weight calculation result</h1>
          </div>
          <div className='card-body table-responsive p-0' >
            <table className="table table-hover text-nowrap" role="grid">
              <thead>
                <tr role="row">
                  <th>index</th>
                  <th>Tray weight</th>
                </tr>
              </thead>
              <tbody>
                {renderCalibrateTrayResult()}
                {renderTotalTrayResult()}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1 className="m-0">Model weight calculation , model : {model}</h1>
            </div>{/* /.col */}
            <div className="col-sm-12">
              <ol className="breadcrumb float-sm-right">
              </ol>
            </div>{/* /.col */}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-4">
              {renderCalibrationOptions()}
            </div>
            {calibrateTrayResultList.length > 0 ? renderCalibrateTray() : <></>}
            {calibrateResultList.length > 0 ? renderCalibrationResult() : <></>}
          </div>
        </div>
      </section>
    </div>
  )
}
