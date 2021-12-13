import React, { useEffect, useState } from "react";
import GaugeChart from 'react-gauge-chart'

export default function WeightGauge(props) {
  const [weight, setWeight] = useState(0);
  const [decimalDigit, setdecimalDigit] = useState(4)

  useEffect(() => {
    mqttConnect(props.ip, 8080)
    if (props.decimalDigit) {
      setdecimalDigit(props.decimalDigit)
    }
  }, []);

  const mqttConnect = (ip, ws_port) => {
    var mqtt = require('mqtt');
    var client = mqtt.connect('http://' + ip + ':' + ws_port + '/');
    var topic_s = "weight";
    client.subscribe(topic_s, { qos: 2 });

    client.on('message', function (topic, message) {
      var note = parseFloat(message.toString())
      setWeight(note);
      handleChange(note)
      // client.end();
    });
  }

  const handleChange = (note) => {
    if (props.onChange) {
      props.onChange(note);
    }
  }


  return (
    <div style={{ textAlign: 'center', padding: 0 }}>
      <h2>{props.name}</h2>
      <GaugeChart id="gauge-chart5"
        percent={(weight / props.targetWeight).toFixed(decimalDigit)}
        nrOfLevels={100}
        arcsLength={[0.6, 0.3, 0.1]}
        arcPadding={0.01}
        colors={['#EA4228', '#F5CD19', '#5BE12C']}
        // needleColor={(weight / props.targetWeight) >= 0.9 && (weight / props.targetWeight) <= 1.1 ? "#5BE12C" : "#464A4F"}
        animDelay={0}
        formatTextValue={value => weight.toFixed(decimalDigit) + ' Kg'}
        textColor={"#000000"}
      />
    </div>
  )
}
