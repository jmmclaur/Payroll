import React from "react";
import "./Main.css";
import { useContext } from "react";
import Sidebar from "../SideBar/SideBar";

function Main({ handleNotifyClick }) {
  return (
    <main>
      <p className="main_welcome">Welcome!</p>
      <section className="notifications">
        Notifications
        <ul className="payroll_notifications" />
        <button
          onClick={handleNotifyClick}
          type="button"
          className="notification_btn"
          id="notification_btn"
        />
      </section>
    </main>
  );
}

export default Main;
