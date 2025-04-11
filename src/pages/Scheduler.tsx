
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageCalendar } from "@/components/scheduler/MessageCalendar";

const Scheduler = () => {
  return (
    <Dashboard title="Scheduler">
      <div className="grid gap-6">
        <MessageCalendar />
      </div>
    </Dashboard>
  );
};

export default Scheduler;
