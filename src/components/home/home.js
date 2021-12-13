import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WeightGauge from '../weightGauge'
import { key, server, OK } from '../../constants';
import { httpClient } from '../../utils/HttpClient';
export default function Home() {
  const [devicesList, setdevicesList] = useState([])

  useEffect(() => {
    doGetWeightScaleDevices()
  }, [])

  const doGetWeightScaleDevices = async () => {
    let result = await httpClient.get(server.WEIGHT_DEVICES_URL + 's')
    if (result.data.api_result === OK) {
      setdevicesList(result.data.result)
    }
  }

  const renderWeightDetails = () => {
    if (devicesList.length > 0) {
      return devicesList.map((item) => (
        <div className='col-4'>
          <Link to={"/weightDeviceDetail/" + item.device_id}>
            <WeightGauge name={item.device_name} targetWeight={
              item.weightModelMaster.target_product_count || item.weightModelMaster.weight_per_product ? 
                (item.weightModelMaster.target_product_count * item.weightModelMaster.weight_per_product) + item.weightModelMaster.weight_tray: 0} ip={item.device_ip} />
          </Link>
        </div>
      ))
    }
  }

  return (
    <div className='content-wrapper'>
      <section className='content'>
        <h1>Home</h1>
        <div className='row'>
          {renderWeightDetails()}
        </div>
      </section>
    </div>
  )
}

