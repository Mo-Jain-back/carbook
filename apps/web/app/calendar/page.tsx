import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { CalendarEventType } from "@/lib/store";
import { eventsData } from "./datasource";
import MappingEvents from "@/components/mapping-events";



export default async function Home() {
  const dbEvents = eventsData;

  return (
    <div className="scrollbar-hide">
      <Header />
      <MappingEvents eventsData={dbEvents as unknown as CalendarEventType[]}/>
      <MainView  />
    </div>
  );
}
