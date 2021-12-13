import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
import _ from "lodash";
import { key, server, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import moment from 'moment';
import Modal from 'react-modal';
import './weight_models.css'
import { Link } from 'react-router-dom';

export default function Weight_models() {
  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])

  //create weight scales
  const [model, setmodel] = useState(null)
  const [model_name, setmodel_name] = useState(null)
  const [target_product_count, settarget_product_count] = useState(0)
  const [weight_per_product, setweight_per_product] = useState(0)
  const [weight_tray, setweight_tray] = useState(0)

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  //edit weight_scales
  const [device_id, setDevice_id] = useState('')

  useEffect(() => {
    doGetWeightScaleModels()
  }, [])

  const debounceSearch = useRef(_.debounce(e => findWeightScales(e), 500)).current;

  const searchChanged = (e) => {
    e.persist();
    debounceSearch(e);
  };

  const findWeightScales = async (e) => {
    if (e.target.value != '') {
      let response = await httpClient.get(server.FIND_WEIGHT_MODELS_URL + '/' + e.target.value)
      console.log(response.data);
      if (response.data.result.length > 0 && response.data.api_result === OK) {
        settableData(response.data.result)
      } else {
        settableData([])
      }
    } else {
      doGetWeightScaleModels()
    }
  }

  const doGetWeightScaleModels = async () => {
    let result = await httpClient.get(server.WEIGHT_MODELS_URL)
    if (result.data.api_result === OK) {
      if (result.data.result.length > 0) {
        let tableHeader = Object.keys(result.data.result[0])
        tableHeader.push('Action')
        settableData(result.data.result)
        settableHeader(tableHeader)
      }
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
                doOpenModalEditWeightScale(data.model, data.model_name, data.target_product_count, data.weight_per_product, data.weight_tray)
              }} className='btn btn-warning' style={{ marginLeft: 10 }}>
                Edit
              </button>
              <Link to={'/master/weight_calculation/' + data.model} className='btn btn-dark' style={{ marginLeft: 10 }}>
                Weight Calculation
              </Link>
            </div>
          default:
            return data[header]
        }
      }
    }

    const doOpenModalEditWeightScale = (model, model_name, target_product_count, weight_per_product, weight_tray) => {
      setmodel(model)
      setmodel_name(model_name)
      settarget_product_count(target_product_count)
      setweight_per_product(weight_per_product)
      setweight_tray(weight_tray)
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
          let response = await httpClient.delete(server.WEIGHT_MODELS_URL, { data })
          if (response.data.api_result === OK) {
            Swal.fire(
              'Deleted!',
              'device_id : ' + device_id + ' has been deleted.',
              'success'
            ).then(() => {
              doGetWeightScaleModels()
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
    setmodel(null)
    setmodel_name(null)
    settarget_product_count(0)
    setweight_per_product(0)
    setweight_tray(0)
    setCreateModalIsOpen(false)
    setEditModelIsOpen(false)
  }

  //create weight_scales
  const doCreateWeightScales = async () => {
    try {
      const response = await httpClient.post(server.WEIGHT_MODELS_URL, {
        model,
        model_name,
        target_product_count,
        weight_per_product,
        weight_tray,
      })
      if (response.data.api_result === OK) {
        closeModal()
        doGetWeightScaleModels()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something wrong , Please try again.D',
        })
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something wrong , Please try again.D',
      })
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
                <h4 className='card-title"'>Create new weight scale Models</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              doCreateWeightScales()
            }}>
              <div class="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Model</label>
                  <input required onChange={(e) => {
                    setmodel(e.target.value)
                  }} type="text" className="form-control" placeholder="Enter model" />
                </div>
                <div className="form-group">
                  <label>Model name</label>
                  <input required
                    onChange={(e) => {
                      setmodel_name(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter model name" />
                </div>
                <div className="form-group">
                  <label >Target product count</label>
                  <input
                    required
                    min={0}
                    onChange={(e) => {
                      settarget_product_count(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter target product count" />
                </div>
                <div className="form-group">
                  <label >Weight per product</label>
                  <input
                    min={0}
                    required
                    step={0.0001}
                    onChange={(e) => {
                      setweight_per_product(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter weight per product" />
                </div>
                <div className="form-group">
                  <label >Weight of tray</label>
                  <input
                    min={0}
                    step={0.0001}
                    required
                    onChange={(e) => {
                      setweight_tray(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter weight of tray" />
                </div>
              </div>
              <div class="card-footer">
                <button type='submit' class="btn btn-success">Submit</button>
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
    try {
      const response = await httpClient.put(server.WEIGHT_MODELS_URL, {
        model,
        model_name,
        target_product_count,
        weight_per_product,
        weight_tray,
        updater: localStorage.getItem(key.USER_NAME)
      })
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        Swal.fire({
          icon: 'success',
          title: 'Yeah...',
          text: 'Update completed',
        })
        closeModal()
        doGetWeightScaleModels()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something wrong , Please try again',
        })
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
                <h4 className='card-title"'>Edit weight scale Models(device_id : {device_id})</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              doUpdateWeightScales()
            }}>
              <div class="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Model</label>
                  <input required
                    value={model}
                    onChange={(e) => {
                      setmodel(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter model" />
                </div>
                <div className="form-group">
                  <label>Model name</label>
                  <input required
                    value={model_name}
                    onChange={(e) => {
                      setmodel_name(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter model name" />
                </div>
                <div className="form-group">
                  <label >target product count</label>
                  <input
                    value={target_product_count}
                    required
                    onChange={(e) => {
                      settarget_product_count(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter target product count" />
                </div>
                <div className="form-group">
                  <label >Weight per product</label>
                  <input
                    value={weight_per_product}
                    required
                    step={0.0001}
                    min={0}
                    onChange={(e) => {
                      setweight_per_product(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter weight per product" />
                </div>
                <div className="form-group">
                  <label >Weight of tray</label>
                  <input
                    value={weight_tray}
                    min={0}
                    step={0.0001}
                    required
                    onChange={(e) => {
                      setweight_tray(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter weight of tray" />
                </div>

              </div>
              <div class="card-footer">
                <button type='submit' class="btn btn-warning">Update</button>
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
                  <h1 className="card-title">Weight scales Models</h1>
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
                      Add Models
                    </button>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table
                      id="example2"
                      className="table table-hover text-nowrap"
                      role="grid"
                      aria-describedby="example2_info"
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
