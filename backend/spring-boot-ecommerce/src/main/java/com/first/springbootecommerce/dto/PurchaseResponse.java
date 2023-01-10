package com.first.springbootecommerce.dto;

//use this class to send java object as json response
public class PurchaseResponse {

	private  String orderTrackingNumber;

	public PurchaseResponse(String orderTrackingNumber) {
		this.orderTrackingNumber=orderTrackingNumber;
	}
	public String getOrderTrackingNumber() {
		return orderTrackingNumber;
	}

	public void setOrderTrackingNumber(String orderTrackingNumber) {
		this.orderTrackingNumber = orderTrackingNumber;
	}


	
}
