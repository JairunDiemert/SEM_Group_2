import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  addSchedule(event) {
    event.preventDefault();
    const target = event.target;
    const scheduleDate = target.querySelector("#scheduleDate").value;
    const userEmail = target.querySelector("#userEmail").value;
    const catalogTitle = target.querySelector("#catalogTitle").value;

    this.auth
      .addSchedule(scheduleDate, userEmail, catalogTitle)
      .subscribe((data) => {
        console.log(data);
        if (data.success) {
          this.router.navigate(["schedule"]);
        }
        window.alert(data.message);
      });

    console.log(scheduleDate, userEmail, catalogTitle);
  }
}