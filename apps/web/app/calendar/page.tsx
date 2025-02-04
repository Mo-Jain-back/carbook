import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { CalendarEventType } from "@/lib/store";
import { eventsData } from "./datasource";



export default async function Home() {
  const dbEvents = eventsData;

  return (
    <div className="scrollbar-hide">
      <Header />
      <MainView eventsData={dbEvents as unknown as CalendarEventType[]} />
    </div>
  );
}
