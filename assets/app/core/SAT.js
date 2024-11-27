class SAT {

    static Format = {

        /**
         * Converts a number to Roman numerals.
         * @param {number} num - The number to convert.
         * @returns {string} - Roman numeral representation.
         */
        ToRoman: function (num) {
            if (isNaN(num)) return '';
            const romanNumerals = [
                { value: 1000, numeral: 'M' },
                { value: 900, numeral: 'CM' },
                { value: 500, numeral: 'D' },
                { value: 400, numeral: 'CD' },
                { value: 100, numeral: 'C' },
                { value: 90, numeral: 'XC' },
                { value: 50, numeral: 'L' },
                { value: 40, numeral: 'XL' },
                { value: 10, numeral: 'X' },
                { value: 9, numeral: 'IX' },
                { value: 5, numeral: 'V' },
                { value: 4, numeral: 'IV' },
                { value: 1, numeral: 'I' },
            ];
            let result = '';
            romanNumerals.forEach(({ value, numeral }) => {
                while (num >= value) {
                    result += numeral;
                    num -= value;
                }
            });
            return result;
        },

        /**
         * Converts a date string (YYYY-MM-DD) to a readable format.
         * @param {string} date - The date string in YYYY-MM-DD format.
         * @param {string} locale - Locale for month names (default: 'id').
         * @returns {string} - Formatted date (e.g., "15 Desember 2023").
         */
        ToDate: function (date, locale = 'id') {
            const [year, month, day] = date.split('-');
            return `${parseInt(day)} ${this._getMonthName(month, locale)} ${year}`;
        },

        /**
         * Converts a datetime string (YYYY-MM-DD HH:mm:ss) to a readable format with time.
         * @param {string} datetime - The datetime string in YYYY-MM-DD HH:mm:ss format.
         * @param {string} locale - Locale for month names (default: 'id').
         * @returns {string} - Formatted datetime (e.g., "15 Desember 2023 pukul 14:30").
         */
        ToDateTime: function (datetime, locale = 'id') {
            const [date, time] = datetime.split(' ');
            const formattedDate = this.ToDate(date, locale);
            const [hour, minute] = time.split(':');
            return `${formattedDate} pukul ${hour}:${minute}`;
        },

        /**
         * Converts a date string to a readable format with the day name.
         * @param {string} date - The date string in YYYY-MM-DD format.
         * @param {string} locale - Locale for day and month names (default: 'id').
         * @returns {string} - Formatted date with day name (e.g., "Jumat, 15 Desember 2023").
         */
        ToDateWithDay: function (date, locale = 'id') {
            const [year, month, day] = date.split('-');
            const dateObject = new Date(year, parseInt(month) - 1, day);
            const dayName = this._getDayName(dateObject.getDay(), locale);
            return `${dayName}, ${parseInt(day)} ${this._getMonthName(month, locale)} ${year}`;
        },

        /**
         * Converts a datetime string to a readable format with the day name and time.
         * @param {string} datetime - The datetime string in YYYY-MM-DD HH:mm:ss format.
         * @param {string} locale - Locale for day and month names (default: 'id').
         * @returns {string} - Formatted datetime with day name (e.g., "Jumat, 15 Desember 2023 pukul 14:30").
         */
        ToDateTimeWithDay: function (datetime, locale = 'id') {
            const [date, time] = datetime.split(' ');
            const formattedDate = this.ToDateWithDay(date, locale);
            const [hour, minute] = time.split(':');
            return `${formattedDate} pukul ${hour}:${minute}`;
        },

        /**
         * Formats a number to Indonesian currency.
         * @param {number|string} price - The price to format.
         * @param {string} locale - Locale for currency formatting (default: 'id-ID').
         * @returns {string} - Formatted price (e.g., "1.000.000").
         */
        ToPrice: function (price, locale = 'id-ID') {
            return parseInt(price).toLocaleString(locale);
        },

        /**
         * Formats a phone number to an Indonesian standard format.
         * @param {string} phoneNumber - The phone number to format.
         * @returns {string} - Formatted phone number (e.g., "+62 812-3456-7890").
         */
        ToPhoneNumber: function (phoneNumber) {
            let formattedNumber = phoneNumber.replace(/^0/, '+62 ');
            return formattedNumber.replace(/(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        },

        /**
         * Gets the month name for a given month number.
         * @private
         * @param {string} month - The month number (01-12).
         * @param {string} locale - Locale for month names (default: 'id').
         * @returns {string} - Month name (e.g., "Desember").
         */
        _getMonthName: function (month, locale = 'id') {
            const months = {
                'id': [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ],
                'en': [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };
            return months[locale][parseInt(month) - 1];
        },

        /**
         * Gets the day name for a given day index.
         * @private
         * @param {number} dayIndex - The day index (0-6, where 0 is Sunday).
         * @param {string} locale - Locale for day names (default: 'id').
         * @returns {string} - Day name (e.g., "Jumat").
         */
        _getDayName: function (dayIndex, locale = 'id') {
            const days = {
                'id': ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            };
            return days[locale][dayIndex];
        }

    };

    static Parse = {

        /**
         * Converts a readable date string to a standardized YYYY-MM-DD format.
         * @param {string} dateString - The date string (e.g., "15 Desember 2023").
         * @returns {string} - The date in YYYY-MM-DD format.
         */
        ToDate: function (dateString) {
            const datePattern = /^(?:\w+,?\s*)?(\d{1,2})\s+(\w+)\s+(\d{4})/i;
            const match = dateString.match(datePattern);

            if (!match) throw new Error('Format tanggal tidak dikenali.');

            const [, day, monthName, year] = match;
            const month = this._getMonthNumber(monthName);

            if (month === -1) throw new Error('Nama bulan tidak valid.');

            return `${year}-${this._padZero(month)}-${this._padZero(day)}`;
        },

        /**
         * Converts a readable datetime string to a standardized YYYY-MM-DD HH:mm:ss format.
         * @param {string} dateTimeString - The datetime string (e.g., "15 Desember 2023 pukul 14:30").
         * @returns {string} - The datetime in YYYY-MM-DD HH:mm:ss format.
         */
        ToDateTime: function (dateTimeString) {
            const dateTimePattern = /^(?:\w+,?\s*)?(\d{1,2})\s+(\w+)\s+(\d{4})\s+pukul\s+(\d{1,2}):(\d{2})/i;
            const match = dateTimeString.match(dateTimePattern);

            if (!match) throw new Error('Format tanggal dan waktu tidak dikenali.');

            const [, day, monthName, year, hour, minute] = match;
            const month = this._getMonthNumber(monthName);

            if (month === -1) throw new Error('Nama bulan tidak valid.');

            return `${year}-${this._padZero(month)}-${this._padZero(day)} ${this._padZero(hour)}:${this._padZero(minute)}:00`;
        },

        /**
         * Converts a month name to its number.
         * @private
         * @param {string} monthName - The name of the month (e.g., "Desember").
         * @returns {number} - The month number (1-12) or -1 if invalid.
         */
        _getMonthNumber: function (monthName) {
            const months = [
                'januari', 'februari', 'maret', 'april', 'mei', 'juni',
                'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
            ];

            const index = months.indexOf(monthName.toLowerCase());
            return index !== -1 ? index + 1 : -1;
        },

        /**
         * Pads a number with a leading zero if necessary.
         * @private
         * @param {number|string} num - The number to pad.
         * @returns {string} - The padded number (e.g., "01").
         */
        _padZero: (num) => num.toString().padStart(2, '0')

    };

    static Element = {

        /**
         * Shows the specified element by removing the `d-none` class.
         *
         * @param {jQuery} element - The element to show.
         *
         * @returns {void}
         *
         * @example
         * // Show an element
         * Element.Show($('#myElement'));
         */
        Show: (element) => element.toggleClass('d-none', false),

        /**
         * Hides the specified element by adding the `d-none` class.
         *
         * @param {jQuery} element - The element to hide.
         *
         * @returns {void}
         *
         * @example
         * // Hide an element
         * Element.Hide($('#myElement'));
         */
        Hide: (element) => element.toggleClass('d-none', true),

        /**
         * Enables a form element by removing the `disabled` property and `disabled` class.
         *
         * @param {jQuery} element - The form element to enable.
         *
         * @returns {void}
         *
         * @example
         * // Enable a form element
         * Element.Enable($('#myInput'));
         */
        Enable: (element) => element.prop('disabled', false).toggleClass('disabled', false),

        /**
         * Disables a form element by adding the `disabled` property and `disabled` class.
         *
         * @param {jQuery} element - The form element to disable.
         *
         * @returns {void}
         *
         * @example
         * // Disable a form element
         * Element.Disable($('#myInput'));
         */
        Disable: (element) => element.prop('disabled', true).toggleClass('disabled', true),

        /**
         * Clears the value of the specified form element and triggers a change event.
         *
         * @param {jQuery} element - The form element to clear.
         *
         * @returns {void}
         *
         * @example
         * // Empty an input field
         * Element.Empty($('#myInput'));
         */
        Empty: (element) => element.val('').change(),

        /**
         * Makes the specified element and its container (if provided) visible and enabled.
         *
         * @param {jQuery} element - The element to appear.
         * @param {string|null} [class_container=null] - The class of the container element to show (optional).
         *
         * @returns {void}
         *
         * @example
         * // Make an element appear along with its container
         * Element.Appear($('#myInput'), '.myContainer');
         */
        Appear: (element, class_container = null) => {
            if (class_container) element.closest(class_container).toggleClass('d-none', false);
            element.prop('disabled', false).toggleClass('disabled', false);
        },

        /**
         * Hides, disables, and clears the value of the specified element and its container (if provided).
         *
         * @param {jQuery} element - The element to vanish.
         * @param {string|null} [class_container=null] - The class of the container element to hide (optional).
         *
         * @returns {void}
         *
         * @example
         * // Hide, disable, and clear an element along with its container
         * Element.Vanish($('#myInput'), '.myContainer');
         */
        Vanish: (element, class_container = null) => {
            if (class_container) element.closest(class_container).toggleClass('d-none', true);
            element.prop('disabled', true).toggleClass('disabled', true);
            element.val('').change();
        }

    };

    static Form = {

        /**
         * Populates a `<select>` element with options based on the provided configuration.
         *
         * This method is versatile and supports scenarios such as:
         * - Single or multiple selections.
         * - Adding a placeholder or "Other" option.
         * - Customizing option attributes (e.g., adding data attributes).
         *
         * @param {Object} config - The configuration object for populating the select element.
         * @param {HTMLElement} config.element - The `<select>` DOM element to populate.
         * @param {Array<Object>} [config.items=[]] - An array of objects representing the options.
         * @param {string} [config.valueKey="value"] - The key in each item object to use as the option's value.
         * @param {string} [config.textKey="text"] - The key in each item object to use as the option's display text.
         * @param {string|Array<string>} [config.selectedValue=null] - The value(s) to be pre-selected.
         *                                                          Can be a single value or an array of values for multiple selects.
         * @param {string} [config.placeholder="Select an option..."] - The text for the placeholder option.
         * @param {boolean} [config.includePlaceholder=true] - Whether to include a placeholder option.
         * @param {boolean} [config.addOtherOption=false] - Whether to include an "Other" option.
         * @param {string} [config.otherOptionText="Other"] - The display text for the "Other" option.
         * @param {string} [config.otherOptionValue="Other"] - The value for the "Other" option.
         * @param {boolean} [config.multiple=false] - Whether the select element allows multiple selections.
         * @param {Function} [config.optionAttributes=(item) => ({})] - A function to add custom attributes to the option elements.
         *                                                             Receives the item object as an argument and returns an object of attributes.
         *
         * @returns {void}
         *
         * @example
         * // Populate a single-select dropdown with a placeholder
         * SAT.Form.PopulateSelect({
         *   element: document.getElementById('mySelect'),
         *   items: [
         *     { id: 1, name: 'Option 1' },
         *     { id: 2, name: 'Option 2' },
         *   ],
         *   valueKey: 'id',
         *   textKey: 'name',
         *   selectedValue: 2,
         *   placeholder: 'Please select an option',
         * });
         *
         * @example
         * // Populate a multi-select dropdown with custom attributes
         * SAT.Form.PopulateSelect({
         *   element: document.getElementById('myMultiSelect'),
         *   items: [
         *     { id: 'A', label: 'Alpha', group: 'Group A' },
         *     { id: 'B', label: 'Beta', group: 'Group B' },
         *   ],
         *   valueKey: 'id',
         *   textKey: 'label',
         *   selectedValue: ['A'],
         *   multiple: true,
         *   optionAttributes: (item) => ({ 'data-group': item.group }),
         * });
         *
         * @example
         * // Populate a dropdown with an "Other" option
         * SAT.Form.PopulateSelect({
         *   element: document.getElementById('colorSelect'),
         *   items: [
         *     { value: 'red', text: 'Red' },
         *     { value: 'blue', text: 'Blue' },
         *   ],
         *   selectedValue: 'Other',
         *   addOtherOption: true,
         *   otherOptionText: 'Custom Color',
         *   otherOptionValue: 'Other',
         * });
         */
        PopulateSelect: function ({
            element,
            items = [],
            valueKey = 'value',
            textKey = 'text',
            selectedValue = null,
            placeholder = 'Select an option...',
            includePlaceholder = true,
            addOtherOption = false,
            otherOptionText = 'Other',
            otherOptionValue = 'Other',
            multiple = false,
            optionAttributes = (item) => ({})
        }) {

        // Clear existing options
        element.innerHTML = "";

        // Add placeholder option if required and if not a multiple select
        if (includePlaceholder && !multiple) {
            const placeholderOption = new Option(placeholder, '', false, false);
            placeholderOption.disabled = true;
            placeholderOption.hidden = true;
            element.append(placeholderOption);
        }

        // Add items to the select element
        items.forEach(item => {
            const value = item[valueKey];
            const text = item[textKey];
            const isSelected = multiple
                ? Array.isArray(selectedValue) && selectedValue.includes(value)
                : value === selectedValue;

            const option = new Option(text, value, false, isSelected);

            // Add custom attributes to the option if provided
            const attributes = optionAttributes(item);
            Object.keys(attributes).forEach(attr => {
                option.setAttribute(attr, attributes[attr]);
            });

            element.append(option);
        });

        // Add "Other" option if required
        if (addOtherOption) {
            const isSelected = multiple
                ? Array.isArray(selectedValue) && selectedValue.includes(otherOptionValue)
                : otherOptionValue === selectedValue;

            const otherOption = new Option(otherOptionText, otherOptionValue, false, isSelected);
            element.append(otherOption);
        }
        },

        /**
         * Enables a datepicker on the specified element with customizable options.
         *
         * This method leverages the Tempus Dominus library to create a flexible datepicker.
         * It supports various configurations like localization, date/time restrictions, and formatting.
         *
         * @param {Object} config - The configuration object for the datepicker.
         * @param {string} config.id - The ID of the input element where the datepicker will be enabled.
         * @param {string} [config.locale="id"] - The locale for the datepicker (default: 'id' for Indonesian).
         * @param {string|null} [config.maxDate=null] - The maximum selectable date (format: YYYY-MM-DD or ISO).
         * @param {string|null} [config.minDate=null] - The minimum selectable date (format: YYYY-MM-DD or ISO).
         * @param {string|null} [config.defaultDate=null] - The default selected date (format: YYYY-MM-DD or ISO).
         * @param {string} [config.format="DD MMMM YYYY"] - The format for displaying the selected date.
         * @param {boolean} [config.enableTime=false] - Whether to enable time selection.
         * @param {number} [config.timeStep=1] - The step interval for time selection in minutes.
         * @param {Object} [config.options={}] - Additional customization options for Tempus Dominus.
         *
         * @returns {Object} - Returns the initialized Tempus Dominus instance for further manipulation.
         *
         * @example
         * // Basic datepicker with default options
         * SAT.Form.EnableDatePicker({
         *   id: 'dateInput',
         * });
         *
         * @example
         * // Datepicker with minimum and maximum date restrictions
         * SAT.Form.EnableDatePicker({
         *   id: 'eventDate',
         *   minDate: '2023-01-01',
         *   maxDate: '2023-12-31',
         *   format: 'DD/MM/YYYY',
         * });
         *
         * @example
         * // Date and time picker with a default date
         * SAT.Form.EnableDatePicker({
         *   id: 'appointmentTime',
         *   enableTime: true,
         *   defaultDate: '2023-05-15T10:30:00',
         *   timeStep: 15,
         *   format: 'DD MMM YYYY, HH:mm',
         * });
         *
         * @example
         * // Fully customized datepicker
         * SAT.Form.EnableDatePicker({
         *   id: 'customPicker',
         *   locale: 'en',
         *   minDate: '2023-03-01',
         *   maxDate: '2023-06-30',
         *   enableTime: true,
         *   timeStep: 30,
         *   options: {
         *     display: {
         *       inline: true, // Show inline instead of a dropdown
         *     },
         *   },
         * });
         */
        EnableDatePicker: function (id) {
            const form = document.getElementById(id);
            const datepicker = new tempusDominus.TempusDominus(form, {
                localization: { locale: 'id' },
                restrictions: { maxDate: (new tempusDominus.DateTime()).endOf('hours') }
            });
            datepicker.dates.formatInput = (date) => { return moment(date).locale('id').format('DD MMMM YYYY') }
        }

    };

    static Swal = {

        /**
         * Displays an error alert using SweetAlert2.
         *
         * @param {Object} config - The configuration object for the error alert.
         * @param {string} [config.title="Oops. Terjadi kesalahan"] - The title of the alert.
         * @param {string} [config.message=""] - The message or text to display in the alert.
         *
         * @example
         * // Show an error alert with default title
         * MyClass.Swal.FireError({ message: 'Terjadi kesalahan saat menyimpan data.' });
         *
         * @example
         * // Show an error alert with a custom title
         * MyClass.Swal.FireError({ title: 'Error', message: 'Formulir tidak valid.' });
         */
        FireError: function ({ title = 'Oops. Terjadi kesalahan', message = '' }) {
            Swal.fire({
                title: title,
                text: message,
                icon: "error",
                showConfirmButton: false
            });
        },

        /**
         * Displays a success alert using SweetAlert2.
         *
         * @param {Object} config - The configuration object for the success alert.
         * @param {string} [config.title="Berhasil"] - The title of the alert.
         * @param {string} [config.message=""] - The message or text to display in the alert.
         *
         * @example
         * // Show a success alert with default title
         * MyClass.Swal.FireSuccess({ message: 'Data berhasil disimpan.' });
         *
         * @example
         * // Show a success alert with a custom title
         * MyClass.Swal.FireSuccess({ title: 'Sukses!', message: 'Akun berhasil dibuat.' });
         */
        FireSuccess: function ({ title = 'Berhasil', message = '' }) {
            Swal.fire({
                title: title,
                text: message,
                icon: "success",
                showConfirmButton: false
            });
        },

        /**
         * Displays a confirmation dialog using SweetAlert2.
         *
         * @param {Object} config - The configuration object for the confirmation alert.
         * @param {string} [config.title="Anda yakin?"] - The title of the confirmation dialog.
         * @param {string} [config.message=""] - The message or text to display in the dialog.
         * @param {Function} [config.confirmCallback=()=>{}] - The callback function to execute if "Yes" is confirmed.
         * @param {Function} [config.cancelCallback=()=>{}] - The callback function to execute if "No" is selected.
         *
         * @example
         * // Show a confirmation dialog
         * MyClass.Swal.FireConfirm({
         *   title: 'Konfirmasi',
         *   message: 'Apakah Anda yakin ingin menghapus data ini?',
         *   confirmCallback: () => { console.log('Data dihapus.'); },
         *   cancelCallback: () => { console.log('Aksi dibatalkan.'); }
         * });
         */
        FireConfirm: ({ title = 'Anda yakin?', message = '', confirmCallback = () => {}, cancelCallback = () => {} }) => {
            Swal.fire({
                title,
                text: message,
                allowOutsideClick: false,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmCallback();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    cancelCallback();
                }
            });
        },

        /**
         * Displays a loading alert using SweetAlert2.
         *
         * @param {string} [message="Tunggu sebentar..."] - The message to display in the loading alert.
         *
         * @example
         * // Show a loading alert
         * MyClass.Swal.FireLoading('Memuat data...');
         */
        FireLoading: (message = 'Tunggu sebentar...') => {
            Swal.fire({
                title: message,
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }

    };

    static Util = {

        /**
         * Anonymizes an email address by masking part of the local part (before the "@" symbol).
         *
         * The method retains a portion of the local part (defaulting to 3 characters, or 1 if the local part is very short),
         * and replaces the remaining characters with asterisks (*), while leaving the domain intact.
         *
         * @param {string} email - The email address to anonymize (e.g., "example@gmail.com").
         * @returns {string} - The anonymized email address (e.g., "exa*******@gmail.com").
         *
         * @example
         * // Anonymize a standard email
         * const anonymized = SATV2.AnonymizeText("example@gmail.com");
         * console.log(anonymized); // Output: "exa*******@gmail.com"
         *
         * @example
         * // Anonymize a short local part
         * const anonymized = SATV2.AnonymizeText("ab@domain.com");
         * console.log(anonymized); // Output: "a*@domain.com"
         */
        AnonymizeText: function (email) {
            let parts = email.split("@");
            let localPart = parts[0];
            let domain = parts[1];
            let visibleCount = localPart.length < 4 ? 1 : 3;
            let anonymizedLocalPart = localPart.substring(0, visibleCount) + '*'.repeat(localPart.length - visibleCount);
            return anonymizedLocalPart + "@" + domain;
        }

    }

}
