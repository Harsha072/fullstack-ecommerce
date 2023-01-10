import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormserviceService } from 'src/app/services/shop-formservice.service';
import { CustomValidations } from 'src/app/validators/custom-validations';
import {Purchase} from 'src/app/common/purchase';
import { Customer } from 'src/app/common/customer';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup
  totalPrice:number=0;
  totalQuantity:number=0;
 country:Country[]=[];
 shippingAddressStates:State[]=[];
 billingAddressStates:State[]=[];
  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];
storage:Storage=sessionStorage;
  

  constructor(private formBuilder : FormBuilder,private shopService:ShopFormserviceService, private cartService:CartService,
    private checkOut:CheckoutService,private router:Router) { }

  ngOnInit(): void {
    //read the email from user email

    const theEmail= JSON.parse(this.storage.getItem('userEmail'));
    // build the form using form builder
    //customer is form group name
    const startMonth:number=new Date().getMonth()+1;
    this.shopService.getCreditCardMonths(startMonth).subscribe(
      data=>{
         this.creditCardMonths=data;
      }
    );
    this.shopService.getCreditCardYears().subscribe(
      data=>{
         this.creditCardYears=data;
      }
    );
    this.shopService.getCountry().subscribe(
      data=>{
      this.country=data;
      console.log(this.country);
      }
    )
    this.checkoutFormGroup=this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        email: new FormControl(theEmail,[Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ])
      }),
      shippingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        pinCode:new FormControl('',[Validators.required,Validators.minLength(3),CustomValidations.checkWhiteSpace]),
      }),
      billingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        pinCode:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
      }),
      creditCardInfo:this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required,Validators.minLength(2),CustomValidations.checkWhiteSpace]),
        cardNumber:new FormControl('',[Validators.required,Validators.minLength(16),Validators.pattern(
          '[0-9]{16}'
        )]),
        securityCode:new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern(
          '[0-9]{3}'
        )]),
        expirationMonth:[''],
        expirationYear:['']
      }),
    });
    this.reviewCartDetails();
  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data=>{
        this.totalPrice=data;
      }
    )
    this.cartService.totalQuantity.subscribe(
      data=>{
        this.totalQuantity=data;
      }
    )
  }
  getStates(formGropuName:string){
    console.log("calling::::::")
const formgroup = this.checkoutFormGroup.get(formGropuName);
console.log("calling::::::",formgroup);
const countryCode = formgroup.value.country.code;
console.log(countryCode);
const countryName = formgroup.value.name;

this.shopService.getState(countryCode).subscribe(
  data=>{
    if(formGropuName=='shippingAddress'){
          this.shippingAddressStates=data;
          console.log("states ",data)
    }
    else{
      console.log("billing");
this.billingAddressStates=data;
console.log("hiiiii ",this.billingAddressStates);
    }
    formgroup.get('state').setValue(data[0]);
  }
)

  }
get firstName(){return this.checkoutFormGroup.get('customer.firstName');}

get lastName(){return this.checkoutFormGroup.get('customer.lastName');}

get email(){return this.checkoutFormGroup.get('customer.email');}

get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}

get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}

get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}

get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}

get shippingAddressPincode(){return this.checkoutFormGroup.get('shippingAddress.pinCode');}



get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}

get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}

get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}

get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}

get billingAddressPincode(){return this.checkoutFormGroup.get('billingAddress.pinCode');}

get creditCardType(){return this.checkoutFormGroup.get('creditCardInfo.cardType');}

get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCardInfo.nameOnCard');}

get creditCardNumber(){return this.checkoutFormGroup.get('creditCardInfo.cardNumber');}

get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCardInfo.securityCode');}

onSubmit(){
    console.log(this.checkoutFormGroup.get('customer').value.email);
    console.log("form sumitted!!!!!!");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    return;
    }
    //set up order
 let order = new Order();
 
order.totalPrice=this.totalPrice;
order.totalQuantity= this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems
    //create orderitems from cart items
let orderItems: OrderItem[] =[];
for(let i=0;i<cartItems.length;i++){
  console.log("cart items ",cartItems[i]);
  orderItems[i]= new OrderItem(cartItems[i]);
  console.log("order items ",orderItems[i]);
}
    //set up purchase
let purchase = new Purchase();
    //populate purchase customer
purchase.customer= this.checkoutFormGroup.controls['customer'].value;
    //populate shipping address
purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value
const shippingState :State= JSON.parse(JSON.stringify(purchase.shippingAddress.state));
const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
purchase.shippingAddress.state = shippingState.name;
purchase.shippingAddress.country = shippingCountry.name;
    //populate billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value
    const billingState :State= JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = JSON.stringify(billingState.name);
    purchase.billingAddress.country =JSON.stringify( billingCountry.name);
    //populate purchase order and order items
    console.log("order "+order.totalPrice,order.totalQuantity);
  for(let i =0;i<orderItems.length;i++){
console.log("order items in loop "+orderItems[i].unitPrice);

  }
    purchase.order= order;
    purchase.orderItem=orderItems;
    for(let i =0;i<purchase.orderItem.length;i++){
      console.log("order items in purchase loop "+purchase.orderItem[i].unitPrice);
      
        }
    console.log("purchae order items "+purchase.orderItem.length);
    console.log("fonal purchase order"+purchase.order);
    // call rest api
    console.log(`the purchase ${purchase.billingAddress.city}`);
    this.checkOut.placeOrder(purchase).subscribe({next: response =>{
      alert(`Your order has been recieved. Order tracking number:${response.orderTrackingNumber}`);
  
    //reset cart
    this.resetCart();
    },
    error: err=>{
      alert(` Ther was an error: ${err.message}`)
    }
  })
  }
  resetCart() {
    //reset cart data
this.cartService.cartItems=[];
this.cartService.totalQuantity.next(0);
this.cartService.totalPrice.next(0);
    //reset form data
this.checkoutFormGroup.reset();
    //navigate to main product page\
    this.router.navigateByUrl("/products");
  }
  copyshippingAddressTobillingAdress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates=this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates=[];
    }
  }
  handleMonthsAndYears(){
    const creditCardInfoGroup = this.checkoutFormGroup.get('creditCardInfo');

    const currentYear :number = new Date().getFullYear();
    const selectedYear :number=Number(creditCardInfoGroup.value.expirationYear);
//if current year is equal to selected year

let startMonth:number;
if(currentYear==selectedYear){
  startMonth = new Date().getMonth()+1
}
else{
  startMonth =1;
}
this.shopService.getCreditCardMonths(startMonth).subscribe(
  data =>{
    this.creditCardMonths = data;
  }
)
  }

}
