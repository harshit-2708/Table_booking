import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'app/services/user.model';
import { Restaurant } from 'app/services/restaurant.model';

import { UserprofileService } from 'app/services/userprofile.service';
import { Table } from 'app/services/table.model';
import { A } from '@angular/cdk/keycodes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-restownerprofile',
  templateUrl: './restownerprofile.component.html',
  styleUrls: ['./restownerprofile.component.css']
})
export class RestownerprofileComponent implements OnInit {
  isModify: boolean = false;
  isOwnerCheckbox: boolean = false;
  isOwner: boolean = false;

  user: User = {
    roleName: '',
    userId: 0,
    userPhoneNumber: '',
    userEmail: '',
    userName: ''
  };
  restaurant: Restaurant = {
    restaurantId: 0,
    restaurantName: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      pincode: ''
    },
    gstIn: '',
    contact: '',
    nonVeg: false,
    description: '',
    rating: 0,
    openingTime: '',
    closingTime: '',
    cuisines: [],
    userId:0
  };
  table = new Table;
  benches!: Table[];
  benchType: string[] = ['private', 'general']
  selectedBenchType: string = '';

  change: string[] = [];
  constructor(private userservice: UserprofileService) { }

  ngOnInit(): void {
    this.userservice.getUser();
    this.userservice.userProfile.subscribe((data) => {

      this.user = data;
      if (this.user.roleName == "owner") {
        this.userservice.getRestaurantByUser(this.user.userId);
        this.userservice.restaurantProfile.subscribe((data) => {

          this.restaurant = data;
          this.userservice.getAllBenches(this.restaurant.restaurantId)
          this.userservice.benchList.subscribe((data) => {
            this.benches = data
            // data.forEach((element,index)=>{
            //   if(element.benchType!=this.benches[0].benchType){
            //     this.benches.push(element)
            //   }
            // })
          })
        })
      }
    })
  }

  onModify() {
    this.isModify = true
  }

  onSubmit() {
    this.isModify = false
    this.restaurant.userId = this.user.userId
    this.userservice.updateRestaurantDetail(this.restaurant)
    console.log(this.restaurant)
  }

  checkIsOwner() {
    if (this.user.roleName == "owner" && this.isOwnerCheckbox == true) {
      this.isOwner = true
    } else if (this.isOwnerCheckbox == true) {
      console.log('You are not owner')
      this.isOwner = false
    } else {
      this.isOwner = false
    }
  }


  addTable(data: NgForm) {
    this.table = new Table;
    this.table.benchType = this.selectedBenchType;
    this.table.capacity = data.value.capacity;
    this.table.price = data.value.price;
    this.table.noOfBench = data.value.noOfTable;
    this.table.restaurantId = this.restaurant.restaurantId;
    if (
      this.table.benchType === undefined || 
      this.table.benchType === "" || 
      this.table.capacity === undefined || 
      this.table.capacity === 0 ||
      this.table.price === 0||
      this.table.noOfBench === 0||
      this.table.restaurantId === undefined ||
      this.table.price === undefined||
      this.table.noOfBench === undefined) 
      {
      console.log('Please enter every field')
    } else {
      for(let i=0;i<data.value.noOfTable;i++){
        this.benches.push(this.table)
      }
      this.userservice.addBench(this.table)
    }
    data.reset();
    this.selectedBenchType = "";
  }

  onDeleteButton(data:any){
    this.benches.forEach((element,index)=>{
      if(element.benchId === data.benchId){
        this.benches.splice(index,1)
      }
    })
    this.userservice.deleteBench(data.benchId)
  }
}
