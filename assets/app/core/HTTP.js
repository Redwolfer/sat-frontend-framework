class HTTP {

    /**
     * API Base URLs
     */
    static API_PMB = $('#base-api-pmb').attr('href');
    static API_STORAGE = $('#base-api-storage').attr('href');

    /**
     * Makes an HTTP request.
     *
     * @param {Object} options - The configuration options for the HTTP request.
     * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE).
     * @param {string} options.url - The endpoint URL for the request.
     * @param {Object} [options.request={}] - The request body (default is an empty object).
     * @param {Object} [options.headers={}] - Additional headers for the request.
     * @param {string} [options.errorMessage=""] - A custom error message to display on failure.
     * @param {boolean} [options.useFormData=false] - Whether the request should use FormData.
     *
     * @returns {Promise<Object>} - The response object from the server.
     * @throws {Error} - Throws an error if the request fails or returns an error response.
     *
     * @example
     * // Example 1: POST Request with JSON Body
     * const response = await HTTP.fetch({
     *   method: 'POST',
     *   url: '/api/users',
     *   request: { name: 'John Doe', age: 30 },
     *   headers: { Authorization: 'Bearer token' },
     *   errorMessage: 'Failed to create user.',
     * });
     *
     * @example
     * // Example 2: PUT Request with FormData
     * const formData = new FormData();
     * formData.append('file', fileInput.files[0]);
     * const response = await HTTP.fetch({
     *   method: 'PUT',
     *   url: '/api/upload',
     *   request: formData,
     *   useFormData: true,
     *   errorMessage: 'Failed to upload file.',
     * });
     */
    static async fetch({ method, url, request = {}, headers = {}, errorMessage = '', useFormData = false }) {
        const response = await new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: useFormData ? request : (Object.keys(request).length !== 0 ? JSON.stringify(request) : {}),
                dataType: 'json',
                type: method,
                contentType: useFormData ? false : 'application/json',
                headers,
                ...(useFormData && { enctype: 'multipart/form-data' }),
                ...(useFormData && { processData: false }),
                ...(useFormData && { contentType: false }),
                ...(useFormData && { async: true }),
                ...(useFormData && { cache: false }),
                success: response => resolve(response),
                error: response => reject(response)
            });
        });
        HTTP.checkErrorResponses(response, errorMessage);
        return response;
    }

    /**
     * Checks for error responses from the server.
     *
     * @param {Object} response - The response object from the server.
     * @param {string} [errorMessage=""] - A custom error message to display on failure.
     *
     * @throws {Error} - Throws an error with the appropriate error message.
     */
    static checkErrorResponses(response, errorMessage = '') {
        if (response.status === 'failed' || response.status === 'error') {
            if (errorMessage === '') {
                throw new Error(response.exception?.message || 'An unknown error occurred.');
            } else {
                throw new Error(errorMessage);
            }
        }
    }

}
