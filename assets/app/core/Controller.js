class Controller {

    static successResponse({ data = null, message_id = 'Berhasil.', message_en = 'Success.' }) {
        return {
            success: true,
            data: data,
            messages: {
                id: message_id,
                en: message_en
            }
        }
    }

}
