import paymentLinkService from "../paylink-service/pamentLinkSolution.service";

const EnsurePaymentLinkApiKey = async (clientCode) => {
    let apiKey = sessionStorage.getItem("paymentLinkApiKey");

    if (!apiKey) {
        try {
            const response = await paymentLinkService.getPaymentLinkApiKey({ client_code: clientCode });
            apiKey = response.data.api_key;
            sessionStorage.setItem("paymentLinkApiKey", apiKey);
        } catch (error) {
            console.error("Failed to fetch Payment Link API Key", error);
            throw new Error("API Key required but could not be fetched");
        }
    }

    return apiKey;
};

export default EnsurePaymentLinkApiKey;