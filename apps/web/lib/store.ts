import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getMonth } from "./getTime";

interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

interface UserStore {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
}

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
}

export type CalendarEventType = {
  id: string;
  title: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  description: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
};

type EventStore = {
  events: CalendarEventType[];
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  setEvents: (events: CalendarEventType[]) => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
};

interface ToggleSideBarType {
  isSideBarOpen: boolean;
  setSideBarOpen: (flag:boolean) => void;
}

type EventRow = { id: string; rowIndex: number };

type EventStore1 = {
  eventsRow: EventRow[];
  setEventsRow: (eventsRow: EventRow[]) => void;
};

export const useEventRows = create<EventStore1>((set) => ({
  eventsRow: [],
  setEventsRow: (eventsRow) => set({ eventsRow }),
}));

export type WrappedEvent = {
  id:string;
  startDate:Dayjs;
  endDate:Dayjs;
}

type WrappedEventStore = {
  wrappedEvents: WrappedEvent[];
  setWrappedEvents: (eventsRow: WrappedEvent[]) => void;
};

export const useWrappedEvent = create<WrappedEventStore>((set) => ({
  wrappedEvents: [],
  setWrappedEvents: (wrappedEvents) => set({ wrappedEvents }),
}));

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        username: "",
        setUsername: (value: string) => {
          set({ username: value });
        },
        password: "",
        setPassword: (value: string) => {
          set({ password: value });
        },
        name: "",
        setName: (value: string) => {
          set({ name: value });
        },
      }),
      { name: "user_data", skipHydration: true },
    ),
  ),
);


export const useViewStore = create<ViewStoreType>()(
  devtools(
    persist(
      (set) => ({
        selectedView: "month",
        setView: (value: string) => {
          set({ selectedView: value });
        },
      }),
      { name: "calendar_view", skipHydration: true },
    ),
  ),
);

export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
      }),
      { name: "date_data", skipHydration: true },
    ),
  ),
);

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  isEventSummaryOpen: false,
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  openEventSummary: (event) =>
    set({ isEventSummaryOpen: true, selectedEvent: event }),
  closeEventSummary: () =>
    set({ isEventSummaryOpen: false, selectedEvent: null }),
}));

export const useToggleSideBarStore = create<ToggleSideBarType>()(
  devtools(
    persist(
      (set, get) => ({
        isSideBarOpen: true,
        setSideBarOpen: (flag:boolean) => {
          set({ isSideBarOpen: flag });
        },
      }),
      { name: "sidebar_state" } 
    )
  )
);

