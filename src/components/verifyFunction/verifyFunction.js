import React, { useState } from 'react'

export default function VerifyFunction() {

  const [productWeightList, setproductWeightList] = useState([])
  const [trayWeightList, settrayWeightList] = useState([])

  const [productWeight, setproductWeight] = useState(0)
  const [trayWeight, settrayWeight] = useState(0)
  const [productCount, setproductCount] = useState(0)
  const [trayCount, settrayCount] = useState(0)

  const [count, setcount] = useState(0)

  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const renderProductWeight = () => {
    const renderProductWeightTable = () => {
      return productWeightList.map((item) => (
        <li>
          {item}
        </li>
      ))
    }

    const renderMinMax = () => (
      <div className='row' style={{ textAlign: 'center' }}>
        <div className='col-md-6'>min : {Math.min(...productWeightList)}</div>
        <div className='col-md-6'>max : {Math.max(...productWeightList)}</div>
        <div className='col-md-6'>range : {(Math.max(...productWeightList) - Math.min(...productWeightList)).toFixed(3)}</div>
        <div className='col-md-6'>average : {average(productWeightList).toFixed(3)}</div>

      </div>
    )

    return (
      <>
        <form onSubmit={(e) => {
          e.preventDefault()
          var newProductWeightList = productWeightList
          newProductWeightList.push(parseFloat(productWeight))
          setproductWeightList(newProductWeightList)
          setcount(count + 1)
        }}>
          <div className="form-group">
            <label>Input product weight (kg)</label>
            <input
              value={productWeight}
              onChange={(e) => {
                setproductWeight(e.target.value)
              }} type="number" min={0} step={0.00001} className="form-control" id="exampleInputEmail1" />
          </div>
          {productWeightList.length > 0 ? renderMinMax() : <></>}
          <hr></hr>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type='button' onClick={() => {
            setproductWeight(0)
            setproductWeightList([])
          }} className="btn btn-default float-right">Reset</button>

        </form>
        <div style={{ marginTop: 5 }}>
          <ul style={{ listStyle: "inside" }}>
            {renderProductWeightTable()}
          </ul>
        </div>
      </>
    )
  }

  const renderTrayWeight = () => {
    const rendertrayWeightTable = () => {
      return trayWeightList.map((item) => (
        <li>
          {item}
        </li>
      ))
    }

    const renderMinMax = () => (
      <div className='row' style={{ textAlign: 'center' }}>
        <div className='col-md-6'>min : {Math.min(...trayWeightList)}</div>
        <div className='col-md-6'>max : {Math.max(...trayWeightList)}</div>
        <div className='col-md-6'>range : {(Math.max(...trayWeightList) - Math.min(...trayWeightList)).toFixed(3)}</div>
        <div className='col-md-6'>average : {average(trayWeightList).toFixed(3)}</div>

      </div>
    )

    return (
      <>
        <form onSubmit={(e) => {
          e.preventDefault()
          var newtrayWeightList = trayWeightList
          newtrayWeightList.push(parseFloat(trayWeight))
          settrayWeightList(newtrayWeightList)
          setcount(count + 1)
        }}>
          <div className="form-group">
            <label>Input tray weight (kg)</label>
            <input
              value={trayWeight}
              onChange={(e) => {
                settrayWeight(e.target.value)
              }} type="number" min={0} step={0.00001} className="form-control" id="exampleInputEmail1" />
          </div>
          {trayWeightList.length > 0 ? renderMinMax() : <></>}
          <hr></hr>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type='button' onClick={() => {
            settrayWeight(0)
            settrayWeightList([])
          }} className="btn btn-default float-right">Reset</button>

        </form>
        <div style={{ marginTop: 5 }}>
          <ul style={{ listStyle: "inside" }}>
            {rendertrayWeightTable()}
          </ul>
        </div>
      </>
    )
  }

  const renderSummary = () => {
    const summaryResult = () => {
      if (productWeightList.length > 0 && trayWeightList.length > 0 && productCount > 0 && trayCount > 0) {
        return (
          <>
            <div className="card-body table-responsive p-0" style={{ height: 300 }}>
              <table className="table table-head-fixed text-nowrap" style={{ textAlign: 'center' }}>
                <thead>
                  <tr >
                    <th>item</th>
                    <th>Product</th>
                    <th>Tray</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total range weight</td>
                    <td>{((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount).toFixed(3)} Kg</td>
                    <td>{((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount).toFixed(3)} kg</td>
                    <td>{(((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount) + ((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount)).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td>Average weight</td>
                    <td>{average(productWeightList).toFixed(3)} kg</td>
                    <td>{average(trayWeightList).toFixed(3)} kg</td> 
                    <td></td>

                  </tr>
                  <tr>
                    <td>Result</td>
                    <td>{((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount).toFixed(3) < average(productWeightList) ? 'pass' : 'failed'}</td>
                    <td>{((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount).toFixed(3) < average(productWeightList) ? 'pass' : 'failed'}</td>
                    <td>{(((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount) + ((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount)) < average(productWeightList) ? 'pass' : 'failed'}</td>
                  </tr>
                  <tr>
                    <td>Reason</td>
                    <td>{((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount).toFixed(3) < average(productWeightList) ? '' : 'Total range weight > Average weight'}</td>
                    <td>{((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount).toFixed(3) < average(productWeightList) ? '' : 'Total range weight > Average weight'}</td>
                    <td>{(((Math.max(...trayWeightList) - Math.min(...trayWeightList)) * trayCount) + ((Math.max(...productWeightList) - Math.min(...productWeightList)) * productCount)) < average(productWeightList) ? '' : 'Total product range weight > Average product weight'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </>

        )
      }
    }
    return (
      <form>
        <div className='row'>
          <div className='col-md-6'>
            <div className="form-group">
              <label>Product per pack</label>
              <input
                value={productCount}
                onChange={(e) => {
                  setproductCount(e.target.value)
                }} type="number" min={1} step={1} className="form-control" id="exampleInputEmail1" />
            </div>
          </div>
          <div className='col-md-6'>
            <div className="form-group">
              <label>Tray per pack</label>
              <input
                value={trayCount}
                onChange={(e) => {
                  settrayCount(e.target.value)
                }} type="number" min={1} step={1} className="form-control" id="exampleInputEmail1" />
            </div>
          </div>


        </div>
        <hr></hr>
        {summaryResult()}

      </form>
    )
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Verify Function</h1>
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
              <div className="card card-primary">
                <div className="card-header">
                  <h3 class="card-title">
                    <i style={{ marginRight: 5 }} className="fas fa-drumstick-bite" />
                    Product
                  </h3>
                </div>
                <div className="card-body">
                  {renderProductWeight()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-warning">
                <div className="card-header">
                  <h3 class="card-title">
                    <i style={{ marginRight: 5 }} className="fas fa-box-open" />
                    tray
                  </h3>
                </div>
                <div className="card-body">
                  {renderTrayWeight()}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-success">
                <div className="card-header">
                  <h3 class="card-title">
                    <i style={{ marginRight: 5 }} className="fas fa-clipboard-list" />
                    Summary
                  </h3>
                </div>
                <div className="card-body">
                  {renderSummary()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
