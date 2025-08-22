

## customRegistrationFields Schema

| Field Name      | Data Type    | Required | Description                    |
|-----------------|--------------|----------|--------------------------------|
| `organizationId`|`foreign key` | Yes      | we need to take from organization Schema |
| `openigId`      | `foreign key`| Yes      | We need to take from opening Schema|
| `registrationFields`| `Array`  | Yes      | Lets see the  formFields Schema |


## registrationFields

| Field Name     | Data Type  | Required | Description                    |
|----------------|------------|----------|--------------------------------|
| `fieldName`    | `String`   | Yes      | Name of the field       | 
| `type`         | `enum`     | Yes      | We need to take those option - text, Email, Textarea, Numbar, Date, DateTime, Checkbox, Image, Drop down |
| `isRequired`   | `Boolean`  | No       | Whether the field is mandatory    |
| `isDeleted`    | `Boolean`  | No       | Whether the field is deleted or not    |
| `isUnique`     | `Boolean`  | No       | Whether the field is unique or not from this opening    |
| `defaultValue` | `String`   | No       | by default we can give empty   |
| `dropDownValues`| `Arrays`  | No       | by default we can give empty arrays   |
| `options`      | `Object`   | No       | lets see Option Schema    |


## dropDownValuesSchema

| Field Name     | Data Type  | Required | Description                    |
|----------------|------------|----------|--------------------------------|
| `color`        | `String`   | No       | we will send from frontend  |
| `value`        | `String`   | No       | what ever user provided  |

## optionsFieldSchema

| Field Name     | Data Type  | Required | Description                    |
|----------------|------------|----------|--------------------------------|
| `minLength`    | `number`   | No       | We need check the min length of the characters  | 
| `maxLength`    | `number`   | No       | We need check the min length of the characters  |
| `minNumber`    | `number`   | No       | We need check the min number allow for  |
| `maxNumber`    | `number`   | No       | We need check the max number allow for that type |
| `isValid`      | `Boolean`  | No       | Whether we need to check is it valid or not |
| `minDate`      | `Date`     | No       | We need check the min date allow for that type |
| `maxDate`      | `Date`     | No       | We need check the max date allow for that type |
| `minDateTime`  | `DateTime` | No       | We need check the min date Time allow for that type |
| `maxDateTime`  | `DateTime` | No       | We need check the max date Time allow for that type |
| `fileMinSize`  | `DateTime` | No       | We need check the min size allow for that type |
| `fileMaxSize`  | `DateTime` | No       | We need check the max date Time allow for that type |


## update userInterviewSchema . 
## we need to add one extra field called customRegistrationData whcih is object key should be the id of the custom registration field and the value  is giveb by the user 

| Field Name      | Data Type    | Required | Description                    |
|-----------------|--------------|----------|--------------------------------|
| `formFields`    |`foreign key` | Yes      | we need to take from custom registration field  |
| `value`         |`String`      | Yes      | it is depedent upon the Field . Let say for text, Email, Textarea, Numbar, Date, DateTime, Checkbox we can easily store the value only. but for drop down we need to store the id of the drop down and for file we need to upload the file into s3 then just store the s3 link into our db |








