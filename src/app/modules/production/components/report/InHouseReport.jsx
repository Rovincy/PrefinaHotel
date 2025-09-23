import React from 'react'
import ko from 'knockout'
import 'devexpress-reporting/dx-webdocumentviewer'
import '../../../../../../node_modules/devextreme/dist/css/dx.light.css'
import '../../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css'
import '../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css'
import '../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css'
import {Host} from './Host'
import {useEffect, useRef} from 'react'
import {DxReportViewer} from 'devexpress-reporting/dx-webdocumentviewer'

const ReportViewer = () => {
  const reportUrl = ko.observable('InHouseReport')
  const viewerRef = useRef()
  const requestOptions = {
    host: Host,
    invokeAction: 'DXXRDV',
  }

  useEffect(() => {
    const viewer = new DxReportViewer(viewerRef.current, {
      reportUrl,
      requestOptions,
      callbacks: {
        customizeParameterLookUpSource: function (s, e) {
          if (s?.name?.toLowerCase() === 'Guest') {
            var parametersModel = e.filter((x) => x.value === 'Guest')
            return parametersModel
          }
        },
       
        
      },
    })
    viewer.render()
    return () => viewer.dispose()
  })

  return <div ref={viewerRef}></div>
}

function InHouseReport() {
  return (
    <div style={{width: '100%', height: '1000px'}}>
      <ReportViewer />
    </div>
  )
}
export default InHouseReport
