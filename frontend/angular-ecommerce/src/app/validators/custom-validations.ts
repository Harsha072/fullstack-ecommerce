import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidations {
    // whitespace validation

    static checkWhiteSpace(control:FormControl) :ValidationErrors{
        if((control.value !==null) && (control.value.trim().length===0)){
            //return a key valur pair of validationErrors
            return {'checkWhiteSpace' :true}
        }
        else{
            return null;
        }
    }
}
