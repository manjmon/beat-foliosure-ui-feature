import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlList: string[]) {
    let createdFormGroup= (formGroup: FormGroup) => {
        let controlValueList=[];
        Object.keys(formGroup.controls).forEach(key => {
            if(key.includes("itemInput"))
            {
                let newControl={
                    "name":"",
                    "value":""
                };
                const formCtrlValue = formGroup.controls[key]?.value?.trim();
                newControl.name=key;
                newControl.value=formCtrlValue?.trim();
                if(formCtrlValue!=null && formCtrlValue!="")
                  controlValueList.push(newControl);
            }
          });
         let duplicateArray = controlValueList
     .map(e => e['value'])
     .map((e, i, final) => final.indexOf(e) !== i && i)
     .filter(obj=> controlValueList[obj])
     .map(e => controlValueList[e]);
        const control = formGroup.controls["controlName"];
        const matchingControl = formGroup.controls["matchingControlName"];
        if(duplicateArray.length >0)
        {
            for(let i=0;i<duplicateArray.length;i++)
            {
                const control = formGroup.controls[duplicateArray[i]?.name];
                control.setErrors({ mustMatch: true });
            }
        }
        else{
            for(let i=0;i<controlValueList.length;i++)
            {
                const control = formGroup.controls[controlValueList[i]?.name];
                control.setErrors({ mustMatch: false });
                control.setErrors(null);
            }
        }
        // return null if controls haven't initialised yet
        if (!control || !matchingControl) {
          return null;
        }

        // return null if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return null;
        }

        // set error on matchingControl if validation fails
        // if (control.value !== matchingControl.value) {
        //     matchingControl.setErrors({ mustMatch: true });
        // } else {
        //     matchingControl.setErrors(null);
        // }
    }
    return createdFormGroup;
}