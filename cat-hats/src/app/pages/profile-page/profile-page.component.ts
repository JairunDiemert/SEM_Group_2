import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/auth.service";
import { customerModel } from "src/app/models/customer-model";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.css"],
})
export class ProfilePageComponent implements OnInit {
  public customer: customerModel = {
    username: "null12",
    cartItems: [],
    cartTotal: 0,
    name: "null",
    email: "null",
    address: "null",
    password: "null",
  };
  constructor(private Auth: AuthService, private user: UserService) {
    let email: String = localStorage.getItem("email");
    this.Auth.getUser(email).subscribe((data) => {
      this.customer.username = data.username;
      this.customer.name = data.name;
      this.customer.email = data.email;
      this.customer.address = data.address;
      this.customer.password = data.password;
    });
  }

  profileShow: Boolean = true;

  ngOnInit(): void {}

  editProfileClick() {
    this.profileShow = false;
  }

  profileClick() {
    this.profileShow = true;
  }

  onSubmit(profileForm: NgForm) {
    let oldEmail: String = localStorage.getItem("email");
    console.log(oldEmail);
    this.customer.username = profileForm.value.username;
    this.customer.name = profileForm.value.name;
    this.customer.email = profileForm.value.email;
    this.customer.address = profileForm.value.address;
    this.customer.password = profileForm.value.password;

    this.user
      .updateUser(
        oldEmail,
        this.customer.username,
        this.customer.name,
        this.customer.email,
        this.customer.address,
        this.customer.password
      )
      .subscribe((data) => {
        if (data.success) {
          alert("Your profile was updated");
        } else {
          alert("Some problem");
        }
      });
  }
}
