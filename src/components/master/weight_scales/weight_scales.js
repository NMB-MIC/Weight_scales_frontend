import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
import _ from "lodash";
import { key, server, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import moment from 'moment';
import Modal from 'react-modal';
import './weight_scales.css'

export default function Weight_scales() {
  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])

  //create weight scales
  const [device_name, setDevice_name] = useState('')
  const [device_ip, setDevice_ip] = useState('')
  const [device_detail, setDevice_detail] = useState('')

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  //edit weight_scales
  const [device_id, setDevice_id] = useState('')
 
  useEffect(() => {
    doGetWeightScaleDevices()
  }, [])

  const debounceSearch = useRef(_.debounce(e => findWeightScales(e), 500)).current;

  const searchChanged = (e) => {
    e.persist();
    debounceSearch(e);
  };

  const findWeightScales = async (e) => {
    console.log('findWeightScales');
    if (e.target.value != '') {
      let response = await httpClient.get(server.FIND_PATIENT_DATA_URL + '/' + e.target.value)
      console.log(response.data);
      if (response.data.result.length > 0 && response.data.api_result === OK) {
        settableData(response.data.result)
      } else {
        settableData([])
      }
    } else {
      doGetWeightScaleDevices()
    }
  }

  const doGetWeightScaleDevices = async () => {
    let result = await httpClient.get(server.WEIGHT_DEVICES_URL)
    if (result.data.result.length > 0) {
      let tableHeader = Object.keys(result.data.result[0])
      tableHeader.push('Action')
      settableData(result.data.result)
      settableHeader(tableHeader)
    }
  }

  const renderTableRow = () => {
    const generateTableData = (data) => {
      return tableHeader.map((header) => (
        <td>
          {renderRow(data, header)}
        </td>
      ))
    }

    const renderRow = (data, header) => {
      if (header == 'createdAt' || header == 'updatedAt') {
        return moment(data[header]).format('DD-MMM-YYYY HH:mm:ss')
      } else {
        switch (header) {
          case 'Action':
            return <div className="">
              <button onClick={(e) => {
                e.preventDefault()
                doDeleteWeightScale(data.device_id)
              }} className='btn btn-danger'>Delete</button>
              <button onClick={(e) => {
                e.preventDefault()
                doOpenModalEditWeightScale(data.device_id, data.device_ip, data.device_name, data.device_detail)
              }} className='btn btn-warning' style={{ marginLeft: 10 }}>
                Edit
              </button>
            </div>
          default:
            return data[header]
        }
      }
    }

    const doOpenModalEditWeightScale = (device_id, device_ip, device_name, device_detail) => {
      setDevice_id(device_id)
      setDevice_ip(device_ip)
      setDevice_name(device_name)
      setDevice_detail(device_detail)
      setEditModelIsOpen(true)
    }

    const doDeleteWeightScale = async (device_id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete device_id : " + device_id + ", You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = {
            updater: localStorage.getItem(key.USER_NAME),
            device_id
          }
          let response = await httpClient.delete(server.WEIGHT_DEVICES_URL, { data })
          if (response.data.api_result === OK) {
            Swal.fire(
              'Deleted!',
              'device_id : ' + device_id + ' has been deleted.',
              'success'
            ).then(() => {
              doGetWeightScaleDevices()
            }
            )
          } else {
            Swal.fire(
              'Error!',
              'Delete device_id : ' + device_id + ' failed, please try again.',
              'error'
            )
          }
        }
      })
    }

    return tableData.map((item) => (
      <tr>{generateTableData(item)}</tr>
    ))
  }

  const renderTableHeader = () => {
    return tableHeader.map((item) => (
      <th className="sorting"
        rowSpan={1}
        colSpan={1}>
        {item}
      </th>
    ))
  }

  const closeModal = () => {
    setDevice_id('')
    setDevice_name('')
    setDevice_ip('')
    setDevice_detail('')
    setCreateModalIsOpen(false)
    setEditModelIsOpen(false)
  }
 
  //create weight_scales
  const doCreateWeightScales = async () => {
    const ValidateIPaddress = (ipaddress) => {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have entered an invalid IP address!',
      })
      return (false)
    }
    try {
      if (ValidateIPaddress(device_ip)) {
        const response = await httpClient.post(server.WEIGHT_DEVICES_URL, { device_name, device_ip, device_detail })
        if (response.data.api_result === OK) {
          closeModal()
          doGetWeightScaleDevices()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something wrong , Please try again.D',
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderCreateWeightScales = () => {
    return (
      <Modal
        isOpen={createModalIsOpen}
        style={{
          content: {
            transform: 'translate(0%, 0%)',
            overlfow: 'scroll' // <-- This tells the modal to scrol
          },
        }}
        className="content-wrapper"
      >
        <div style={{ margin: '10%', padding: '5%', backgroundColor: 'rgba(0,0,0,0)', overflow: 'auto' }}>
          <div className="card card-success">
            <div className="card-header">
              <div className='d-flex justify-content-between'>
                <h4 className='card-title"'>Create new weight scale devices</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form>
              <div class="card-body">

                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Device name</label>
                  <input required onChange={(e) => {
                    setDevice_name(e.target.value)
                  }} type="text" className="form-control" placeholder="Enter device name" />
                </div>
                <div className="form-group">
                  <label>Device ip</label>
                  <input required
                    onChange={(e) => {
                      setDevice_ip(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter device ip" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Device name</label>
                  <textarea
                    required
                    rows="4"
                    onChange={(e) => {
                      setDevice_detail(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter device detail" />
                </div>
              </div>
              <div class="card-footer">
                <button class="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault()
                    doCreateWeightScales()
                  }}
                >Submit</button>
                <button class="btn btn-default float-right" onClick={(e) => {
                  e.preventDefault()
                  closeModal();
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    )
  }

  //edit weight_scales
  const doUpdateWeightScales = async () => {
    const ValidateIPaddress = (ipaddress) => {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have entered an invalid IP address!',
      })
      return (false)
    }
    try {
      if (ValidateIPaddress(device_ip)) {
        const response = await httpClient.put(server.WEIGHT_DEVICES_URL, { device_id, device_name, device_ip, device_detail, updater: localStorage.getItem(key.USER_NAME) })
        if (response.data.api_result === OK) {
          console.log(response.data.result);
          Swal.fire({
            icon: 'success',
            title: 'Yeah...',
            text: 'Update completed',
          })
          closeModal()
          doGetWeightScaleDevices()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something wrong , Please try again',
          })
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something wrong!',
      })
      console.log(error);
      closeModal()
    }
  }

  const renderEditWeightScales = () => {
    return (
      <Modal
        isOpen={editModelIsOpen}
        style={{
          content: {
            transform: 'translate(0%, 0%)',
            overlfow: 'scroll' // <-- This tells the modal to scrol
          },
        }}
        className="content-wrapper"
      >
        <div style={{ margin: '10%', padding: '5%', backgroundColor: 'rgba(0,0,0,0)', overflow: 'auto' }}>
          <div className="card card-warning">
            <div className="card-header">
              <div className='d-flex justify-content-between'>
                <h4 className='card-title"'>Edit weight scale devices(device_id : {device_id})</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form>
              <div class="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Device name</label>
                  <input required
                    value={device_name}
                    onChange={(e) => {
                      setDevice_name(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter device name" />
                </div>
                <div className="form-group">
                  <label>Device ip</label>
                  <input required
                    value={device_ip}
                    onChange={(e) => {
                      setDevice_ip(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter device ip" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Device name</label>
                  <textarea
                    value={device_detail}
                    required
                    rows="4"
                    onChange={(e) => {
                      setDevice_detail(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter device detail" />
                </div>
              </div>
              <div class="card-footer">
                <button class="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault()
                    doUpdateWeightScales()
                  }}
                >Update</button>
                <button class="btn btn-default float-right" onClick={(e) => {
                  e.preventDefault()
                  closeModal();
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Master manage</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">

            </div>{/* /.col */}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-dark">
                <div className="card-header">
                  <h1 className="card-title">Weight scales devices</h1>
                </div>
                <div className="card-body">
                  <div className="input-group input-group-sm">
                    <input
                      onChange={(e) => searchChanged(e)}
                      type="search"
                      className="form-control input-lg"
                      placeholder="Enter search keyword"
                      style={{ borderRadius: 10, marginRight: 10 }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCreateModalIsOpen(true)
                      }} className="btn btn-success btn-sm">
                      Add devices
                      </button>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table
                      className="table table-hover text-nowrap"
                      role="grid"
                    >
                      <thead>
                        <tr role="row">
                          {renderTableHeader()}
                        </tr>
                      </thead>
                      <tbody>
                        {renderTableRow()}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  {renderCreateWeightScales()}
                  {renderEditWeightScales()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
