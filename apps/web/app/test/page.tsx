"use client";

import {
    ScheduleComponent, ViewDirective, Month, Inject, ViewsDirective, EventSettingsModel, ExcelExport, ExportOptions
  } from '@syncfusion/ej2-react-schedule';
  import { scheduleData } from './datasource';
//   import './App.css';
  import { useRef } from 'react';
  import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
  
  const App = () => {
    const scheduleObj = useRef<ScheduleComponent>(null);
    const eventSettings: EventSettingsModel = { dataSource: scheduleData };
    const exportClick = () => {
      const exportOptions: ExportOptions = {
        fields: ['Id', 'Subject'],
        exportType: 'csv'
      };
      scheduleObj?.current?.exportToExcel(exportOptions);
    }
  
    return (
      <div>
        <ButtonComponent onClick={exportClick}>Excel Export</ButtonComponent>
        <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2024, 1, 10)} 
        eventSettings={eventSettings} ref={scheduleObj}>
          <ViewsDirective>
            <ViewDirective option='Month' />
          </ViewsDirective>
          <Inject services={[Month, ExcelExport]} />
        </ScheduleComponent>
      </div>
    );
  };
  
  export default App;
  