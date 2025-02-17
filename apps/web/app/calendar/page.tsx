import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import MappingEvents from "@/components/mapping-events";



export default async function Home() {
  return (
    <div className="scrollbar-hide">
      <Header />
      <MappingEvents/>
      <MainView  />
    </div>
  );
}
