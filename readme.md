## Custom Validator Class: General Guide
The `Validator` class provides a powerful base for form validation. You can create a custom validator class tailored to your specific requirements by extending the `Validator` class.

---

### Extend the Validator Class
Create a new class (e.g., `MyValidator`) that extends the base `Validator` class. This allows you to reuse its methods and add your own validation logic.

```js
class MyValidator extends Validator {

    /**
     * Custom validation method for a specific form or context.
     * @returns void
     */
    validateForm() {
        // Example: Validate a required text input field
        if (this.required($('#username'))) {
            this.maxLength($('#username'), 50, 'Username must not exceed 50 characters.');
            this.alphabetic($('#username'), 'Username must contain only letters.');
        }

        // Example: Validate an email field
        this.required($('#email'), 'Email is required.');
        this.email($('#email'), 'Please enter a valid email address.');

        // Example: Validate a numeric field with range
        if (this.required($('#age'))) {
            this.range($('#age'), 18, 99, 'Age must be between 18 and 99.');
        }

        // Throw error messages if any validation fails
        this.throwErrorMessage();
    }
}
```

---

### General Usage Guide

#### Step 1: Instantiate Your Custom Validator
Create an instance of your custom validator class.

```js
const myValidator = new MyValidator();
```

---

#### Step 2: Use the Custom Validation Method
Call the `validateForm` method (or any custom method) to validate your form fields.

**Example Usage:**
```js
try {

    // Perform validation
    myValidator.validateForm();

    // If validation passes, proceed with form submission
    console.log('Form is valid. Submitting...');

} catch (error) {

    // Handle validation errors
    console.error('Validation failed:', error.message);

}

```

---

### Key Components of a Custom Validator

#### 1. Reuse Predefined Methods:
- Use the methods provided by the `Validator` class (e.g., `required`, `email`, `range`) to handle standard validations.

#### 2. Add Custom Logic:
- Incorporate conditional logic for field-specific validations (e.g., validating fields based on other inputs).

#### 3. Throw Errors:
- Use the `throwErrorMessage` method to halt execution and report validation errors.

---

### Validation Rules Examples
Here’s how you might define typical validation rules for common fields in your form:

#### 1. Text Fields
Validate that the field is required, does not exceed a certain length, and contains only letters.
```js
if (this.required($('#username'))) {
    this.maxLength($('#username'), 100, 'Username must not exceed 100 characters.');
    this.alphabetic($('#username'), 'Username must contain only letters.');
}
```

#### 2. Email
Validate that the email field is required and follows a proper email format.

```js
this.required($('#email'), 'Email is required.');
this.email($('#email'), 'Invalid email address format.');
```

#### 3. Numeric Fields
Validate that a numeric field falls within a specific range.

```js
if (this.required($('#age'))) {
    this.range($('#age'), 18, 65, 'Age must be between 18 and 65.');
}
```

#### 4. File Uploads
Validate that the uploaded file meets type and size requirements.

```js
if (this.required($('#profilePicture'))) {
    this.fileType($('#profilePicture'), ['image/jpeg', 'image/png'], 'Only JPEG and PNG files are allowed.');
    this.fileSize($('#profilePicture'), 2 * 1024 * 1024, 'File size must not exceed 2 MB.');
}
```

#### 5. Conditional Validation
Perform validations based on the values of other fields.

```js
if ($('#employmentStatus').val() === 'Employed') {
    this.required($('#employerName'), 'Employer name is required for employed individuals.');
}
```

---

### Tips for Building Custom Validators

#### 1. Use Logical Grouping:
- Group related validations in your custom method to make the code more readable and maintainable.

#### 2. Avoid Repetition:
- Reuse the base `Validator` methods as much as possible to minimize code duplication.

#### 3. Customize Error Messages:
- Provide meaningful, user-friendly error messages tailored to your application.

#### 4. Handle Dynamic Fields:
- Use conditional checks to handle fields that may not always require validation (e.g., fields shown based on user input).

#### 5. Debugging:
- Use `console.error` to log validation errors during development.

---

### Error Handling

#### `throwErrorMessage`
The `throwErrorMessage` method is essential to stop the form submission process when validation fails. It:
- Throws an exception with a custom error message.
- Logs all validation errors to the console.

**Example**
```js
try {
    myValidator.validateForm();
} catch (error) {
    console.error('Validation Error:', error.message);
}
```

---

### Example: Validating a Registration Form
Here’s a complete example of using the `MyValidator` class to validate a user registration form:

#### HTML
```html
<form id="registrationForm">
    <input type="text" id="username" placeholder="Enter username">
    <input type="email" id="email" placeholder="Enter email">
    <input type="number" id="age" placeholder="Enter age">
    <input type="file" id="profilePicture">
    <button type="submit">Register</button>
</form>
```

#### JavaScript
```js
$('#registrationForm').on('submit', function (e) {
    e.preventDefault();

    const myValidator = new MyValidator();

    try {
        myValidator.validateForm();
        console.log('Form is valid. Submitting...');
        // Perform form submission
    } catch (error) {
        console.error('Validation failed:', error.message);
    }
});
```

---

### Conclusion
Custom validator class:
- Extends the Validator class for reusable, consistent validation logic.
- Simplifies complex validation scenarios with custom methods.
- Helps ensure accurate and complete form submissions.

By following this guide, you can build robust, reusable validators tailored to your application's requirements.
