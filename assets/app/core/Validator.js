/**
 * Validator Class
 *
 * @author Kafka Febianto Agiharta
 * @version 1.0.0
 *
 * The `Validator` class provides a flexible and reusable solution for form validation in web applications.
 * It supports synchronous and asynchronous validations, custom error messages, and seamless integration
 * with popular form styling frameworks like Bootstrap.
 *
 * ## Key Features:
 * - Validates input fields using pre-defined rules (e.g., required, email, numeric, etc.).
 * - Supports asynchronous validations for real-time checks (e.g., checking username availability via API).
 * - Displays error messages dynamically and updates the UI to indicate invalid fields.
 * - Allows custom validation logic with the `custom` and `asyncValidation` methods.
 * - Automatically tracks validation errors and throws exceptions if validation fails.
 *
 * ## How to Use:
 *
 * ### 1. Instantiate the Validator Class
 * Create an instance of the `Validator` class before starting any validation process:
 *
 * ```javascript
 * const validator = new Validator();
 * ```
 *
 * ### 2. Validate Input Fields
 * Use pre-defined methods to validate input fields:
 *
 * #### Example 1: Required Field Validation
 * ```javascript
 * // HTML
 * <input type="text" id="username" />
 *
 * // JavaScript
 * const isValid = validator.required($('#username'), 'Username is required.');
 * if (!isValid) {
 *   console.log('Validation failed: Username is required.');
 * }
 * ```
 *
 * #### Example 2: Email Validation
 * ```javascript
 * // HTML
 * <input type="email" id="email" />
 *
 * // JavaScript
 * const isValid = validator.email($('#email'), 'Invalid email address.');
 * if (!isValid) {
 *   console.log('Validation failed: Invalid email address.');
 * }
 * ```
 *
 * #### Example 3: Numeric Range Validation
 * ```javascript
 * // HTML
 * <input type="number" id="age" />
 *
 * // JavaScript
 * const isValid = validator.range($('#age'), 18, 99, 'Age must be between 18 and 99.');
 * if (!isValid) {
 *   console.log('Validation failed: Age must be between 18 and 99.');
 * }
 * ```
 *
 * ### 3. Asynchronous Validation
 * Use `asyncValidation` to validate fields that require server-side checks:
 *
 * ```javascript
 * // HTML
 * <input type="text" id="username" />
 *
 * // JavaScript
 * async function isUsernameAvailable(value) {
 *   const response = await fetch(`/api/check-username?username=${value}`);
 *   const result = await response.json();
 *   return result.available;
 * }
 *
 * (async () => {
 *   const isValid = await validator.asyncValidation($('#username'), isUsernameAvailable, 'Username is already taken.');
 *   if (!isValid) {
 *     console.log('Validation failed: Username is already taken.');
 *   }
 * })();
 * ```
 *
 * ### 4. Throw Validation Errors
 * Use `throwErrorMessage` to stop form submission if there are validation errors:
 *
 * ```javascript
 * // JavaScript
 * try {
 *   validator.required($('#email'), 'Email is required.');
 *   validator.email($('#email'), 'Invalid email address.');
 *   validator.throwErrorMessage('Form contains invalid fields.');
 *   console.log('Form submitted successfully!');
 * } catch (error) {
 *   console.error(error.message); // Displays the custom error message
 * }
 * ```
 *
 * ### 5. Custom Validation
 * Use `custom` to implement field-specific validation logic:
 *
 * ```javascript
 * // HTML
 * <input type="text" id="customField" />
 *
 * // JavaScript
 * const customValidation = (value) => value.startsWith('A'); // Example: Value must start with 'A'
 * const isValid = validator.custom($('#customField'), customValidation, 'Value must start with "A".');
 * if (!isValid) {
 *   console.log('Validation failed: Value must start with "A".');
 * }
 * ```
 *
 * ### 6. Handle Validation Errors in Bulk
 * Validate multiple fields and throw a single error message if any validation fails:
 *
 * ```javascript
 * // HTML
 * <input type="text" id="username" />
 * <input type="email" id="email" />
 * <input type="number" id="age" />
 *
 * // JavaScript
 * try {
 *   validator.required($('#username'), 'Username is required.');
 *   validator.email($('#email'), 'Invalid email address.');
 *   validator.range($('#age'), 18, 99, 'Age must be between 18 and 99.');
 *   validator.throwErrorMessage('Please fix the highlighted errors.');
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * ```
 *
 * ## Notes:
 * - Ensure to include jQuery in your project, as this class uses jQuery for element selection and manipulation.
 * - Some validation methods (e.g., `date`, `datetime`, `time`) rely on the `moment.js` library for date parsing and formatting.
 * - Error messages are dynamically displayed using the `parentClass` and `messageClass` properties. Customize these classes to match your CSS framework.
 *
 * ## Compatibility:
 * - Browser: Compatible with modern browsers (Chrome, Firefox, Edge, etc.).
 * - Frameworks: Integrates seamlessly with most CSS and JavaScript frameworks.
 *
 */
class Validator {

    /**
     * Initializes the `Validator` class.
     *
     * @property {number} errors - A counter for the number of validation errors.
     *                             Defaults to `0`.
     *
     * @property {Array} errorMessages - An array to store error messages for invalid fields.
     *                                   Defaults to an empty array `[]`.
     *
     * @property {string} parentClass - The CSS class of the parent container where validation styles/messages will be applied.
     *                                  Defaults to `.form-group`.
     *
     * @property {string} messageClass - The CSS class used to display validation messages.
     *                                   Defaults to `.validation-message`.
     *
     * @example
     * const validator = new Validator();
     * // validator.errors -> 0
     * // validator.errorMessages -> []
     * // validator.parentClass -> '.form-group'
     * // validator.messageClass -> '.validation-message'
     */
    constructor() {
        this.errors = 0;
        this.errorMessages = [];
        this.parentClass = '.form-group';
        this.messageClass = '.validation-message';
    }

    // ========================================================================
    // General Validation
    // ========================================================================

    /**
     * Validates that the input field is not empty.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<select>`, `<textarea>`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Wajib diisi.' for empty fields.
     *
     * @returns {boolean} - Returns `true` if the field is not empty, otherwise `false`.
     *
     * @example
     * validator.required($('#username'), 'Username is required.');
     */
    required(element, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="text"],input[type="email"],input[type="password"],input[type="number"],select,textarea') && element.val() === '') {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Wajib diisi.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        } else if (element.is('input[type="radio"],input[type="checkbox"]') && element.filter(':checked').val() === undefined) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Wajib dipilih.');
            element.on('change', () => this.#setErrorMessage(element));
            return false;
        } else if (element.is('input[type="file"]') && element.get(0).files.length === 0) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Wajib diunggah.');
            element.on('change', () => this.#setErrorMessage(element));
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validates that the field is required only if another field has a specific value.
     *
     * @param {jQuery} element - The field to validate (e.g., `<input>`, `<textarea>`).
     * @param {jQuery} otherElement - The field whose value determines if validation is required.
     * @param {string|number} expectedValue - The value of `otherElement` that triggers validation.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Field ini wajib diisi.' if left empty.
     *
     * @returns {boolean} - Returns `true` if validation passes, otherwise `false`.
     *
     * @example
     * validator.requiredIf($('#address'), $('#hasAddress'), 'yes', 'Address is required.');
     */
    requiredIf(element, otherElement, expectedValue, message = '') {
        this.#setErrorMessage(element);
        if (otherElement.val() === expectedValue && element.val() === '') {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Field ini wajib diisi.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the value of the field matches the value of another field.
     *
     * @param {jQuery} element - The field to validate.
     * @param {jQuery} targetElement - The field to compare against.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Input tidak sama.' if left empty.
     *
     * @returns {boolean} - Returns `true` if the values match, otherwise `false`.
     *
     * @example
     * validator.equalTo($('#confirmPassword'), $('#password'), 'Passwords must match.');
     */
    equalTo(element, targetElement, message = '') {
        this.#setErrorMessage(element);
        if (element.val() !== targetElement.val()) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Input tidak sama.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the field contains a boolean value.
     *
     * @param {jQuery} element - The field to validate.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Nilai harus berupa boolean.' if left empty.
     *
     * @returns {boolean} - Returns `true` if the value is a valid boolean, otherwise `false`.
     *
     * @example
     * validator.boolean($('#subscribe'), 'Invalid boolean value.');
     */
    boolean(element, message = '') {
        this.#setErrorMessage(element);
        const value = element.val();
        const validValues = [true, false, 'true', 'false', 1, 0, '1', '0'];
        if (!validValues.includes(value)) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Nilai harus berupa boolean.');
            element.on('change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    // ========================================================================
    // Text Validation
    // ========================================================================

    /**
     * Validates that the input value has at least the specified minimum number of characters.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {number} length - The minimum number of characters required.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Minimal {length} karakter.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.minLength($('#username'), 5, 'Username must be at least 5 characters.');
     */
    minLength(element, length, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="text"],input[type="email"],input[type="password"],textarea') && element.val().length < length) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Minimal ${length} karakter.`);
            element.on('keyup', () => this.#setErrorMessage(element));
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validates that the input value does not exceed the specified maximum number of characters.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {number} length - The maximum number of characters allowed.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Maksimal {length} karakter.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.maxLength($('#bio'), 200, 'Bio must not exceed 200 characters.');
     */
    maxLength(element, length, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="text"],input[type="email"],input[type="password"],textarea') && element.val().length > length) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Maksimal ${length} karakter.`);
            element.on('keyup', () => this.#setErrorMessage(element));
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validates that the input contains only alphabetic characters (letters, spaces, commas, and periods).
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tidak boleh mengandung angka.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.alphabetic($('#name'), 'Name must only contain letters.');
     */
    alphabetic(element, message = '') {
        this.#setErrorMessage(element);
        const alphabeticRegex = /^[a-zA-Z.,\s]*$/;

        if (!element.is('input[type="text"],textarea') || !alphabeticRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Tidak boleh mengandung angka.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }

        return true;
    }

    /**
     * Validates that the input contains only alphanumeric characters (letters, numbers, and spaces).
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Hanya boleh mengandung huruf dan angka.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.alphanumeric($('#username'), 'Username must only contain letters and numbers.');
     */
    alphanumeric(element, message = '') {
        this.#setErrorMessage(element);
        const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
        if (element.is('input[type="text"],textarea') && !alphanumericRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Hanya boleh mengandung huruf dan angka.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates the input value against a custom regular expression.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {RegExp} regex - The regular expression to test the input against.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Format input tidak sesuai.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * const regex = /^[a-z0-9_-]{3,15}$/; // Username: 3-15 characters, lowercase letters, numbers, _, -
     * validator.pattern($('#username'), regex, 'Invalid username format.');
     */
    pattern(element, regex, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="text"],textarea') && !regex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Format input tidak sesuai.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates the input value using a custom validator function.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {Function} validatorFunction - A custom function that takes the input value as an argument
     *                                        and returns `true` if valid, `false` otherwise.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Input tidak valid.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * const isEven = (value) => parseInt(value) % 2 === 0;
     * validator.custom($('#number'), isEven, 'The number must be even.');
     */
    custom(element, validatorFunction, message = '') {
        this.#setErrorMessage(element);
        if (!validatorFunction(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Input tidak valid.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    // ========================================================================
    // Numeric Validation
    // ========================================================================

    /**
     * Validates that the input contains only numeric characters (0-9).
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Hanya boleh mengandung angka.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.numeric($('#age'), 'Age must be a number.');
     */
    numeric(element, message = '') {
        this.#setErrorMessage(element);
        const numericRegex = /^[0-9]+$/;
        if (element.is('input[type="text"],input[type="number"],textarea') && !numericRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Hanya boleh mengandung angka.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value is not less than a specified minimum value.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {number} minValue - The minimum value allowed.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Nilai minimal adalah {minValue}.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.minValue($('#price'), 100, 'Price must be at least 100.');
     */
    minValue(element, minValue, message = '') {
        this.#setErrorMessage(element);
        const value = parseFloat(element.val());
        if (element.is('input[type="number"],input[type="text"]') && value < minValue) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Nilai minimal adalah ${minValue}.`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value does not exceed a specified maximum value.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {number} maxValue - The maximum value allowed.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Nilai maksimal adalah {maxValue}.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.maxValue($('#discount'), 50, 'Discount must not exceed 50%.');
     */
    maxValue(element, maxValue, message = '') {
        this.#setErrorMessage(element);
        const value = parseFloat(element.val());
        if (element.is('input[type="number"],input[type="text"]') && value > maxValue) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Nilai maksimal adalah ${maxValue}.`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value falls within a specified range (inclusive).
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input>`, `<textarea>`).
     * @param {number} minValue - The minimum value allowed.
     * @param {number} maxValue - The maximum value allowed.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Nilai harus antara {minValue} dan {maxValue}.'.
     *
     * @returns {boolean} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * validator.range($('#temperature'), -10, 50, 'Temperature must be between -10 and 50.');
     */
    range(element, minValue, maxValue, message = '') {
        this.#setErrorMessage(element);
        const value = parseFloat(element.val());
        if (element.is('input[type="number"],input[type="text"]') && (value < minValue || value > maxValue)) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Nilai harus antara ${minValue} dan ${maxValue}.`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    // ========================================================================
    // File Validation
    // ========================================================================

    /**
     * Validates that the uploaded file has an allowed MIME type.
     *
     * @param {jQuery} element - The file input field to validate (e.g., `<input type="file">`).
     * @param {string[]} allowedTypes - An array of allowed MIME types (e.g., `['image/jpeg', 'image/png']`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Format berkas tidak sesuai.'.
     *
     * @returns {boolean} - Returns `true` if the file type is valid, otherwise `false`.
     *
     * @example
     * validator.fileType($('#profilePicture'), ['image/jpeg', 'image/png'], 'Only JPEG and PNG files are allowed.');
     */
    fileType(element, allowedTypes, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="file"]') && element.get(0).files.length > 0) {
            const file = element.get(0).files[0];
            if (!allowedTypes.includes(file.type)) {
                this.errors++;
                this.#setErrorMessage(element, message !== '' ? message : 'Format berkas tidak sesuai.');
                element.on('change', () => this.#setErrorMessage(element));
                return false;
            }
        }
        return true;
    }

    /**
     * Validates that the uploaded file does not exceed a specified maximum size.
     *
     * @param {jQuery} element - The file input field to validate (e.g., `<input type="file">`).
     * @param {number} maxSize - The maximum file size allowed in bytes (e.g., `1048576` for 1 MB).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Ukuran file tidak boleh lebih dari {maxSize} MB.'.
     *
     * @returns {boolean} - Returns `true` if the file size is within the allowed limit, otherwise `false`.
     *
     * @example
     * validator.fileSize($('#resume'), 2097152, 'File size must not exceed 2 MB.');
     */
    fileSize(element, maxSize, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="file"]') && element.get(0).files.length > 0) {
            const file = element.get(0).files[0];
            if (file.size > maxSize) {
                this.errors++;
                const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(2);
                const errorMessage = message !== '' ? message : `Ukuran file tidak boleh lebih dari ${maxSizeInMB} MB.`;
                this.#setErrorMessage(element, errorMessage);
                element.on('change', () => this.#setErrorMessage(element));
                return false;
            }
        }
        return true;
    }

    /**
     * Validates that the uploaded file has an allowed file extension.
     *
     * @param {jQuery} element - The file input field to validate (e.g., `<input type="file">`).
     * @param {string[]} allowedExtensions - An array of allowed file extensions (e.g., `['jpg', 'png', 'pdf']`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Ekstensi file tidak diizinkan.'.
     *
     * @returns {boolean} - Returns `true` if the file extension is valid, otherwise `false`.
     *
     * @example
     * validator.fileExtension($('#uploadDocument'), ['pdf', 'docx'], 'Only PDF and DOCX files are allowed.');
     */
    fileExtension(element, allowedExtensions, message = '') {
        this.#setErrorMessage(element);
        if (element.is('input[type="file"]') && element.get(0).files.length > 0) {
            const file = element.get(0).files[0];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                this.errors++;
                this.#setErrorMessage(element, message !== '' ? message : 'Ekstensi file tidak diizinkan.');
                element.on('change', () => this.#setErrorMessage(element));
                return false;
            }
        }
        return true;
    }

    // ========================================================================
    // Date and Time Validation
    // ========================================================================

    /**
     * Validates that the input value is a valid date in the specified format.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="date">`).
     * @param {string} [format="YYYY-MM-DD"] - The expected date format (default is ISO date).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal tidak sesuai format {format}.'.
     *
     * @returns {boolean} - Returns `true` if the date is valid, otherwise `false`.
     *
     * @example
     * validator.date($('#birthDate'), 'YYYY-MM-DD', 'Invalid date format.');
     */
    date(element, format = 'YYYY-MM-DD', message = '') {
        this.#setErrorMessage(element);
        const dateValue = element.val();
        const isValidDate = moment(dateValue, format, true).isValid();
        if (element.is('input[type="text"],input[type="date"]') && !isValidDate) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Tanggal tidak sesuai format ${format}.`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value is a valid datetime in the specified format.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="datetime-local">`).
     * @param {string} [format="YYYY-MM-DD HH:mm:ss"] - The expected datetime format (default is ISO datetime).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Format tanggal dan waktu tidak sesuai ({format}).'.
     *
     * @returns {boolean} - Returns `true` if the datetime is valid, otherwise `false`.
     *
     * @example
     * validator.datetime($('#appointmentTime'), 'YYYY-MM-DD HH:mm', 'Invalid datetime format.');
     */
    datetime(element, format = 'YYYY-MM-DD HH:mm:ss', message = '') {
        this.#setErrorMessage(element);
        const datetimeValue = element.val();
        const isValidDatetime = moment(datetimeValue, format, true).isValid();
        if (element.is('input[type="text"],input[type="datetime-local"]') && !isValidDatetime) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Format tanggal dan waktu tidak sesuai (${format}).`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value is a valid time in the specified format.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="time">`).
     * @param {string} [format="HH:mm:ss"] - The expected time format (default is ISO time).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Format waktu tidak sesuai ({format}).'.
     *
     * @returns {boolean} - Returns `true` if the time is valid, otherwise `false`.
     *
     * @example
     * validator.time($('#meetingTime'), 'HH:mm', 'Invalid time format.');
     */
    time(element, format = 'HH:mm:ss', message = '') {
        this.#setErrorMessage(element);
        const timeValue = element.val();
        const isValidTime = moment(timeValue, format, true).isValid();
        if (element.is('input[type="text"],input[type="time"]') && !isValidTime) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : `Format waktu tidak sesuai (${format}).`);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input date is not earlier than the specified minimum date.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="date">`).
     * @param {string} minDate - The minimum date allowed, in the specified format.
     * @param {string} [format="YYYY-MM-DD"] - The expected date format (default is ISO date).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal tidak boleh sebelum {minDate}.'.
     *
     * @returns {boolean} - Returns `true` if the date is valid, otherwise `false`.
     *
     * @example
     * validator.minDate($('#eventDate'), '2023-01-01', 'YYYY-MM-DD', 'Date cannot be earlier than January 1, 2023.');
     */
    minDate(element, minDate, format = 'YYYY-MM-DD', message = '') {
        this.#setErrorMessage(element);
        const dateValue = moment(element.val(), format, true);
        const min = moment(minDate, format, true);

        if (element.is('input[type="text"],input[type="date"]') && (!dateValue.isValid() || dateValue.isBefore(min))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal tidak boleh sebelum ${min.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input date is not later than the specified maximum date.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="date">`).
     * @param {string} maxDate - The maximum date allowed, in the specified format.
     * @param {string} [format="YYYY-MM-DD"] - The expected date format (default is ISO date).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal tidak boleh setelah {maxDate}.'.
     *
     * @returns {boolean} - Returns `true` if the date is valid, otherwise `false`.
     *
     * @example
     * validator.maxDate($('#eventDate'), '2023-12-31', 'YYYY-MM-DD', 'Date cannot be later than December 31, 2023.');
     */
    maxDate(element, maxDate, format = 'YYYY-MM-DD', message = '') {
        this.#setErrorMessage(element);
        const dateValue = moment(element.val(), format, true);
        const max = moment(maxDate, format, true);

        if (element.is('input[type="text"],input[type="date"]') && (!dateValue.isValid() || dateValue.isAfter(max))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal tidak boleh setelah ${max.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input datetime is not earlier than the specified minimum datetime.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="datetime-local">`).
     * @param {string} minDatetime - The minimum datetime allowed, in the specified format.
     * @param {string} [format="YYYY-MM-DD HH:mm:ss"] - The expected datetime format (default is ISO datetime).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal dan waktu tidak boleh sebelum {minDatetime}.'.
     *
     * @returns {boolean} - Returns `true` if the datetime is valid, otherwise `false`.
     *
     * @example
     * validator.minDatetime($('#appointmentTime'), '2023-01-01 08:00:00', 'YYYY-MM-DD HH:mm:ss', 'Datetime cannot be earlier than January 1, 2023, 8:00 AM.');
     */
    minDatetime(element, minDatetime, format = 'YYYY-MM-DD HH:mm:ss', message = '') {
        this.#setErrorMessage(element);
        const datetimeValue = moment(element.val(), format, true);
        const min = moment(minDatetime, format, true);

        if (element.is('input[type="text"],input[type="datetime-local"]') && (!datetimeValue.isValid() || datetimeValue.isBefore(min))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal dan waktu tidak boleh sebelum ${min.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input datetime is not later than the specified maximum datetime.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="datetime-local">`).
     * @param {string} maxDatetime - The maximum datetime allowed, in the specified format.
     * @param {string} [format="YYYY-MM-DD HH:mm:ss"] - The expected datetime format (default is ISO datetime).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal dan waktu tidak boleh setelah {maxDatetime}.'.
     *
     * @returns {boolean} - Returns `true` if the datetime is valid, otherwise `false`.
     *
     * @example
     * validator.maxDatetime($('#appointmentTime'), '2023-12-31 18:00:00', 'YYYY-MM-DD HH:mm:ss', 'Datetime cannot be later than December 31, 2023, 6:00 PM.');
     */
    maxDatetime(element, maxDatetime, format = 'YYYY-MM-DD HH:mm:ss', message = '') {
        this.#setErrorMessage(element);
        const datetimeValue = moment(element.val(), format, true);
        const max = moment(maxDatetime, format, true);

        if (element.is('input[type="text"],input[type="datetime-local"]') && (!datetimeValue.isValid() || datetimeValue.isAfter(max))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal dan waktu tidak boleh setelah ${max.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input date falls within a specified range.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="date">`).
     * @param {string} startDate - The start date of the range, in the specified format.
     * @param {string} endDate - The end date of the range, in the specified format.
     * @param {string} [format="YYYY-MM-DD"] - The expected date format (default is ISO date).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal harus antara {startDate} dan {endDate}.'.
     *
     * @returns {boolean} - Returns `true` if the date is valid, otherwise `false`.
     *
     * @example
     * validator.dateBetween($('#eventDate'), '2023-01-01', '2023-12-31', 'YYYY-MM-DD', 'Date must be between January 1 and December 31, 2023.');
     */
    dateBetween(element, startDate, endDate, format = 'YYYY-MM-DD', message = '') {
        this.#setErrorMessage(element);
        const dateValue = moment(element.val(), format, true);
        const start = moment(startDate, format, true);
        const end = moment(endDate, format, true);

        if (element.is('input[type="text"],input[type="date"]') && (!dateValue.isValid() || !dateValue.isBetween(start, end, null, '[]'))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal harus antara ${start.format(format)} dan ${end.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input datetime falls within a specified range.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="text">`, `<input type="datetime-local">`).
     * @param {string} startDatetime - The start datetime of the range, in the specified format.
     * @param {string} endDatetime - The end datetime of the range, in the specified format.
     * @param {string} [format="YYYY-MM-DD HH:mm:ss"] - The expected datetime format (default is ISO datetime).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Tanggal dan waktu harus antara {startDatetime} dan {endDatetime}.'.
     *
     * @returns {boolean} - Returns `true` if the datetime is valid, otherwise `false`.
     *
     * @example
     * validator.datetimeBetween($('#appointmentTime'), '2023-01-01 08:00:00', '2023-12-31 18:00:00', 'YYYY-MM-DD HH:mm:ss', 'Datetime must be between January 1, 2023, 8:00 AM and December 31, 2023, 6:00 PM.');
     */
    datetimeBetween(element, startDatetime, endDatetime, format = 'YYYY-MM-DD HH:mm:ss', message = '') {
        this.#setErrorMessage(element);
        const datetimeValue = moment(element.val(), format, true);
        const start = moment(startDatetime, format, true);
        const end = moment(endDatetime, format, true);

        if (element.is('input[type="text"],input[type="datetime-local"]') && (!datetimeValue.isValid() || !datetimeValue.isBetween(start, end, null, '[]'))) {
            this.errors++;
            const errorMessage = message !== '' ? message : `Tanggal dan waktu harus antara ${start.format(format)} dan ${end.format(format)}.`;
            this.#setErrorMessage(element, errorMessage);
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    // ========================================================================
    // Format Validation
    // ========================================================================

    /**
     * Validates that the input value is a valid email address.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="email">`, `<input type="text">`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Email tidak sesuai format'.
     *
     * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
     *
     * @example
     * validator.email($('#email'), 'Please enter a valid email address.');
     */
    email(element, message = '') {
        this.#setErrorMessage(element);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (element.is('input[type="text"],input[type="email"]') && !emailRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Email tidak sesuai format');
            element.on('keyup', () => this.#setErrorMessage(element));
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validates that the input value is a valid URL.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="url">`, `<input type="text">`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'URL tidak sesuai format.'.
     *
     * @returns {boolean} - Returns `true` if the URL is valid, otherwise `false`.
     *
     * @example
     * validator.url($('#website'), 'Please enter a valid URL.');
     */
    url(element, message = '') {
        this.#setErrorMessage(element);
        const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/;
        if (element.is('input[type="text"],input[type="url"]') && !urlRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'URL tidak sesuai format.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    /**
     * Validates that the input value is a valid phone number format.
     *
     * @param {jQuery} element - The input field to validate (e.g., `<input type="tel">`, `<input type="text">`).
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Nomor telepon tidak valid.'.
     *
     * @returns {boolean} - Returns `true` if the phone number format is valid, otherwise `false`.
     *
     * @example
     * validator.phoneNumber($('#contact'), 'Please enter a valid phone number.');
     */
    phoneNumber(element, message = '') {
        this.#setErrorMessage(element);
        const phoneRegex = /^[0-9+\s()-]+$/;
        if (element.is('input[type="text"],input[type="tel"]') && !phoneRegex.test(element.val())) {
            this.errors++;
            this.#setErrorMessage(element, message !== '' ? message : 'Nomor telepon tidak valid.');
            element.on('keyup change', () => this.#setErrorMessage(element));
            return false;
        }
        return true;
    }

    // ========================================================================
    // Asynchronous Validation
    // ========================================================================

    /**
     * Performs asynchronous validation using a provided validator function.
     *
     * @param {jQuery} element - The input field to validate.
     * @param {Function} asyncValidatorFunction - A function that returns a `Promise` resolving to `true` if valid and `false` otherwise.
     * @param {string} [message=""] - Custom error message to display if validation fails.
     *                                Defaults to 'Input tidak valid.'.
     *
     * @returns {Promise<boolean>} - Returns `true` if the validation passes, otherwise `false`.
     *
     * @example
     * async function isUsernameAvailable(value) {
     *     const response = await fetch(`/api/check-username?username=${value}`);
     *     const result = await response.json();
     *     return result.available;
     * }
     *
     * await validator.asyncValidation($('#username'), isUsernameAvailable, 'Username is already taken.');
     */
    async asyncValidation(element, asyncValidatorFunction, message = '') {
        this.#setErrorMessage(element);
        try {
            const isValid = await asyncValidatorFunction(element.val());
            if (!isValid) {
                this.errors++;
                this.#setErrorMessage(element, message !== '' ? message : 'Input tidak valid.');
                element.on('keyup change', () => this.#setErrorMessage(element));
                return false;
            }
        } catch (error) {
            this.errors++;
            this.#setErrorMessage(element, 'Terjadi kesalahan saat validasi.');
            return false;
        }
        return true;
    }

    // ========================================================================
    // Additional Methods
    // ========================================================================

    /**
     * Validates multiple fields using a batch of validation rules.
     *
     * This method allows you to specify an array of validation rules, each containing
     * a method name and its corresponding arguments. It sequentially executes the
     * specified validation methods and throws an error if any validation fails.
     *
     * @param {Array} validations - An array of validation rules. Each rule should be an object with:
     *   - `method` {string}: The name of the validation method to call (e.g., 'required', 'email').
     *   - `args` {Array}: An array of arguments to pass to the validation method.
     *
     * @throws {Error} - Throws an error if any of the validations fail. The error message can be customized
     *                   through the `throwErrorMessage` method.
     *
     * @example
     * // HTML
     * <input type="text" id="username" />
     * <input type="email" id="email" />
     * <input type="number" id="age" />
     *
     * // JavaScript
     * const validator = new Validator();
     *
     * try {
     *   validator.validateFields([
     *     { method: 'required', args: [$('#username'), 'Username is required.'] },
     *     { method: 'email', args: [$('#email'), 'Please provide a valid email address.'] },
     *     { method: 'range', args: [$('#age'), 18, 99, 'Age must be between 18 and 99.'] }
     *   ]);
     *   console.log('All validations passed.');
     * } catch (error) {
     *   console.error('Validation failed:', error.message);
     * }
     */
    validateFields(validations) {
        validations.forEach(validation => {
            const { method, args } = validation;
            this[method](...args);
        });
        this.throwErrorMessage();
    }

    /**
     * Throws an error if there are validation errors.
     *
     * @param {string} [message="Masih ada form yang belum diisi atau salah."] - The error message to throw.
     *
     * @throws {Error} - Throws an error with the provided message if there are validation errors.
     *                   Logs the validation errors to the console.
     *
     * @example
     * validator.throwErrorMessage('Some fields are invalid. Please correct them.');
     */
    throwErrorMessage(message = 'Masih ada form yang belum diisi atau salah.') {
        if (this.errors >= 1) {
            console.error({ validationErrors: this.errorMessages });
            throw new Error(message);
        };
    }

    /**
     * Private method: Updates the error message and applies styling to indicate invalid fields.
     *
     * @param {jQuery} element - The input field to mark as invalid.
     * @param {string} [message=""] - The error message to display. If empty, removes the invalid state.
     *
     * @private
     *
     * @example
     * // Automatically called by validation methods to display error messages.
     */
    #setErrorMessage(element, message = '') {
        if (element.is('select')) {
            element.closest(this.parentClass).find('.select2-selection').toggleClass('is-invalid', message !== '');
            message !== '' ? this.errorMessages.push({ element: element.attr('id'), message: message }) : false;
        };
        element.toggleClass('is-invalid', message !== '');
        message !== '' ? this.errorMessages.push({ element: '#' + element.attr('id'), message: message }) : false;
        element.closest(this.parentClass).find(this.messageClass).html(message);
    }

}
